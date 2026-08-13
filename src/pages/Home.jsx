import { useState, useEffect, useRef, Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { layers } from '../data/layers'
import { animateScrollTo } from '../utils/scroll'
import styles from './Home.module.css'

const IMG_HEIGHT = 420   // natural height at 560px wide (2160×1620 source)
const REST_MB   = -428   // ~10px visible gap at rest
const HOVER_MB  = -374   // ~46px visible gap when spread
const HOVER_MB_MOBILE = -345   // ~75px visible gap when spread — enough room for the per-layer titles
const HIT_HEIGHT = 68    // height of the invisible click zone per ingredient
const MOBILE_QUERY = '(max-width: 640px)'
const HINT_SEEN_KEY = 'sandwichSite:hoverHintSeen'
const EXPAND_DURATION = 550      // ms — matches the marginBottom transition below, so the
                                  // page scroll and the layer spread finish in lockstep
const SCROLL_MARGIN = -31        // breathing room below the sandwich once scrolled into view

// Total rendered height of the sandwich (pre-scale) for a given inter-layer margin —
// each of the (n-1) gaps between layers contributes `margin` (negative = overlap).
function totalHeight(marginValue) {
  return layers.length * IMG_HEIGHT + (layers.length - 1) * marginValue
}

// Absolute y from sandwich top where the painted ingredient center sits (hover state).
// Each layer starts i * (IMG_HEIGHT + hoverMb) px from the sandwich top — hoverMb must
// match whatever margin is actually driving the layerWrapper spread (HOVER_MB desktop,
// HOVER_MB_MOBILE on mobile) or the hit zones drift away from the visible ingredients.
function getLabelY(i, hoverMb) {
  return i * (IMG_HEIGHT + hoverMb) + (layers[i].labelTopPct / 100) * IMG_HEIGHT
}

export default function Home() {
  const [isHovered, setIsHovered] = useState(false)
  const [hoveredId, setHoveredId] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const sandwichRef = useRef(null)
  const cancelScrollRef = useRef(() => {})
  const navigate = useNavigate()

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY)
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => () => cancelScrollRef.current(), [])

  // First-visit-of-the-session hint, desktop only — "dig in" nudge pointing
  // at the sandwich. sessionStorage (not localStorage) so it resets on a
  // fresh session rather than being gone forever after the first-ever load.
  // Reading matchMedia directly here (rather than the isMobile state) avoids
  // a render-order race on mount; the flag is written immediately so it
  // won't show again this session, whether or not the visitor hovers.
  useEffect(() => {
    const isDesktop = !window.matchMedia(MOBILE_QUERY).matches
    if (isDesktop && !window.sessionStorage.getItem(HINT_SEEN_KEY)) {
      setShowHint(true)
      window.sessionStorage.setItem(HINT_SEEN_KEY, '1')
    }
  }, [])

  // Fires the instant the hover/tap starts — computed once, up front, rather
  // than measured every animation frame (which caused the choppiness: forcing
  // a synchronous layout read on every tick of the spread animation). The
  // final expanded height is known analytically, so we can kick off a single
  // eased scroll that runs in parallel with the spread, timed to land with
  // the fully-expanded sandwich's bottom edge just inside the viewport — the
  // top stays put (no scroll) whenever the sandwich already fits on screen.
  const handleExpandStart = () => {
    setIsHovered(true)
    setShowHint(false)
    cancelScrollRef.current()

    const el = sandwichRef.current
    if (!el) return
    const restRect = el.getBoundingClientRect()
    const scale = restRect.height / totalHeight(REST_MB)
    const hoverMb = isMobile ? HOVER_MB_MOBILE : HOVER_MB
    const projectedBottom = restRect.top + totalHeight(hoverMb) * scale
    const overflow = projectedBottom - window.innerHeight

    if (overflow > 0) {
      cancelScrollRef.current = animateScrollTo(window.scrollY + overflow + SCROLL_MARGIN, EXPAND_DURATION)
    }
  }

  const handleExpandEnd = () => {
    cancelScrollRef.current()
    setIsHovered(false)
    setHoveredId(null)
  }

  return (
    <motion.div
      className={styles.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className={styles.titleBlock}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.1 }}
      >
        <h1 className={styles.name}>Morgan Weltzer</h1>
        <p className={styles.tagline}>{isMobile ? 'Click to Get Cookin’' : 'Let’s Get Cookin’'}</p>
       {/* <p className={styles.tagline}>Hover to explore · Click to dive in</p>*/}
      </motion.div>

      <div className={styles.scene}>
        <AnimatePresence>
          {showHint && !isMobile && (
            <motion.div
              className={styles.hoverHint}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8, transition: { duration: 0.25 } }}
              transition={{ duration: 0.4, delay: 1 }}
            >
              <motion.div
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 1.8 }}
              >
                <p className={styles.hoverHintText}>
                  Not your average hamburger menu.
                  <br />
                  Hover over me to dig in.
                </p>
                <svg
                  className={styles.hoverHintArrow}
                  width="120"
                  height="120"
                  viewBox="0 0 120 120"
                  fill="none"
                >
                  <motion.path
                    d="M108,14 C72,-6 34,10 42,40 C49,66 78,64 70,42 C64,25 36,26 26,48 C15,72 20,90 6,102"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1, ease: 'easeInOut', delay: 1.3 }}
                  />
                  <motion.path
                    d="M6,102 L23,97 M6,102 L13,86"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: 2.3 }}
                  />
                </svg>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <div
          ref={sandwichRef}
          className={styles.sandwich}
          onMouseEnter={handleExpandStart}
          onMouseLeave={handleExpandEnd}
        >
          {/* ── Layer images — pointer-events disabled, z-index controls paint order ── */}
          {layers.map((layer, i) => {
            const isLast = i === layers.length - 1
            const hoverMb = isMobile ? HOVER_MB_MOBILE : HOVER_MB
            const mb = isLast ? 0 : isHovered ? hoverMb : REST_MB

            return (
              <motion.div
                key={layer.id}
                className={styles.layerWrapper}
                style={{ zIndex: layers.length - i }}
                initial={{ opacity: 0, y: 30 }}
                animate={{
                  marginBottom: mb,
                  opacity: 1,
                  y: hoveredId === layer.id ? -8 : 0,
                }}
                transition={{
                  marginBottom: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
                  opacity:      { duration: 0.5,  delay: i * 0.07 },
                  y:            { duration: 0.18 },
                }}
              >
                <AnimatePresence>
                  {isHovered && !layer.isBread && (
                    <motion.span
                      className={styles.mobileLayerTitle}
                      style={{
                        top: `${layer.labelTopPct}%`,
                        '--accent': layer.accentColor,
                        '--text-col': layer.textColor,
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {layer.displayName}
                    </motion.span>
                  )}
                </AnimatePresence>
                <img
                  className={styles.layerImg}
                  src={layer.image}
                  alt={layer.displayName}
                  draggable={false}
                />
              </motion.div>
            )
          })}

          {/* ── Interaction overlay ──
              z-index 60 — above all layer stacking contexts.
              Contains both visible labels (pointer-events: none)
              and invisible hit zones (pointer-events: auto) aligned to each
              ingredient's painted center in the expanded/hover state. ── */}
          <div className={styles.interactionOverlay}>
            <AnimatePresence>
              {isHovered && layers.map((layer, i) => {
                if (layer.isBread) return null
                const centerY = getLabelY(i, isMobile ? HOVER_MB_MOBILE : HOVER_MB)

                return (
                  <Fragment key={layer.id}>
                    {/* Label */}
                    <motion.div
                      className={styles.labelTag}
                      style={{
                        top: centerY,
                        '--accent': layer.accentColor,
                        '--text-col': layer.textColor,
                      }}
                      initial={{ opacity: 0, x: 54 }}
                      animate={{ opacity: 1, x: 40 }}
                      exit={{ opacity: 0, x: 54 }}
                      transition={{ duration: 0.2, delay: i * 0.06 }}
                    >
                      <span className={styles.labelPill}>{layer.displayName}</span>
                      <span className={styles.labelLine} />
                    </motion.div>

                    {/* Invisible hit zone — exactly aligned to ingredient center */}
                    <div
                      className={styles.hitArea}
                      style={{ top: centerY - HIT_HEIGHT / 2 }}
                      onMouseEnter={() => setHoveredId(layer.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={() => navigate(`/layer/${layer.id}`)}
                      aria-label={`Open ${layer.displayName}`}
                    />
                  </Fragment>
                )
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
