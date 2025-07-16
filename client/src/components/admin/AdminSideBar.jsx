/* eslint-disable no-unused-vars */
import React from 'react';
import profile from '../../assets/profile.png';
import { LayoutDashboardIcon, ListCollapseIcon, ListIcon, PlusSquareIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const AdminSideBar = () => {
    const user = {
        firstName: 'Admin',
        lastName: 'User',
        imageUrl: profile
    };

    const adminNavLinks = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboardIcon },
        { name: 'Add Shows', path: '/admin/add-shows', icon: PlusSquareIcon },
        { name: 'List Shows', path: '/admin/list-shows', icon: ListIcon },
        { name: 'List Bookings', path: '/admin/list-bookings', icon: ListCollapseIcon }
    ];

    return (
        <div className="h-[calc(100vh-64px)] w-full md:max-w-[240px] bg-black/40 backdrop-blur-md border-r border-white/10 text-white flex flex-col items-center py-8 px-4 shadow-md">
            <img className="h-14 w-14 rounded-full object-cover" src={user.imageUrl} alt="Admin" />
            <p className="mt-2 text-base font-medium">{user.firstName} {user.lastName}</p>

            <nav className="mt-8 w-full flex flex-col gap-2">
                {adminNavLinks.map(({ name, path, icon: Icon }, index) => (
                    <NavLink
                        key={index}
                        to={path}
                        end
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 group ${isActive ? 'bg-[#e50914]/20 text-[#e50914]' : 'text-gray-300 hover:bg-white/10 hover:text-white'
                            }`
                        }
                    >
                        <Icon className="w-5 h-5" />
                        <span className="text-sm">{name}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default AdminSideBar;
