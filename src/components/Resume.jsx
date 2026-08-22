import { motion } from 'framer-motion'
import { FaDownload, FaFilePdf, FaExternalLinkAlt } from 'react-icons/fa'
import { SectionTitle } from './motion/Reveal'
import { ClipReveal } from './motion/ScrollFX'
import { springStamp } from '../lib/motion'

export const RESUME_PATH = '/Sujay-Kumar-Resume.pdf'

const Resume = () => (
  <section id="resume" className="py-24 md:py-32">
    <div className="mx-auto max-w-6xl px-6 md:px-10">
      <div className="mb-10 max-w-2xl">
        <SectionTitle
          label="Resume"
          title="CV for recruiters"
          subtitle="Download or preview the latest PDF."
        />
      </div>

      <ClipReveal from="bottom" duration={0.8}>
        <motion.div
          whileHover={{ y: -4 }}
          transition={springStamp}
          className="soft-panel overflow-hidden hover:shadow-2xl"
        >
          <div className="flex flex-col gap-4 border-b border-[var(--line)] p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
            <div className="flex items-start gap-4">
              <motion.div
                animate={{ rotate: [0, -8, 8, 0], scale: [1, 1.08, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--ink)] text-[var(--bg)]"
              >
                <FaFilePdf size={20} />
              </motion.div>
              <div>
                <h3 className="font-display text-xl text-[var(--ink)]">Sujay Kumar — Resume</h3>
                <p className="mt-1 text-sm text-[var(--text-faint)]">
                  Backend · Spring Boot · Oracle Fusion · PDF
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <motion.a
                href={RESUME_PATH}
                download="Sujay-Kumar-Resume.pdf"
                data-cursor="go"
                whileHover={{ scale: 1.1, rotate: -3 }}
                whileTap={{ scale: 0.94 }}
                transition={springStamp}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-5 py-2.5 text-sm font-semibold text-[var(--bg)]"
              >
                <FaDownload size={14} /> Download CV
              </motion.a>
              <motion.a
                href={RESUME_PATH}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="view"
                whileHover={{ scale: 1.1, rotate: 3 }}
                transition={springStamp}
                className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--ink)] px-5 py-2.5 text-sm font-semibold"
              >
                <FaExternalLinkAlt size={12} /> Open PDF
              </motion.a>
            </div>
          </div>
          <div className="bg-[var(--bg)] p-3 md:p-5">
            <iframe
              title="Resume preview"
              src={`${RESUME_PATH}#toolbar=0`}
              className="h-[70vh] min-h-[520px] w-full rounded-xl border border-[var(--line)] bg-[var(--bg-elevated)]"
            />
          </div>
        </motion.div>
      </ClipReveal>
    </div>
  </section>
)

export default Resume
