import React, { createContext, useState, useContext, useEffect } from 'react';

// Types
export type RequestStatus = 'created' | 'verify' | 'approved' | 'rejected' | 'processing' | 'completed' | 'failed';
export type RequestType = 'transcript' | 'grade_appeal' | 'enrollment' | 'exemption' | 'other';

export interface RequestComment {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  text: string;
  createdAt: string;
}

export interface RequestAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
}

export interface Request {
  id: string;
  title: string;
  description: string;
  type: RequestType;
  status: RequestStatus;
  urgency: 'low' | 'medium' | 'high';
  studentId: string;
  studentName: string;
  department: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  comments: RequestComment[];
  attachments: RequestAttachment[];
  statusHistory: {
    status: RequestStatus;
    changedBy: string;
    changedAt: string;
    comment?: string;
  }[];
}

interface RequestContextType {
  requests: Request[];
  loading: boolean;
  error: string | null;
  addRequest: (request: Omit<Request, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'statusHistory'>) => Promise<void>;
  updateRequestStatus: (id: string, status: RequestStatus, comment?: string) => Promise<void>;
  addComment: (requestId: string, text: string) => Promise<void>;
  getRequestById: (id: string) => Request | undefined;
  filterRequests: (filters: {
    status?: RequestStatus[];
    type?: RequestType[];
    search?: string;
    department?: string;
  }) => Request[];
}

// Create the context
const RequestContext = createContext<RequestContextType | undefined>(undefined);

// Provider component
export const RequestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load requests from localStorage or initialize with mock data
    const storedRequests = localStorage.getItem('acadRequests');
    
    if (storedRequests) {
      setRequests(JSON.parse(storedRequests));
    } else {
      // Mock data
      const mockRequests: Request[] = [
        {
          id: '1',
          title: 'Demande de relevé de notes',
          description: 'Je souhaite obtenir mon relevé de notes pour la session 2023.',
          type: 'transcript',
          status: 'created',
          urgency: 'medium',
          studentId: '5',
          studentName: 'Student User',
          department: 'Computer Science',
          createdAt: new Date(2023, 5, 15).toISOString(),
          updatedAt: new Date(2023, 5, 15).toISOString(),
          comments: [],
          attachments: [],
          statusHistory: [
            {
              status: 'created',
              changedBy: 'Student User',
              changedAt: new Date(2023, 5, 15).toISOString(),
            }
          ]
        },
        {
          id: '2',
          title: 'Réclamation de note examen Algorithme',
          description: 'Je souhaite faire une réclamation concernant ma note d\'examen en Algorithme qui me semble incorrecte.',
          type: 'grade_appeal',
          status: 'processing',
          urgency: 'high',
          studentId: '5',
          studentName: 'Student User',
          department: 'Computer Science',
          createdAt: new Date(2023, 4, 10).toISOString(),
          updatedAt: new Date(2023, 4, 25).toISOString(),
          assignedTo: 'Teacher User',
          comments: [
            {
              id: 'c1',
              userId: '2',
              userName: 'Teacher User',
              userRole: 'teacher',
              text: 'Votre demande est en cours d\'examen. Merci de fournir votre copie.',
              createdAt: new Date(2023, 4, 20).toISOString(),
            }
          ],
          attachments: [
            {
              id: 'a1',
              name: 'Screenshot_note.pdf',
              url: '#',
              type: 'application/pdf',
              size: 2500000,
              uploadedAt: new Date(2023, 4, 10).toISOString(),
            }
          ],
          statusHistory: [
            {
              status: 'created',
              changedBy: 'Student User',
              changedAt: new Date(2023, 4, 10).toISOString(),
            },
            {
              status: 'processing',
              changedBy: 'Academic Secretary',
              changedAt: new Date(2023, 4, 15).toISOString(),
              comment: 'Requête transmise au professeur concerné',
            }
          ]
        },
        {
          id: '3',
          title: 'Demande de dispense de cours',
          description: 'Je demande une dispense pour le cours de Statistiques car j\'ai déjà validé ce module dans mon établissement précédent.',
          type: 'exemption',
          status: 'approved',
          urgency: 'medium',
          studentId: '5',
          studentName: 'Student User',
          department: 'Computer Science',
          createdAt: new Date(2023, 3, 5).toISOString(),
          updatedAt: new Date(2023, 3, 20).toISOString(),
          assignedTo: 'Department Head',
          comments: [
            {
              id: 'c2',
              userId: '3',
              userName: 'Department Head',
              userRole: 'department_head',
              text: 'Après examen de votre dossier, votre demande est approuvée.',
              createdAt: new Date(2023, 3, 20).toISOString(),
            }
          ],
          attachments: [
            {
              id: 'a2',
              name: 'Relevé_notes_précédent.pdf',
              url: '#',
              type: 'application/pdf',
              size: 3500000,
              uploadedAt: new Date(2023, 3, 5).toISOString(),
            },
            {
              id: 'a3',
              name: 'Programme_cours.pdf',
              url: '#',
              type: 'application/pdf',
              size: 1500000,
              uploadedAt: new Date(2023, 3, 5).toISOString(),
            }
          ],
          statusHistory: [
            {
              status: 'created',
              changedBy: 'Student User',
              changedAt: new Date(2023, 3, 5).toISOString(),
            },
            {
              status: 'processing',
              changedBy: 'Academic Secretary',
              changedAt: new Date(2023, 3, 10).toISOString(),
            },
            {
              status: 'approved',
              changedBy: 'Department Head',
              changedAt: new Date(2023, 3, 20).toISOString(),
              comment: 'Dispense accordée après vérification des acquis',
            }
          ]
        }
      ];
      
      setRequests(mockRequests);
      localStorage.setItem('acadRequests', JSON.stringify(mockRequests));
    }
    
    setLoading(false);
  }, []);

  // Save requests to localStorage whenever they change
  useEffect(() => {
    if (requests.length > 0) {
      localStorage.setItem('acadRequests', JSON.stringify(requests));
    }
  }, [requests]);

  const addRequest = async (
    requestData: Omit<Request, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'statusHistory'>
  ) => {
    try {
      const now = new Date().toISOString();
      const newRequest: Request = {
        ...requestData,
        id: `req-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
        comments: [],
        statusHistory: [
          {
            status: 'created',
            changedBy: requestData.studentName,
            changedAt: now,
          }
        ]
      };
      
      setRequests(prevRequests => [...prevRequests, newRequest]);
    } catch (err) {
      setError('Failed to add request');
      console.error(err);
    }
  };

  const updateRequestStatus = async (id: string, status: RequestStatus, comment?: string) => {
    try {
      setRequests(prevRequests => 
        prevRequests.map(req => {
          if (req.id === id) {
            const now = new Date().toISOString();
            const updatedStatusHistory = [
              ...req.statusHistory,
              {
                status,
                changedBy: 'Current User', // In a real app, this would be the authenticated user
                changedAt: now,
                comment
              }
            ];
            
            return {
              ...req,
              status,
              updatedAt: now,
              statusHistory: updatedStatusHistory
            };
          }
          return req;
        })
      );
    } catch (err) {
      setError('Failed to update request status');
      console.error(err);
    }
  };

  const addComment = async (requestId: string, text: string) => {
    try {
      setRequests(prevRequests => 
        prevRequests.map(req => {
          if (req.id === requestId) {
            const now = new Date().toISOString();
            const newComment: RequestComment = {
              id: `comment-${Date.now()}`,
              userId: 'current-user-id', // In a real app, this would be the authenticated user id
              userName: 'Current User', // In a real app, this would be the authenticated user name
              userRole: 'role', // In a real app, this would be the authenticated user role
              text,
              createdAt: now
            };
            
            return {
              ...req,
              updatedAt: now,
              comments: [...req.comments, newComment]
            };
          }
          return req;
        })
      );
    } catch (err) {
      setError('Failed to add comment');
      console.error(err);
    }
  };

  const getRequestById = (id: string) => {
    return requests.find(request => request.id === id);
  };

  const filterRequests = (filters: {
    status?: RequestStatus[];
    type?: RequestType[];
    search?: string;
    department?: string;
  }) => {
    return requests.filter(request => {
      // Filter by status
      if (filters.status && filters.status.length > 0 && !filters.status.includes(request.status)) {
        return false;
      }
      
      // Filter by type
      if (filters.type && filters.type.length > 0 && !filters.type.includes(request.type)) {
        return false;
      }
      
      // Filter by department
      if (filters.department && request.department !== filters.department) {
        return false;
      }
      
      // Filter by search term
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        return (
          request.title.toLowerCase().includes(searchTerm) ||
          request.description.toLowerCase().includes(searchTerm) ||
          request.studentName.toLowerCase().includes(searchTerm)
        );
      }
      
      return true;
    });
  };

  const value = {
    requests,
    loading,
    error,
    addRequest,
    updateRequestStatus,
    addComment,
    getRequestById,
    filterRequests
  };

  return <RequestContext.Provider value={value}>{children}</RequestContext.Provider>;
};

// Custom hook to use the request context
export const useRequests = () => {
  const context = useContext(RequestContext);
  if (context === undefined) {
    throw new Error('useRequests must be used within a RequestProvider');
  }
  return context;
};