import React , {useEffect} from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../functions/zustand";
const DocumentEditorLandingPage: React.FC = () => {

  const navigate = useNavigate();
  const { isLogin } = useAuthStore.getState(); // Access Zustand state directly

  // Check if user is logged in when the component mounts
  useEffect(() => {
    if (isLogin) {
      navigate("/dashboard"); // Redirect to dashboard if logged in
    }
  }, [isLogin, navigate]); 
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <header className="bg-blue-600 text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">
          DocSync: Your Collaborative Writing Platform
        </h1>
        <p className="text-xl max-w-2xl mx-auto mb-8">
          Create, edit, and collaborate on documents in real-time with seamless
          synchronization and powerful features.
        </p>
        <button className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-300">
          Get Started
        </button>
      </header>

      {/* Features Section */}
      <section className="container mx-auto py-16 px-4 grid md:grid-cols-3 gap-8">
        <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition duration-300">
          <h2 className="text-2xl font-bold mb-4 text-blue-600">
            Real-Time Editing
          </h2>
          <p className="text-gray-700">
            Collaborate with team members simultaneously, seeing changes
            instantly without refreshing.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition duration-300">
          <h2 className="text-2xl font-bold mb-4 text-blue-600">
            Version History
          </h2>
          <p className="text-gray-700">
            Track document changes, revert to previous versions, and maintain a
            complete editing history.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition duration-300">
          <h2 className="text-2xl font-bold mb-4 text-blue-600">
            Cross-Platform Sync
          </h2>
          <p className="text-gray-700">
            Access your documents from any device, with automatic
            synchronization across platforms.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gray-100 py-16 text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Ready to Transform Your Writing Workflow?
        </h2>
        <button className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition duration-300">
          Create Your First Document
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 text-center">
        <p>&copy; 2025 DocSync. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default DocumentEditorLandingPage;
