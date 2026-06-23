import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { layers } from '../data/layers'
import styles from './LayerPage.module.css'

function LayerContent({ layer }) {
  const { content } = layer
  if (!content) return null

  if (content.type === 'projects') {
    return (
      <>
        <p className={styles.sectionLabel}>Selected Work</p>
        <div className={styles.projectsGrid}>
          {content.items.map((item, i) => (
            <motion.div
              key={item.title}
              className={styles.projectCard}
              style={{ '--accent': layer.accentColor }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.45 + i * 0.1 }}
            >
              <div className={styles.projectTitle}>{item.title}</div>
              <div className={styles.projectDesc}>{item.desc}</div>
            </motion.div>
          ))}
        </div>
      </>
    )
  }

  if (content.type === 'about') {
    return (
      <>
        <p className={styles.sectionLabel}>About Me</p>
        <motion.p
          className={styles.bio}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          {content.bio}
        </motion.p>
      </>
    )
  }

  if (content.type === 'contact') {
    return (
      <>
        <p className={styles.sectionLabel}>Get in Touch</p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          <a className={styles.contactEmail} href={`mailto:${content.email}`}
            style={{ '--accent': layer.accentColor }}>
            {content.email}
          </a>
          <div className={styles.socialLinks}>
            {content.links.map((link) => (
              <a
                key={link.label}
                className={styles.socialLink}
                style={{ background: layer.accentColor, color: layer.textColor }}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </a>
            ))}
          </div>
        </motion.div>
      </>
    )
  }

  if (content.type === 'site-details') {
    return (
      <>
        <p className={styles.sectionLabel}>About This Site</p>
        <motion.p
          className={styles.bio}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          {content.description}
        </motion.p>
        <motion.div
          className={styles.stackList}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {content.stack.map((tech) => (
            <span
              key={tech}
              className={styles.stackTag}
              style={{ '--accent': layer.accentColor }}
            >
              {tech}
            </span>
          ))}
        </motion.div>
      </>
    )
  }

  return null
}

export default function LayerPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const layer = layers.find((l) => l.id === id)

  if (!layer || layer.isBread) {
    navigate('/')
    return null
  }

  return (
    <motion.div
      className={styles.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Hero — the ingredient image stretched wide with a tinted overlay */}
      <div
        className={styles.hero}
        style={{ '--accent': layer.accentColor }}
      >
        <motion.img
          className={styles.heroImg}
          src={layer.image}
          alt={layer.displayName}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        />

        <div className={styles.heroOverlay} />

        <div className={styles.heroContent}>
          <motion.button
            className={styles.backBtn}
            onClick={() => navigate('/')}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            ← Back
          </motion.button>

          <motion.p
            className={styles.heroSubtitle}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            {layer.subtitle}
          </motion.p>

          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
          >
            {layer.displayName}
          </motion.h1>
        </div>
      </div>

      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.38 }}
      >
        <LayerContent layer={layer} />
      </motion.div>
    </motion.div>
  )
}
