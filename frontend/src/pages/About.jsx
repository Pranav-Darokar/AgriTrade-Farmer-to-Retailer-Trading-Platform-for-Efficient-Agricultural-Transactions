import { motion } from 'framer-motion';
import { Leaf, ShieldCheck, Users, BarChart2, Award, Sprout } from 'lucide-react';
import { Link } from 'react-router-dom';

const values = [
    { icon: <Leaf className="h-6 w-6 text-green-500" />, title: 'Sustainability', desc: 'Reducing food waste and carbon footprint by shortening supply chains from farm to shelf.' },
    { icon: <ShieldCheck className="h-6 w-6 text-green-500" />, title: 'Transparency', desc: 'Every price, every transaction is open and fair. No hidden commissions or middlemen.' },
    { icon: <Users className="h-6 w-6 text-green-500" />, title: 'Community First', desc: 'Our platform grows stronger as farmers and retailers build lasting relationships.' },
    { icon: <Award className="h-6 w-6 text-green-500" />, title: 'Quality Assured', desc: 'All produce listings are verified and quality-checked before reaching retailers.' },
    { icon: <BarChart2 className="h-6 w-6 text-green-500" />, title: 'Data-Driven', desc: 'Market insights and price analytics help farmers and retailers make smarter decisions.' },
    { icon: <Sprout className="h-6 w-6 text-green-500" />, title: 'Empowerment', desc: 'We believe every farmer deserves a fair price and every retailer deserves fresh produce.' },
];

export default function About() {
    return (
        <div className="bg-white dark:bg-gray-900 transition-colors duration-300">

            {/* ── Hero ── */}
            <section className="relative py-28 overflow-hidden">
                <div className="absolute inset-0">
                    <img src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1920&q=80" alt="Farm" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-br from-green-900/90 to-gray-900/80" />
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="relative max-w-4xl mx-auto text-center px-4"
                >
                    <span className="inline-block bg-green-500/20 border border-green-400/40 text-green-300 text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-widest mb-6">
                        🌾 Our Story
                    </span>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
                        Bridging the Gap Between <span className="text-green-400">Farm</span> & <span className="text-yellow-400">Retail</span>
                    </h1>
                    <p className="text-green-100 text-xl leading-relaxed max-w-2xl mx-auto">
                        AgriTrade was born from a simple belief — farmers deserve fair prices and retailers deserve fresh produce. We built the platform to make that happen.
                    </p>
                </motion.div>
            </section>

            {/* ── Mission ── */}
            <section className="py-24 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <span className="text-green-600 font-semibold tracking-widest uppercase text-sm">Our Mission</span>
                        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-3 mb-6 leading-tight">
                            Empowering India's 600 Million Farmers
                        </h2>
                        <p className="text-gray-500 dark:text-gray-300 text-lg leading-relaxed mb-6">
                            India's agricultural sector feeds over a billion people, yet farmers rarely see the true value of their labour. Long supply chains, multiple intermediaries, and lack of market access cost farmers up to <strong className="text-gray-700 dark:text-gray-100">60% of their potential earnings</strong>.
                        </p>
                        <p className="text-gray-500 dark:text-gray-300 text-lg leading-relaxed mb-8">
                            AgriTrade cuts through those layers. By connecting farmers directly to retailers through a simple digital platform, we ensure produce gets where it needs to go — <strong className="text-gray-700 dark:text-gray-100">faster, fresher, and fairer</strong>.
                        </p>
                        <div className="flex gap-6">
                            {[['2022', 'Founded'], ['22+', 'States'], ['₹10Cr+', 'Trade Volume']].map(([val, lbl]) => (
                                <div key={lbl} className="text-center">
                                    <div className="text-3xl font-extrabold text-green-600">{val}</div>
                                    <div className="text-gray-500 dark:text-gray-400 text-sm mt-1">{lbl}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="grid grid-cols-2 gap-4"
                    >
                        <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&q=80" alt="Paddy field" className="rounded-2xl w-full h-48 object-cover shadow-lg" />
                        <img src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&q=80" alt="Fresh vegetables" className="rounded-2xl w-full h-48 object-cover shadow-lg mt-8" />
                        <img src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80" alt="Farm sunrise" className="rounded-2xl w-full h-48 object-cover shadow-lg" />
                        <img src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&q=80" alt="Harvest" className="rounded-2xl w-full h-48 object-cover shadow-lg mt-8" />
                    </motion.div>
                </div>
            </section>

            {/* ── Values ── */}
            <section className="py-24 bg-white dark:bg-gray-900 transition-colors duration-300">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-green-600 font-semibold tracking-widest uppercase text-sm">What We Stand For</span>
                        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-3">Our Core Values</h2>
                    </motion.div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {values.map((v, i) => (
                            <motion.div
                                key={v.title}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08, duration: 0.5 }}
                                className="flex gap-4 p-6 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                                    {v.icon}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">{v.title}</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{v.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>


            {/* ── CTA ── */}
            <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-500">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto text-center px-4"
                >
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Ready to Join the Movement?</h2>
                    <p className="text-green-100 text-lg mb-8">Sign up today and be part of India's agricultural revolution.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/signup" className="px-8 py-3.5 bg-white text-green-700 font-bold rounded-full shadow-lg hover:bg-green-50 transition-all duration-300 transform hover:-translate-y-0.5">
                            Get Started Free
                        </Link>
                        <Link to="/contact" className="px-8 py-3.5 border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-0.5">
                            Contact Us
                        </Link>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
