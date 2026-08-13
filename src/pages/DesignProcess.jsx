import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { designProcesses } from '../data/designProcesses'
import { animateScrollTo } from '../utils/scroll'
import MermaidDiagram from '../components/MermaidDiagram'
import styles from './DesignProcess.module.css'

const MOBILE_QUERY = '(max-width: 640px)'
const ACCORDION_SCROLL_DURATION = 500  // ms — a bit slower than the 250ms height
                                        // animation so the scroll reads as a deliberate spotlight, not a snap
const ACCORDION_SCROLL_MARGIN = 24     // breathing room below the newly revealed content
const NAV_SCROLL_DURATION = 900        // ms — page-length jump, so it gets a slower, more deliberate ease
const NAV_SCROLL_GAP = 20              // breathing room below the sticky nav bar

// Carousel slot positions, keyed by signed offset from the focused ticket
// (0 = front/center, -1 = one to the left, 1 = one to the right). Side
// tickets sit fully alongside the center one — not tucked behind it — so
// they stay clickable and mostly visible rather than just peeking out.
// The mobile offset is smaller so side cards aren't pushed almost entirely
// off a narrow screen.
function carouselSlots(isMobile) {
  const x = isMobile ? 150 : 260
  return {
    '-1': { x: -x, y: 0, rotate: 0, scale: 0.84, opacity: 0.92, zIndex: 1, blur: 2 },
    '0':  { x: 0,  y: 0, rotate: 0, scale: 1,    opacity: 1,    zIndex: 2, blur: 0 },
    '1':  { x,     y: 0, rotate: 0, scale: 0.84, opacity: 0.92, zIndex: 1, blur: 2 },
  }
}

// Normalizes i - active into the shortest signed offset around the loop
// (e.g. for 3 tickets, a raw offset of 2 is the same as -1 the other way).
function slotOffset(i, active, count) {
  let offset = i - active
  if (offset > count / 2) offset -= count
  if (offset < -count / 2) offset += count
  return offset
}

function PersonaField({ label, items }) {
  if (!items || items.length === 0) return null
  return (
    <div className={styles.personaField}>
      <span className={styles.personaFieldLabel}>{label}</span>
      <ul className={styles.personaFieldList}>
        {items.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </div>
  )
}

// Shared open/close + scroll-into-view logic for the persona and
// requirement-group accordions. On open, projects where the expanded
// card's bottom edge will land (current header height + the body's
// natural, un-clipped content height) and — only if that would run past
// the viewport — eases the page down just enough to spotlight it.
function useSpotlightAccordion() {
  const [open, setOpen] = useState(false)
  const cardRef = useRef(null)
  const bodyInnerRef = useRef(null)
  const cancelScrollRef = useRef(() => {})

  useEffect(() => () => cancelScrollRef.current(), [])

  const toggle = () => {
    cancelScrollRef.current()
    const opening = !open
    setOpen(opening)
    if (!opening) return

    const cardEl = cardRef.current
    const bodyEl = bodyInnerRef.current
    if (!cardEl || !bodyEl) return

    const cardRect = cardEl.getBoundingClientRect()
    const overflow = (cardRect.bottom + bodyEl.scrollHeight) - window.innerHeight
    if (overflow > 0) {
      cancelScrollRef.current = animateScrollTo(window.scrollY + overflow + ACCORDION_SCROLL_MARGIN, ACCORDION_SCROLL_DURATION)
    }
  }

  return { open, toggle, cardRef, bodyInnerRef }
}

// Accordion card for a single persona. Everything above "Goal" (label,
// name, meta, quote) is the always-visible header/toggle; Goal onward is
// the collapsible body. The body stays mounted (height animates between 0
// and 'auto') rather than unmounting on close, so its natural content
// height can be measured on open to drive the spotlight scroll.
function PersonaAccordion({ persona: p }) {
  const { open, toggle, cardRef, bodyInnerRef } = useSpotlightAccordion()

  return (
    <div ref={cardRef} className={styles.personaCard} data-open={open || undefined}>
      <button
        type="button"
        className={styles.personaHeader}
        onClick={toggle}
        aria-expanded={open}
      >
        <div className={styles.personaHeaderRow}>
          {p.label && <span className={styles.personaLabel}>{p.label}</span>}
          <span className={styles.personaChevron} aria-hidden="true">{open ? '−' : '+'}</span>
        </div>
        <h4 className={styles.personaName}>{p.name}</h4>
        <span className={styles.personaMeta}>{p.age} · {p.occupation}</span>
        {p.quote && <p className={styles.personaQuote}>“{p.quote}”</p>}
      </button>
      <motion.div
        className={styles.personaBody}
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
      >
        <div ref={bodyInnerRef} className={styles.personaBodyInner}>
          {p.context && <p className={styles.personaContext}>{p.context}</p>}
          <PersonaField label="Goal" items={p.goal} />
          <PersonaField label="Frustrations" items={p.frustrations} />
          <PersonaField label="Behaviors" items={p.behaviors} />
          <PersonaField label="Priorities" items={p.priorities} />
          <PersonaField label="What Would Stop Them From Buying" items={p.whatWouldStopBuying} />
          <PersonaField label="What Earns Their Trust" items={p.whatEarnsTrust} />
          <PersonaField label="Design Implications" items={p.designImplications} />
        </div>
      </motion.div>
    </div>
  )
}

// Accordion card for one MVP requirement group (e.g. "2 — Home"). Header
// shows the group number, title, and item count; body is the numbered
// requirement list (x.y — text).
function RequirementGroup({ group }) {
  const { open, toggle, cardRef, bodyInnerRef } = useSpotlightAccordion()

  return (
    <div ref={cardRef} className={styles.reqCard} data-open={open || undefined}>
      <button
        type="button"
        className={styles.reqHeader}
        onClick={toggle}
        aria-expanded={open}
      >
        <span className={styles.reqNumber}>{group.number}</span>
        <span className={styles.reqTitle}>{group.title}</span>
        <span className={styles.reqCount}>{group.items.length} req{group.items.length !== 1 ? 's' : ''}</span>
        <span className={styles.reqChevron} aria-hidden="true">{open ? '−' : '+'}</span>
      </button>
      <motion.div
        className={styles.reqBody}
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
      >
        <div ref={bodyInnerRef} className={styles.reqBodyInner}>
          <ol className={styles.reqList}>
            {group.items.map(item => (
              <li key={item.id} className={styles.reqItem}>
                <span className={styles.reqItemId}>{item.id}</span>
                <span className={styles.reqItemText}>{item.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </motion.div>
    </div>
  )
}

// Accordion card for one shared/reused UI component. Header is just the
// component name; body is the description plus its screenshot (or a
// placeholder frame until one is supplied).
function ComponentAccordion({ component: c }) {
  const { open, toggle, cardRef, bodyInnerRef } = useSpotlightAccordion()

  return (
    <div ref={cardRef} className={styles.compCard} data-open={open || undefined}>
      <button
        type="button"
        className={styles.compHeader}
        onClick={toggle}
        aria-expanded={open}
      >
        <span className={styles.compName}>{c.name}</span>
        <span className={styles.compChevron} aria-hidden="true">{open ? '−' : '+'}</span>
      </button>
      <motion.div
        className={styles.compBody}
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
      >
        <div ref={bodyInnerRef} className={styles.compBodyInner}>
          {c.body && <p className={styles.sectionText}>{c.body}</p>}
          {c.images
            ? <ImageGallery images={c.images} />
            : c.image
              ? <img className={styles.sectionImage} src={c.image} alt={c.name} />
              : <div className={styles.sectionImagePlaceholder}>Add image</div>}
        </div>
      </motion.div>
    </div>
  )
}

// Thumbnail grid that opens a full-size lightbox on click — used for the
// low-fidelity wireframe scans and any other section image galleries.
function ImageGallery({ images }) {
  const [activeIndex, setActiveIndex] = useState(null)

  useEffect(() => {
    if (activeIndex === null) return
    const onKey = e => { if (e.key === 'Escape') setActiveIndex(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeIndex])

  return (
    <>
      <div className={styles.galleryGrid}>
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            className={styles.galleryThumb}
            onClick={() => setActiveIndex(i)}
          >
            <img src={img.src} alt={img.caption ?? ''} loading="lazy" />
            {img.caption && <span className={styles.galleryCaption}>{img.caption}</span>}
          </button>
        ))}
      </div>
      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            className={styles.galleryLightbox}
            onClick={() => setActiveIndex(null)}
            role="dialog"
            aria-modal="true"
            aria-label={images[activeIndex].caption ?? 'Image'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <motion.button
              type="button"
              className={styles.galleryLightboxClose}
              onClick={() => setActiveIndex(null)}
              aria-label="Close"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              ×
            </motion.button>
            <motion.img
              className={styles.galleryLightboxImage}
              src={images[activeIndex].src}
              alt={images[activeIndex].caption ?? ''}
              onClick={e => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.94, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
            {images[activeIndex].caption && (
              <motion.span
                className={styles.galleryLightboxCaption}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.22, delay: 0.05 }}
              >
                {images[activeIndex].caption}
              </motion.span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default function DesignProcess() {
  const { id } = useParams()
  const navigate = useNavigate()
  const project = designProcesses[id]
  const [activeTicket, setActiveTicket] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const navRef = useRef(null)
  const orderRailRef = useRef(null)
  const sectionRefs = useRef({})
  const cancelNavScrollRef = useRef(() => {})

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY)
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => () => cancelNavScrollRef.current(), [])

  if (!project) {
    navigate('/')
    return null
  }

  const tickets = project.sections.filter(s => s.ticket)
  const contentSections = project.sections.filter(s => !s.ticket)

  const goTo = i => {
    if (tickets.length === 0) return
    setActiveTicket(((i % tickets.length) + tickets.length) % tickets.length)
  }

  // Jumps to a ticket (bringing it to front of the carousel) or a regular
  // content section, eased with the same scroll utility used elsewhere on
  // the site, offset so the sticky nav bar doesn't cover the target.
  const handleNavClick = (heading, ticketIndex) => {
    cancelNavScrollRef.current()
    const isTicket = ticketIndex !== undefined
    if (isTicket) goTo(ticketIndex)

    const targetEl = isTicket ? orderRailRef.current : sectionRefs.current[heading]
    if (!targetEl) return

    const navHeight = navRef.current?.getBoundingClientRect().height ?? 0
    const targetY = targetEl.getBoundingClientRect().top + window.scrollY - navHeight - NAV_SCROLL_GAP
    cancelNavScrollRef.current = animateScrollTo(targetY, NAV_SCROLL_DURATION)
  }

  return (
    <motion.div
      className={styles.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className={styles.hero} style={{ '--accent': project.accentColor }}>
        <div className={styles.heroContent}>
          <motion.button
            className={styles.backTicket}
            onClick={() => navigate('/layer/projects')}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            ← BACK TO PROJECTS
          </motion.button>
          <motion.p
            className={styles.heroSubtitle}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            {project.subtitle}
          </motion.p>
          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
          >
            {project.title}
          </motion.h1>
          {project.intro && (
            <motion.p
              className={styles.heroIntro}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {project.intro}
            </motion.p>
          )}
          {project.liveLink && (
            <motion.a
              className={styles.liveLink}
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.46 }}
            >
              View Live Prototype →
            </motion.a>
          )}
        </div>
      </div>

      {project.problemStatement && (
        <div className={styles.problemBar} style={{ '--accent': project.accentColor }}>
          {(() => {
            const [label, ...rest] = project.problemStatement.split(': ')
            const body = rest.join(': ')
            return (
              <p className={styles.problemText}>
                <span className={styles.problemLabel}>{label}:</span> {body}
              </p>
            )
          })()}
        </div>
      )}

      {(tickets.length > 0 || contentSections.length > 0) && (
        <div ref={navRef} className={styles.sectionNavBar} style={{ '--accent': project.accentColor }}>
          <nav className={styles.sectionNav} aria-label="Jump to section">
            {tickets.map((t, i) => (
              <button
                key={t.heading}
                type="button"
                className={styles.sectionNavItem}
                onClick={() => handleNavClick(t.heading, i)}
              >
                {t.heading.replace(/^The /, '')}
              </button>
            ))}
            {contentSections.map(s => (
              <button
                key={s.heading}
                type="button"
                className={styles.sectionNavItem}
                onClick={() => handleNavClick(s.heading)}
              >
                {s.heading}
              </button>
            ))}
          </nav>
        </div>
      )}

      {tickets.length > 0 && (() => {
        const slots = carouselSlots(isMobile)

        return (
          <div ref={orderRailRef} className={styles.orderRail} style={{ '--accent': project.accentColor }}>
            <div className={styles.ticketStack}>
              {tickets.length > 1 && (
                <button
                  className={`${styles.ticketArrow} ${styles.ticketArrowPrev}`}
                  onClick={() => goTo(activeTicket - 1)}
                  aria-label="Previous ticket"
                >
                  ‹
                </button>
              )}

              {tickets.map((section, i) => {
                const offset = slotOffset(i, activeTicket, tickets.length)
                const isFront = offset === 0
                const pos = slots[offset] ?? { x: 0, y: 0, rotate: 0, scale: 0.7, opacity: 0, zIndex: 0, blur: 3 }

                return (
                  <motion.div
                    key={section.heading}
                    className={styles.orderTicket}
                    data-front={isFront || undefined}
                    style={{ zIndex: pos.zIndex }}
                    animate={{ x: pos.x, y: pos.y, rotate: pos.rotate, scale: pos.scale, opacity: pos.opacity, filter: `blur(${pos.blur}px)` }}
                    transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                    onClick={() => !isFront && goTo(i)}
                    role={isFront ? undefined : 'button'}
                    tabIndex={isFront ? undefined : 0}
                    aria-label={isFront ? undefined : `Bring "${section.heading}" ticket to front`}
                    onKeyDown={e => {
                      if (!isFront && (e.key === 'Enter' || e.key === ' ')) goTo(i)
                    }}
                  >
                    <div className={styles.ticketHeader}>
                      <span className={styles.ticketNum}>ORDER #{String(i + 1).padStart(2, '0')}</span>
                      {section.ticketLabel && (
                        <span className={styles.ticketStamp}>{section.ticketLabel}</span>
                      )}
                    </div>
                    <h2 className={styles.ticketHeading}>{section.heading}</h2>
                    <div className={styles.ticketPunch} />
                    {section.intro && <p className={styles.ticketIntro}>{section.intro}</p>}
                    {section.bullets && (
                      <ul className={styles.ticketItems}>
                        {section.bullets.map((b, j) => <li key={j}>{b}</li>)}
                      </ul>
                    )}
                  </motion.div>
                )
              })}

              {tickets.length > 1 && (
                <button
                  className={`${styles.ticketArrow} ${styles.ticketArrowNext}`}
                  onClick={() => goTo(activeTicket + 1)}
                  aria-label="Next ticket"
                >
                  ›
                </button>
              )}
            </div>
            <div className={styles.ticketDots}>
              {tickets.map((section, i) => (
                <button
                  key={section.heading}
                  className={styles.ticketDot}
                  data-active={i === activeTicket || undefined}
                  onClick={() => goTo(i)}
                  aria-label={`Show "${section.heading}" ticket`}
                />
              ))}
            </div>
          </div>
        )
      })()}

      <div className={styles.content} style={{ '--accent': project.accentColor }}>
        {contentSections.map((section, i) => (
          <motion.section
            key={section.heading}
            ref={el => { sectionRefs.current[section.heading] = el }}
            className={styles.section}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }}
          >
            <div className={styles.sectionNum} style={{ color: project.accentColor }}>
              {String(i + 1).padStart(2, '0')}
            </div>
            <div className={styles.sectionBody}>
              <h2 className={styles.sectionHeading}>{section.heading}</h2>
              {section.body && <p className={styles.sectionText}>{section.body}</p>}
              {section.intro && <p className={styles.sectionIntro}>{section.intro}</p>}
              {section.bullets && (
                <ul className={styles.sectionBullets}>
                  {section.bullets.map((b, j) => <li key={j}>{b}</li>)}
                </ul>
              )}
              {section.image && (
                <img className={styles.sectionImage} src={section.image} alt={section.heading} />
              )}
              {section.images && <ImageGallery images={section.images} />}
              {section.screens && (
                <div className={styles.compGroups}>
                  {section.screens.map(s => (
                    <ComponentAccordion key={s.name} component={s} />
                  ))}
                </div>
              )}
              {section.diagram && (
                <div className={styles.diagramWrap}>
                  <MermaidDiagram chart={section.diagram} />
                  {section.diagramCaption && <p className={styles.diagramCaption}>{section.diagramCaption}</p>}
                </div>
              )}
              {section.components && (
                <div className={styles.compGroups}>
                  {section.components.map(c => (
                    <ComponentAccordion key={c.name} component={c} />
                  ))}
                </div>
              )}
              {!section.image && !section.images && !section.screens && !section.diagram && !section.components && !section.bullets && !section.subsections && (
                <div className={styles.sectionImagePlaceholder}>Add image</div>
              )}
              {section.subsections && (
                <div className={styles.subsections}>
                  {section.subsections.map(sub => (
                    <div key={sub.heading} className={styles.subsection}>
                      <h3 className={styles.subsectionHeading}>{sub.heading}</h3>
                      {sub.body && <p className={styles.sectionText}>{sub.body}</p>}
                      {sub.intro && <p className={styles.sectionIntro}>{sub.intro}</p>}
                      {sub.bullets && (
                        <ul className={styles.sectionBullets}>
                          {sub.bullets.map((b, j) => <li key={j}>{b}</li>)}
                        </ul>
                      )}
                      {sub.image && (
                        <img className={styles.sectionImage} src={sub.image} alt={sub.heading} />
                      )}
                      {sub.personas && (
                        <div className={styles.personaGrid}>
                          {sub.personas.map(p => (
                            <PersonaAccordion key={p.name} persona={p} />
                          ))}
                        </div>
                      )}
                      {sub.images && <ImageGallery images={sub.images} />}
                      {sub.requirementGroups && (
                        <div className={styles.reqGroups}>
                          {sub.requirementGroups.map(g => (
                            <RequirementGroup key={g.number} group={g} />
                          ))}
                        </div>
                      )}
                      {!sub.image && !sub.bullets && !sub.personas && !sub.images && !sub.requirementGroups && (
                        <div className={styles.sectionImagePlaceholder}>Add image</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.section>
        ))}
      </div>
    </motion.div>
  )
}
