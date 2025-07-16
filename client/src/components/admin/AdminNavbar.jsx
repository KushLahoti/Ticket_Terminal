import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'

const AdminNavbar = () => {
    return (
        <div className="h-16 w-full bg-black/40 backdrop-blur-md border-b border-white/10 shadow-sm flex items-center justify-between px-6 md:px-10 z-50">
            <Link to="/">
                <img src={logo} alt="logo" className="w-16 h-auto" />
            </Link>
        </div>
    )
}

export default AdminNavbar
