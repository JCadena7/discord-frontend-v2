import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useUiStore } from '../../store/uiStore';
import clsx from 'clsx';
import { Toaster } from 'react-hot-toast';

const Layout: React.FC = () => {
  const { sidebarOpen } = useUiStore();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }} 
      />
      <Sidebar />
      <main
        className={clsx(
          'transition-all duration-300 pt-16 md:pt-0',
          sidebarOpen ? 'md:ml-64' : 'md:ml-0'
        )}
      >
        <div className="container mx-auto p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;