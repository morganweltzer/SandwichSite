import { useState, Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { layers } from '../data/layers'
import styles from './Home.module.css'

const IMG_HEIGHT = 420   // natural height at 560px wide (2160×1620 source)
const REST_MB   = -410   // ~10px visible gap at rest
const HOVER_MB  = -374   // ~46px visible gap when spread
const HIT_HEIGHT = 68    // height of the invisible click zone per ingredient

// Absolute y from sandwich top where the painted ingredient center sits (hover state).
// Each layer starts i * (420 - 374) = i * 46 px from the sandwich top.
function getLabelY(i) {
  return i * (IMG_HEIGHT + HOVER_MB) + (layers[i].labelTopPct / 100) * IMG_HEIGHT
}

export default function Home() {
  const [isHovered, setIsHovered] = useState(false)
  const [hoveredId, setHoveredId] = useState(null)
  const navigate = useNavigate()

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
        <h1 className={styles.name}>My Portfolio</h1>
        <p className={styles.tagline}>Hover to explore · Click to dive in</p>
      </motion.div>

      <div className={styles.scene}>
        <div
          className={styles.sandwich}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => { setIsHovered(false); setHoveredId(null) }}
        >
          {/* ── Layer images — pointer-events disabled, z-index controls paint order ── */}
          {layers.map((layer, i) => {
            const isLast = i === layers.length - 1
            const mb = isLast ? 0 : isHovered ? HOVER_MB : REST_MB

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
                const centerY = getLabelY(i)

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
                      initial={{ opacity: 0, x: 14 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 14 }}
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
