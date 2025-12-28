import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { FaGithub, FaArrowRight } from 'react-icons/fa'

const ProjectCard = ({ project, index }) => {
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const mouseXSpring = useSpring(x)
    const mouseYSpring = useSpring(y)

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"])
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"])

    const handleMouseMove = (e) => {
        const rect = e.target.getBoundingClientRect()
        const width = rect.width
        const height = rect.height
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top
        const xPct = mouseX / width - 0.5
        const yPct = mouseY / height - 0.5
        x.set(xPct)
        y.set(yPct)
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.8 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="group relative h-[450px] w-full rounded-2xl bg-[#0a0a0a] border border-white/10 overflow-hidden cursor-pointer shadow-2xl"
        >
            {/* Background Image with Zoom Effect */}
            <div
                style={{ transform: "translateZ(0px)" }}
                className="absolute inset-0 z-0"
            >
                <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-in-out opacity-50 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent opacity-90 group-hover:opacity-40 transition-opacity duration-500" />
            </div>

            {/* Content Floating on Top */}
            <div
                style={{ transform: "translateZ(50px)" }}
                className="absolute inset-0 z-10 flex flex-col justify-end p-8"
            >
                <p className="text-xs font-mono text-gray-400 mb-2 uppercase tracking-widest">{project.category}</p>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">{project.title}</h3>
                <p className="text-gray-300 text-sm mb-6 max-w-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100 font-light leading-relaxed">
                    {project.tech}
                </p>

                <div className="flex gap-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-200">
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white text-black font-bold rounded-full text-xs hover:bg-gray-200 uppercase tracking-wider flex items-center gap-2 transition-colors">
                        <FaGithub size={16} /> Source
                    </a>
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="px-6 py-3 border border-white/30 backdrop-blur-md text-white font-bold rounded-full text-xs hover:bg-neutral-800 hover:text-white transition-all uppercase tracking-wider flex items-center gap-2">
                        Demo <FaArrowRight size={12} />
                    </a>
                </div>
            </div>
        </motion.div>
    )
}

const Projects = () => {
    const projects = [
        {
            title: "E-Commerce",
            category: "Full Stack",
            tech: "Robust platform engineered with Java Spring Boot microservices, Angular dashboard, and high-performance MySQL database.",
            image: "https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=1632&auto=format&fit=crop",
            github: "https://github.com/GSujaykumar/Ecommerce",
            link: "https://ecommerce-mocha-alpha.vercel.app/"
        },
        {
            title: "MonkeyType",
            category: "React Application",
            tech: "Elegant typing test application featuring real-time analytics, custom themes, and smooth Framer Motion animations.",
            image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1631&auto=format&fit=crop",
            github: "https://github.com/GSujaykumar/monkeytypeclone",
            link: "https://monkeytypeclone-pied.vercel.app/"
        },
        {
            title: "Tic Tac Toe",
            category: "Game Development",
            tech: "Unbeatable AI opponent implemented with Minimax algorithm, featuring glassmorphism UI and sound effects.",
            image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop",
            github: "https://github.com/GSujaykumar/Tic-Toc-Toe-Game",
            link: "https://tic-toc-toe-game-blue.vercel.app/"
        },
        {
            title: "REST APIs Platform",
            category: "Backend Architecture",
            tech: "Secure API gateway with JWT authentication, Swagger documentation, and automated testing pipelines.",
            image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1770&auto=format&fit=crop",
            github: "https://github.com/GSujaykumar/SpringBootAPIS",
            link: "#"
        }
    ]

    return (
        <section id="projects" className="min-h-screen py-32 px-6 md:px-20 bg-[#050505] relative overflow-hidden">
            {/* Background Noise used similarly to Hero for consistency */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-bold text-white tracking-tighter mb-4"
                    >
                        SELECTED <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-800">WORKS.</span>
                    </motion.h2>
                    <p className="text-gray-400 max-w-xl text-lg font-light">
                        A collection of projects exploring performance, design, and user experience.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-10 perspective-1000">
                    {projects.map((project, index) => (
                        <ProjectCard key={index} project={project} index={index} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Projects
