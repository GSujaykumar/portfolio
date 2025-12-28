import { motion } from 'framer-motion'
import { FaJava, FaReact, FaDocker, FaDatabase, FaGitAlt, FaNodeJs, FaHtml5, FaCss3Alt, FaAws } from 'react-icons/fa'
import { SiSpringboot, SiTailwindcss, SiApachekafka, SiTypescript, SiJavascript, SiPostgresql, SiMongodb, SiRedux, SiGraphql } from 'react-icons/si'

const MarqueeItem = ({ icon, name }) => (
    <div className="flex items-center gap-4 px-6 md:px-10 py-4 transition-all duration-300 cursor-default mx-2 group">
        <span className="text-4xl text-gray-500 group-hover:text-white transition-colors duration-300">{icon}</span>
        <span className="text-2xl font-semibold tracking-tight text-gray-600 group-hover:text-white transition-colors duration-300">{name}</span>
    </div>
)

const Skills = () => {
    const row1 = [
        { name: "Java", icon: <FaJava /> },
        { name: "Spring Boot", icon: <SiSpringboot /> },
        { name: "Microservices", icon: <FaDatabase /> },
        { name: "React", icon: <FaReact /> },
        { name: "TypeScript", icon: <SiTypescript /> },
        { name: "PostgreSQL", icon: <SiPostgresql /> },
        { name: "Docker", icon: <FaDocker /> },
        { name: "AWS", icon: <FaAws /> },
    ]

    const row2 = [
        { name: "JavaScript", icon: <SiJavascript /> },
        { name: "Tailwind CSS", icon: <SiTailwindcss /> },
        { name: "Redux", icon: <SiRedux /> },
        { name: "MongoDB", icon: <SiMongodb /> },
        { name: "Kafka", icon: <SiApachekafka /> },
        { name: "Git", icon: <FaGitAlt /> },
        { name: "GraphQL", icon: <SiGraphql /> },
        { name: "HTML5", icon: <FaHtml5 /> },
    ]

    return (
        <section id="skills" className="py-24 md:py-32 bg-[#050505] relative overflow-hidden flex flex-col justify-center">

            <div className="max-w-7xl mx-auto px-6 md:px-20 mb-16 md:mb-24 w-full">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center md:text-left"
                >
                    <h2 className="text-5xl md:text-8xl text-white font-bold tracking-tighter mb-8 leading-[0.9]">
                        TECHNICAL <br />
                        <span className="text-gray-800">EXPERTISE.</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl text-lg font-light leading-relaxed md:ml-2">
                        I prefer a deep-dive approach to technology, mastering the underlying principles rather than just scratching the surface of frameworks.
                    </p>
                </motion.div>
            </div>

            {/* Dual Scrolling Marquees - Clean Text Only */}
            <div className="flex flex-col gap-4 md:gap-10 w-full opacity-80 hover:opacity-100 transition-opacity duration-500">
                <div className="w-full relative overflow-hidden border-y border-white/5 py-4 bg-white/[0.02]">
                    <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#050505] to-transparent z-10"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#050505] to-transparent z-10"></div>
                    <motion.div
                        className="flex w-max"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
                    >
                        {[...row1, ...row1, ...row1].map((skill, i) => (
                            <MarqueeItem key={i} icon={skill.icon} name={skill.name} />
                        ))}
                    </motion.div>
                </div>

                <div className="w-full relative overflow-hidden border-b border-white/5 py-4 bg-white/[0.02]">
                    <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#050505] to-transparent z-10"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#050505] to-transparent z-10"></div>
                    <motion.div
                        className="flex w-max"
                        animate={{ x: ["-50%", "0%"] }}
                        transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
                    >
                        {[...row2, ...row2, ...row2].map((skill, i) => (
                            <MarqueeItem key={i} icon={skill.icon} name={skill.name} />
                        ))}
                    </motion.div>
                </div>
            </div>

        </section>
    )
}

export default Skills
