import React from 'react';


const ErrorPage: React.FC = () => {
  


  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-800">
      <h1 className="text-6xl font-bold">{`404 PAGE NOT FOUND `}</h1>
      <p className="mt-4 text-lg">Sorry, something went wrong.</p>
    </div>
  );
};

export default ErrorPage;