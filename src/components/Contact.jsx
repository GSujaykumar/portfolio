import { useRef } from 'react'
import {
  motion,
  useMotionTemplate,
  useMotionValue,
} from 'framer-motion'
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaPhone,
  FaCopy,
  FaArrowUpRightFromSquare,
  FaLocationDot,
  FaBolt,
} from 'react-icons/fa6'
import { FaDownload } from 'react-icons/fa'
import { Marquee, MaskReveal } from './motion/Reveal'
import { ParallaxLayer } from './motion/ScrollFX'
import { toast } from './UxChrome'
import { easeOut, springStamp, viewportOnce } from '../lib/motion'

const EMAIL = 'sujaykumargaddam18@gmail.com'
const PHONE = '+91 9347298955'
const LINKEDIN = 'https://www.linkedin.com/in/sujaykumar-gaddam-a660693a0/'
const GITHUB = 'https://github.com/GSujaykumar'
const CV = '/Sujay-Kumar-Resume.pdf'

const channels = [
  {
    label: 'Email',
    value: EMAIL,
    href: `mailto:${EMAIL}?subject=Opportunity%20-%20Sujay%20Kumar`,
    icon: FaEnvelope,
    cursor: 'mail',
    action: 'Write',
    accent: 'var(--signal)',
  },
  {
    label: 'Phone',
    value: PHONE,
    href: 'tel:+919347298955',
    icon: FaPhone,
    cursor: 'go',
    action: 'Call',
    accent: 'var(--hot)',
  },
  {
    label: 'LinkedIn',
    value: 'sujaykumar-gaddam',
    href: LINKEDIN,
    icon: FaLinkedin,
    cursor: 'go',
    action: 'Connect',
    accent: 'var(--signal)',
  },
  {
    label: 'GitHub',
    value: 'GSujaykumar',
    href: GITHUB,
    icon: FaGithub,
    cursor: 'go',
    action: 'Code',
    accent: 'var(--hot)',
  },
]

function MagneticCard({ children, className = '', ...rest }) {
  const ref = useRef(null)
  const mx = useMotionValue(50)
  const my = useMotionValue(50)
  const background = useMotionTemplate`radial-gradient(420px circle at ${mx}% ${my}%, color-mix(in srgb, var(--signal) 22%, transparent), transparent 55%)`

  return (
    <motion.a
      ref={ref}
      onPointerMove={(e) => {
        const r = ref.current?.getBoundingClientRect()
        if (!r) return
        mx.set(((e.clientX - r.left) / r.width) * 100)
        my.set(((e.clientY - r.top) / r.height) * 100)
      }}
      className={`contact-card group relative overflow-hidden ${className}`}
      {...rest}
    >
      <motion.div aria-hidden style={{ background }} className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative z-[1]">{children}</div>
    </motion.a>
  )
}

const Contact = () => {
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      toast('Email copied')
    } catch {
      toast('Copy failed — use Email me')
    }
  }

  return (
    <section id="contact" className="contact-finale relative overflow-hidden pb-10 pt-24 md:pt-32">
      <ParallaxLayer speed={18} className="pointer-events-none absolute inset-0">
        <div
          aria-hidden
          className="absolute -left-24 top-10 h-[42vmax] w-[42vmax] rounded-full bg-[color-mix(in_srgb,var(--signal)_18%,transparent)] blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -right-20 bottom-0 h-[48vmax] w-[48vmax] rounded-full bg-[color-mix(in_srgb,var(--hot)_16%,transparent)] blur-3xl"
        />
      </ParallaxLayer>

      <div className="pointer-events-none absolute inset-x-0 top-8 -rotate-3 opacity-30">
        <Marquee items={['OPEN TO WORK', 'BACKEND JAVA', 'SPRING BOOT', 'MICROSERVICES', 'HIRE', 'HYDERABAD']} />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-24 rotate-2 opacity-20">
        <Marquee reverse items={['JWT', 'REST APIs', 'ORACLE FUSION', 'MYSQL', 'DOCKER', 'JENKINS', 'ZIPKIN']} />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-10">
        <div className="mb-12 text-center md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.45, ease: easeOut }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--bg-elevated)] px-4 py-2"
          >
            <motion.span
              className="h-2 w-2 rounded-full bg-[var(--signal)]"
              animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--text-faint)]">
              Open to work
            </span>
          </motion.div>

          <h2 className="contact-title font-display text-[clamp(3.4rem,13vw,8rem)] uppercase leading-[0.84] tracking-tight text-[var(--ink)]">
            <MaskReveal>LET'S</MaskReveal>
            <span className="contact-title__hot">
              <MaskReveal delay={0.08}>CONNECT</MaskReveal>
            </span>
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ delay: 0.15, duration: 0.5, ease: easeOut }}
            className="mx-auto mt-6 max-w-2xl text-base text-[var(--text-muted)] md:text-lg"
          >
            Backend Java roles — Spring Boot microservices, REST · JWT, MySQL · Oracle DB,
            Docker · Jenkins, and Oracle Fusion ops. Email first; I reply within a day.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ delay: 0.25, ...springStamp }}
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--bg-elevated)] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]"
          >
            <FaLocationDot className="text-[var(--signal)]" />
            Hyderabad, India · Remote-friendly
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6, ease: easeOut }}
          style={{ transformPerspective: 1200 }}
          className="contact-panel relative overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[var(--ink)] text-[var(--bg)] shadow-[var(--panel-shadow)]"
        >
          <div className="contact-scan pointer-events-none absolute inset-0 opacity-40" aria-hidden />
          <div className="grid lg:grid-cols-12">
            <div className="relative flex flex-col justify-between gap-10 border-b border-white/10 p-8 md:p-10 lg:col-span-5 lg:border-b-0 lg:border-r">
              <div>
                <p className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--signal)]">
                  <FaBolt /> Primary channel
                </p>
                <h3 className="mt-4 font-display text-4xl uppercase leading-[0.9] tracking-tight md:text-5xl">
                  Start with
                  <br />
                  an email
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-white/65 md:text-base">
                  Best for opportunities, interviews, and Fusion / backend discussions.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <motion.a
                  href={`mailto:${EMAIL}?subject=Opportunity%20-%20Sujay%20Kumar`}
                  data-cursor="mail"
                  whileHover={{ scale: 1.04, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  transition={springStamp}
                  className="contact-cta relative inline-flex items-center justify-between gap-3 overflow-hidden rounded-full bg-[var(--bg)] px-6 py-4 text-sm font-bold text-[var(--ink)]"
                >
                  <span className="absolute inset-0 animate-pulse rounded-full bg-[color-mix(in_srgb,var(--signal)_18%,transparent)]" />
                  <span className="relative inline-flex items-center gap-2">
                    <FaEnvelope /> Email me
                  </span>
                  <FaArrowUpRightFromSquare className="relative text-xs" />
                </motion.a>

                <div className="flex flex-wrap gap-2">
                  <motion.button
                    type="button"
                    data-cursor="go"
                    onClick={copyEmail}
                    whileHover={{ scale: 1.05, rotate: -1 }}
                    whileTap={{ scale: 0.96 }}
                    transition={springStamp}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-white/25 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white"
                  >
                    <FaCopy /> Copy email
                  </motion.button>
                  <motion.a
                    href={CV}
                    download="Sujay-Kumar-Resume.pdf"
                    data-cursor="go"
                    whileHover={{ scale: 1.05, rotate: 1 }}
                    whileTap={{ scale: 0.96 }}
                    transition={springStamp}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-white/25 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white"
                  >
                    <FaDownload /> CV
                  </motion.a>
                </div>
              </div>
            </div>

            <div className="grid gap-3 p-6 sm:grid-cols-2 md:p-8 lg:col-span-7">
              {channels.map((item, i) => {
                const Icon = item.icon
                return (
                  <MagneticCard
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    data-cursor={item.cursor}
                    initial={{ opacity: 0, y: 28, scale: 0.96 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={viewportOnce}
                    transition={{ delay: 0.06 + i * 0.07, duration: 0.45, ease: easeOut }}
                    whileHover={{ y: -8, scale: 1.03, rotate: i % 2 ? 1.2 : -1.2 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex min-h-[150px] flex-col justify-between rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 transition hover:bg-white hover:text-[var(--ink)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className="flex h-11 w-11 items-center justify-center rounded-2xl text-lg transition group-hover:bg-[var(--ink)] group-hover:text-[var(--bg)]"
                        style={{ background: `color-mix(in srgb, ${item.accent} 22%, transparent)`, color: item.accent }}
                      >
                        <Icon />
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45 transition group-hover:text-[var(--text-faint)]">
                        {item.action}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/50 transition group-hover:text-[var(--text-faint)]">
                        {item.label}
                      </p>
                      <p className="mt-1 break-all text-sm font-semibold leading-snug md:text-base">
                        {item.value}
                      </p>
                    </div>
                    <FaArrowUpRightFromSquare className="absolute bottom-5 right-5 text-xs opacity-0 transition group-hover:opacity-100" />
                  </MagneticCard>
                )
              })}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ delay: 0.15, duration: 0.5, ease: easeOut }}
          className="mt-8 flex flex-col items-center justify-between gap-4 overflow-hidden rounded-[1.5rem] border border-[var(--line)] bg-[var(--bg-elevated)] px-6 py-5 text-center sm:flex-row sm:text-left"
        >
          <div>
            <p className="font-display text-lg uppercase tracking-tight text-[var(--ink)]">
              Prefer a quick ping?
            </p>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Call-ready number — weekday replies within a day.
            </p>
          </div>
          <motion.a
            href="tel:+919347298955"
            data-cursor="go"
            whileHover={{ scale: 1.08, rotate: -3, y: -4 }}
            whileTap={{ scale: 0.96 }}
            transition={springStamp}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-6 py-3 text-sm font-bold text-[var(--bg)] shadow-lg"
          >
            <FaPhone /> {PHONE}
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

export default Contact
