import React from 'react';
import { RequestType } from '../../contexts/RequestContext';
import { FileText, Award, AlertCircle, BookOpen, Clipboard } from 'lucide-react';

interface RequestTypeIconProps {
  type: RequestType;
  size?: number;
  className?: string;
}

const RequestTypeIcon: React.FC<RequestTypeIconProps> = ({ 
  type, 
  size = 20, 
  className = '' 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'transcript':
        return <FileText size={size} className={className} />;
      case 'grade_appeal':
        return <AlertCircle size={size} className={className} />;
      case 'enrollment':
        return <BookOpen size={size} className={className} />;
      case 'exemption':
        return <Award size={size} className={className} />;
      case 'other':
      default:
        return <Clipboard size={size} className={className} />;
    }
  };

  return getIcon();
};

export const getRequestTypeLabel = (type: RequestType): string => {
  switch (type) {
    case 'transcript':
      return 'Relevé de notes';
    case 'grade_appeal':
      return 'Réclamation de note';
    case 'enrollment':
      return 'Inscription/Réinscription';
    case 'exemption':
      return 'Demande de dispense';
    case 'other':
    default:
      return 'Autre demande';
  }
};

export default RequestTypeIcon;