import { motion } from 'framer-motion'

const ExperienceItem = ({ role, company, period, description, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, duration: 0.8 }}
            className="relative pl-8 md:pl-12 border-l border-white/10 pb-12 last:pb-0"
        >
            <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 bg-white rounded-full ring-4 ring-black" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                    <h3 className="text-2xl font-bold text-white">{role}</h3>
                    <div className="text-lg text-gray-400 font-medium">{company}</div>
                </div>
                <div className="text-sm font-mono text-gray-500 mt-2 sm:mt-0 uppercase tracking-wider bg-white/5 px-3 py-1 rounded-full w-fit">
                    {period}
                </div>
            </div>

            <div className="text-gray-400 leading-relaxed font-light space-y-4 max-w-3xl">
                {description.map((item, i) => (
                    <p key={i} className="relative pl-4">
                        <span className="absolute left-0 top-2.5 w-1 h-1 bg-gray-600 rounded-full"></span>
                        {item}
                    </p>
                ))}
            </div>
        </motion.div>
    )
}

const Experience = () => {
    const experiences = [
        {
            role: "Full Stack Developer",
            company: "Varsity Edification Management",
            period: "2024 — Present",
            description: [
                "Architected and maintained scalable microservices using Spring Boot, integrating complex business logic with high-performance requirements.",
                "Spearheaded layout and functionality overhauls in React & Angular, implementing secure JWT authentication flows and optimizing state management.",
                "Reduced API latency by 40% through efficient query optimization and caching strategies.",
                "Collaborated with cross-functional teams to deliver robust features in an Agile environment."
            ]
        }
    ]

    return (
        <section id="experience" className="py-32 px-6 md:px-20 bg-[#060606] relative z-10 border-t border-white/5">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-20"
                >
                    <h2 className="text-4xl md:text-5xl text-white font-bold tracking-tighter mb-6">PROFESSIONAL HISTORY</h2>
                    <p className="text-gray-400 max-w-xl text-lg">
                        My journey in the tech industry, building impactful solutions.
                    </p>
                </motion.div>

                <div className="space-y-4">
                    {experiences.map((exp, index) => (
                        <ExperienceItem key={index} {...exp} index={index} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Experience
