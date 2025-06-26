import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useRequests, RequestType } from '../contexts/RequestContext';
import { getRequestTypeLabel } from '../components/ui/RequestTypeIcon';
import { AlertCircle, Upload, X } from 'lucide-react';

const NewRequest: React.FC = () => {
  const { user } = useAuth();
  const { addRequest } = useRequests();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [type, setType] = useState<RequestType>('transcript');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high'>('medium');
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setFiles(prev => [...prev, ...fileArray]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !type || !description) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    try {
      setError('');
      setIsSubmitting(true);
      
      // Convert files to attachments (in a real app, these would be uploaded to a server)
      const attachments = files.map((file, index) => ({
        id: `file-${Date.now()}-${index}`,
        name: file.name,
        url: '#', // In a real app, this would be the URL to the uploaded file
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString()
      }));
      
      await addRequest({
        title,
        description,
        type,
        status: 'pending',
        urgency,
        studentId: user?.id || '',
        studentName: user?.name || '',
        department: user?.department || '',
        attachments
      });
      
      navigate('/requests');
    } catch (err) {
      setError('Une erreur est survenue lors de la soumission de votre requête');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const requestTypes: RequestType[] = ['transcript', 'grade_appeal', 'enrollment', 'exemption', 'other'];

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">Nouvelle requête</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            {/* Title */}
            <div className="sm:col-span-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Titre <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="shadow-sm focus:ring-[#0F4C81] focus:border-[#0F4C81] block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Ex: Demande de relevé de notes pour le semestre 1"
                  required
                />
              </div>
            </div>
            
            {/* Request Type */}
            <div className="sm:col-span-3">
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Type de requête <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value as RequestType)}
                  className="shadow-sm focus:ring-[#0F4C81] focus:border-[#0F4C81] block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                >
                  {requestTypes.map((reqType) => (
                    <option key={reqType} value={reqType}>
                      {getRequestTypeLabel(reqType)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Urgency */}
            <div className="sm:col-span-3">
              <label htmlFor="urgency" className="block text-sm font-medium text-gray-700">
                Niveau d'urgence
              </label>
              <div className="mt-1">
                <select
                  id="urgency"
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as 'low' | 'medium' | 'high')}
                  className="shadow-sm focus:ring-[#0F4C81] focus:border-[#0F4C81] block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="low">Faible</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Élevée</option>
                </select>
              </div>
            </div>
            
            {/* Description */}
            <div className="sm:col-span-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="shadow-sm focus:ring-[#0F4C81] focus:border-[#0F4C81] block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Décrivez votre requête de manière détaillée..."
                  required
                />
              </div>
            </div>
            
            {/* File Attachments */}
            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700">
                Pièces jointes
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-[#0F4C81] hover:text-[#0D3F6C]"
                    >
                      <span>Télécharger des fichiers</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        multiple
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">ou glisser-déposer</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, PDF jusqu'à 10 Mo
                  </p>
                </div>
              </div>
              
              {/* File List */}
              {files.length > 0 && (
                <ul className="mt-3 divide-y divide-gray-200 border border-gray-200 rounded-md">
                  {files.map((file, index) => (
                    <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                      <div className="w-0 flex-1 flex items-center">
                        <span className="flex-1 w-0 truncate">{file.name}</span>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="font-medium text-red-600 hover:text-red-500"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/requests')}
              className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#0F4C81] hover:bg-[#0D3F6C] disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Soumission...
                </>
              ) : (
                'Soumettre la requête'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewRequest;