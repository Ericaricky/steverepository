import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, UserCircle2, Search, Filter, Plus, Edit, Trash2, MoreVertical } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  matricule?: string;
  status: 'active' | 'inactive';
  lastLogin: string;
}

const UserManagement: React.FC = () => {

  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string[]>([]);
  const [departmentFilter, setDepartmentFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  // Mock user data
  const mockUsers: UserData[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'student',
      department: 'Computer Science',
      matricule: '19S2189',
      status: 'active',
      lastLogin: '2024-02-15T10:30:00Z'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'director',
      department: 'Computer Science',
      status: 'active',
      lastLogin: '2024-02-14T15:45:00Z'
    },
    {
      id: '3',
      name: 'Robert Johnson',
      email: 'robert.johnson@example.com',
      role: 'department_head',
      department: 'Computer Science',
      status: 'active',
      lastLogin: '2024-02-13T09:20:00Z'
    },
    {
      id: '4',
      name: 'Sarah Williams',
      email: 'sarah.williams@example.com',
      role: 'academic_secretary',
      status: 'inactive',
      lastLogin: '2024-01-20T11:15:00Z'
    }
  ];

  // Filter users based on search term and filters
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.matricule && user.matricule.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = roleFilter.length === 0 || roleFilter.includes(user.role);
    const matchesDepartment = departmentFilter.length === 0 || 
      (user.department && departmentFilter.includes(user.department));
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(user.status);

    return matchesSearch && matchesRole && matchesDepartment && matchesStatus;
  });

  // Format date
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  // Role translation
  const translateRole = (role: string) => {
    switch (role) {
      case 'student':
        return 'Étudiant';
      case 'teacher':
        return 'Enseignant';
      case 'department_head':
        return 'Chef de département';
      case 'academic_secretary':
        return 'Secrétaire académique';
      case 'admin':
        return 'Administrateur';
      default:
        return role;
    }
  };


  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Gestion des utilisateurs</h2>
        <p className="mt-1 text-sm text-gray-500">
          Gérez les comptes utilisateurs et leurs permissions
        </p>
      </div>

      {/* Actions Bar */}
      <div className="mb-6 bg-white shadow rounded-lg">
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
                  placeholder="Nom, email, matricule..."
                />
              </div>
            </div>

            {/* Role Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Rôle
              </label>
              <div className="mt-1 flex flex-wrap gap-2">
                {['student', 'teacher', 'department_head', 'academic_secretary', 'admin'].map((role) => (
                  <button
                    key={role}
                    onClick={() => setRoleFilter(prev =>
                      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
                    )}
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      roleFilter.includes(role)
                        ? 'bg-[#0F4C81] text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {translateRole(role)}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Statut
              </label>
              <div className="mt-1 flex gap-2">
                {['active', 'inactive'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(prev =>
                      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
                    )}
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      statusFilter.includes(status)
                        ? 'bg-[#0F4C81] text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {status === 'active' ? 'Actif' : 'Inactif'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => {
                setSearchTerm('');
                setRoleFilter([]);
                setDepartmentFilter([]);
                setStatusFilter([]);
              }}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Réinitialiser les filtres
            </button>

            <Link to='/admin/users/create'
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#0F4C81] hover:bg-[#0D3F6C]"
            >
              <Plus className="-ml-1 mr-2 h-5 w-5" 
              />
              Nouvel utilisateur
            </Link>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="min-w-full divide-y divide-gray-200">
          <div className="bg-gray-50">
            <div className="grid grid-cols-6 gap-4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="col-span-2">Utilisateur</div>
              <div>Rôle</div>
              <div>Département</div>
              <div>Dernière connexion</div>
              <div className="text-right">Actions</div>
            </div>
          </div>
          <div className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <div key={user.id} className="grid grid-cols-6 gap-4 px-6 py-4 items-center">
                <div className="col-span-2">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-[#0F4C81] flex items-center justify-center text-white">
                        <UserCircle2 className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                      {user.matricule && (
                        <div className="text-xs text-gray-400">#{user.matricule}</div>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {translateRole(user.role)}
                  </span>
                </div>
                <div className="text-sm text-gray-900">
                  {user.department || '-'}
                </div>
                <div className="text-sm text-gray-500">
                  {formatDate(user.lastLogin)}
                </div>
                <div className="text-right space-x-2">
                  <button
                    className="text-gray-400 hover:text-gray-500"
                    title="Modifier"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    className="text-gray-400 hover:text-gray-500"
                    title="Supprimer"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                  <button
                    className="text-gray-400 hover:text-gray-500"
                    title="Plus d'options"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun utilisateur trouvé</h3>
            <p className="mt-1 text-sm text-gray-500">
              Essayez de modifier vos filtres ou d'effectuer une nouvelle recherche.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;