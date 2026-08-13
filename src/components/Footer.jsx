import { motion } from 'framer-motion'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { SplitChars } from './motion/Reveal'
import { springStamp, viewportOnce } from '../lib/motion'

const Footer = () => {
  return (
    <footer className="border-t border-[var(--line)] px-6 py-20">
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={viewportOnce}
        transition={springStamp}
        className="mx-auto flex max-w-5xl flex-col items-center text-center"
      >
        <p className="font-display text-4xl uppercase tracking-tight text-[var(--ink)] md:text-6xl">
          <SplitChars text="{ SUJAY }" />
        </p>
        <p className="mt-4 max-w-md text-sm text-[var(--text-muted)]">
          Backend Java · Spring Boot · Oracle Fusion — built to ship, not just demo.
        </p>

        <div className="mt-8 flex gap-8 text-xs font-bold uppercase tracking-wider text-[var(--text-faint)]">
          <motion.a
            href="https://github.com/GSujaykumar"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="go"
            whileHover={{ y: -6, scale: 1.15, rotate: -6 }}
            transition={springStamp}
          >
            GitHub
          </motion.a>
          <motion.a
            href="https://www.linkedin.com/in/sujaykumar-gaddam-a660693a0/"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="go"
            whileHover={{ y: -6, scale: 1.15, rotate: 6 }}
            transition={springStamp}
          >
            LinkedIn
          </motion.a>
          <motion.a
            href="mailto:sujaykumargaddam18@gmail.com"
            data-cursor="mail"
            whileHover={{ y: -6, scale: 1.15 }}
            transition={springStamp}
          >
            Email
          </motion.a>
        </div>

        <div className="mt-7 flex gap-5 text-[var(--text-muted)]">
          <motion.a
            href="https://github.com/GSujaykumar"
            aria-label="GitHub"
            whileHover={{ scale: 1.3, rotate: -10 }}
            transition={springStamp}
          >
            <FaGithub size={22} />
          </motion.a>
          <motion.a
            href="https://www.linkedin.com/in/sujaykumar-gaddam-a660693a0/"
            aria-label="LinkedIn"
            whileHover={{ scale: 1.3, rotate: 10 }}
            transition={springStamp}
          >
            <FaLinkedin size={22} />
          </motion.a>
        </div>

        <p className="mt-10 text-sm text-[var(--text-faint)]">
          {new Date().getFullYear()} Sujay Kumar · Crafted with intention ©
        </p>
      </motion.div>
    </footer>
  )
}

export default Footer
