import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Users, 
  MessageSquare, 
  FolderTree, 
  Settings, 
  Menu, 
  X, 
  Moon, 
  Sun, 
  LogOut,
  ChevronLeft
} from 'lucide-react';
import { useUiStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import clsx from 'clsx';

const Sidebar: React.FC = () => {
  const { theme, toggleTheme, sidebarOpen, toggleSidebar } = useUiStore();
  const { logout, selectedGuild } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleChangeServer = () => {
    navigate('/login');
  };

  const navItems = [
    { to: '/roles', icon: <Users size={20} />, label: 'Roles' },
    { to: '/channels', icon: <MessageSquare size={20} />, label: 'Channels' },
    { to: '/categories', icon: <FolderTree size={20} />, label: 'Categories' },
    { to: '/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <>
      <div 
        className={clsx(
          'fixed top-0 left-0 w-64 h-full bg-gray-900 text-white z-20 transition-transform duration-300 ease-in-out transform',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'md:translate-x-0'
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-md">
              <MessageSquare size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold">Discord Admin</h1>
              {selectedGuild && (
                <button
                  onClick={handleChangeServer}
                  className="text-sm text-gray-400 hover:text-white flex items-center mt-1"
                >
                  <span className="truncate">{selectedGuild.name}</span>
                  <ChevronLeft size={16} className="ml-1" />
                </button>
              )}
            </div>
          </div>
          <button 
            onClick={toggleSidebar}
            className="md:hidden text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-3 p-3 rounded-md transition-colors',
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    )
                  }
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 p-2 rounded-md text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-gray-900 text-white z-10 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 p-2 rounded-md">
            <MessageSquare size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold">Discord Admin</h1>
            {selectedGuild && (
              <p className="text-sm text-gray-400">{selectedGuild.name}</p>
            )}
          </div>
        </div>
        <button 
          onClick={toggleSidebar}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>
    </>
  );
};

export default Sidebar;