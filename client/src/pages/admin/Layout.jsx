import React from 'react';
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminSideBar from '../../components/admin/AdminSideBar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] text-white flex flex-col">
            <AdminNavbar />
            <div className="flex flex-1 overflow-hidden">
                <div className="w-16 md:w-64 bg-black/40 border-r border-white/10 backdrop-blur-md">
                    <AdminSideBar />
                </div>
                <main className="flex-1 h-[calc(100vh-64px)] overflow-y-auto p-4 md:p-8 bg-white/5 rounded-lg shadow-lg border border-white/10 m-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
