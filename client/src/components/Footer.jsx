import React from 'react'
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react'
import logo from '../assets/logo.png'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer className="bg-black/90 text-gray-300 px-6 pt-8 md:px-16 lg:px-36 w-full">
            <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-700 pb-10">
                <div className="md:max-w-96">
                    <div className='flex items-center gap-2'>
                        <span>
                            <img src={logo} alt="Logo" className='w-14 h-14' />
                        </span>
                        <h1 className="text-2xl font-bold text-white">
                            TicketTerminal
                        </h1>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed">
                        Book your favorite movies instantly. Experience seamless ticket booking with real-time seat selection and hassle-free payments.
                    </p>
                    <div className="flex gap-4 mt-4">
                        <a href="#" className="hover:text-white transition-colors">
                            <Facebook size={20} />
                        </a>
                        <a href="#" className="hover:text-white transition-colors">
                            <Twitter size={20} />
                        </a>
                        <a href="#" className="hover:text-white transition-colors">
                            <Instagram size={20} />
                        </a>
                        <a href="#" className="hover:text-white transition-colors">
                            <Youtube size={20} />
                        </a>
                    </div>
                </div>

                <div className="flex-1 flex items-start md:justify-end gap-20 md:gap-40">
                    <div>
                        <h2 className="font-semibold text-white mb-5">Quick Links</h2>
                        <ul className="text-sm space-y-2">
                            <li><Link to='/'>Home</Link></li>
                            <li><Link to='/movies'>Movies</Link></li>
                            <li><Link to='/'>Contact</Link></li>
                            <li><Link to='/'>Privacy Policy</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="font-semibold text-white mb-5">Contact</h2>
                        <div className="text-sm space-y-2">
                            <p>support@ticketterminal.com</p>
                            <p>+91-6000000000</p>
                        </div>
                    </div>
                </div>
            </div>

            <p className="pt-6 text-center text-sm text-gray-500 pb-5">
                © {new Date().getFullYear()} TicketTerminal. All rights reserved.
            </p>
        </footer>
    )
}

export default Footer
