import React, { useState } from 'react';
import { Sidebar } from '../../components/admin/Sidebar';
import { Topbar } from '../../components/admin/Topbar';

export const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 font-inter" style={{ margin: 0, padding: 0 }}>
      {/* Admin Sidebar - Fixed Left */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Admin Main Content Area - Starts after sidebar */}
      <div
        className="min-h-screen flex flex-col lg:ml-[260px]"
        style={{
          padding: 0
        }}
      >
        {/* Admin Topbar - Sticky at top */}
        <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Admin Content - Scrollable area below topbar */}
        <main
          className="flex-1 overflow-y-auto bg-gray-50"
          style={{
            padding: 0,
            margin: 0
          }}
        >
          <div style={{ padding: '30px' }}>
            {children}
          </div>
        </main>


      </div>
    </div>
  );
};

export default AdminLayout;
