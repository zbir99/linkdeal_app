import { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';

interface SettingsActionsProps {
  onSave: () => void;
}

const SettingsActions: FunctionComponent<SettingsActionsProps> = ({ onSave }) => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate('/admin');
  };

  const handleSave = () => {
    onSave();
  };

  return (
    <div className="w-full h-12 relative flex items-start gap-4 text-center text-sm font-arimo">
      <div 
        className="h-12 flex-[0.9333] rounded-xl bg-white border-gray border-solid border-[0.8px] box-border flex items-center justify-center py-2 px-4 cursor-pointer hover:bg-gray-50 hover:border-[#7008E7] hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md"
        onClick={handleCancel}
      >
        <div className="relative leading-5" style={{ color: '#7008E7' }}>Cancel</div>
      </div>
      <div 
        className="h-12 flex-1 relative shadow-[0px_10px_15px_-3px_rgba(112,_8,_231,_0.5),_0px_4px_6px_-4px_rgba(112,_8,_231,_0.5)] rounded-xl text-white cursor-pointer hover:bg-[#8020F7] hover:scale-105 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
        style={{ backgroundColor: '#7008E7' }}
        onClick={handleSave}
      >
        <svg className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17 21V13H7V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7 3V8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <div className="leading-5">Save All Changes</div>
      </div>
    </div>
  );
};

export default SettingsActions;
