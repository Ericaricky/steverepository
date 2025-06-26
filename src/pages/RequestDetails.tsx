import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useRequests, RequestStatus } from '../contexts/RequestContext';
import { useNotifications } from '../contexts/NotificationContext';
import StatusBadge from '../components/ui/StatusBadge';
import RequestTypeIcon, { getRequestTypeLabel } from '../components/ui/RequestTypeIcon';
import { 
  Clock, User, Building, AlertTriangle, MessageSquare, 
  Paperclip, ChevronLeft, Send, Download
} from 'lucide-react';

const RequestDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getRequestById, updateRequestStatus, addComment, loading } = useRequests();
  const { addNotification } = useNotifications();
  
  const [comment, setComment] = useState('');
  const [statusComment, setStatusComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [changingStatus, setChangingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState<RequestStatus | ''>('');
  
  const request = getRequestById(id || '');
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0F4C81]"></div>
      </div>
    );
  }
  
  if (!request) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Requête non trouvée</h2>
        <p className="text-gray-500 mb-6">
          La requête que vous recherchez n'existe pas ou a été supprimée.
        </p>
        <Link
          to="/requests"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#0F4C81] hover:bg-[#0D3F6C]"
        >
          <ChevronLeft className="-ml-1 mr-2 h-5 w-5" />
          Retour aux requêtes
        </Link>
      </div>
    );
  }
  
  // Check if user has permission to view this request
  const canView = user?.role !== 'student' || request.studentId === user?.id;
  
  if (!canView) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Accès refusé</h2>
        <p className="text-gray-500 mb-6">
          Vous n'avez pas la permission de voir cette requête.
        </p>
        <Link
          to="/requests"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#0F4C81] hover:bg-[#0D3F6C]"
        >
          <ChevronLeft className="-ml-1 mr-2 h-5 w-5" />
          Retour aux requêtes
        </Link>
      </div>
    );
  }
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Handle comment submission
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim()) return;
    
    try {
      setSubmittingComment(true);
      await addComment(request.id, comment);
      
      // Add notification for the student if comment is from staff
      if (user?.role !== 'student') {
        addNotification({
          title: 'Nouveau commentaire',
          message: `${user?.name} a ajouté un commentaire à votre requête "${request.title}"`,
          type: 'info',
          link: `/requests/${request.id}`
        });
      }
      
      setComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };
  
  // Handle status change
  const handleStatusChange = async () => {
    if (!newStatus) return;
    
    try {
      setChangingStatus(true);
      await updateRequestStatus(request.id, newStatus, statusComment);
      
      // Add notification for the student if status is changed by staff
      if (user?.role !== 'student') {
        const statusMessages = {
          pending: 'mise en attente',
          in_review: 'placée en cours d\'examen',
          approved: 'approuvée',
          rejected: 'rejetée',
          more_info: 'marquée comme nécessitant plus d\'informations',
          archived: 'archivée'
        };
        
        addNotification({
          title: 'Statut mis à jour',
          message: `Votre requête "${request.title}" a été ${statusMessages[newStatus]} par ${user?.name}`,
          type: newStatus === 'approved' ? 'success' : newStatus === 'rejected' ? 'error' : 'info',
          link: `/requests/${request.id}`
        });
      }
      
      setNewStatus('');
      setStatusComment('');
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setChangingStatus(false);
    }
  };
  
  // Check if user can change status
  const canChangeStatus = user?.role !== 'student';
  
  // Get available status options based on current status
  const getAvailableStatusOptions = (): RequestStatus[] => {
    switch (request.status) {
      case 'pending':
        return ['in_review', 'approved', 'rejected', 'more_info'];
      case 'in_review':
        return ['approved', 'rejected', 'more_info', 'pending'];
      case 'more_info':
        return ['in_review', 'approved', 'rejected', 'pending'];
      case 'approved':
      case 'rejected':
        return ['archived'];
      case 'archived':
        return ['pending'];
      default:
        return [];
    }
  };

  return (
    <div>
      <div className="mb-4">
        <button
          onClick={() => navigate('/requests')}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Retour aux requêtes
        </button>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Header */}
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center mb-2 sm:mb-0">
              <RequestTypeIcon 
                type={request.type} 
                size={24}
                className="text-gray-500" 
              />
              <h2 className="ml-2 text-xl font-semibold text-gray-900">
                {request.title}
              </h2>
            </div>
            <StatusBadge status={request.status} className="text-sm px-3 py-1" />
          </div>
          <div className="mt-2 flex flex-wrap text-sm text-gray-500">
            <div className="mr-6 flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Créée le {formatDate(request.createdAt)}
            </div>
            <div className="mr-6 flex items-center">
              <User className="h-4 w-4 mr-1" />
              {request.studentName}
            </div>
            <div className="flex items-center">
              <Building className="h-4 w-4 mr-1" />
              {request.department}
            </div>
            {request.urgency === 'high' && (
              <div className="flex items-center ml-6 text-amber-600">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Urgence élevée
              </div>
            )}
          </div>
        </div>
        
        {/* Content */}
        <div className="px-4 py-5 sm:p-6">
          {/* Type and Description */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {getRequestTypeLabel(request.type)}
            </h3>
            <p className="text-gray-700 whitespace-pre-line">
              {request.description}
            </p>
          </div>
          
          {/* Attachments */}
          {request.attachments.length > 0 && (
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-900 mb-2 flex items-center">
                <Paperclip className="h-4 w-4 mr-1" />
                Pièces jointes ({request.attachments.length})
              </h3>
              <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                {request.attachments.map((attachment) => (
                  <li key={attachment.id} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                    <div className="w-0 flex-1 flex items-center">
                      <span className="ml-2 flex-1 w-0 truncate">
                        {attachment.name}
                      </span>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <a href="#" className="font-medium text-[#0F4C81] hover:text-[#0D3F6C]">
                        <Download className="h-5 w-5" />
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Status Change (for staff) */}
          {canChangeStatus && (
            <div className="mb-6 bg-gray-50 p-4 rounded-md">
              <h3 className="text-md font-medium text-gray-900 mb-2">
                Changer le statut
              </h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {getAvailableStatusOptions().map((status) => (
                  <button
                    key={status}
                    onClick={() => setNewStatus(status)}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      newStatus === status
                        ? 'bg-[#0F4C81] text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {status === 'pending' && 'En attente'}
                    {status === 'in_review' && 'En cours d\'examen'}
                    {status === 'approved' && 'Approuver'}
                    {status === 'rejected' && 'Rejeter'}
                    {status === 'more_info' && 'Demander plus d\'infos'}
                    {status === 'archived' && 'Archiver'}
                  </button>
                ))}
              </div>
              
              {newStatus && (
                <div>
                  <div className="mt-1">
                    <textarea
                      rows={2}
                      value={statusComment}
                      onChange={(e) => setStatusComment(e.target.value)}
                      className="shadow-sm focus:ring-[#0F4C81] focus:border-[#0F4C81] block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Ajouter un commentaire concernant ce changement de statut (optionnel)"
                    />
                  </div>
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={() => setNewStatus('')}
                      className="mr-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleStatusChange}
                      disabled={changingStatus}
                      className="px-3 py-1 bg-[#0F4C81] text-white text-sm font-medium rounded-md hover:bg-[#0D3F6C] disabled:bg-gray-400"
                    >
                      {changingStatus ? 'En cours...' : 'Confirmer'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Comments */}
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <MessageSquare className="h-4 w-4 mr-1" />
              Commentaires
            </h3>
            
            <div className="space-y-4">
              {request.comments.length > 0 ? (
                request.comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between">
                      <div className="font-medium text-gray-900">{comment.userName}</div>
                      <div className="text-sm text-gray-500">{formatDate(comment.createdAt)}</div>
                    </div>
                    <div className="mt-1 text-gray-700">{comment.text}</div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Aucun commentaire pour le moment.
                </p>
              )}
            </div>
            
            {/* Add Comment Form */}
            <div className="mt-4">
              <form onSubmit={handleCommentSubmit}>
                <div className="mt-1">
                  <textarea
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="shadow-sm focus:ring-[#0F4C81] focus:border-[#0F4C81] block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Ajouter un commentaire..."
                  />
                </div>
                <div className="mt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={!comment.trim() || submittingComment}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#0F4C81] hover:bg-[#0D3F6C] disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {submittingComment ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Envoi...
                      </>
                    ) : (
                      <>
                        <Send className="-ml-1 mr-2 h-4 w-4" />
                        Envoyer
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Status History */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-md font-medium text-gray-900 mb-4">
              Historique des statuts
            </h3>
            <div className="flow-root">
              <ul className="-mb-8">
                {request.statusHistory.map((statusChange, idx) => (
                  <li key={idx}>
                    <div className="relative pb-8">
                      {idx !== request.statusHistory.length - 1 && (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      )}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white">
                            <Clock className="h-5 w-5 text-white" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium text-gray-900">
                                {statusChange.changedBy}
                              </span>{' '}
                              a changé le statut à{' '}
                              <span className="font-medium">
                                {statusChange.status === 'pending' && 'En attente'}
                                {statusChange.status === 'in_review' && 'En cours d\'examen'}
                                {statusChange.status === 'approved' && 'Approuvée'}
                                {statusChange.status === 'rejected' && 'Rejetée'}
                                {statusChange.status === 'more_info' && 'Plus d\'informations requises'}
                                {statusChange.status === 'archived' && 'Archivée'}
                              </span>
                              {statusChange.comment && (
                                <>
                                  <br />
                                  <span className="text-gray-600 italic">
                                    "{statusChange.comment}"
                                  </span>
                                </>
                              )}
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            <time dateTime={statusChange.changedAt}>
                              {formatDate(statusChange.changedAt)}
                            </time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;