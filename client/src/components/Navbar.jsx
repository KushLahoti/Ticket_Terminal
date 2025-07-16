import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, TicketPlus } from 'lucide-react';
import { useState } from 'react';
import logo from "../assets/logo.png"
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user } = useUser();
    const { openSignIn } = useClerk();
    const navigate = useNavigate();

    return (
        <nav className="absolute top-0 left-0 w-full text-white z-50">
            <div className="max-w-7xl mx-auto px-5 md:px-20 py-4 flex justify-between items-center">
                <Link to="/">
                    <img src={logo} alt="Logo" className="w-14 h-14" />
                </Link>
                <div className="hidden md:flex gap-2 px-8 py-1 bg-black/40 backdrop-blur-sm rounded-full">
                    {['Home', 'Movies', 'Theatres', 'Releases', 'Favourites'].map((item, i) => (
                        <Link
                            key={i}
                            to={(item == "Home") ? '/' : `/${item.toLowerCase()}`}
                            className="text-sm px-3 py-1 rounded-full text-white hover:bg-[#e50914] transition-colors duration-200"
                        >
                            {item}
                        </Link>
                    ))}
                </div>
                <div className="flex items-center space-x-4">
                    <Search className="w-5 h-5 hover:text-accent cursor-pointer" />
                    {
                        !user ? (
                            <button
                                onClick={openSignIn}
                                to="/login"
                                className="bg-accent text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-[#e50914] transition-colors duration-200">
                                Login
                            </button>
                        ) : (
                            <UserButton>
                                <UserButton.MenuItems>
                                    <UserButton.Action label='My Bookings' labelIcon={<TicketPlus width={15} />} onClick={() => navigate('/myBookings')} />
                                </UserButton.MenuItems>
                            </UserButton>
                        )
                    }
                    {!menuOpen && (
                        <button className="md:hidden" onClick={() => setMenuOpen(true)}>
                            <Menu className="w-6 h-6" />
                        </button>
                    )}

                </div>
            </div>
            {menuOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-black/60 backdrop-blur-xs z-50 flex flex-col items-center justify-center space-y-6 text-lg font-medium">
                    <button
                        className="absolute top-4 right-4 text-white"
                        onClick={() => setMenuOpen(false)}
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <Link to="/" className="hover:text-accent hover:scale-110 transition duration-200" onClick={() => setMenuOpen(false)}>Home</Link>
                    <Link to="/movies" className="hover:text-accent hover:scale-110 transition duration-200" onClick={() => setMenuOpen(false)}>Movies</Link>
                    <Link to="/theatres" className="hover:text-accent hover:scale-110 transition duration-200" onClick={() => setMenuOpen(false)}>Theatres</Link>
                    <Link to="/releases" className="hover:text-accent hover:scale-110 transition duration-200" onClick={() => setMenuOpen(false)}>Releases</Link>
                    <Link to="/favourites" className="hover:text-accent hover:scale-110 transition duration-200" onClick={() => setMenuOpen(false)}>Favourites</Link>
                </div>
            )}

        </nav>
    );
};

export default Navbar;
