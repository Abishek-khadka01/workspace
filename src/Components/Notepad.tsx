import {  useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuthStore from "../functions/zustand";
import { SocketSingleton } from "../sockets/socket";
import { DocumentContentUpdate, FindDocumentByid } from "../Api/Documents";
import {  TypeMembers } from "../types/document.types";
type Member = {
  id: string;
  name: string;
  image: string;
  online: boolean
};

type JoinRequest = {
  userId: string;
  username: string;
  profilePicture: string;
};

// Join Request Notification Component
const JoinRequestNotification: React.FC<{
  request: JoinRequest;
  onAccept: () => void;
  onReject: () => void;
}> = ({ request, onAccept, onReject }) => {
  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 flex items-center gap-4 border border-gray-200 animate-slide-up z-50">
      <div className="flex-shrink-0">
        <img
          src={request.profilePicture}
          alt={request.username}
          className="w-12 h-12 rounded-full object-cover"
        />
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-800">
          <span className="font-semibold">{request.username}</span> wants to join your document
        </p>
        <div className="mt-2 flex gap-2">
          <button
            onClick={onAccept}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
          >
            Accept
          </button>
          <button
            onClick={onReject}
            className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

const NotePad: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);

  const [lastEditor, setLastEditor] = useState<Member | null>(null);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [fileName, setFileName] = useState<string>("Untitled Document");
  const [joinRequest, setJoinRequest] = useState<JoinRequest | null>(null);
  const { id: userId } = useAuthStore.getState(); // Assuming this gets the current user's ID
  const { id: idDocument } = useParams(); // Get document ID from URL params
  
  const navigate = useNavigate();
  const {url } = useAuthStore()

  const [members, setMembers] = useState<Member[]>([]); // Initially empty members array
    
  const UserSocket = SocketSingleton.TheInstance();

  // Update members from server when socket connects
  useEffect(() => {
    if (!UserSocket) return;

    console.log(`User is running `);

    UserSocket.on("connect", () => {
      console.log(`The user is connected successfully `, UserSocket.id);
    });


    UserSocket.on("request-to-join-document", ({from ,user ,  message})=>{
        setJoinRequest({
          userId: user._id,
          username: user.username,
          profilePicture: user.profilepicture
        })
        console.log(user, from , message)

      
    })

    UserSocket.on("update-text-event", ({ id , from, message, DocumentID, profile, name }) => {
      console.log(DocumentID===idDocument , DocumentID, idDocument,"fjghjfjgh")
      if(DocumentID===idDocument) {
        console.log(`The update-text-event is called by ${from}`);
        setText(message);
        setLastEditor({
          id,
          name,
          image: profile,
          online : true

        })
      }
    });

    // Event listener to update members when joined or left
    UserSocket.on("update-members", (updatedMembers: Member[]) => {
      setMembers(updatedMembers);
    });

    // Listen for join request
    UserSocket.on("join-request", (request: JoinRequest) => {
      setJoinRequest(request);
    });



      UserSocket.on("accepted_request", ({message}) => {
        alert(message)
      })

      UserSocket.on("rejected_request", ()=>{
        alert(`You are not accepted in the document`)
        navigate("/dashboard")
      })

      UserSocket.on("error", ({message})=>{
      alert(`Error, ${message}`)
      
      })


    // Cleanup socket listeners on unmount
    return () => {
      UserSocket.off("update-members");
      UserSocket.off("join-request");
      
      UserSocket.off("accepted_request");
      UserSocket.off("rejected_request");
      UserSocket.disconnect()
    };
  }, [UserSocket, navigate]);

  useEffect(() => {
    (async () => 
     await HandleInitialCall())();
  }, []);


  
  const HandleInitialCall = async ()=>{
    try {
      if (!idDocument) {
        console.error("Document ID is missing in the URL.");
        return;
      }

      const documentDetails = await  FindDocumentByid(idDocument);
      
        
        console.table(documentDetails.data.message)
        setFileName(documentDetails.data.message.name);
        setText(documentDetails.data.message.content);
        SocketSingleton.connectSocket(userId as string, idDocument); // Pass both userId and idDocument
        const OnlineMembers = documentDetails.data.message.members.map((docs: TypeMembers)=>{
           
          return {id : docs._id,
            name : docs.username,
            image : docs.profilepicture,
            online : true
          }

        })
        setMembers(OnlineMembers)
        
      



    } catch (error) {
      alert(`Cannot acess the resource `)
      console.log(error)
      navigate("/dashboard")
    }


  }
 
  

  


  // Send text updates to the server
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    console.log(idDocument)
    setText(newText);
    setTimeout(() => {
      UserSocket?.emit("update-text", {
        from: userId,
        message: newText,
        DocumentID : idDocument,
      });
    }, 2000);

    

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const newTimeout = setTimeout(() => {
      setLastEditor({ id: userId as string, name: "me" , image: url, online: true });
    }, 1000);

    setTypingTimeout(newTimeout);
  };

  const handleAcceptJoinRequest = () => {
    if (joinRequest) {
      UserSocket?.emit("accept_join_request", {
        userId: joinRequest.userId,
        documentID: idDocument,
      });
      setJoinRequest(null);
     
    }
  };

  const handleRejectJoinRequest = () => {
    if (joinRequest) {
      UserSocket?.emit("reject_join_request", {
        userId: joinRequest.userId,
        documentID: idDocument,
      });
      setJoinRequest(null);
    }
  };

  const handleCloseDocument = () => {
    if (text.trim() !== "" && window.confirm("Do you want to save before closing?")) {
      
    // setIsDocumentOpen(false);
  };
}

  const handleSaveFile = async () => {
   
    await SaveDocument()
    alert(`File details is saved `)
  };

  const handleRenameFile = () => {
    const newName = prompt("Enter new filename:", fileName);
    if (newName) {
      setFileName(newName);
      UserSocket?.emit("rename_document", { fileName: newName, idDocument: idDocument });
    }
  };

  const SaveDocument= async ()=>{
    
       try {
        console.log(idDocument, text)
        
        const response = await DocumentContentUpdate(idDocument as string , text)
        if(!response.data.success){
        alert(`Updated the document and saved `)
        }else{
          console.log(`Error in saving the file`)
          alert(`Error in saving the file `)
        }
       } catch (error) {
        console.log(error)
        alert(`Error occured `)
       }
    
  }

  

  return (
    <div className="flex h-screen flex-col">
      <div className="p-4 bg-gray-200 text-center font-semibold text-lg relative">
        {fileName}
        {!isNavOpen && (
          <button
            onClick={() => setIsNavOpen(true)}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-gray-300 transition-colors duration-200 flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-sm font-medium">Menu</span>
          </button>
        )}
      </div>
      <div className="flex flex-1">
        <div className={`bg-gray-800 text-white ${isNavOpen ? "w-64" : "w-0"} transition-all duration-300 relative`}>
          {isNavOpen && (
            <>
              <button
                onClick={() => setIsNavOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="p-4 mt-12">
                <button
                  className="w-full text-left px-4 py-2 rounded hover:bg-gray-700 mb-2"
                  onClick={handleSaveFile}
                >
                  Save File
                </button>
                <button
                  className="w-full text-left px-4 py-2 rounded hover:bg-gray-700 mb-2"
                  onClick={handleRenameFile}
                >
                  Rename File
                </button>
                <button
                  className="w-full text-left px-4 py-2 rounded hover:bg-gray-700 text-red-300 hover:text-red-200"
                  onClick={handleCloseDocument}
                >
                  Close File
                </button>
              </div>
            </>
          )}
        </div>

        <div className="flex-1 flex flex-col p-4">
          <div className="flex-1 bg-white rounded-lg shadow-sm border relative">
            <div className="h-full p-4">
              <textarea
                className="w-full h-full outline-none resize-none"
                value={text}
                
                onChange={handleTextChange}
                
                placeholder="Start typing..."
              />
              {lastEditor && (
                <div className="absolute bottom-4 right-4 group">
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-blue-500">
                    <img
                      src={lastEditor.image}
                      alt={lastEditor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-full right-0 mb-2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100">
                    Last edited by {lastEditor.name}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2 mt-2 items-center">
            {members.map((member) => (
              <div key={member.id} className="relative group">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100">
                  {member.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {joinRequest && (
        
        <JoinRequestNotification
          request={joinRequest}
          onAccept={handleAcceptJoinRequest}
          onReject={handleRejectJoinRequest}
        />
      )}
    </div>
  );
}


export default NotePad;