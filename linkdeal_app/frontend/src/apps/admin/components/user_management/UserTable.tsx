import { FunctionComponent, useMemo, useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  joinDate: string;
  lastActive: string;
  sessions: number;
  amount: string;
  initials: string;
}

interface UserTableProps {
  searchTerm: string;
  selectedRole: string;
  selectedStatus: string;
  onClearFilters: () => void;
}

const UserTable: FunctionComponent<UserTableProps> = ({ searchTerm, selectedRole, selectedStatus, onClearFilters }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: 'Sophie Martin',
      email: 'sophie.martin@email.com',
      role: 'Mentee',
      status: 'Active',
      joinDate: 'Jan 15, 2024',
      lastActive: '2 hours ago',
      sessions: 12,
      amount: '€1,800',
      initials: 'SM'
    },
    {
      id: 2,
      name: 'Alexandre Dubois',
      email: 'alex.dubois@email.com',
      role: 'Mentor',
      status: 'Active',
      joinDate: 'Nov 20, 2023',
      lastActive: '1 day ago',
      sessions: 45,
      amount: '€6,750',
      initials: 'AD'
    },
    {
      id: 3,
      name: 'Thomas Bernard',
      email: 'thomas.bernard@email.com',
      role: 'Mentor',
      status: 'Active',
      joinDate: 'Mar 10, 2024',
      lastActive: '5 hours ago',
      sessions: 28,
      amount: '€4,200',
      initials: 'TB'
    },
    {
      id: 4,
      name: 'Julie Petit',
      email: 'julie.petit@email.com',
      role: 'Mentee',
      status: 'Inactive',
      joinDate: 'Jun 5, 2024',
      lastActive: '2 weeks ago',
      sessions: 3,
      amount: '€450',
      initials: 'JP'
    },
    {
      id: 5,
      name: 'Marc Durand',
      email: 'marc.durand@email.com',
      role: 'Mentor',
      status: 'Suspended',
      joinDate: 'Feb 18, 2024',
      lastActive: '1 month ago',
      sessions: 15,
      amount: '€2,250',
      initials: 'MD'
    },
    {
      id: 6,
      name: 'Claire Moreau',
      email: 'claire.moreau@email.com',
      role: 'Mentee',
      status: 'Active',
      joinDate: 'Jul 22, 2024',
      lastActive: '30 minutes ago',
      sessions: 8,
      amount: '€1,200',
      initials: 'CM'
    },
    {
      id: 7,
      name: 'Pierre Laurent',
      email: 'pierre.laurent@email.com',
      role: 'Admin',
      status: 'Active',
      joinDate: 'Oct 1, 2023',
      lastActive: 'Just now',
      sessions: 0,
      amount: '€0',
      initials: 'PL'
    }
  ]);

  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);

  // Toggle user status between Active and Suspended
  const toggleUserStatus = (userId: number) => {
    setUsers(prevUsers => 
      prevUsers.map(user => {
        if (user.id === userId) {
          // Toggle between Active and Suspended
          const newStatus = user.status === 'Active' ? 'Suspended' : 'Active';
          return { ...user, status: newStatus };
        }
        return user;
      })
    );
  };

  // Toggle dropdown menu
  const toggleDropdown = (userId: number) => {
    setDropdownOpen(dropdownOpen === userId ? null : userId);
  };

  // Handle dropdown actions
  const handleEdit = (userId: number) => {
    console.log('Edit user:', userId);
    setDropdownOpen(null);
  };

  const handleDelete = (userId: number) => {
    console.log('Delete user:', userId);
    setDropdownOpen(null);
  };

  const handleView = (userId: number) => {
    console.log('View user:', userId);
    setDropdownOpen(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-container')) {
        setDropdownOpen(null);
      }
    };

    if (dropdownOpen !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  // Filter users based on search term and filters
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      // Search filter (name and email)
      const matchesSearch = searchTerm === '' || 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Role filter
      const matchesRole = selectedRole === 'All Roles' || user.role === selectedRole;
      
      // Status filter
      const matchesStatus = selectedStatus === 'All Status' || user.status === selectedStatus;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, selectedRole, selectedStatus]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedRole, selectedStatus]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-orange-500/20 border-orange-500/30 text-orange-300';
      case 'Mentor':
        return 'bg-purple-500/20 border-purple-500/30 text-purple-300';
      case 'Mentee':
        return 'bg-blue-500/20 border-blue-500/30 text-blue-300';
      default:
        return 'bg-gray-500/20 border-gray-500/30 text-gray-300';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500/20 border-green-500/30 text-green-400';
      case 'Inactive':
        return 'bg-gray-500/20 border-gray-500/30 text-gray-300';
      case 'Suspended':
        return 'bg-red-500/20 border-red-500/30 text-red-300';
      default:
        return 'bg-gray-500/20 border-gray-500/30 text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_161_15555)">
              <path d="M10.9013 4.99999C11.1296 6.12064 10.9669 7.28571 10.4402 8.30089C9.91352 9.31608 9.05473 10.12 8.00704 10.5787C6.95935 11.0373 5.7861 11.1229 4.68293 10.8212C3.57977 10.5195 2.61338 9.84869 1.94492 8.92071C1.27646 7.99272 0.946343 6.86361 1.00961 5.72169C1.07289 4.57976 1.52572 3.49404 2.29261 2.64558C3.05949 1.79712 4.09407 1.23721 5.22381 1.05922C6.35356 0.881233 7.51017 1.09592 8.50078 1.66749" stroke="#05DF72" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4.5 5.5L6 7L11 2" stroke="#05DF72" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
            <defs>
              <clipPath id="clip0_161_15555">
                <rect width="12" height="12" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        );
      case 'Inactive':
        return (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_161_15696)">
              <path d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11Z" stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 4V6" stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 8H6.005" stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
            <defs>
              <clipPath id="clip0_161_15696">
                <rect width="12" height="12" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        );
      case 'Suspended':
        return (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_161_15740)">
              <path d="M2.46484 2.46451L9.53534 9.53551" stroke="#FF6467" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11Z" stroke="#FF6467" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
            <defs>
              <clipPath id="clip0_161_15740">
                <rect width="12" height="12" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
      {/* Custom Scrollbar Styles */}
      <style>
        {`
          .user-table-scroll::-webkit-scrollbar {
            height: 8px;
          }
          .user-table-scroll::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
          }
          .user-table-scroll::-webkit-scrollbar-thumb {
            background: #7008E7;
            border-radius: 10px;
          }
          .user-table-scroll::-webkit-scrollbar-thumb:hover {
            background: #8B5CF6;
          }
          .user-table-scroll {
            scrollbar-width: thin;
            scrollbar-color: #7008E7 rgba(255, 255, 255, 0.05);
          }
        `}
      </style>
      <div className="overflow-x-auto user-table-scroll">
        {filteredUsers.length === 0 ? (
          // No Users Found State
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="w-20 h-20 rounded-full bg-purple-500/20 flex items-center justify-center mb-6">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 22C23.866 22 27 18.866 27 15C27 11.134 23.866 8 20 8C16.134 8 13 11.134 13 15C13 18.866 16.134 22 20 22Z" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 35C8 30.5817 11.5817 27 16 27H24C28.4183 27 32 30.5817 32 35" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No users found</h3>
            <p className="text-white/60 text-center max-w-md">
              We couldn't find any users matching your current filters. Try adjusting your search criteria or filters to see more results.
            </p>
            <button onClick={onClearFilters} className="mt-6 px-6 py-2 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm font-medium hover:bg-purple-500/30 hover:border-purple-500/50 transition-all duration-300">
              Clear Filters
            </button>
          </div>
        ) : (
          // Table with Users
          <table className="w-full">
            {/* Table Header */}
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-white/80 font-medium">User</th>
                <th className="text-center p-4 text-white/80 font-medium">Role</th>
                <th className="text-center p-4 text-white/80 font-medium">Status</th>
                <th className="text-center p-4 text-white/80 font-medium">Join Date</th>
                <th className="text-center p-4 text-white/80 font-medium">Last Active</th>
                <th className="text-center p-4 text-white/80 font-medium">Sessions</th>
                <th className="text-center p-4 text-white/80 font-medium">Amount</th>
                <th className="text-center p-4 text-white/80 font-medium">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  {/* User Column */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#7008E7] flex items-center justify-center">
                        <span className="text-white text-sm font-medium">{user.initials}</span>
                      </div>
                      <div>
                        <div className="text-white font-medium">{user.name}</div>
                        <div className="text-white/60 text-sm">{user.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Role Column */}
                  <td className="p-4 text-center">
                    <div className={`px-3 py-1 rounded-lg border text-xs font-medium flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-black/20 cursor-default ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </div>
                  </td>

                  {/* Status Column */}
                  <td className="p-4 text-center">
                    <div className={`px-1.5 py-1.5 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 h-7 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-black/20 cursor-default ${getStatusBadgeColor(user.status)}`}>
                      {getStatusIcon(user.status)}
                      {user.status}
                    </div>
                  </td>

                  {/* Join Date Column */}
                  <td className="p-4 text-center">
                    <div className="text-white/80 text-sm">{user.joinDate}</div>
                  </td>

                  {/* Last Active Column */}
                  <td className="p-4 text-center">
                    <div className="text-white/60 text-sm">{user.lastActive}</div>
                  </td>

                  {/* Sessions Column */}
                  <td className="p-4 text-center">
                    <div className="text-white text-sm font-medium">{user.sessions}</div>
                  </td>

                  {/* Amount Column */}
                  <td className="p-4 text-center">
                    <div className="text-white text-sm font-medium">{user.amount}</div>
                  </td>

                  {/* Actions Column */}
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 8L12 13L21 8" stroke="white" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M21 8V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V8" stroke="white" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M3 8L5 6L19 6L21 8" stroke="white" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M10 12H14" stroke="white" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button 
                        className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                        onClick={() => toggleUserStatus(user.id)}
                      >
                        {user.status === 'Active' ? (
                          // Suspend Icon (red circle with slash)
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_161_15672)">
                              <path d="M3.28516 3.28601L12.7125 12.714" stroke="#FF6467" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M8.00065 14.6667C11.6825 14.6667 14.6673 11.6819 14.6673 8C14.6673 4.3181 11.6825 1.33334 8.00065 1.33334C4.31875 1.33334 1.33398 4.3181 1.33398 8C1.33398 11.6819 4.31875 14.6667 8.00065 14.6667Z" stroke="#FF6467" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                            </g>
                            <defs>
                              <clipPath id="clip0_161_15672">
                                <rect width="16" height="16" fill="white"/>
                              </clipPath>
                            </defs>
                          </svg>
                        ) : (
                          // Unsuspend Icon (green check with user)
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.666 7.33333L11.9993 8.66667L14.666 6" stroke="#05DF72" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M10.6673 14V12.6667C10.6673 11.9594 10.3864 11.2811 9.88627 10.781C9.38617 10.281 8.70789 10 8.00065 10H4.00065C3.29341 10 2.61513 10.281 2.11503 10.781C1.61494 11.2811 1.33398 11.9594 1.33398 12.6667V14" stroke="#05DF72" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M6.00065 7.33333C7.47341 7.33333 8.66732 6.13943 8.66732 4.66667C8.66732 3.19391 7.47341 2 6.00065 2C4.52789 2 3.33398 3.19391 3.33398 4.66667C3.33398 6.13943 4.52789 7.33333 6.00065 7.33333Z" stroke="#05DF72" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </button>
                      <div className="relative dropdown-container">
                        <button 
                          className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                          onClick={() => toggleDropdown(user.id)}
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.00065 8.66666C8.36884 8.66666 8.66732 8.36818 8.66732 7.99999C8.66732 7.63181 8.36884 7.33333 8.00065 7.33333C7.63246 7.33333 7.33398 7.63181 7.33398 7.99999C7.33398 8.36818 7.63246 8.66666 8.00065 8.66666Z" stroke="#99A1AF" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M8.00065 4C8.36884 4 8.66732 3.70152 8.66732 3.33333C8.66732 2.96514 8.36884 2.66666 8.00065 2.66666C7.63246 2.66666 7.33398 2.96514 7.33398 3.33333C7.33398 3.70152 7.63246 4 8.00065 4Z" stroke="#99A1AF" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M8.00065 13.3333C8.36884 13.3333 8.66732 13.0349 8.66732 12.6667C8.66732 12.2985 8.36884 12 8.00065 12C7.63246 12 7.33398 12.2985 7.33398 12.6667C7.33398 13.0349 7.63246 13.3333 8.00065 13.3333Z" stroke="#99A1AF" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        
                        {/* Dropdown Menu */}
                        {dropdownOpen === user.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-[#1a1a2e] border border-white/10 rounded-lg shadow-lg z-50">
                            <div className="py-1">
                              <button
                                onClick={() => handleView(user.id)}
                                className="w-full px-4 py-2 text-left text-white/80 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-2"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M12 12C12 13.1046 11.1046 14 10 14S8 13.1046 8 12 8.89543 10 10 10 12 10.8954 12 12z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                View
                              </button>
                              <button
                                onClick={() => handleEdit(user.id)}
                                className="w-full px-4 py-2 text-left text-white/80 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-2"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M11 4H4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20H16C17.1046 20 18 19.1046 18 18V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M18.5 2.5C19.3284 1.67157 20.6716 1.67157 21.5 2.5C22.3284 3.32843 22.3284 4.67157 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(user.id)}
                                className="w-full px-4 py-2 text-left text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center gap-2"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M8 6V4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V6M19 6V20C19 21.1046 18.1046 22 17 22H7C5.89543 22 5 21.1046 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {filteredUsers.length > 0 && totalPages > 1 && (
        <div className="border-t border-white/10 px-4 py-4 sm:px-6">
          <div className="flex items-center justify-center gap-2">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-[#7008E7] border-[#7008E7] text-white'
                    : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                }`}
              >
                {page}
              </button>
            ))}

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
