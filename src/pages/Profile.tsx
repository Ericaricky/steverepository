import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Building, GraduationCap, Save, AlertCircle } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department || '',
    matricule: user?.matricule || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError('');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would update the user profile
      setIsEditing(false);
    } catch (err) {
      setError('Une erreur est survenue lors de la mise à jour du profil');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Header */}
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Mon profil
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Gérez vos informations personnelles
          </p>
        </div>

        {/* Profile Content */}
        <div className="px-4 py-5 sm:p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center">
                <div className="h-20 w-20 rounded-full bg-[#0F4C81] flex items-center justify-center text-white text-2xl">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">
                    {user?.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {user?.role === 'student' ? 'Étudiant' :
                     user?.role === 'teacher' ? 'Enseignant' :
                     user?.role === 'department_head' ? 'Chef de département' :
                     user?.role === 'academic_secretary' ? 'Secrétaire académique' :
                     'Administrateur'}
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nom complet
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#0F4C81] focus:border-[#0F4C81] disabled:bg-gray-50 disabled:text-gray-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!isEditing}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#0F4C81] focus:border-[#0F4C81] disabled:bg-gray-50 disabled:text-gray-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                    Département
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="department"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      disabled={!isEditing}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#0F4C81] focus:border-[#0F4C81] disabled:bg-gray-50 disabled:text-gray-500 sm:text-sm"
                    />
                  </div>
                </div>

                {user?.role === 'student' && (
                  <div>
                    <label htmlFor="matricule" className="block text-sm font-medium text-gray-700">
                      Matricule
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <GraduationCap className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="matricule"
                        value={formData.matricule}
                        onChange={(e) => setFormData({ ...formData, matricule: e.target.value })}
                        disabled={!isEditing}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#0F4C81] focus:border-[#0F4C81] disabled:bg-gray-50 disabled:text-gray-500 sm:text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#0F4C81] hover:bg-[#0D3F6C] disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <Save className="-ml-1 mr-2 h-5 w-5" />
                        Enregistrer
                      </>
                    )}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#0F4C81] hover:bg-[#0D3F6C]"
                >
                  Modifier le profil
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;