import { FunctionComponent, useState, useRef, useEffect } from 'react';

interface ChatConversation {
  id: string;
  session_id: string;
  title?: string;
  message_count: number;
  created_at: string;
  updated_at: string;
  messages: { role: string; content: string; timestamp: string }[];
}

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat?: () => void;
  onSelectChat?: (sessionId: string) => void;
  currentSessionId?: string;
}

import api from '@/services/api';

const ChatSidebar: FunctionComponent<ChatSidebarProps> = ({
  isOpen,
  onClose,
  onNewChat,
  onSelectChat,
  currentSessionId
}) => {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatConversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; chatId: string | null }>({ show: false, chatId: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);

  // Fetch chat history from API
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('ai/conversations/');
        setChatHistory(response.data.conversations || []);
      } catch (error) {
        console.error('Failed to fetch chat history:', error);
        setChatHistory([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatHistory();
  }, [currentSessionId]); // Refetch when session changes

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirm({ show: true, chatId: id });
    setOpenDropdownId(null);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.chatId) return;

    setIsDeleting(true);
    try {
      await api.delete(`ai/conversations/${deleteConfirm.chatId}/`);
      setChatHistory(prev => prev.filter(chat => chat.id !== deleteConfirm.chatId));
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    } finally {
      setIsDeleting(false);
      setDeleteConfirm({ show: false, chatId: null });
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm({ show: false, chatId: null });
  };

  const handleShare = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    const chat = chatHistory.find(c => c.id === id);
    if (!chat) return;

    // Create shareable link
    const shareUrl = `${window.location.origin}/mentee/ai-chat?session=${chat.session_id}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      // Show success toast
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 2500);
    } catch (error) {
      // Fallback - create temp input for older browsers
      const tempInput = document.createElement('input');
      tempInput.value = shareUrl;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 2500);
    }
    setOpenDropdownId(null);
  };

  const handleRenameClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const chat = chatHistory.find(c => c.id === id);
    setRenameValue(chat?.title || getChatTitle(chat!));
    setRenamingId(id);
    setOpenDropdownId(null);
    // Focus input after render
    setTimeout(() => renameInputRef.current?.focus(), 50);
  };

  const handleRenameSubmit = async (id: string) => {
    if (!renameValue.trim()) {
      setRenamingId(null);
      return;
    }

    try {
      await api.patch(`ai/conversations/${id}/`, { title: renameValue.trim() });
      setChatHistory(prev => prev.map(c =>
        c.id === id ? { ...c, title: renameValue.trim() } : c
      ));
    } catch (error) {
      console.error('Failed to rename conversation:', error);
    }
    setRenamingId(null);
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleRenameSubmit(id);
    } else if (e.key === 'Escape') {
      setRenamingId(null);
    }
  };

  const handleNewChat = () => {
    if (onNewChat) {
      onNewChat();
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  const getChatTitle = (chat: ChatConversation) => {
    if (chat.messages && chat.messages.length > 0) {
      const firstUserMessage = chat.messages.find(m => m.role === 'user');
      if (firstUserMessage) {
        return firstUserMessage.content.slice(0, 30) + (firstUserMessage.content.length > 30 ? '...' : '');
      }
    }
    return 'New Conversation';
  };

  const getChatPreview = (chat: ChatConversation) => {
    if (chat.messages && chat.messages.length > 0) {
      const lastMessage = chat.messages[chat.messages.length - 1];
      return lastMessage.content.slice(0, 40) + (lastMessage.content.length > 40 ? '...' : '');
    }
    return 'Start chatting...';
  };

  return (
    <div className={`
      h-full w-[260px] bg-white/5 border-r border-white/10 flex flex-col
      fixed md:static inset-y-0 left-0 z-50 md:z-auto
      transform md:transform-none transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `}>
      {/* Close button for mobile */}
      <div className="md:hidden absolute top-4 right-4">
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4L4 12M4 4L12 12" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-4 pt-14 md:pt-4">
        <button
          onClick={handleNewChat}
          className="w-full rounded-xl bg-gradient-to-r from-[#7008E7] to-[#9B4DFF] border border-white/10 h-[57.6px] flex items-center px-4 gap-3 text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 8V24" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 16H24" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-base font-medium">New Chat</span>
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-2">
        {isLoading ? (
          // Loading skeleton
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg bg-white/5 p-3 animate-pulse">
                <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
                <div className="h-3 bg-white/5 rounded w-full mb-2" />
                <div className="h-2 bg-white/5 rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : chatHistory.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center h-full py-12 px-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#7008E7]/20 to-[#9B4DFF]/20 flex items-center justify-center mb-4 animate-pulse">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="url(#gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <defs>
                  <linearGradient id="gradient" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#A684FF" />
                    <stop offset="1" stopColor="#7008E7" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h3 className="text-white font-semibold text-base mb-2 text-center">No conversations yet</h3>
            <p className="text-gray-400 text-xs text-center leading-relaxed mb-6">
              Start a new chat to find your perfect mentor match!
            </p>
            <button
              onClick={handleNewChat}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#7008E7] to-[#9B4DFF] text-white text-sm font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 3V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Start Chatting
            </button>
          </div>
        ) : (
          // Chat List
          <div className="space-y-2">
            {chatHistory.map((chat) => (
              <div key={chat.id} className="relative group">
                <div
                  className={`w-full rounded-lg p-3 text-left hover:bg-white/10 transition-all duration-300 cursor-pointer ${currentSessionId === chat.session_id ? 'bg-white/10 border border-[#7008E7]/30' : 'bg-white/5'
                    }`}
                  onClick={() => onSelectChat && onSelectChat(chat.session_id)}
                >
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 10C14 10.5304 13.7893 11.0391 13.4142 11.4142C13.0391 11.7893 12.5304 12 12 12H5L2 15V3C2 2.46957 2.21071 1.96086 2.58579 1.58579C2.96086 1.21071 3.46957 1 4 1H12C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V10Z" stroke="#A684FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex-1 min-w-0">
                      {renamingId === chat.id ? (
                        <input
                          ref={renameInputRef}
                          type="text"
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onBlur={() => handleRenameSubmit(chat.id)}
                          onKeyDown={(e) => handleRenameKeyDown(e, chat.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full bg-white/10 border border-[#7008E7] rounded-lg px-2 py-1 text-sm text-white outline-none focus:ring-2 focus:ring-[#7008E7]/50"
                          autoFocus
                        />
                      ) : (
                        <div className="text-sm text-white leading-[21px] truncate mb-1">
                          {chat.title || getChatTitle(chat)}
                        </div>
                      )}
                      <div className="text-xs text-gray-400 leading-[18px] truncate mb-1">
                        {getChatPreview(chat)}
                      </div>
                      <div className="text-[11px] text-gray-500 leading-[16.5px]">
                        {formatTimeAgo(chat.updated_at || chat.created_at)}
                      </div>
                    </div>

                    {/* Three Dots Menu Button */}
                    <button
                      onClick={(e) => toggleDropdown(chat.id, e)}
                      className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded flex items-center justify-center hover:bg-white/10 transition-all duration-200 flex-shrink-0"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="8" cy="3" r="1" fill="#9CA3AF" />
                        <circle cx="8" cy="8" r="1" fill="#9CA3AF" />
                        <circle cx="8" cy="13" r="1" fill="#9CA3AF" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Dropdown Menu */}
                {openDropdownId === chat.id && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-2 top-2 mt-8 w-40 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 shadow-xl overflow-hidden z-[60]"
                  >
                    <button
                      onClick={(e) => handleRenameClick(chat.id, e)}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-white hover:bg-white/10 transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.3333 2.00004C11.5084 1.82494 11.7163 1.68605 11.9451 1.59129C12.1739 1.49653 12.4191 1.44775 12.6666 1.44775C12.9142 1.44775 13.1594 1.49653 13.3882 1.59129C13.617 1.68605 13.8249 1.82494 14 2.00004C14.1751 2.17513 14.314 2.383 14.4088 2.61178C14.5035 2.84055 14.5523 3.08575 14.5523 3.33337C14.5523 3.58099 14.5035 3.82619 14.4088 4.05497C14.314 4.28374 14.1751 4.49161 14 4.66671L5.00001 13.6667L1.33334 14.6667L2.33334 11L11.3333 2.00004Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Rename
                    </button>

                    <button
                      onClick={(e) => handleShare(chat.id, e)}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-white hover:bg-white/10 transition-colors border-t border-white/10"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="4" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.5" />
                        <circle cx="12" cy="4" r="1.5" stroke="currentColor" strokeWidth="1.5" />
                        <circle cx="12" cy="12" r="1.5" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M5.5 7L10.5 4.5M5.5 9L10.5 11.5" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                      Share
                    </button>

                    <button
                      onClick={(e) => handleDeleteClick(chat.id, e)}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors border-t border-white/10"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 4H3.33333H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M5.33333 4V2.66667C5.33333 2.31304 5.47381 1.97391 5.72386 1.72386C5.97391 1.47381 6.31304 1.33333 6.66667 1.33333H9.33333C9.68696 1.33333 10.0261 1.47381 10.2761 1.72386C10.5262 1.97391 10.6667 2.31304 10.6667 2.66667V4M12.6667 4V13.3333C12.6667 13.687 12.5262 14.0261 12.2761 14.2761C12.0261 14.5262 11.687 14.6667 11.3333 14.6667H4.66667C4.31304 14.6667 3.97391 14.5262 3.72386 14.2761C3.47381 14.0261 3.33333 13.687 3.33333 13.3333V4H12.6667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 p-4">
        <div className="text-xs text-gray-400 text-center">
          AI Coach v1.0
        </div>
      </div>
      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Icon */}
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6H5H21" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Text */}
            <h3 className="text-white text-lg font-semibold text-center mb-2">Delete Conversation?</h3>
            <p className="text-gray-400 text-sm text-center mb-6">
              This action cannot be undone. All messages in this conversation will be permanently deleted.
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                disabled={isDeleting}
                className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-all duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Copy Success Toast */}
      {showCopiedToast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom duration-300">
          <div className="bg-[#1a1a2e] border border-[#7008E7]/30 rounded-xl px-4 py-3 shadow-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.5 4.5L6 12L2.5 8.5" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-white text-sm font-medium">Link copied to clipboard!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatSidebar;
