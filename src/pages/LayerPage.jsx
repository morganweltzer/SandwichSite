import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { layers } from '../data/layers'
import styles from './LayerPage.module.css'

const navigableLayers = layers.filter(l => !l.isBread)

function ProjectsContent({ layer }) {
  const { content } = layer
  return (
    <div className={styles.menuBoardWrap}>
      <div className={styles.menuBoardHeader}>
        <div className={styles.menuBoardEyebrow}>Est. 2001</div>
        <div className={styles.menuBoardTitle}>Today's Specials</div>
        <div className={styles.menuBoardSub}>· All items made fresh to order ·</div>
      </div>
      <div className={styles.menuItems}>
        {content.items.map((item, i) => (
          <motion.div
            key={item.title}
            className={styles.menuItem}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.45 + i * 0.1 }}
          >
            <div className={styles.menuItemTop}>
              <span className={styles.menuItemNum}>{String(i + 1).padStart(2, '0')}</span>
              <span className={styles.menuItemName}>{item.title}</span>
              <span
                className={styles.menuItemBadge}
                style={{ background: layer.accentColor, color: layer.textColor }}
              >
                Chef's Pick
              </span>
            </div>
            <p className={styles.menuItemDesc}>{item.desc}</p>
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.menuItemLink}
                style={{ color: layer.accentColor }}
              >
                View Project →
              </a>
            )}
            {item.tech && (
              <div className={styles.menuItemFooter}>
                <span className={styles.menuServedWith}>Served with</span>
                {item.tech.map(t => (
                  <span key={t} className={styles.menuTechTag}>{t}</span>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function AboutContent({ layer }) {
  const { content } = layer
  return (
    <div className={styles.staffCardWrap}>
      <motion.div
        className={styles.staffCard}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.42 }}
      >
        <div
          className={styles.staffCardTop}
          style={{ background: layer.accentColor, color: layer.textColor }}
        >
          <span className={styles.staffLabel}>Employee Profile</span>
          <span className={styles.staffId}>ID #001</span>
        </div>
        <div className={styles.staffPunchHole} />
        <div className={styles.staffMain}>
          <div className={styles.staffName}>Morgan Weltzer</div>
          <div className={styles.staffRole}>Designer & Developer</div>
          <hr className={styles.staffDivider} />
          <p className={styles.staffBio}>{content.bio}</p>

          {content.experience?.length > 0 && (
            <>
              <hr className={styles.staffDivider} />
              <div className={styles.staffSectionLabel}>Work Experience</div>
              {content.experience.map((job, i) => (
                <motion.div
                  key={i}
                  className={styles.staffEntry}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.55 + i * 0.1 }}
                >
                  <div className={styles.staffEntryTop}>
                    <span className={styles.staffEntryTitle}>{job.role}</span>
                    <span className={styles.staffEntryDates}>{job.dates}</span>
                  </div>
                  <div
                    className={styles.staffEntryCompany}
                    style={{ color: layer.accentColor }}
                  >
                    {job.company}
                  </div>
                  {job.bullets?.length > 0 && (
                    <ul className={styles.staffEntryList}>
                      {job.bullets.map((b, j) => <li key={j}>{b}</li>)}
                    </ul>
                  )}
                </motion.div>
              ))}
            </>
          )}

          {content.education?.length > 0 && (
            <>
              <hr className={styles.staffDivider} />
              <div className={styles.staffSectionLabel}>Education</div>
              {content.education.map((edu, i) => (
                <motion.div
                  key={i}
                  className={styles.staffEntry}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.65 + i * 0.1 }}
                >
                  <div className={styles.staffEntryTop}>
                    <span className={styles.staffEntryTitle}>{edu.degree}</span>
                    <span className={styles.staffEntryDates}>{edu.dates}</span>
                  </div>
                  <div
                    className={styles.staffEntryCompany}
                    style={{ color: layer.accentColor }}
                  >
                    {edu.school}
                  </div>
                  {edu.bullets?.length > 0 && (
                    <ul className={styles.staffEntryList}>
                      {edu.bullets.map((b, j) => <li key={j}>{b}</li>)}
                    </ul>
                  )}
                </motion.div>
              ))}
            </>
          )}
        </div>
        <a
          href="/Morgan Weltzer 2026.pdf"
          download
          className={styles.staffDownload}
          style={{ borderColor: layer.accentColor, color: layer.accentColor }}
        >
          ↓ DOWNLOAD EMPLOYEE FILE
        </a>
        <div className={styles.staffFooter}>
          <div className={styles.staffBarcode} aria-hidden="true">
            <span style={{ height: '60%' }} /><span style={{ height: '100%' }} />
            <span style={{ height: '40%' }} /><span style={{ height: '80%' }} />
            <span style={{ height: '55%' }} /><span style={{ height: '100%' }} />
            <span style={{ height: '30%' }} /><span style={{ height: '90%' }} />
            <span style={{ height: '65%' }} /><span style={{ height: '45%' }} />
            <span style={{ height: '100%' }} /><span style={{ height: '35%' }} />
            <span style={{ height: '75%' }} /><span style={{ height: '50%' }} />
            <span style={{ height: '95%' }} /><span style={{ height: '40%' }} />
            <span style={{ height: '60%' }} /><span style={{ height: '85%' }} />
          </div>
          <p className={styles.staffBarcodeLabel}>VALID: ALWAYS · AUTHORIZED: EVERYWHERE</p>
        </div>
      </motion.div>
    </div>
  )
}

function CheddarModal({ onClose, accentColor, textColor }) {
  return (
    <motion.div
      className={styles.cheddarOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.cheddarCard}
        initial={{ opacity: 0, scale: 0.92, y: 28 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 28 }}
        transition={{ duration: 0.28 }}
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.cheddarHeader} style={{ background: accentColor, color: textColor }}>
          <span className={styles.cheddarEyebrow}>· Secret Menu ·</span>
          <span className={styles.cheddarTitle}>Extra Cheese</span>
          <span className={styles.cheddarSubhead}>Available while supplies last</span>
        </div>
        <div className={styles.cheddarBody}>
          <img src="/Cheddar-Picture.jpg" alt="Cheddar the Corgi" className={styles.cheddarPhoto} />
          <div className={styles.cheddarName}>Cheddar</div>
          <div className={styles.cheddarRole}>Sous Chef · Head of Security · Good Boy</div>
          <hr className={styles.cheddarDivider} />
          <p className={styles.cheddarBlurb}>
            Our most requested secret ingredient. My welsh corgi who specializes with late-night zoomies and scaring off neighborhood squirrels.
            Pairs well with absolutely everything.
          </p>
          <p className={styles.cheddarNote}>⚠ Not available for delivery. In-person visits only.</p>
        </div>
        <button className={styles.cheddarClose} onClick={onClose} style={{ color: accentColor }}>
          — Close Tab —
        </button>
      </motion.div>
    </motion.div>
  )
}

function ContactContent({ layer }) {
  const { content } = layer
  const [showCheddar, setShowCheddar] = useState(false)

  return (
    <>
    <AnimatePresence>
      {showCheddar && (
        <CheddarModal
          onClose={() => setShowCheddar(false)}
          accentColor={layer.accentColor}
          textColor={layer.textColor}
        />
      )}
    </AnimatePresence>
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.45 }}
    >
      <div className={styles.receiptBgBox}>
        <div className={styles.receiptWrap}>
          <div className={styles.receiptPaper}>

            <div className={styles.dinerName}>Thank You!</div>
            <p className={styles.dinerTagline}>— HAND CRAFTED · FULL STACK —</p>
            <p className={styles.dinerAddress}>Come back again</p>

            <hr className={styles.receiptDivider} />

            <div className={styles.metaRow}>
              <span>CONTACT CARD</span><span>TABLE FOR 1</span>
            </div>
            <div className={styles.metaRow}>
              <span>859-640-6943</span><span>OPEN 24/7</span>
            </div>

            <hr className={styles.receiptDivider} />

            <div className={styles.receiptItems}>
              <div className={styles.itemRow}>
                <span className={styles.itemQty}>1</span>
                <span className={styles.itemName}>
                  <a href={`mailto:${content.email}`} className={styles.receiptLink}>EMAIL</a>
                </span>
                <span className={styles.itemPrice}>ON THE HOUSE</span>
              </div>
              <div className={styles.itemNote}>{content.email}</div>

              {content.links.map((link) => (
                <div key={link.label} className={styles.itemRow}>
                  <span className={styles.itemQty}>1</span>
                  <span className={styles.itemName}>
                    {link.modal === 'cheddar' ? (
                      <button className={styles.receiptLinkBtn} onClick={() => setShowCheddar(true)}>
                        {link.label.toUpperCase()}
                      </button>
                    ) : (
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className={styles.receiptLink}>
                        {link.label.toUpperCase()}
                      </a>
                    )}
                  </span>
                  <span className={styles.itemPrice}>FREE</span>
                </div>
              ))}
            </div>

            <hr className={styles.receiptDivider} />

            <div className={styles.totalsRow}><span>MESSAGES</span><span>UNLIMITED</span></div>
            <div className={styles.totalsRow}><span>RESPONSE TIME</span><span>FAST</span></div>
            <div className={`${styles.totalsRow} ${styles.grandTotal}`}>
              <span>TABLE RATING</span><span>★★★★★</span>
            </div>

            <hr className={styles.receiptDivider} />

            <p className={styles.thankYou}>
              Thanks for stopping by.{' '}
              <span className={styles.thankYouAccent}>Don't be a stranger.</span>
            </p>

            <div className={styles.barcode} aria-hidden="true">
              <span style={{ height: '60%' }} /><span style={{ height: '100%' }} />
              <span style={{ height: '40%' }} /><span style={{ height: '80%' }} />
              <span style={{ height: '55%' }} /><span style={{ height: '100%' }} />
              <span style={{ height: '30%' }} /><span style={{ height: '90%' }} />
              <span style={{ height: '65%' }} /><span style={{ height: '45%' }} />
              <span style={{ height: '100%' }} /><span style={{ height: '35%' }} />
              <span style={{ height: '75%' }} /><span style={{ height: '50%' }} />
              <span style={{ height: '95%' }} /><span style={{ height: '40%' }} />
              <span style={{ height: '60%' }} /><span style={{ height: '85%' }} />
              <span style={{ height: '30%' }} /><span style={{ height: '100%' }} />
            </div>
            <p className={styles.receiptId}>NO REFUNDS · NO RETURNS</p>

          </div>
        </div>
      </div>
    </motion.div>
    </>
  )
}

function SiteDetailsContent({ layer }) {
  const { content } = layer
  return (
    <div className={styles.nutritionWrap}>
      <motion.div
        className={styles.nutritionBox}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.42 }}
      >
        <div className={styles.nutritionTitle}>Site Facts</div>
        <hr className={styles.nutritionDividerThin} />
        <div className={styles.nutritionServing}>Serving Size: 1 Portfolio</div>
        <hr className={styles.nutritionDividerThick} />
        <div className={styles.nutritionPunchline}>{content.punchline}</div>
        <hr className={styles.nutritionDividerMed} />
        <div className={styles.nutritionDescBlock}>
          {content.description.map((para, i) => (
            <p key={i} className={styles.nutritionDesc}>{para}</p>
          ))}
        </div>
        <hr className={styles.nutritionDividerThick} />
        <div className={styles.nutritionIngLabel}>% Daily Ingredients</div>
        <hr className={styles.nutritionDividerThin} />
        {content.stack.map((tech, i) => (
          <div key={tech}>
            <div className={styles.nutritionStackRow}>
              <span className={styles.nutritionIngredient}>{tech}</span>
              <span className={styles.nutritionPct}>100%</span>
            </div>
            {i < content.stack.length - 1 && <hr className={styles.nutritionStackDivider} />}
          </div>
        ))}
        <hr className={styles.nutritionDividerThick} />
        <p className={styles.nutritionFooter}>
          * Percent Daily Values based on a 2,000 calorie creative diet. Human made, AI assisted.
        </p>
      </motion.div>
    </div>
  )
}

function LayerNav({ currentId }) {
  const navigate = useNavigate()
  const currentIdx = navigableLayers.findIndex(l => l.id === currentId)
  const prev = navigableLayers[currentIdx - 1]
  const next = navigableLayers[currentIdx + 1]

  return (
    <div className={styles.layerNav}>
      <div className={styles.layerNavInner}>
        <div className={styles.layerNavSide}>
          {prev && (
            <button className={styles.layerNavBtn} onClick={() => navigate(`/layer/${prev.id}`)}>
              <span className={styles.layerNavArrow}>←</span>
              <span className={styles.layerNavName}>{prev.displayName}</span>
            </button>
          )}
        </div>
        <button className={styles.layerNavHome} onClick={() => navigate('/')}>
          ↑ Full Sandwich
        </button>
        <div className={`${styles.layerNavSide} ${styles.layerNavRight}`}>
          {next && (
            <button className={styles.layerNavBtn} onClick={() => navigate(`/layer/${next.id}`)}>
              <span className={styles.layerNavName}>{next.displayName}</span>
              <span className={styles.layerNavArrow}>→</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
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
            className={styles.backTicket}
            onClick={() => navigate('/')}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            ← BACK
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
        {layer.content?.type === 'projects'     && <ProjectsContent layer={layer} />}
        {layer.content?.type === 'about'        && <AboutContent layer={layer} />}
        {layer.content?.type === 'contact'      && <ContactContent layer={layer} />}
        {layer.content?.type === 'site-details' && <SiteDetailsContent layer={layer} />}
      </motion.div>

      <LayerNav currentId={id} />
    </motion.div>
  )
}
