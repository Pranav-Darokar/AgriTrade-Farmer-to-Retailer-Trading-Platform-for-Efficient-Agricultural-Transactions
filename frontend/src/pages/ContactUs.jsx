import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

const contactDetails = [
    { icon: <Mail className="h-5 w-5 text-green-500" />, label: 'Email Us', value: 'support@agritrade.in', href: 'mailto:support@agritrade.in' },
    { icon: <Phone className="h-5 w-5 text-green-500" />, label: 'Call Us', value: '+91 98765 43210', href: 'tel:+919876543210' },
    { icon: <MapPin className="h-5 w-5 text-green-500" />, label: 'Office', value: 'Nagpur, Maharashtra, India', href: '#' },
    { icon: <Clock className="h-5 w-5 text-green-500" />, label: 'Working Hours', value: 'Mon – Sat, 9 AM – 6 PM IST', href: '#' },
];

export default function ContactUs() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        // Simulate async send
        await new Promise(r => setTimeout(r, 1200));
        setLoading(false);
        setSubmitted(true);
    };

    return (
        <div className="bg-white dark:bg-gray-900 transition-colors duration-300">

            {/* ── Hero ── */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0">
                    <img src="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=1920&q=80" alt="Contact" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-br from-green-900/90 to-gray-900/80" />
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="relative max-w-3xl mx-auto text-center px-4"
                >
                    <span className="inline-block bg-green-500/20 border border-green-400/40 text-green-300 text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-widest mb-6 whitespace-nowrap">
                        📬 Get In Touch
                    </span>
                    <h1 className="text-5xl font-extrabold text-white mb-5 leading-tight">
                        We'd Love to <span className="text-green-400">Hear</span> from You
                    </h1>
                    <p className="text-green-100 text-lg">
                        Have a question, feedback, or want to partner with us? Drop us a message and we'll get back within 24 hours.
                    </p>
                </motion.div>
            </section>

            {/* ── Form + Info ── */}
            <section className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-5 gap-12">

                    {/* Contact Info Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-2 space-y-6"
                    >
                        <div>
                            <span className="text-green-600 font-semibold tracking-widest uppercase text-sm">Contact Info</span>
                            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2 mb-4">Let's Talk</h2>
                            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                                Whether you're a farmer wanting to list produce, a retailer looking for fresh supply, or just curious about AgriTrade — we're here to help.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {contactDetails.map(item => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 hover:shadow-md transition-all duration-200 group"
                                >
                                    <div className="w-10 h-10 bg-green-50 dark:bg-green-900/30 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-green-100 dark:group-hover:bg-green-900/50 transition-colors">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">{item.label}</p>
                                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{item.value}</p>
                                    </div>
                                </a>
                            ))}
                        </div>

                        {/* Map embed placeholder */}
                        <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm h-40">
                            <iframe
                                title="AgriTrade Location"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.4!2d79.0882!3d21.1458!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDA4JzQ0LjkiTiA3OcKwMDUnMTcuNSJF!5e0!3m2!1sen!2sin!4v1700000000000"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-3"
                    >
                        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-black/5 dark:shadow-black/20 border border-gray-100 dark:border-gray-700 p-8 md:p-10">
                            {submitted ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center text-center py-16 gap-4"
                                >
                                    <div className="w-20 h-20 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                        <CheckCircle className="h-10 w-10 text-green-500" />
                                    </div>
                                    <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">Message Sent!</h3>
                                    <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                                        Thank you for reaching out. Our team will get back to you within 24 hours.
                                    </p>
                                    <button
                                        onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                                        className="mt-4 px-6 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors"
                                    >
                                        Send Another
                                    </button>
                                </motion.div>
                            ) : (
                                <>
                                    <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">Send a Message</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Fill out the form and we'll respond shortly.</p>

                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name *</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={form.name}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="Ramesh Kumar"
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address *</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={form.email}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="ramesh@example.com"
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Subject *</label>
                                            <input
                                                type="text"
                                                name="subject"
                                                value={form.subject}
                                                onChange={handleChange}
                                                required
                                                placeholder="How can we help you?"
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Message *</label>
                                            <textarea
                                                name="message"
                                                value={form.message}
                                                onChange={handleChange}
                                                required
                                                rows={5}
                                                placeholder="Tell us more about your query..."
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm resize-none"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white font-bold rounded-xl shadow-lg shadow-green-500/25 transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {loading ? (
                                                <>
                                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                    </svg>
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <Send size={16} /> Send Message
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
