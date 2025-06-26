import React from 'react';
import { Outlet } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <GraduationCap size={48} className="text-[#0F4C81]" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          IUT de Douala
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Système de Gestion des Requêtes Académiques
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;