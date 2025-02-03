import React from 'react';

interface ErrorPageProps {
  errorCode: number;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ errorCode }) => {
  let message = "";

  switch (errorCode) {
    case 404:
      message = "404 - Page Not Found";
      break;
    case 502:
      message = "502 - Bad Gateway";
      break;
    default:
      message = "An error occurred";
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-800">
      <h1 className="text-6xl font-bold">{message}</h1>
      <p className="mt-4 text-lg">Sorry, something went wrong.</p>
    </div>
  );
};

export default ErrorPage;