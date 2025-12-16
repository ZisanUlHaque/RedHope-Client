import React from 'react';
import { Link } from 'react-router';

const Forbidden = () => {
  return (
    <div className="bg-red-100 min-h-screen flex flex-col justify-center items-center text-center">
      <h1 className="text-6xl font-bold text-red-700">Access Denied</h1>
      <p className="mt-5 text-gray-600 max-w-md">
        You do not have permission to access this page.
      </p>  
      <Link to="/">
        <button className="btn mt-6 bg-red-700 text-white border-none">
          Go to Home
        </button>
      </Link>

    </div>
  );
};

export default Forbidden;