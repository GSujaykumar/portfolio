import { motion } from 'framer-motion'
import { SectionTitle, Reveal } from './motion/Reveal'
import { springStamp } from '../lib/motion'

const Education = () => (
  <section id="education" className="py-24 md:py-32">
    <div className="mx-auto max-w-6xl px-6 md:px-10">
      <div className="mb-12">
        <SectionTitle label="Education" title="School" />
      </div>
      <Reveal variant="fade">
        <motion.article
          whileHover={{ y: -4 }}
          transition={springStamp}
          className="soft-panel max-w-3xl p-8 hover:shadow-2xl md:p-10"
        >
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--text-faint)]">
            2021 — 2024
          </p>
          <h3 className="mt-3 font-display text-2xl text-[var(--ink)] md:text-3xl">
            B.Tech in Computer Science and Engineering
          </h3>
          <p className="mt-2 text-lg text-[var(--text-muted)]">JNTUH University, India</p>
        </motion.article>
      </Reveal>
    </div>
  </section>
)

export default Education
