import { motion } from 'framer-motion'
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa'

const Contact = () => {
    return (
        <section id="contact" className="py-20 md:py-32 bg-[#050505] relative overflow-hidden">

            <div className="max-w-7xl mx-auto px-6 md:px-20 relative z-10">
                <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start">

                    {/* Left Column: Contact Info */}
                    <div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-6xl md:text-8xl font-bold tracking-tighter text-white mb-12 leading-[0.9]"
                        >
                            LET'S <br /> WORK <span className="text-gray-700">TOGETHER.</span>
                        </motion.h2>

                        <div className="space-y-8">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="group flex items-center gap-6"
                            >
                                <div className="p-4 rounded-full bg-white/5 group-hover:bg-white text-white group-hover:text-black transition-all duration-300">
                                    <FaEnvelope size={24} />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm font-mono uppercase tracking-widest mb-1">Email</p>
                                    <a href="mailto:sujaykumargaddam18@gmail.com" className="text-2xl md:text-3xl text-white font-medium hover:underline decoration-1 underline-offset-8">
                                        sujaykumargaddam18@gmail.com
                                    </a>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                className="group flex items-center gap-6"
                            >
                                <div className="p-4 rounded-full bg-white/5 group-hover:bg-white text-white group-hover:text-black transition-all duration-300">
                                    <FaPhone size={24} />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm font-mono uppercase tracking-widest mb-1">Phone</p>
                                    <a href="tel:+919347298955" className="text-2xl md:text-3xl text-white font-medium hover:underline decoration-1 underline-offset-8">
                                        +91 9347298955
                                    </a>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 }}
                                className="group flex items-center gap-6"
                            >
                                <div className="p-4 rounded-full bg-white/5 group-hover:bg-white text-white group-hover:text-black transition-all duration-300">
                                    <FaMapMarkerAlt size={24} />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm font-mono uppercase tracking-widest mb-1">Location</p>
                                    <p className="text-2xl md:text-3xl text-white font-medium">
                                        Hyderabad, India
                                    </p>
                                </div>
                            </motion.div>
                        </div>

                        <div className="flex gap-6 mt-16">
                            <a href="https://github.com/GSujaykumar" className="p-4 bg-[#0a0a0a] border border-white/10 rounded-full hover:bg-gray-200 hover:text-black transition-all duration-300 hover:scale-110">
                                <FaGithub size={24} />
                            </a>
                            <a href="https://www.linkedin.com/in/sujaykumar-undefined-a660693a0/" className="p-4 bg-[#0a0a0a] border border-white/10 rounded-full hover:bg-[#0077b5] hover:border-[#0077b5] hover:text-white transition-all duration-300 hover:scale-110">
                                <FaLinkedin size={24} />
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="bg-[#0a0a0a] p-8 md:p-12 rounded-3xl border border-white/5"
                    >
                        <h3 className="text-2xl text-white font-bold mb-8">Send me a message</h3>
                        <form className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400 font-mono uppercase tracking-widest">Name</label>
                                    <input type="text" className="w-full bg-[#111] border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-white/30 transition-colors" placeholder="John Doe" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400 font-mono uppercase tracking-widest">Email</label>
                                    <input type="email" className="w-full bg-[#111] border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-white/30 transition-colors" placeholder="john@example.com" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 font-mono uppercase tracking-widest">Subject</label>
                                <input type="text" className="w-full bg-[#111] border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-white/30 transition-colors" placeholder="Project Inquiry" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 font-mono uppercase tracking-widest">Message</label>
                                <textarea rows="4" className="w-full bg-[#111] border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-white/30 transition-colors resize-none" placeholder="Tell me about your project..."></textarea>
                            </div>
                            <button type="button" className="w-full py-5 bg-white text-black font-bold text-lg rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                                <FaPaperPlane size={18} /> Send Message
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>

            <footer className="mt-32 py-8 bg-[#050505] border-t border-white/5 text-center">
                <p className="text-gray-600 text-sm font-mono uppercase tracking-widest">
                    © {new Date().getFullYear()} Sujay Kumar. Crafted in React & Tailwind.
                </p>
            </footer>
        </section>
    )
}

export default Contact
