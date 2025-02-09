import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { BACKEND_URL } from "../ApiResponses/User";
import {  useNavigate } from "react-router-dom";
import useAuthStore from "../functions/zustand";
type Member = {
  id: number;
  name: string;
  image: string;
  online: boolean;
};

const NotePad: React.FC = () => {


  
  const navigate = useNavigate()
  const [text, setText] = useState<string>("");
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const [isDocumentOpen, setIsDocumentOpen] = useState<boolean>(true);
  const [lastEditor, setLastEditor] = useState<Member | null>(null);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [fileName, setFileName] = useState<string>("Untitled Document");

  const [members, setMembers] = useState<Member[]>([
    { id: 1, name: "Alice", image: "/api/placeholder/40/40", online: true },
    { id: 2, name: "Bob", image: "/api/placeholder/40/40", online: false },
    { id: 3, name: "Charlie", image: "/api/placeholder/40/40", online: true },
  ]);

 useEffect(() => {
    const {isLogin, id} = useAuthStore.getState()
    if(!isLogin){
      navigate("/")

    }
    const pathParts = window.location.pathname.split("/");
    const fileid = (pathParts[pathParts.length - 1]);
    console.log(fileid)
    const socket = io(BACKEND_URL,{
      
        auth: {
          token: id,
          documentId : fileid 
        } 
    ,
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log(`User is connected , ${socket.id}`);
    });
  }, [useAuthStore]);

  const currentUser = members[0];
  const onlineMembers = members.filter((member) => member.online);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    const newTimeout = setTimeout(() => {
      setLastEditor(currentUser);
    }, 1000);
    setTypingTimeout(newTimeout);
  };

  const handleCloseDocument = () => {
    if (text.trim() !== "" && window.confirm("Do you want to save before closing?")) {
      alert("Saving file...");
    }
    setIsDocumentOpen(false);
  };

  if (!isDocumentOpen) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Document Closed</h2>
          <button
            onClick={() => setIsDocumentOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Open New Document
          </button>
        </div>
      </div>
    );
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
              <button onClick={() => setIsNavOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="p-4 mt-12">
                <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-700 mb-2" onClick={() => alert("Save File")}>Save File</button>
                <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-700 mb-2" onClick={() => alert("Rename File")}>Rename File</button>
                <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-700 mb-2" onClick={() => alert("Add Members")}>Add Members</button>
                <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-700 text-red-300 hover:text-red-200" onClick={handleCloseDocument}>Close File</button>
              </div>
            </>
          )}
        </div>

        <div className="flex-1 flex flex-col p-4">
          <div className="flex-1 bg-white rounded-lg shadow-sm border relative">
            <div className="h-full p-4">
              <textarea className="w-full h-full outline-none resize-none" value={text} onChange={handleTextChange} placeholder="Start typing..." />
              {lastEditor && (
                <div className="absolute bottom-4 right-4 group">
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-blue-500">
                    <img src={lastEditor.image} alt={lastEditor.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute bottom-full right-0 mb-2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100">
                    Last edited by {lastEditor.name}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2 mt-2 items-center">
            {onlineMembers.map((member) => (
              <div key={member.id} className="relative group">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100">
                  {member.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotePad;