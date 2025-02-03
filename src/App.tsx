// src/App.tsx

import React, { useState } from "react";
import DocumentList from "./Components/Documents";

const App: React.FC = () => {
  const [documents, setDocuments] = useState([
    {
      id: 1,
      title: "Document 1",
      createdAt: "2025-02-01T10:00:00Z", // ISO 8601 format
      updatedAt: "2025-02-02T12:00:00Z", // ISO 8601 format
      members: [
        {
          name: "John Doe",
          profilePicture: "https://randomuser.me/api/portraits/men/1.jpg",
        },
        {
          name: "Jane Smith",
          profilePicture: "https://randomuser.me/api/portraits/women/1.jpg",
        },
      ],
    },
    {
      id: 2,
      title: "Document 2",
      createdAt: "2025-01-15T08:30:00Z", // ISO 8601 format
      updatedAt: "2025-02-01T09:45:00Z", // ISO 8601 format
      members: [
        {
          name: "Alice Johnson",
          profilePicture: "https://randomuser.me/api/portraits/women/2.jpg",
        },
        {
          name: "Bob Brown",
          profilePicture: "https://randomuser.me/api/portraits/men/2.jpg",
        },
      ],
    },
  ]);

  const handleEdit = (id: number) => {
    alert(`Editing document with id: ${id}`);
    // Implement the logic to edit a document
  };

  const handleDelete = (id: number) => {
    setDocuments(documents.filter((doc) => doc.id !== id)); // Filter out the deleted document
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-semibold mb-6">Document Management</h1>
      <DocumentList
        documents={documents}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default App;
