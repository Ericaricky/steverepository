import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Bell, Lock, Eye, EyeOff, Save, AlertCircle } from 'lucide-react';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailNotifications: true,
    browserNotifications: true,
    language: 'fr'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    
    try {
      setSaving(true);
      setError('');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (err) {
      setError('Une erreur est survenue lors de la mise à jour des paramètres');
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
            Paramètres
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Gérez vos préférences et la sécurité de votre compte
          </p>
        </div>

        {/* Settings Content */}
        <div className="px-4 py-5 sm:p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Password Section */}
            <div className="mb-8">
              <h4 className="text-base font-medium text-gray-900 mb-4 flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                Changer le mot de passe
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                    Mot de passe actuel
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="currentPassword"
                      value={formData.currentPassword}
                      onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                      className="block w-full pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#0F4C81] focus:border-[#0F4C81] sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    Nouveau mot de passe
                  </label>
                  <div className="mt-1">
                    <input
                      type="password"
                      id="newPassword"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      className="block w-full border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#0F4C81] focus:border-[#0F4C81] sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirmer le nouveau mot de passe
                  </label>
                  <div className="mt-1">
                    <input
                      type="password"
                      id="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="block w-full border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#0F4C81] focus:border-[#0F4C81] sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications Section */}
            <div className="mb-8">
              <h4 className="text-base font-medium text-gray-900 mb-4 flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notifications
              </h4>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="emailNotifications"
                    type="checkbox"
                    checked={formData.emailNotifications}
                    onChange={(e) => setFormData({ ...formData, emailNotifications: e.target.checked })}
                    className="h-4 w-4 text-[#0F4C81] focus:ring-[#0F4C81] border-gray-300 rounded"
                  />
                  <label htmlFor="emailNotifications" className="ml-3">
                    <span className="block text-sm font-medium text-gray-700">Notifications par email</span>
                    <span className="block text-sm text-gray-500">Recevoir des notifications par email pour les mises à jour importantes</span>
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="browserNotifications"
                    type="checkbox"
                    checked={formData.browserNotifications}
                    onChange={(e) => setFormData({ ...formData, browserNotifications: e.target.checked })}
                    className="h-4 w-4 text-[#0F4C81] focus:ring-[#0F4C81] border-gray-300 rounded"
                  />
                  <label htmlFor="browserNotifications" className="ml-3">
                    <span className="block text-sm font-medium text-gray-700">Notifications du navigateur</span>
                    <span className="block text-sm text-gray-500">Recevoir des notifications dans le navigateur en temps réel</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Language Section */}
            <div className="mb-8">
              <h4 className="text-base font-medium text-gray-900 mb-4">
                Langue
              </h4>
              
              <div>
                <select
                  id="language"
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-[#0F4C81] focus:border-[#0F4C81] sm:text-sm rounded-md"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end">
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
                    Enregistrer les modifications
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;