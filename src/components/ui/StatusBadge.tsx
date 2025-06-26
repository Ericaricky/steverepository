import React from 'react';
import { RequestStatus } from '../../contexts/RequestContext';

interface StatusBadgeProps {
  status: RequestStatus;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const getStatusInfo = (status: RequestStatus) => {
    switch (status) {
      case 'pending':
        return {
          label: 'En attente',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
        };
      case 'in_review':
        return {
          label: 'En cours d\'examen',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
        };
      case 'approved':
        return {
          label: 'Approuvée',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
        };
      case 'rejected':
        return {
          label: 'Rejetée',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
        };
      case 'more_info':
        return {
          label: 'Infos supplémentaires',
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-800',
        };
      case 'archived':
        return {
          label: 'Archivée',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
        };
      default:
        return {
          label: 'Inconnu',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
        };
    }
  };

  const { label, bgColor, textColor } = getStatusInfo(status);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor} ${className}`}>
      {label}
    </span>
  );
};

export default StatusBadge;