import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import logo from '../assets/logo.png';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="text-2xl font-bold text-white flex items-center mb-4">
                            <img src={logo} alt="AgriTrade Logo" className="h-8 w-auto mr-2" />
                            AgriTrade
                        </Link>
                        <p className="text-sm text-gray-400 mb-6">
                            Connecting farmers and retailers for a sustainable and profitable agricultural ecosystem.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                                <Linkedin size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 uppercase tracking-wider">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link to="/" className="hover:text-green-400 transition-colors">Home</Link></li>
                            <li><Link to="/products" className="hover:text-green-400 transition-colors">Marketplace</Link></li>
                            <li><Link to="/login" className="hover:text-green-400 transition-colors">Login</Link></li>
                            <li><Link to="/signup" className="hover:text-green-400 transition-colors">Sign Up</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 uppercase tracking-wider">Legal</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-green-400 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-green-400 transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-green-400 transition-colors">Cookie Policy</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 uppercase tracking-wider">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <MapPin size={20} className="mr-2 text-green-500 flex-shrink-0" />
                                <span>123 Farm Street, Agri Valley, CA 90210</span>
                            </li>
                            <li className="flex items-center">
                                <Phone size={20} className="mr-2 text-green-500 flex-shrink-0" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center">
                                <Mail size={20} className="mr-2 text-green-500 flex-shrink-0" />
                                <span>support@agritrade.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} AgriTrade Platform. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
