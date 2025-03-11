import React, { useEffect, useState } from "react";
import { AllDocumentsApi, CreateDocumentApi } from "../Api/Documents";
import useAuthStore from "../functions/zustand";
import { DocumentTypeFromS } from "../types/document.types";
import { useNavigate } from "react-router-dom";


type Document = {
  id: number | string;
  title: string;
  updatedAt: string;
  members: { name: string; profilePicture: string }[];
};

type NewMember = {
  name: string;
  profilePicture: string;
};

const DocumentList: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<number | string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newDocumentTitle, setNewDocumentTitle] = useState("");
  const [newMembers, setNewMembers] = useState<NewMember[]>([]);
  const [newMemberName, setNewMemberName] = useState("");
  // navigate

  const navigate = useNavigate()
  // Use the store directly as a hook
  const { username, url } = useAuthStore();

  // Fetch all documents when component mounts
  useEffect(() => {
    fetchAllDocuments();
  }, []);

  const fetchAllDocuments = async () => {
    try {
      setIsLoading(true);
      const response = await AllDocumentsApi();
      
      if (!response.data.success) {
        console.error(`Error fetching documents: ${response.data.message}`);
        return;
      }
      
      const formattedDocuments = response.data.documents.map((doc: DocumentTypeFromS) => {
        // Create properly formatted members array
        const membersList = doc.members.map(member => ({
          name: member.username,
          profilePicture: member.profilepicture || ""
        }));
        
        return {
          id: doc._id,
          title: doc.name,
          updatedAt: doc.updatedAt,
          members: membersList
        };
      });
      
      setDocuments(formattedDocuments);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = (id: number | string) => {
    setDocumentToDelete(id);
    setIsConfirmDeleteOpen(true);
  };

  const handleCancelDelete = () => {
    setIsConfirmDeleteOpen(false);
    setDocumentToDelete(null);
  };

  const handleDelete = () => {
    if (documentToDelete !== null) {
      setDocuments((prevDocs) =>
        prevDocs.filter((doc) => doc.id !== documentToDelete)
      );
      setIsConfirmDeleteOpen(false);
      setDocumentToDelete(null);
    }
  };

  const onEdit = (id: number | string) => {
    console.log(`Edit document with ID: ${id}`);
  };

  const handleAddMember = () => {
    if (newMemberName.trim()) {
      setNewMembers([
        ...newMembers,
        { name: newMemberName.trim(), profilePicture: "" },
      ]);
      setNewMemberName("");
    }
  };

  const handleRemoveMember = (index: number) => {
    setNewMembers(newMembers.filter((_, i) => i !== index));
  };

  const handleCreateDocument = async () => {
    try {
      const response = await CreateDocumentApi(newDocumentTitle);
      
      if (response.status !== 201) {
        console.error(response.data.message);
        alert(response.data.message);
        return;
      }
      
      const newDocumentToSave = {
        id: response.data.document.id,
        title: response.data.document.name,
        updatedAt: response.data.document.updated_at,
        members: [
          {
            name: username,
            profilePicture: url || "",
          },
        ],
      };
      
      // Update state using functional update to ensure we're working with the latest state
      setDocuments(prevDocuments => [...prevDocuments, newDocumentToSave]);
      handleCloseCreateDialog();
      
      // Refresh the document list to ensure we have the latest data
      fetchAllDocuments();
      
    } catch (error) {
      console.error("Failed to create document:", error);
      alert("Failed to create document. Please try again.");
    }
  };

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
    setNewDocumentTitle("");
    setNewMembers([]);
    setNewMemberName("");
  };

  return (
    <div className="relative min-h-screen pb-16">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold mb-6">Documents</h1>

        {isLoading ? (
          <div className="text-center py-8">Loading documents...</div>
        ) : documents.length === 0 ? (
          <p>No documents found.</p>
        ) : (
          documents.map((document) => (
            <div key={document.id}  className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">{document.title}</h2>
                <div className="flex space-x-2">
                  <button
                    onClick = {
                      ()=>{
                        console.log(`Button clicked `)
                        navigate(`/document/${document.id}`)
        
                      }
                    }
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleConfirmDelete(document.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="mt-2">
                <strong>Members:</strong>
                <div className="flex space-x-2 ml-2">
                  {document.members && document.members.length > 0 ? (
                    document.members.map((member, index) => (
                      <div key={index} className="relative group text-center">
                        <img
                          src={member.profilePicture || "default-avatar.png"}
                          alt={member.name}
                          className="w-10 h-10 rounded-full border-2 border-white"
                        />
                        <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs text-gray-700">
                            {member.name}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <span className="text-gray-500">No members</span>
                  )}
                </div>
              </div>

              <div className="mt-2 text-sm text-gray-500">
                <p>{document.updatedAt ? new Date(document.updatedAt).toLocaleDateString() : "No date"}</p>
              </div>
            </div>
          ))
        )}

        {/* Floating Add Button */}
        <button
          onClick={() => setIsCreateDialogOpen(true)}
          className="fixed bottom-6 right-6 bg-green-500 text-white w-14 h-14 rounded-full shadow-lg hover:bg-green-600 flex items-center justify-center text-2xl transition-transform hover:scale-110"
          aria-label="Add new document"
        >
          +
        </button>
      </div>

      {/* Create Document Dialog */}
      {isCreateDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Create New Document</h3>

              {/* Document Title Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  value={newDocumentTitle}
                  onChange={(e) => setNewDocumentTitle(e.target.value)}
                  placeholder="Enter document title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Members Section */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Members
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddMember()}
                    placeholder="Enter member name"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleAddMember}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Add
                  </button>
                </div>

                {/* Members List */}
                <div className="mt-2 space-y-2">
                  {newMembers.map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                    >
                      <span className="text-gray-700">{member.name}</span>
                      <button
                        onClick={() => handleRemoveMember(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dialog Actions */}
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={handleCloseCreateDialog}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateDocument}
                  disabled={!newDocumentTitle.trim()}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {isConfirmDeleteOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-xl font-semibold text-center mb-4">Are you sure?</h3>
            <div className="flex justify-between space-x-4">
              <button
                onClick={handleCancelDelete}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentList;