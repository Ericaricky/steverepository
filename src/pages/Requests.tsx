import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useRequests, RequestStatus, RequestType } from '../contexts/RequestContext';
import StatusBadge from '../components/ui/StatusBadge';
import RequestTypeIcon, { getRequestTypeLabel } from '../components/ui/RequestTypeIcon';
import { FilePlus, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const Requests: React.FC = () => {
  const { user } = useAuth();
  const { requests, loading, filterRequests } = useRequests();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Filtering and search state
  const [statusFilter, setStatusFilter] = useState<RequestStatus[]>([]);
  const [typeFilter, setTypeFilter] = useState<RequestType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Initialize filters from URL params
  useEffect(() => {
    const status = searchParams.get('status');
    if (status) {
      setStatusFilter([status as RequestStatus]);
    }
    
    const type = searchParams.get('type');
    if (type) {
      setTypeFilter([type as RequestType]);
    }
    
    const search = searchParams.get('search');
    if (search) {
      setSearchTerm(search);
    }
  }, [searchParams]);
  
  // Apply filters
  const filteredRequests = filterRequests({
    status: statusFilter.length ? statusFilter : undefined,
    type: typeFilter.length ? typeFilter : undefined,
    search: searchTerm || undefined,
    department: user?.role === 'department_head' ? user.department : undefined
  });
  
  // Get only user's requests if student
  const userRequests = user?.role === 'student'
    ? filteredRequests.filter(req => req.studentId === user.id)
    : filteredRequests;
  
  // Sort requests (most recent first)
  const sortedRequests = [...userRequests].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  
  // Paginate requests
  const totalPages = Math.ceil(sortedRequests.length / itemsPerPage);
  const paginatedRequests = sortedRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, typeFilter, searchTerm]);
  
  // Apply filters and update URL
  const applyFilters = () => {
    const params: { [key: string]: string } = {};
    
    if (statusFilter.length === 1) {
      params.status = statusFilter[0];
    }
    
    if (typeFilter.length === 1) {
      params.type = typeFilter[0];
    }
    
    if (searchTerm) {
      params.search = searchTerm;
    }
    
    setSearchParams(params);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setStatusFilter([]);
    setTypeFilter([]);
    setSearchTerm('');
    setSearchParams({});
  };
  
  // Toggle status filter
  const toggleStatusFilter = (status: RequestStatus) => {
    setStatusFilter(prev => 
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };
  
  // Toggle type filter
  const toggleTypeFilter = (type: RequestType) => {
    setTypeFilter(prev => 
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };
  
  const statusOptions: RequestStatus[] = [
    'created', 'verify', 'approved', 'rejected', 'processing', 'completed', 'failed'
  ];
  
  const typeOptions: RequestType[] = [
    'transcript', 'grade_appeal', 'enrollment', 'exemption', 'other'
  ];
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0F4C81]"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          {user?.role === 'student' ? 'Mes requêtes' : 'Requêtes académiques'}
        </h2>
        
        {user?.role === 'student' && (
          <Link
            to="/requests/new"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#0F4C81] hover:bg-[#0D3F6C]"
          >
            <FilePlus className="-ml-1 mr-2 h-5 w-5" />
            Nouvelle requête
          </Link>
        )}
      </div>
      
      {/* Filters */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                Recherche
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="focus:ring-[#0F4C81] focus:border-[#0F4C81] block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Titre, description, étudiant..."
                />
              </div>
            </div>
            
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Statut
              </label>
              <div className="mt-1 flex flex-wrap gap-2">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => toggleStatusFilter(status)}
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      statusFilter.includes(status)
                        ? 'bg-[#0F4C81] text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {status === 'created' && 'Créée'}
                    {status === 'verify' && 'Vérification'}
                    {status === 'approved' && 'Approuvée'}
                    {status === 'rejected' && 'Rejetée'}
                    {status === 'completed' && 'Terminée'}
                    {status === 'failed' && 'Échouée'}
                    {status === 'processing' && 'En cours de traitement'}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Type de requête
              </label>
              <div className="mt-1 flex flex-wrap gap-2">
                {typeOptions.map((type) => (
                  <button
                    key={type}
                    onClick={() => toggleTypeFilter(type)}
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      typeFilter.includes(type)
                        ? 'bg-[#0F4C81] text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {getRequestTypeLabel(type)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="mr-3 text-sm text-gray-600 hover:text-gray-900"
            >
              Réinitialiser
            </button>
            <button
              onClick={applyFilters}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#0F4C81] hover:bg-[#0D3F6C]"
            >
              <Filter className="h-4 w-4 mr-1" />
              Filtrer
            </button>
          </div>
        </div>
      </div>
      
      {/* Request List */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        {paginatedRequests.length > 0 ? (
          <>
            <ul className="divide-y divide-gray-200">
              {paginatedRequests.map((request) => (
                <li key={request.id}>
                  <Link to={`/requests/${request.id}`} className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <RequestTypeIcon 
                            type={request.type} 
                            className="flex-shrink-0 h-5 w-5 text-gray-500" 
                          />
                          <p className="ml-2 text-sm font-medium text-[#0F4C81] truncate">
                            {request.title}
                          </p>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <StatusBadge status={request.status} />
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            {user?.role !== 'student' && (
                              <span className="truncate">{request.studentName} • </span>
                            )}
                            <span className="ml-1 truncate">{request.department}</span>
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p>
                            Mis à jour le {formatDate(request.updatedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Affichage de <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>{' '}
                      à <span className="font-medium">
                        {Math.min(currentPage * itemsPerPage, sortedRequests.length)}
                      </span>{' '}
                      sur <span className="font-medium">{sortedRequests.length}</span> résultats
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === 1
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Précédent</span>
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      
                      {/* Page numbers */}
                      {Array.from({ length: totalPages }).map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentPage(idx + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                            currentPage === idx + 1
                              ? 'z-10 bg-[#0F4C81] border-[#0F4C81] text-white'
                              : 'text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {idx + 1}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === totalPages
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Suivant</span>
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="py-12 text-center">
            <p className="text-gray-500 mb-4">Aucune requête trouvée.</p>
            {user?.role === 'student' && (
              <Link
                to="/requests/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#0F4C81] hover:bg-[#0D3F6C]"
              >
                <FilePlus className="-ml-1 mr-2 h-5 w-5" />
                Créer une nouvelle requête
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests;