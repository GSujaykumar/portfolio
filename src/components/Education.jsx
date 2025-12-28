import { motion } from 'framer-motion'
import { FaGraduationCap } from 'react-icons/fa'

const EducationItem = ({ degree, institution, period, location, details, index }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.2, duration: 0.6 }}
        className="group relative bg-[#0a0a0a] border border-white/5 p-8 rounded-2xl hover:border-white/20 transition-all duration-500 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
    >
        <div className="absolute top-8 right-8 text-white opacity-5 group-hover:opacity-10 transition-opacity transform scale-150 group-hover:rotate-12 duration-700">
            <FaGraduationCap size={100} />
        </div>

        <div className="relative z-10">
            <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-3 py-1 bg-white text-black text-xs font-bold rounded-full uppercase tracking-wider">
                    {period}
                </span>
                <span className="px-3 py-1 border border-white/10 text-gray-400 text-xs font-medium rounded-full uppercase tracking-wider">
                    {location}
                </span>
            </div>

            <h3 className="text-2xl md:text-3xl text-white font-bold mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
                {degree}
            </h3>

            <h4 className="text-xl text-gray-400 mb-6 font-light">{institution}</h4>

            <ul className="space-y-2">
                {details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-500 text-sm leading-relaxed">
                        <span className="mt-1.5 w-1.5 h-1.5 bg-gray-700 rounded-full group-hover:bg-white transition-colors duration-500"></span>
                        {detail}
                    </li>
                ))}
            </ul>
        </div>
    </motion.div>
)

const Education = () => {
    const educationData = [
        {
            degree: "Bachelor of Technology",
            institution: "Malla Reddy University",
            period: "2021 — 2025",
            location: "Hyderabad, India",
            details: [
                "Major in Computer Science and Engineering.",
                "Consistently maintained a high GPA (8.8/10).",
                "Focused on Data Structures, Algorithms, and Cloud Computing.",
                "Active member of the Technical Club and Open Source Community."
            ]
        },
        {
            degree: "Diploma in Engineering",
            institution: "State Board of Technical Education",
            period: "2018 — 2021",
            location: "Telangana, India",
            details: [
                "Specialized in Computer Engineering fundamentals.",
                "Executed final year project on Library Management System using Java.",
                "Awarded Academic Excellence Certificate in 2020."
            ]
        }
    ]

    return (
        <section id="education" className="py-32 px-6 md:px-20 bg-[#050505] relative z-10 border-t border-white/5">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-20"
                >
                    <h2 className="text-4xl md:text-5xl text-white font-bold tracking-tighter mb-6">EDUCATION</h2>
                    <p className="text-gray-400 max-w-xl text-lg">
                        Academic background and qualifications.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                    {educationData.map((edu, index) => (
                        <EducationItem key={index} {...edu} index={index} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Education
