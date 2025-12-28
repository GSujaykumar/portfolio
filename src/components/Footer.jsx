import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'

const Footer = () => {
    return (
        <footer className="bg-[#020617] pt-20 pb-10 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
                <h2 className="text-3xl font-extrabold tracking-tighter mb-8">
                    <span className="text-white">SUJAY</span>
                    <span className="text-blue-500">.DEV</span>
                </h2>

                <div className="flex space-x-8 mb-8">
                    <a href="https://github.com/GSujaykumar" className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform">
                        <FaGithub size={24} />
                    </a>
                    <a href="https://www.linkedin.com/in/sujaykumar-undefined-a660693a0/" className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform">
                        <FaLinkedin size={24} />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform">
                        <FaTwitter size={24} />
                    </a>
                </div>

                <p className="text-gray-500 text-sm font-medium">
                    © {new Date().getFullYear()} Sujay Kumar. All rights reserved.
                </p>
                <p className="text-gray-600 text-xs mt-2">
                    Built with React, Tailwind CSS & Framer Motion
                </p>
            </div>
        </footer>
    )
}

export default Footer
