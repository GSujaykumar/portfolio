import { motion } from 'framer-motion'

const About = () => {
    return (
        <section id="about" className="py-20 bg-[#050505] relative z-20">
            <div className="max-w-7xl mx-auto px-6 md:px-20">
                <div className="grid md:grid-cols-12 gap-12">

                    {/* Big Heading Column */}
                    <div className="md:col-span-12">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-8 leading-[0.9]"
                        >
                            DRIVEN BY <br />
                            <span className="text-gray-700">INNOVATION.</span>
                        </motion.h2>
                    </div>

                    {/* Left Column: Stats */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="md:col-span-4 space-y-8"
                    >
                        <div className="p-6 bg-[#0a0a0a] border border-white/5 rounded-2xl">
                            <h3 className="text-4xl font-bold text-white mb-1">1.5+</h3>
                            <p className="text-sm font-mono text-gray-400 uppercase tracking-widest">Years Experience</p>
                        </div>
                        <div className="p-6 bg-[#0a0a0a] border border-white/5 rounded-2xl">
                            <h3 className="text-4xl font-bold text-white mb-1">10+</h3>
                            <p className="text-sm font-mono text-gray-400 uppercase tracking-widest">Projects Completed</p>
                        </div>
                        <div className="p-6 bg-[#0a0a0a] border border-white/5 rounded-2xl">
                            <h3 className="text-4xl font-bold text-white mb-1">4+</h3>
                            <p className="text-sm font-mono text-gray-400 uppercase tracking-widest">Hackathons</p>
                        </div>
                    </motion.div>

                    {/* Right Column: Narrative */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="md:col-span-8 flex flex-col justify-center"
                    >
                        <p className="text-2xl text-gray-300 font-light leading-relaxed mb-6">
                            I am a <span className="text-white font-medium">Junior Software Engineer</span> with a passion for building scalable, high-performance web applications.
                        </p>
                        <p className="text-lg text-gray-500 font-light leading-relaxed mb-6">
                            My journey began with a curiosity for how things work on the web, which evolved into a career in full-stack development.
                            I specialize in <span className="text-gray-300">Spring Boot microservices</span> and <span className="text-gray-300">modern React interfaces</span>,
                            focusing on writing clean, maintainable code that solves real-world problems.
                        </p>
                        <p className="text-lg text-gray-500 font-light leading-relaxed">
                            Currently, I am focused on mastering cloud-native architecture and exploring the depths of system design.
                            When I'm not coding, I'm analyzing improved algorithms or participating in competitive coding challenges.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default About
