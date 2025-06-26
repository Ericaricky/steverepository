import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            404
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            La page que vous recherchez n'existe pas.
          </p>
        </div>
        <div>
          <Link 
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#0F4C81] hover:bg-[#0D3F6C]"
          >
            <HomeIcon className="-ml-1 mr-2 h-5 w-5" />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;