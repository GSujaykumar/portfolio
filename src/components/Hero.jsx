import { motion } from 'framer-motion'
import { Link } from 'react-scroll'
import { FaArrowDown } from 'react-icons/fa'

const Hero = () => {
    return (
        <section id="home" className="min-h-screen flex items-center justify-center bg-[#050505] relative overflow-hidden px-6 pt-20">

            {/* Aurora Background Effect */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-purple-900/20 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-indigo-900/10 rounded-full blur-[100px] mix-blend-screen"></div>
                <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[30vw] h-[30vw] bg-blue-900/10 rounded-full blur-[150px] mix-blend-screen"></div>
            </div>

            <div className="max-w-[1400px] w-full relative z-10 grid md:grid-cols-12 gap-8 items-center h-full">

                {/* Left: Content */}
                <div className="md:col-span-8 flex flex-col justify-center order-2 md:order-1">
                    {/* Massive Typography */}
                    <div className="flex flex-col relative z-20">
                        <motion.div
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                        >
                            <h1 className="text-[12vw] md:text-[10vw] font-bold text-white tracking-tighter leading-[0.85] mix-blend-difference">
                                CREATIVE
                            </h1>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden flex items-center gap-4 md:gap-8"
                        >
                            {/* Abstract Line / Decorator */}
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "100px" }}
                                transition={{ delay: 1, duration: 1 }}
                                className="h-[2vw] bg-white/20 hidden md:block"
                            />
                            <h1 className="text-[12vw] md:text-[10vw] font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-white tracking-tighter leading-[0.85]">
                                DEVELOPER
                            </h1>
                        </motion.div>
                    </div>

                    {/* Subtext and CTA */}
                    <div className="mt-8 md:mt-20 grid md:grid-cols-12 gap-8 items-end">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="md:col-span-8"
                        >
                            <p className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed">
                                Crafting digital experiences with a focus on motion, aesthetics, and high-performance engineering.
                            </p>
                        </motion.div>

                        <div className="md:col-span-4 flex justify-start md:justify-end">
                            <Link to="projects" smooth={true} duration={500}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="group flex items-center gap-4 px-8 py-4 bg-white text-black rounded-full font-bold uppercase tracking-widest text-sm"
                                >
                                    Work
                                    <span className="group-hover:rotate-90 transition-transform duration-300"><FaArrowDown /></span>
                                </motion.button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right: Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    transition={{ delay: 0.4, duration: 1.2, ease: "circOut" }}
                    className="md:col-span-4 order-1 md:order-2 flex justify-center md:justify-end relative"
                >
                    <div className="relative w-full aspect-[3/4] max-w-sm md:max-w-none rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl group">
                        {/* Abstract Frame */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-blue-500/20 mix-blend-overlay z-10"></div>

                        <img
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1587&auto=format&fit=crop"
                            alt="Sujay Kumar"
                            className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
                        />

                        {/* Scanline Overlay */}
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                    </div>
                </motion.div>

            </div>
        </section>
    )
}

export default Hero
