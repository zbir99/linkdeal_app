import { FunctionComponent, useMemo, useState, useEffect } from 'react';
import api from '@/services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joinDate: string;
  lastActive: string;
  sessions: number;
  amount: string;
  initials: string;
  profile_picture_url?: string;
  social_picture_url?: string;
}

interface EditableUser {
  id: string;
  role: string;
  full_name: string;
  // Mentor fields
  professional_title?: string;
  location?: string;
  bio?: string;
  // Mentee fields
  current_role?: string;
  field_of_study?: string;
  // Common fields
  country?: string;
  languages?: string[];
  skills?: string[];
}

interface UserTableProps {
  searchTerm: string;
  selectedRole: string;
  selectedStatus: string;
  onClearFilters: () => void;
}

// Helper function to format "time ago"
const formatTimeAgo = (dateString: string | null): string => {
  if (!dateString) return 'Never';

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffWeeks === 1) return '1 week ago';
  if (diffWeeks < 4) return `${diffWeeks} weeks ago`;
  if (diffMonths === 1) return '1 month ago';
  return `${diffMonths} months ago`;
};

const UserTable: FunctionComponent<UserTableProps> = ({ searchTerm, selectedRole, selectedStatus, onClearFilters }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [togglingUserId, setTogglingUserId] = useState<string | null>(null);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<EditableUser | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  // Delete confirmation state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        // Fetch approved mentors
        const mentorsApprovedRes = await api.get('/auth/admin/mentors/pending/?status=approved');
        const mentorsApproved = (mentorsApprovedRes.data.results || mentorsApprovedRes.data || []).map((m: any) => ({
          id: m.id,
          name: m.full_name,
          email: m.email,
          role: 'Mentor',
          status: 'Active',
          joinDate: new Date(m.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          lastActive: m.last_active ? formatTimeAgo(m.last_active) : '-',
          sessions: m.sessions_count ?? 0,
          amount: `€${((m.total_amount ?? 0)).toLocaleString()}`,
          initials: m.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase(),
          profile_picture_url: m.profile_picture_url,
          social_picture_url: m.social_picture_url
        }));

        // Fetch rejected mentors
        const mentorsRejectedRes = await api.get('/auth/admin/mentors/pending/?status=rejected');
        const mentorsRejected = (mentorsRejectedRes.data.results || mentorsRejectedRes.data || []).map((m: any) => ({
          id: m.id,
          name: m.full_name,
          email: m.email,
          role: 'Mentor',
          status: 'Rejected',
          joinDate: new Date(m.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          lastActive: m.last_active ? formatTimeAgo(m.last_active) : '-',
          sessions: m.sessions_count ?? 0,
          amount: `€${((m.total_amount ?? 0)).toLocaleString()}`,
          initials: m.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase(),
          profile_picture_url: m.profile_picture_url,
          social_picture_url: m.social_picture_url
        }));

        // Fetch banned mentors
        const mentorsBannedRes = await api.get('/auth/admin/mentors/pending/?status=banned');
        const mentorsBanned = (mentorsBannedRes.data.results || mentorsBannedRes.data || []).map((m: any) => ({
          id: m.id,
          name: m.full_name,
          email: m.email,
          role: 'Mentor',
          status: 'Suspended',
          joinDate: new Date(m.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          lastActive: m.last_active ? formatTimeAgo(m.last_active) : '-',
          sessions: m.sessions_count ?? 0,
          amount: `€${((m.total_amount ?? 0)).toLocaleString()}`,
          initials: m.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase(),
          profile_picture_url: m.profile_picture_url,
          social_picture_url: m.social_picture_url
        }));

        // Fetch active mentees
        const menteesActiveRes = await api.get('/auth/admin/mentees/?status=active');
        const menteesActive = (menteesActiveRes.data.results || menteesActiveRes.data || []).map((m: any) => ({
          id: m.id,
          name: m.full_name,
          email: m.email,
          role: 'Mentee',
          status: 'Active',
          joinDate: new Date(m.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          lastActive: m.last_active ? formatTimeAgo(m.last_active) : '-',
          sessions: m.sessions_count ?? 0,
          amount: `€${((m.total_amount ?? 0)).toLocaleString()}`,
          initials: m.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase(),
          profile_picture_url: m.profile_picture_url,
          social_picture_url: m.social_picture_url
        }));

        // Fetch banned mentees
        const menteesBannedRes = await api.get('/auth/admin/mentees/?status=banned');
        const menteesBanned = (menteesBannedRes.data.results || menteesBannedRes.data || []).map((m: any) => ({
          id: m.id,
          name: m.full_name,
          email: m.email,
          role: 'Mentee',
          status: 'Suspended',
          joinDate: new Date(m.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          lastActive: m.last_active ? formatTimeAgo(m.last_active) : '-',
          sessions: m.sessions_count ?? 0,
          amount: `€${((m.total_amount ?? 0)).toLocaleString()}`,
          initials: m.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase(),
          profile_picture_url: m.profile_picture_url,
          social_picture_url: m.social_picture_url
        }));

        // Combine and sort by join date (newest first)
        const allUsers = [...mentorsApproved, ...mentorsRejected, ...mentorsBanned, ...menteesActive, ...menteesBanned];
        // Note: joinDate is a string "Nov 24, 2024", so we'd need to parse it if we want strict sorting, 
        // but typically the API returns newest first. Let's just combine for now as UserTable might paginate locally or not.
        setUsers(allUsers);
      } catch (error) {
        console.error('Failed to fetch users', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Toggle user status between Active and Suspended
  const toggleUserStatus = async (userId: string, currentStatus: string, role: string) => {
    setTogglingUserId(userId);
    try {
      const endpoint = role === 'Mentor' ? 'mentors' : 'mentees';

      if (currentStatus === 'Active') {
        // Ban the user
        await api.post(`/auth/admin/${endpoint}/${userId}/ban/`, { reason: 'Suspended by admin' });
      } else {
        // Unban the user
        await api.post(`/auth/admin/${endpoint}/${userId}/unban/`);
      }

      // Update local state
      setUsers(prevUsers =>
        prevUsers.map(user => {
          if (user.id === userId) {
            const newStatus = user.status === 'Active' ? 'Suspended' : 'Active';
            return { ...user, status: newStatus };
          }
          return user;
        })
      );
    } catch (error) {
      console.error('Failed to toggle user status', error);
      alert('Failed to update user status. Please try again.');
    } finally {
      setTogglingUserId(null);
    }
  };

  // Handle Approve User (for Rejected Mentors)
  const handleApprove = async (userId: string) => {
    setTogglingUserId(userId);
    try {
      await api.post(`/auth/admin/mentors/${userId}/approve/`);

      // Update local state
      setUsers(prevUsers =>
        prevUsers.map(user => {
          if (user.id === userId) {
            return { ...user, status: 'Active' };
          }
          return user;
        })
      );
      setDropdownOpen(null);
    } catch (error) {
      console.error('Failed to approve user', error);
      alert('Failed to approve user. Please try again.');
    } finally {
      setTogglingUserId(null);
    }
  };




  // Toggle dropdown menu
  const toggleDropdown = (userId: string) => {
    setDropdownOpen(dropdownOpen === userId ? null : userId);
  };

  // Handle dropdown actions
  const handleEdit = async (userId: string, role: string) => {
    setDropdownOpen(null);

    try {
      // Fetch user details from backend
      const endpoint = role === 'Mentor' ? 'mentors' : 'mentees';
      const response = await api.get(`/auth/admin/${endpoint}/${userId}/`);
      const userData = response.data;

      setEditingUser({
        id: userId,
        role: role,
        full_name: userData.full_name || '',
        professional_title: userData.professional_title || '',
        location: userData.location || '',
        bio: userData.bio || '',
        current_role: userData.current_role || '',
        field_of_study: userData.field_of_study || '',
        country: userData.country || '',
        languages: userData.languages || [],
        skills: userData.skills || [],
      });
      setEditModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch user details', error);
      alert('Failed to load user details. Please try again.');
    }
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;

    setEditLoading(true);
    try {
      const endpoint = editingUser.role === 'Mentor' ? 'mentors' : 'mentees';

      // Build payload based on role
      const payload: Record<string, unknown> = {
        full_name: editingUser.full_name,
        country: editingUser.country,
        languages: editingUser.languages,
        skills: editingUser.skills,
      };

      if (editingUser.role === 'Mentor') {
        payload.professional_title = editingUser.professional_title;
        payload.location = editingUser.location;
        payload.bio = editingUser.bio;
      } else {
        payload.current_role = editingUser.current_role;
        payload.field_of_study = editingUser.field_of_study;
      }

      await api.patch(`/auth/admin/${endpoint}/${editingUser.id}/edit/`, payload);

      // Update local state
      setUsers(prevUsers =>
        prevUsers.map(user => {
          if (user.id === editingUser.id) {
            return { ...user, name: editingUser.full_name };
          }
          return user;
        })
      );

      setEditModalOpen(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Failed to save user', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = (user: User) => {
    setDropdownOpen(null);
    setDeletingUser(user);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingUser) return;

    setDeleteLoading(true);
    try {
      // Get the AppUser ID - we need to find it from the profile
      const endpoint = deletingUser.role === 'Mentor' ? 'mentors' : 'mentees';
      const profileResponse = await api.get(`/auth/admin/${endpoint}/${deletingUser.id}/`);
      const appUserId = profileResponse.data.user_id || profileResponse.data.user?.id;

      if (!appUserId) {
        throw new Error('Could not find user ID for deletion');
      }

      // Delete user (this removes from Auth0 and cascades to all related tables)
      await api.delete(`/auth/admin/users/${appUserId}/`);

      // Remove from local state
      setUsers(prevUsers => prevUsers.filter(user => user.id !== deletingUser.id));

      setDeleteConfirmOpen(false);
      setDeletingUser(null);
    } catch (error) {
      console.error('Failed to delete user', error);
      alert('Failed to delete user. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setDeletingUser(null);
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
      let matchesStatus = selectedStatus === 'All Status';
      if (selectedStatus === 'Active') matchesStatus = user.status === 'Active';
      if (selectedStatus === 'Suspended') matchesStatus = user.status === 'Suspended';

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
      case 'Suspended':
        return 'bg-red-500/20 border-red-500/30 text-red-300';
      case 'Rejected':
        return 'bg-red-500/10 border-red-500/20 text-red-400';
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
              <path d="M10.9013 4.99999C11.1296 6.12064 10.9669 7.28571 10.4402 8.30089C9.91352 9.31608 9.05473 10.12 8.00704 10.5787C6.95935 11.0373 5.7861 11.1229 4.68293 10.8212C3.57977 10.5195 2.61338 9.84869 1.94492 8.92071C1.27646 7.99272 0.946343 6.86361 1.00961 5.72169C1.07289 4.57976 1.52572 3.49404 2.29261 2.64558C3.05949 1.79712 4.09407 1.23721 5.22381 1.05922C6.35356 0.881233 7.51017 1.09592 8.50078 1.66749" stroke="#05DF72" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4.5 5.5L6 7L11 2" stroke="#05DF72" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <defs>
              <clipPath id="clip0_161_15555">
                <rect width="12" height="12" fill="white" />
              </clipPath>
            </defs>
          </svg>
        );
      case 'Suspended':
        return (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_161_15740)">
              <path d="M2.46484 2.46451L9.53534 9.53551" stroke="#FF6467" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11Z" stroke="#FF6467" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <defs>
              <clipPath id="clip0_161_15740">
                <rect width="12" height="12" fill="white" />
              </clipPath>
            </defs>
          </svg>
        );
      case 'Rejected':
        return (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 3L3 9M3 3L9 9" stroke="#FF6467" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-12 flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#7008E7] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <>
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
                  <path d="M20 22C23.866 22 27 18.866 27 15C27 11.134 23.866 8 20 8C16.134 8 13 11.134 13 15C13 18.866 16.134 22 20 22Z" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8 35C8 30.5817 11.5817 27 16 27H24C28.4183 27 32 30.5817 32 35" stroke="#A684FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
                        <div className="w-10 h-10 rounded-full bg-[#7008E7] flex items-center justify-center overflow-hidden shrink-0">
                          {user.profile_picture_url || user.social_picture_url ? (
                            <img
                              src={user.profile_picture_url || user.social_picture_url}
                              alt={user.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-white text-sm font-medium">{user.initials}</span>
                          )}
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
                        {user.status === 'Rejected' ? (
                          // Approve Button for Rejected Users
                          <button
                            className={`p-2 rounded-lg bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition-colors ${togglingUserId === user.id ? 'opacity-50 cursor-wait' : ''}`}
                            onClick={() => handleApprove(user.id)}
                            title="Approve User"
                            disabled={togglingUserId === user.id}
                          >
                            {togglingUserId === user.id ? (
                              <div className="w-4 h-4 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin"></div>
                            ) : (
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.33398 8.66667L6.00065 11.3333L12.6673 4.66667" stroke="#05DF72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </button>
                        ) : (
                          // Suspend/Activate Button for Active/Suspended Users
                          <button
                            className={`p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors ${togglingUserId === user.id ? 'opacity-50 cursor-wait' : ''}`}
                            onClick={() => toggleUserStatus(user.id, user.status, user.role)}
                            title={user.status === 'Active' ? 'Suspend User' : 'Activate User'}
                            disabled={togglingUserId === user.id}
                          >
                            {togglingUserId === user.id ? (
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : user.status === 'Active' ? (
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_161_15672)">
                                  <path d="M3.28516 3.28601L12.7125 12.714" stroke="#FF6467" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M8.00065 14.6667C11.6825 14.6667 14.6673 11.6819 14.6673 8C14.6673 4.3181 11.6825 1.33334 8.00065 1.33334C4.31875 1.33334 1.33398 4.3181 1.33398 8C1.33398 11.6819 4.31875 14.6667 8.00065 14.6667Z" stroke="#FF6467" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                </g>
                                <defs>
                                  <clipPath id="clip0_161_15672">
                                    <rect width="16" height="16" fill="white" />
                                  </clipPath>
                                </defs>
                              </svg>
                            ) : (
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.666 7.33333L11.9993 8.66667L14.666 6" stroke="#05DF72" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M10.6673 14V12.6667C10.6673 11.9594 10.3864 11.2811 9.88627 10.781C9.38617 10.281 8.70789 10 8.00065 10H4.00065C3.29341 10 2.61513 10.281 2.11503 10.781C1.61494 11.2811 1.33398 11.9594 1.33398 12.6667V14" stroke="#05DF72" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M6.00065 7.33333C7.47341 7.33333 8.66732 6.13943 8.66732 4.66667C8.66732 3.19391 7.47341 2 6.00065 2C4.52789 2 3.33398 3.19391 3.33398 4.66667C3.33398 6.13943 4.52789 7.33333 6.00065 7.33333Z" stroke="#05DF72" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </button>
                        )}
                        <div className="relative dropdown-container">
                          <button
                            className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                            onClick={() => toggleDropdown(user.id)}
                          >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M8.00065 8.66666C8.36884 8.66666 8.66732 8.36818 8.66732 7.99999C8.66732 7.63181 8.36884 7.33333 8.00065 7.33333C7.63246 7.33333 7.33398 7.63181 7.33398 7.99999C7.33398 8.36818 7.63246 8.66666 8.00065 8.66666Z" stroke="#99A1AF" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M8.00065 4C8.36884 4 8.66732 3.70152 8.66732 3.33333C8.66732 2.96514 8.36884 2.66666 8.00065 2.66666C7.63246 2.66666 7.33398 2.96514 7.33398 3.33333C7.33398 3.70152 7.63246 4 8.00065 4Z" stroke="#99A1AF" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M8.00065 13.3333C8.36884 13.3333 8.66732 13.0349 8.66732 12.6667C8.66732 12.2985 8.36884 12 8.00065 12C7.63246 12 7.33398 12.2985 7.33398 12.6667C7.33398 13.0349 7.63246 13.3333 8.00065 13.3333Z" stroke="#99A1AF" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>

                          {/* Dropdown Menu */}
                          {dropdownOpen === user.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-[#1a1a2e] border border-white/10 rounded-lg shadow-lg z-50">
                              <div className="py-1">
                                {/* Approve Option for Rejected Users */}
                                {user.status === 'Rejected' && (
                                  <button
                                    onClick={() => handleApprove(user.id)}
                                    className="w-full px-4 py-2 text-left text-green-400 hover:bg-green-500/10 hover:text-green-300 transition-colors flex items-center gap-2"
                                  >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Approve
                                  </button>
                                )}
                                {/* Edit Option */}
                                <button
                                  onClick={() => handleEdit(user.id, user.role)}
                                  className="w-full px-4 py-2 text-left text-white/80 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-2"
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                  Edit
                                </button>
                                {/* Delete Option */}
                                <button
                                  onClick={() => handleDelete(user)}
                                  className="w-full px-4 py-2 text-left text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center gap-2"
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
                  <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${currentPage === page
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
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {
        editModalOpen && editingUser && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold text-white mb-4">
                Edit {editingUser.role}
              </h2>

              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-white/60 text-sm mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editingUser.full_name}
                    onChange={(e) => setEditingUser({ ...editingUser!, full_name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#7008E7]"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="block text-white/60 text-sm mb-1">Country</label>
                  <input
                    type="text"
                    value={editingUser.country || ''}
                    onChange={(e) => setEditingUser({ ...editingUser!, country: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#7008E7]"
                  />
                </div>

                {/* Mentor-specific fields */}
                {editingUser.role === 'Mentor' && (
                  <>
                    <div>
                      <label className="block text-white/60 text-sm mb-1">Professional Title</label>
                      <input
                        type="text"
                        value={editingUser.professional_title || ''}
                        onChange={(e) => setEditingUser({ ...editingUser!, professional_title: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#7008E7]"
                      />
                    </div>
                    <div>
                      <label className="block text-white/60 text-sm mb-1">Location</label>
                      <input
                        type="text"
                        value={editingUser.location || ''}
                        onChange={(e) => setEditingUser({ ...editingUser!, location: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#7008E7]"
                      />
                    </div>
                    <div>
                      <label className="block text-white/60 text-sm mb-1">Bio</label>
                      <textarea
                        value={editingUser.bio || ''}
                        onChange={(e) => setEditingUser({ ...editingUser!, bio: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#7008E7] resize-none"
                      />
                    </div>
                  </>
                )}

                {/* Mentee-specific fields */}
                {editingUser.role === 'Mentee' && (
                  <>
                    <div>
                      <label className="block text-white/60 text-sm mb-1">Current Role</label>
                      <input
                        type="text"
                        value={editingUser.current_role || ''}
                        onChange={(e) => setEditingUser({ ...editingUser!, current_role: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#7008E7]"
                      />
                    </div>
                    <div>
                      <label className="block text-white/60 text-sm mb-1">Field of Study</label>
                      <input
                        type="text"
                        value={editingUser.field_of_study || ''}
                        onChange={(e) => setEditingUser({ ...editingUser!, field_of_study: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#7008E7]"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => { setEditModalOpen(false); setEditingUser(null); }}
                  className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={editLoading}
                  className="flex-1 px-4 py-2 rounded-lg bg-[#7008E7] text-white hover:bg-[#5c06bc] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {editLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Delete Confirmation Dialog */}
      {
        deleteConfirmOpen && deletingUser && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 w-full max-w-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Delete User</h2>
                  <p className="text-white/60 text-sm">This action cannot be undone</p>
                </div>
              </div>

              <p className="text-white/80 mb-4">
                Are you sure you want to delete <span className="font-semibold text-white">{deletingUser.name}</span>?
              </p>

              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-6">
                <p className="text-red-400 text-sm">
                  ⚠️ This will permanently remove the user from Auth0 and delete all their data including:
                </p>
                <ul className="text-red-400/80 text-sm mt-2 list-disc list-inside">
                  <li>Profile information</li>
                  <li>Session history</li>
                  <li>All related records</li>
                </ul>
              </div>

              {/* Dialog Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleCancelDelete}
                  className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleteLoading}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleteLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    'Delete User'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
    </>
  );
};

export default UserTable;
