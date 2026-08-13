import { motion } from 'framer-motion'
import { SectionTitle } from './motion/Reveal'
import PageReveal from './motion/PageReveal'
import { easeOut, springStamp, viewportOnce } from '../lib/motion'

const Experience = () => {
  const exp = {
    role: 'Software Engineer (Backend)',
    company: 'Varsity Edification Management Pvt. Ltd.',
    period: '2024 — Present',
    location: 'Hyderabad, India',
    description: [
      'Own Spring Boot microservices end-to-end — REST APIs, JWT / Spring Security, JPA, and release ownership.',
      'Cut critical MySQL / PostgreSQL query time ~25% with indexing and query rewrites.',
      'Ship Docker images through Jenkins on Azure with Prometheus, Grafana, and Zipkin in the loop.',
      'Built Oracle Fusion finance-ops automation: Segment 3/5, GL updates, remarks, API runners, mail bridges.',
      'Daily collection checker posts one Teams Adaptive Card — STATUS OK or CRITICAL — without manual checks.',
      'Operators get a live Fusion Console: drop Excel → SQL / upload outputs with clear filenames.',
    ],
  }

  return (
    <section id="experience" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="mb-12">
          <SectionTitle label="Experience" title="Work" />
        </div>

        <PageReveal>
          <motion.article
            whileHover={{ y: -6 }}
            transition={springStamp}
            className="soft-panel p-8 hover:shadow-2xl md:p-10"
          >
            <div className="grid gap-8 md:grid-cols-12">
              <div className="md:col-span-4">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--text-faint)]">
                  {exp.period}
                </p>
                <h3 className="mt-3 font-display text-2xl text-[var(--ink)]">{exp.role}</h3>
                <p className="mt-2 text-[var(--text-muted)]">{exp.company}</p>
                <p className="mt-1 text-sm text-[var(--text-faint)]">{exp.location}</p>
              </div>
              <ul className="space-y-4 md:col-span-8">
                {exp.description.map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={viewportOnce}
                    transition={{ delay: 0.05 + i * 0.05, duration: 0.4, ease: easeOut }}
                    className="relative pl-5 text-[var(--text-muted)] leading-relaxed before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-[var(--ink)]"
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.article>
        </PageReveal>
      </div>
    </section>
  )
}

export default Experience
