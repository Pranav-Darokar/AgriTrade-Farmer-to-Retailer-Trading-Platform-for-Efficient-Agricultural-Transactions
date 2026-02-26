import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, ShieldCheck, Truck, Users, Star, ChevronDown, Sprout, BarChart2, Clock, Award } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

/* ─── Animated Counter ─── */
const Counter = ({ target, suffix = '' }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });
    useEffect(() => {
        if (!inView) return;
        let start = 0;
        const step = Math.ceil(target / 60);
        const timer = setInterval(() => {
            start += step;
            if (start >= target) { setCount(target); clearInterval(timer); }
            else setCount(start);
        }, 20);
        return () => clearInterval(timer);
    }, [inView, target]);
    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

/* ─── Feature Card ─── */
const FeatureCard = ({ icon, title, description, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }}
        className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 flex flex-col items-start transition-colors duration-300"
    >
        <div className="w-14 h-14 bg-green-50 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-5">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-500 dark:text-gray-300 leading-relaxed">{description}</p>
    </motion.div>
);

/* ─── Testimonial Card ─── */
const TestimonialCard = ({ name, role, quote, avatar, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col gap-4 transition-colors duration-300"
    >
        <div className="flex text-yellow-400 gap-1">
            {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
        </div>
        <p className="text-gray-600 dark:text-gray-300 italic leading-relaxed">"{quote}"</p>
        <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
            <img src={avatar} alt={name} className="w-11 h-11 rounded-full object-cover ring-2 ring-green-200" />
            <div>
                <p className="font-bold text-gray-900 dark:text-white text-sm">{name}</p>
                <p className="text-green-600 dark:text-green-400 text-xs">{role}</p>
            </div>
        </div>
    </motion.div>
);

/* ─── How It Works Step ─── */
const Step = ({ num, title, desc, delay }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="flex gap-5 items-start"
    >
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-600 text-white font-bold text-lg flex items-center justify-center shadow-lg">
            {num}
        </div>
        <div>
            <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-1">{title}</h4>
            <p className="text-gray-500 dark:text-gray-400">{desc}</p>
        </div>
    </motion.div>
);

/* ─── Hero Background Slideshow (Ken Burns effect) ─── */
const HERO_IMAGES = [
    'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1920&q=80',
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=80',
    'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1920&q=80',
    'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1920&q=80',
    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1920&q=80',
];

const HeroBackground = () => {
    const [current, setCurrent] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setCurrent(c => (c + 1) % HERO_IMAGES.length), 6000);
        return () => clearInterval(t);
    }, []);
    return (
        <div className="absolute inset-0">
            {HERO_IMAGES.map((src, i) => (
                <motion.div
                    key={src}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: i === current ? 1 : 0 }}
                    transition={{ duration: 1.5, ease: 'easeInOut' }}
                >
                    <motion.img
                        src={src}
                        alt=""
                        className="w-full h-full object-cover"
                        initial={{ scale: 1.08 }}
                        animate={{ scale: i === current ? 1.16 : 1.08 }}
                        transition={{ duration: 7, ease: 'linear' }}
                    />
                </motion.div>
            ))}
        </div>
    );
};

const Home = () => {

    const scrollRef = useRef(null);

    return (
        <div className="flex flex-col min-h-screen font-sans bg-white dark:bg-gray-900 transition-colors duration-300">

            {/* ── HERO ── */}
            <section className="relative min-h-screen flex items-center text-white overflow-hidden">
                <HeroBackground />
                <div className="absolute inset-0 bg-gradient-to-br from-green-950/75 via-green-900/55 to-black/65" />

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="absolute top-24 left-1/2 -translate-x-1/2"
                >
                    <span className="bg-green-500/20 border border-green-400/40 text-green-300 text-[11px] sm:text-xs font-semibold px-3 sm:px-4 py-1.5 rounded-full backdrop-blur-sm tracking-wide sm:tracking-widest uppercase whitespace-nowrap">
                        🌾 India's Agri Trading Platform
                    </span>
                </motion.div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 flex flex-col items-center text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight"
                    >
                        Direct from{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">Farm</span>
                        {' '}to{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-400">Retail</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.5 }}
                        className="text-lg md:text-2xl text-gray-200 max-w-3xl mb-12 leading-relaxed"
                    >
                        Empowering Indian farmers and retailers with a transparent, efficient trading platform.
                        No middlemen — just fresh produce and better profits.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.7 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <Link
                            to="/signup"
                            className="inline-flex items-center justify-center px-10 py-4 text-base font-semibold rounded-full text-green-900 bg-white hover:bg-green-50 shadow-2xl hover:shadow-green-200/50 transition-all duration-300 transform hover:-translate-y-1"
                        >
                            Get Started Free
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                        <Link
                            to="/products"
                            className="inline-flex items-center justify-center px-10 py-4 text-base font-semibold rounded-full text-white border-2 border-white/30 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 transform hover:-translate-y-1"
                        >
                            Browse Marketplace
                        </Link>
                    </motion.div>

                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 cursor-pointer"
                        onClick={() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        <ChevronDown className="h-7 w-7" />
                    </motion.div>
                </div>
            </section>

            {/* ── STATS BAR ── */}
            <section ref={scrollRef} className="bg-gradient-to-r from-green-700 to-emerald-600 py-12">
                <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
                    {[
                        { target: 500, suffix: '+', label: 'Farmers Registered' },
                        { target: 1200, suffix: '+', label: 'Retailers Connected' },
                        { target: 10000, suffix: '+', label: 'Orders Completed' },
                        { target: 22, suffix: '+', label: 'Product Categories' },
                    ].map((s, i) => (
                        <div key={i}>
                            <div className="text-4xl md:text-5xl font-extrabold mb-1">
                                <Counter target={s.target} suffix={s.suffix} />
                            </div>
                            <div className="text-green-100 text-sm font-medium">{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── FEATURES ── */}
            <section className="py-24 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-green-600 font-semibold tracking-widest uppercase text-sm">Why AgriTrade</span>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mt-3 mb-4">Built for Indian Agriculture</h2>
                        <p className="text-xl text-gray-500 dark:text-gray-300 max-w-2xl mx-auto">We bridge the gap between cultivation and consumption with technology.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <FeatureCard delay={0} icon={<Leaf className="h-7 w-7 text-green-600" />} title="Fresh Produce" description="Source farm-fresh produce directly — no cold storage delays, maximum nutrition retained." />
                        <FeatureCard delay={0.1} icon={<ShieldCheck className="h-7 w-7 text-green-600" />} title="Secure Payments" description="Every transaction is transparent and protected. Farmers get paid fairly and on time." />
                        <FeatureCard delay={0.2} icon={<Truck className="h-7 w-7 text-green-600" />} title="Efficient Logistics" description="Streamlined delivery network reduces wastage, costs, and time from farm to shelf." />
                        <FeatureCard delay={0.3} icon={<Users className="h-7 w-7 text-green-600" />} title="Direct Connection" description="Build lasting relationships between farmers and retailers without intermediaries." />
                    </div>
                </div>
            </section>

            {/* ── OUR MISSION ── */}
            <section className="py-24 bg-white dark:bg-gray-900 overflow-hidden transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                            className="grid grid-cols-2 gap-4"
                        >
                            <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&q=80" alt="Indian farmer in paddy field" className="rounded-2xl object-cover w-full h-52 shadow-lg" />
                            <img src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&q=80" alt="Fresh vegetables" className="rounded-2xl object-cover w-full h-52 shadow-lg mt-8" />
                            <img src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&q=80" alt="Agricultural harvest" className="rounded-2xl object-cover w-full h-52 shadow-lg" />
                            <img src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80" alt="Farm produce market" className="rounded-2xl object-cover w-full h-52 shadow-lg mt-8" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                        >
                            <span className="text-green-600 font-semibold tracking-widest uppercase text-sm">Our Mission</span>
                            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-3 mb-6 leading-tight">
                                Empowering the Backbone of India
                            </h2>
                            <p className="text-gray-500 dark:text-gray-300 text-lg leading-relaxed mb-8">
                                Agriculture employs over <strong>60% of India's workforce</strong>. Yet farmers receive only a fraction of the final price due to long supply chains. AgriTrade eliminates those layers — giving farmers fair prices and retailers quality produce at lower costs.
                            </p>
                            <div className="space-y-4">
                                {[
                                    { icon: <Sprout className="h-5 w-5 text-green-600" />, text: 'From wheat fields of Punjab to coconut groves of Kerala' },
                                    { icon: <BarChart2 className="h-5 w-5 text-green-600" />, text: 'Farmers earn up to 40% more per harvest' },
                                    { icon: <Clock className="h-5 w-5 text-green-600" />, text: 'Orders fulfilled within 24-48 hours of harvest' },
                                    { icon: <Award className="h-5 w-5 text-green-600" />, text: 'Verified and quality-checked produce listings' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                            {item.icon}
                                        </div>
                                        <span className="text-gray-700 dark:text-gray-200">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                            <Link
                                to="/signup"
                                className="inline-flex items-center mt-10 px-8 py-3.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full shadow-lg hover:shadow-green-300/50 transition-all duration-300 transform hover:-translate-y-1"
                            >
                                Join the Movement <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section className="py-24 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-green-600 font-semibold tracking-widest uppercase text-sm">Simple Process</span>
                        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-3">How AgriTrade Works</h2>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-10">
                            <Step num="1" delay={0} title="Farmer Lists Produce" desc="Farmers register and list their fresh produce with quantity, price, and category." />
                            <Step num="2" delay={0.1} title="Retailer Browses & Orders" desc="Retailers browse the marketplace, compare prices, and place bulk orders in seconds." />
                            <Step num="3" delay={0.2} title="Secure Transaction" desc="Payment is processed securely. Both parties get real-time order status updates." />
                            <Step num="4" delay={0.3} title="Fresh Delivery" desc="Produce is delivered fresh from farm to retail outlet, tracked every step of the way." />
                        </div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="relative rounded-3xl overflow-hidden shadow-2xl"
                        >
                            <div className="relative h-full min-h-[420px]">
                                <img
                                    src="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=900&q=80"
                                    alt="Farm to retail"
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-br from-green-900/85 to-green-700/70" />
                                <div className="relative p-10 h-full flex flex-col justify-between text-white min-h-[420px]">
                                    <div>
                                        <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
                                            🌾 AgriTrade Platform
                                        </span>
                                        <h3 className="text-3xl font-extrabold mt-5 mb-3 leading-tight">
                                            From Soil to Shelf — in 48 Hours
                                        </h3>
                                        <p className="text-green-100 text-base leading-relaxed max-w-sm">
                                            Our streamlined platform connects farmers directly to retailers, cutting waste, middlemen, and delivery time.
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 mt-8">
                                        {[
                                            { val: '48h', label: 'Avg Delivery' },
                                            { val: '40%', label: 'More Earnings' },
                                            { val: '0', label: 'Middlemen' },
                                        ].map(s => (
                                            <div key={s.label} className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center">
                                                <div className="text-2xl font-extrabold">{s.val}</div>
                                                <div className="text-green-200 text-xs mt-1">{s.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-3 mt-6">
                                        <Link
                                            to="/signup"
                                            className="inline-flex items-center px-6 py-3 bg-white text-green-800 font-bold rounded-full text-sm hover:bg-green-50 transition-colors shadow-lg"
                                        >
                                            Start Trading <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                        <Link to="/products" className="text-green-200 hover:text-white text-sm underline underline-offset-2 transition-colors">
                                            Browse Marketplace
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── PRODUCT CATEGORIES ── */}
            <section className="py-24 bg-white dark:bg-gray-900 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-14"
                    >
                        <span className="text-green-600 font-semibold tracking-widest uppercase text-sm">What We Trade</span>
                        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-3">Explore Categories</h2>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                        {[
                            { name: 'Fresh Vegetables', emoji: '🥦', img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80' },
                            { name: 'Fruits', emoji: '🥭', img: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&q=80' },
                            { name: 'Grains & Pulses', emoji: '🌾', img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80' },
                            { name: 'Dairy', emoji: '🥛', img: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80' },
                            { name: 'Essentials', emoji: '🍯', img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80' },
                        ].map((cat, i) => (
                            <motion.div
                                key={cat.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                whileHover={{ y: -5 }}
                            >
                                <Link to="/products" className="block rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                                    <div className="relative h-36 overflow-hidden">
                                        <img src={cat.img} alt={cat.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        <div className="absolute bottom-3 left-3 text-white">
                                            <span className="text-2xl">{cat.emoji}</span>
                                            <p className="text-sm font-bold leading-tight mt-0.5">{cat.name}</p>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── TESTIMONIALS ── */}
            <section className="py-24 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-green-600 font-semibold tracking-widest uppercase text-sm">Testimonials</span>
                        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-3">Trusted by Farmers & Retailers</h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <TestimonialCard
                            delay={0}
                            name="Ramesh Kumar"
                            role="Wheat Farmer, Punjab"
                            quote="AgriTrade helped me cut out agents completely. I now earn ₹40 more per quintal and get paid within 48 hours. It has changed my family's life."
                            avatar="https://randomuser.me/api/portraits/men/45.jpg"
                        />
                        <TestimonialCard
                            delay={0.1}
                            name="Priya Sharma"
                            role="Vegetable Farmer, Maharashtra"
                            quote="Earlier my tomatoes would rot before reaching the market. Now I list them on AgriTrade and they're sold within a day. Zero wastage!"
                            avatar="https://randomuser.me/api/portraits/women/32.jpg"
                        />
                        <TestimonialCard
                            delay={0.2}
                            name="Anil Mehta"
                            role="Retail Store Owner, Mumbai"
                            quote="I source all my fresh produce through AgriTrade. Quality is consistently better than wholesale markets and prices are more predictable."
                            avatar="https://randomuser.me/api/portraits/men/67.jpg"
                        />
                    </div>
                </div>
            </section>

            {/* ── CTA BANNER ── */}
            <section className="relative py-28 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 to-green-800/75" />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative max-w-4xl mx-auto text-center px-4"
                >
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
                        Ready to Transform Your Agricultural Business?
                    </h2>
                    <p className="text-green-100 text-xl mb-10 max-w-2xl mx-auto">
                        Join thousands of farmers and retailers already benefiting from direct trade. Sign up free in under 2 minutes.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/signup"
                            className="inline-flex items-center justify-center px-10 py-4 bg-white text-green-800 font-bold rounded-full shadow-2xl hover:bg-green-50 transition-all duration-300 transform hover:-translate-y-1 text-lg"
                        >
                            Start Trading Today <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                        <Link
                            to="/products"
                            className="inline-flex items-center justify-center px-10 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1 text-lg"
                        >
                            Explore Marketplace
                        </Link>
                    </div>
                </motion.div>
            </section>

        </div>
    );
};

export default Home;
