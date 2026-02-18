import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, ShieldCheck, Truck, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import heroImage from '../assets/hero.jpg';

const Home = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-green-900 text-white overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={heroImage}
                        alt="Farm field"
                        className="w-full h-full object-cover opacity-30"
                    />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col items-center text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6"
                    >
                        Direct from <span className="text-green-400">Farm</span> to <span className="text-yellow-400">Retail</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl md:text-2xl text-gray-200 max-w-3xl mb-10"
                    >
                        Empowering farmers and retailers with a transparent, efficient, and fair trading platform. No middlemen, just fresh produce and better profits.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <Link
                            to="/signup"
                            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-green-900 bg-white hover:bg-green-50 md:text-lg md:px-10 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                        >
                            Get Started
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                        <Link
                            to="/products"
                            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-green-600 hover:bg-green-700 md:text-lg md:px-10 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                        >
                            Browse Marketplace
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Why Choose AgriTrade?
                        </h2>
                        <p className="mt-4 text-xl text-gray-600">
                            We bridge the gap between cultivation and consumption.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <FeatureCard
                            icon={<Leaf className="h-8 w-8 text-green-600" />}
                            title="Fresh Produce"
                            description="Source directly from farmers ensuring maximum freshness and quality."
                        />
                        <FeatureCard
                            icon={<ShieldCheck className="h-8 w-8 text-green-600" />}
                            title="Secure Payments"
                            description="Safe and transparent transaction process for both parties."
                        />
                        <FeatureCard
                            icon={<Truck className="h-8 w-8 text-green-600" />}
                            title="Efficient Logistics"
                            description="Streamlined delivery options to reduce wastage and cost."
                        />
                        <FeatureCard
                            icon={<Users className="h-8 w-8 text-green-600" />}
                            title="Direct Connection"
                            description="Build long-term relationships without intermediaries."
                        />
                    </div>
                </div>
            </section>

            {/* Stats/Trust Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-green-600 rounded-3xl shadow-xl overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-12 text-center text-white">
                            <div>
                                <div className="text-4xl font-bold mb-2">500+</div>
                                <div className="text-green-100">Farmers Registered</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold mb-2">1,200+</div>
                                <div className="text-green-100">Retailers Connected</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold mb-2">10k+</div>
                                <div className="text-green-100">Orders Completed</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
    >
        <div className="w-14 h-14 bg-green-50 rounded-lg flex items-center justify-center mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </motion.div>
);

export default Home;
