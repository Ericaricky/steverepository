import React from 'react';
import { Link } from 'react-router-dom';
import { FilePlus, Clock, CheckCircle, XCircle, AlertCircle, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useRequests, RequestStatus } from '../contexts/RequestContext';
import StatusBadge from '../components/ui/StatusBadge';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { requests, loading } = useRequests();

  // Count requests by status for the current user
  const getStatusCounts = () => {
    const counts = {
      pending: 0,
      in_review: 0,
      approved: 0,
      rejected: 0,
      total: 0
    };

    if (user?.role === 'student') {
      // For students, only show their own requests
      requests.forEach(request => {
        if (request.studentId === user.id) {
          counts.total++;
          if (request.status === 'pending') counts.pending++;
          else if (request.status === 'in_review') counts.in_review++;
          else if (request.status === 'approved') counts.approved++;
          else if (request.status === 'rejected') counts.rejected++;
        }
      });
    } else {
      // For admin, department head, and academic secretary, show all requests
      requests.forEach(request => {
        counts.total++;
        if (request.status === 'pending') counts.pending++;
        else if (request.status === 'in_review') counts.in_review++;
        else if (request.status === 'approved') counts.approved++;
        else if (request.status === 'rejected') counts.rejected++;
      });
    }

    return counts;
  };

  const statusCounts = getStatusCounts();

  // Get the most recent requests (limit to 5)
  const getRecentRequests = () => {
    if (user?.role === 'student') {
      return requests
        .filter(req => req.studentId === user.id)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5);
    } else {
      return requests
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5);
    }
  };

  const recentRequests = getRecentRequests();

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0F4C81]"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-1">
          Bienvenue, {user?.name}
        </h2>
        <p className="text-sm text-gray-500">
          {user?.role === 'student' 
            ? 'Suivez vos requêtes académiques et soumettez de nouvelles demandes.' 
            : 'Gérez et traitez les requêtes académiques des étudiants.'}
        </p>
      </div>

      {/* Action Button (for students) */}
      {user?.role === 'student' && (
        <div className="mb-6">
          <Link
            to="/requests/new"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#0F4C81] hover:bg-[#0D3F6C]"
          >
            <FilePlus className="-ml-1 mr-2 h-5 w-5" />
            Nouvelle requête
          </Link>
        </div>
      )}

      {/* Status Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    En attente
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {statusCounts.pending}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <Link to="/requests?status=pending" className="font-medium text-[#0F4C81] hover:text-[#0D3F6C]">
                Voir toutes
                <span className="sr-only"> les requêtes en attente</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <AlertCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    En examen
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {statusCounts.in_review}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <Link to="/requests?status=in_review" className="font-medium text-[#0F4C81] hover:text-[#0D3F6C]">
                Voir toutes
                <span className="sr-only"> les requêtes en examen</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Approuvées
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {statusCounts.approved}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <Link to="/requests?status=approved" className="font-medium text-[#0F4C81] hover:text-[#0D3F6C]">
                Voir toutes
                <span className="sr-only"> les requêtes approuvées</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Rejetées
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {statusCounts.rejected}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <Link to="/requests?status=rejected" className="font-medium text-[#0F4C81] hover:text-[#0D3F6C]">
                Voir toutes
                <span className="sr-only"> les requêtes rejetées</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Requests */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 pt-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Requêtes récentes</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Les dernières requêtes {user?.role === 'student' ? 'que vous avez soumises' : 'soumises par les étudiants'}.
          </p>
        </div>
        <div className="border-t border-gray-200 mt-4">
          <ul className="divide-y divide-gray-200">
            {recentRequests.length > 0 ? (
              recentRequests.map((request) => (
                <li key={request.id}>
                  <Link to={`/requests/${request.id}`} className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-[#0F4C81] truncate">
                            {request.title}
                          </p>
                          <StatusBadge status={request.status} className="ml-2" />
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            {user?.role !== 'student' && `${request.studentName} • `}
                            {request.department}
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
              ))
            ) : (
              <li className="px-4 py-6 text-center text-sm text-gray-500">
                Aucune requête pour le moment.
                {user?.role === 'student' && (
                  <div className="mt-2">
                    <Link to="/requests/new" className="text-[#0F4C81] hover:text-[#0D3F6C] font-medium">
                      Créer une nouvelle requête
                    </Link>
                  </div>
                )}
              </li>
            )}
          </ul>
        </div>
        <div className="bg-gray-50 px-4 py-4 sm:px-6 rounded-b-lg">
          <div className="text-sm">
            <Link to="/requests" className="font-medium text-[#0F4C81] hover:text-[#0D3F6C]">
              Voir toutes les requêtes
              <span className="sr-only"> requests</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;