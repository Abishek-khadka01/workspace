import React, { useState } from "react";

type Document = {
  id: number;
  title: string;
  updatedAt: string;
  members: { name: string; profilePicture: string }[]; // Members with name and profile picture
};

interface DocumentListProps {
  documents: Document[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  onEdit,
  onDelete,
}) => {
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] =
    useState<boolean>(false);
  const [documentToDelete, setDocumentToDelete] = useState<number | null>(null);

  const handleConfirmDelete = (id: number) => {
    setDocumentToDelete(id);
    setIsConfirmDeleteOpen(true);
  };

  const handleCancelDelete = () => {
    setIsConfirmDeleteOpen(false);
    setDocumentToDelete(null);
  };

  const handleDelete = () => {
    if (documentToDelete !== null) {
      onDelete(documentToDelete); // Call the onDelete prop function with the document ID
      setIsConfirmDeleteOpen(false);
      setDocumentToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      {documents.length === 0 ? (
        <p>No documents found.</p>
      ) : (
        documents.map((document) => (
          <div key={document.id} className="bg-white p-4 rounded-lg shadow-md">
            {/* Document Title and Buttons (Edit, Delete) */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{document.title}</h2>
              {/* Edit and Delete Buttons on the Right */}
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(document.id)}
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

            {/* Members Section */}
            <div className="mt-2">
              <strong>Members:</strong>
              <div className="flex space-x-2 ml-2">
                {document.members.map((member, index) => (
                  <div key={index} className="relative group text-center">
                    <img
                      src={member.profilePicture}
                      alt={member.name}
                      className="w-10 h-10 rounded-full border-2 border-white"
                    />
                    {/* Display name below the image */}
                    <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs text-gray-700">
                        {member.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Last Updated Section */}
            <div className="mt-2 text-sm text-gray-500">
              <p>{new Date(document.updatedAt).toLocaleDateString()}</p>{" "}
              {/* Only show the date */}
            </div>
          </div>
        ))
      )}

      {/* Confirmation Modal for Delete */}
      {isConfirmDeleteOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-semibold text-center">Are you sure?</h3>
            <div className="flex justify-between mt-4">
              <button
                onClick={handleCancelDelete}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentList;
