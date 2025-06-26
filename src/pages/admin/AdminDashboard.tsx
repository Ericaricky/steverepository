import React, { useState } from 'react';
import { useRequests, RequestStatus, RequestType } from '../../contexts/RequestContext';
// import StatusBadge from '../../components/ui/StatusBadge';
import RequestTypeIcon, { getRequestTypeLabel } from '../../components/ui/RequestTypeIcon';
import { BarChart3, PieChart, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { requests, loading } = useRequests();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

  // Calculate statistics
  const getStatistics = () => {
    const stats = {
      total: requests.length,
      pending: 0,
      approved: 0,
      rejected: 0,
      inReview: 0,
      byType: {} as Record<RequestType, number>,
      byDepartment: {} as Record<string, number>,
      processingTime: [] as number[],
    };

    requests.forEach(request => {
      // Count by status
      if (request.status === 'pending') stats.pending++;
      if (request.status === 'approved') stats.approved++;
      if (request.status === 'rejected') stats.rejected++;
      if (request.status === 'in_review') stats.inReview++;

      // Count by type
      stats.byType[request.type] = (stats.byType[request.type] || 0) + 1;

      // Count by department
      stats.byDepartment[request.department] = (stats.byDepartment[request.department] || 0) + 1;

      // Calculate processing time for completed requests
      if (request.status === 'approved' || request.status === 'rejected') {
        const start = new Date(request.createdAt).getTime();
        const end = new Date(request.updatedAt).getTime();
        stats.processingTime.push((end - start) / (1000 * 60 * 60 * 24)); // Convert to days
      }
    });

    return stats;
  };

  const stats = getStatistics();
  const avgProcessingTime = stats.processingTime.length > 0
    ? Math.round(stats.processingTime.reduce((a, b) => a + b, 0) / stats.processingTime.length)
    : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0F4C81]"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Tableau de bord administratif</h2>
        <p className="mt-1 text-sm text-gray-500">
          Vue d'ensemble des requêtes académiques et des statistiques
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="mb-6">
        <div className="inline-flex rounded-md shadow-sm">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-4 py-2 text-sm font-medium rounded-l-md ${
              timeRange === 'week'
                ? 'bg-[#0F4C81] text-white'
                : 'bg-white text-gray-700 hover:text-gray-900 border border-gray-300'
            }`}
          >
            Semaine
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-4 py-2 text-sm font-medium -ml-px ${
              timeRange === 'month'
                ? 'bg-[#0F4C81] text-white'
                : 'bg-white text-gray-700 hover:text-gray-900 border border-gray-300'
            }`}
          >
            Mois
          </button>
          <button
            onClick={() => setTimeRange('year')}
            className={`px-4 py-2 text-sm font-medium rounded-r-md -ml-px ${
              timeRange === 'year'
                ? 'bg-[#0F4C81] text-white'
                : 'bg-white text-gray-700 hover:text-gray-900 border border-gray-300'
            }`}
          >
            Année
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {/* Total Requests */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total des requêtes
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stats.total}
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <ArrowUpRight className="self-center flex-shrink-0 h-4 w-4" />
                      <span className="sr-only">Augmentation</span>
                      12%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Processing Time */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <PieChart className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Temps moyen de traitement
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {avgProcessingTime} jours
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-red-600">
                      <ArrowDownRight className="self-center flex-shrink-0 h-4 w-4" />
                      <span className="sr-only">Diminution</span>
                      8%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Approval Rate */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Taux d'approbation
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stats.total > 0
                        ? Math.round((stats.approved / stats.total) * 100)
                        : 0}%
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <ArrowUpRight className="self-center flex-shrink-0 h-4 w-4" />
                      <span className="sr-only">Augmentation</span>
                      5%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Requêtes en attente
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stats.pending}
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-red-600">
                      <ArrowUpRight className="self-center flex-shrink-0 h-4 w-4" />
                      <span className="sr-only">Augmentation</span>
                      15%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Detailed Stats */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Request Types Distribution */}
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900">
              Distribution par type de requête
            </h3>
            <div className="mt-6">
              {Object.entries(stats.byType).map(([type, count]) => (
                <div key={type} className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <RequestTypeIcon type={type as RequestType} className="mr-2" />
                      <span className="text-sm font-medium text-gray-700">
                        {getRequestTypeLabel(type as RequestType)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {count} ({Math.round((count / stats.total) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#0F4C81] h-2 rounded-full"
                      style={{ width: `${(count / stats.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Department Distribution */}
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900">
              Distribution par département
            </h3>
            <div className="mt-6">
              {Object.entries(stats.byDepartment).map(([dept, count]) => (
                <div key={dept} className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{dept}</span>
                    <span className="text-sm text-gray-500">
                      {count} ({Math.round((count / stats.total) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#0F4C81] h-2 rounded-full"
                      style={{ width: `${(count / stats.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;