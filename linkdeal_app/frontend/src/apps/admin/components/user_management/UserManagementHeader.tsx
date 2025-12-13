import { FunctionComponent } from 'react';

interface UserManagementHeaderProps {
  onBackToDashboard: () => void;
}

const UserManagementHeader: FunctionComponent<UserManagementHeaderProps> = ({ onBackToDashboard }) => {
  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBackToDashboard}
        className="h-9 rounded-lg bg-white/5 border border-white/10 px-4 text-sm text-white/70 font-medium transition-colors hover:bg-white/10 hover:text-white hover:border-white/20"
      >
        ← Back to Dashboard
      </button>
      
      {/* Page Title and Description */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col items-start gap-2">
          <h1 className="text-3xl font-semibold text-white leading-tight">
            User Management
          </h1>
          <p className="text-base text-white/60">
            Manage all platform users and their permissions
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserManagementHeader;
