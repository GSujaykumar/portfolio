import { motion } from 'framer-motion'
import { Stagger, StaggerItem, SectionTitle } from './motion/Reveal'
import { SplitWords, ClipReveal, ParallaxLayer } from './motion/ScrollFX'
import { AnimatedCounter } from './WowExtras'
import { springStamp } from '../lib/motion'

const About = () => (
  <section id="about" className="py-24 md:py-32">
    <div className="mx-auto max-w-6xl px-6 md:px-10">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <ParallaxLayer className="lg:col-span-5" speed={16}>
          <SectionTitle
            label="About"
            title={
              <>
                Backend systems.
                <br />
                Fusion ownership.
              </>
            }
          />
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              { n: 2, suffix: '+', l: 'Years' },
              { n: 5, suffix: '', l: 'Shipped systems' },
              { n: 25, suffix: '%', l: 'Query gains' },
            ].map((m) => (
              <div key={m.l} className="text-left">
                <p className="font-display text-2xl text-[var(--ink)] md:text-3xl">
                  <AnimatedCounter value={m.n} suffix={m.suffix} />
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-faint)]">
                  {m.l}
                </p>
              </div>
            ))}
          </div>
        </ParallaxLayer>
        <Stagger className="space-y-5 lg:col-span-7" gap={0.12}>
          <StaggerItem variant="fade">
            <SplitWords
              as="p"
              className="text-xl leading-relaxed text-[var(--text-muted)] md:text-2xl"
              text="Backend Java developer with 2 years building Spring Boot microservices, secure REST APIs (JWT · Spring Security), and production Oracle Fusion finance-ops automation."
            />
          </StaggerItem>
          <StaggerItem variant="fade">
            <SplitWords
              as="p"
              delay={0.08}
              gap={0.028}
              className="text-base leading-relaxed text-[var(--text-faint)] md:text-lg"
              text="Day stack: Java 17 · Spring Boot · Hibernate / JPA · MySQL · Oracle DB · Docker · Jenkins CI/CD · Prometheus / Grafana / Zipkin — plus Fusion Segment / GL / remarks pipelines and operator launchers at Varsity."
            />
          </StaggerItem>
          <div className="grid gap-4 pt-2 sm:grid-cols-3">
            {[
              { t: 'Microservices', d: 'Java · Spring Boot · REST' },
              { t: 'Data & Security', d: 'MySQL · Oracle DB · JWT' },
              { t: 'Delivery & Ops', d: 'Docker · Jenkins · Tracing' },
            ].map((item, i) => (
              <ClipReveal key={item.t} delay={i * 0.1} from={i === 1 ? 'top' : 'bottom'}>
                <motion.div
                  whileHover={{ y: -8, rotate: i % 2 ? 1.5 : -1.5 }}
                  transition={springStamp}
                  className="soft-panel h-full p-5 hover:shadow-xl"
                >
                  <p className="font-display text-lg text-[var(--ink)]">{item.t}</p>
                  <p className="mt-1 text-sm text-[var(--text-faint)]">{item.d}</p>
                </motion.div>
              </ClipReveal>
            ))}
          </div>
        </Stagger>
      </div>
    </div>
  </section>
)

export default About
