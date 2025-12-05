import { FunctionComponent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserManagementHeader from '../components/user_management/UserManagementHeader';
import UserStats from '../components/user_management/UserStats';
import UserFilters from '../components/user_management/UserFilters';
import UserTable from '../components/user_management/UserTable';

const UserManagement: FunctionComponent = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [selectedStatus, setSelectedStatus] = useState('All Status');

  const handleBackToDashboard = () => {
    navigate('/admin');
  };

  const handleFilterChange = (newSearchTerm: string, newSelectedRole: string, newSelectedStatus: string) => {
    setSearchTerm(newSearchTerm);
    setSelectedRole(newSelectedRole);
    setSelectedStatus(newSelectedStatus);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedRole('All Roles');
    setSelectedStatus('All Status');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#2a1a3e] relative">
      {/* Background Blur Effects - Fixed to viewport */}
      <div className="fixed top-[60px] left-[338px] [filter:blur(128px)] rounded-[32014000px] [background:linear-gradient(135deg,_rgba(128,_51,_208,_0.4),_rgba(10,_32,_59,_0.4))] w-96 h-96 pointer-events-none z-0" />
      <div className="fixed top-[488px] left-[687px] [filter:blur(128px)] rounded-[32014000px] [background:linear-gradient(135deg,_rgba(128,_51,_208,_0.4),_rgba(10,_32,_59,_0.4))] w-96 h-96 pointer-events-none z-0" />
      
      {/* Additional background gradients for full coverage */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none z-0" />

      {/* Content */}
      <div className="relative z-10 p-6">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header */}
          <UserManagementHeader onBackToDashboard={handleBackToDashboard} />

          {/* Stats */}
          <UserStats />

          {/* Filters */}
          <UserFilters onFilterChange={handleFilterChange} searchTerm={searchTerm} selectedRole={selectedRole} selectedStatus={selectedStatus} />

          {/* User Table */}
          <UserTable searchTerm={searchTerm} selectedRole={selectedRole} selectedStatus={selectedStatus} onClearFilters={handleClearFilters} />
        </div>
      </div>
    </div>
  );
};

export default UserManagement;