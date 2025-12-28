import { useState, useEffect } from 'react'
import { Link } from 'react-scroll'
import { FaBars, FaTimes } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [hoveredIndex, setHoveredIndex] = useState(null)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navLinks = [
        { name: 'Home', to: 'home' },
        { name: 'About', to: 'about' },
        { name: 'Projects', to: 'projects' },
        { name: 'Skills', to: 'skills' },
        { name: 'Education', to: 'education' },
        { name: 'Experience', to: 'experience' },
        { name: 'Contact', to: 'contact' },
    ]

    return (
        <motion.nav
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="fixed w-full z-50 flex justify-center py-6"
        >
            <div
                className={`flex items-center justify-between px-8 py-3 rounded-full transition-all duration-500
                ${scrolled || isOpen
                        ? 'bg-black/80 backdrop-blur-xl shadow-2xl border border-white/5'
                        : 'bg-transparent'
                    }`}
            >
                {/* Logo */}
                <Link to="home" smooth duration={500} className="cursor-pointer group">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="font-bold text-xl tracking-tight text-white flex items-center gap-1"
                    >
                    </motion.div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center space-x-1 mx-8">
                    {navLinks.map((link, index) => (
                        <div
                            key={link.name}
                            className="relative"
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <Link
                                to={link.to}
                                smooth
                                duration={500}
                                spy={true}
                                activeClass="!text-white !font-bold"
                                className="relative z-10 px-5 py-2 text-sm font-medium text-gray-400 hover:text-white cursor-pointer transition-colors outline-none focus:outline-none no-underline hover:no-underline"
                                style={{ textDecoration: 'none', WebkitTapHighlightColor: 'transparent' }}
                            >
                                {link.name}
                            </Link>

                            {/* Hover Pill - Subtle White */}
                            {hoveredIndex === index && (
                                <motion.div
                                    layoutId="pill"
                                    className="absolute inset-0 rounded-full bg-white/10"
                                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                />
                            )}
                        </div>
                    ))}
                </div>



                {/* Mobile Toggle */}
                <div
                    className="md:hidden text-white cursor-pointer z-50 p-2"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-24 w-[90%] bg-[#0a0a0a] border border-white/10
                        rounded-2xl p-6 flex flex-col space-y-2 md:hidden shadow-2xl z-40"
                    >
                        {navLinks.map((link, i) => (
                            <Link
                                key={link.name}
                                to={link.to}
                                smooth
                                duration={500}
                                onClick={() => setIsOpen(false)}
                                className="block text-center py-4 text-gray-400 hover:text-white
                                font-medium tracking-wide rounded-xl hover:bg-white/5 transition-all no-underline"
                                style={{ textDecoration: 'none' }}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    )
}

export default Navbar
