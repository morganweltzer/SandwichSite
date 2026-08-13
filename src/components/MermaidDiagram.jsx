import { useCallback, useEffect, useId, useRef, useState } from 'react'
import styles from './MermaidDiagram.module.css'

const MIN_SCALE = 0.3
const MAX_SCALE = 3
const ZOOM_STEP = 1.25

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

// mermaid (plus its layout/typesetting deps — d3, dagre, cytoscape, katex)
// is sizeable, and this app has no route-level code-splitting, so a static
// import would ship it to every page. Dynamic import keeps it out of the
// shared bundle entirely — it's only fetched the first time a diagram
// actually mounts — and the module-level promise + init flag mean repeat
// instances reuse the same loaded/initialized library.
let mermaidPromise = null
function loadMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import('mermaid').then(({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        themeVariables: {
          fontFamily: "'Courier Prime', monospace",
          fontSize: '14px',
          primaryColor: '#FAF6EA',
          primaryTextColor: '#2C1A0E',
          primaryBorderColor: '#7A3010',
          lineColor: '#7A3010',
          secondaryColor: '#FBF5EC',
          tertiaryColor: '#FFFFFF',
          clusterBkg: '#FBF5EC',
          clusterBorder: '#7A3010',
          edgeLabelBackground: '#FBF5EC',
        },
      })
      return mermaid
    })
  }
  return mermaidPromise
}

// Mermaid's root <svg> ships as width="100%" with no explicit height, so
// the browser scales the whole thing (text included) down to fit its
// container. We drive scale ourselves instead, so pin it to the viewBox's
// own pixel dimensions and let the pan/zoom viewport below own the fit.
function pinToNaturalSize(svgMarkup) {
  const match = svgMarkup.match(/viewBox="[-\d.]+\s+[-\d.]+\s+([\d.]+)\s+([\d.]+)"/)
  if (!match) return svgMarkup
  const [, width, height] = match
  return svgMarkup.replace(/width="100%"/, `width="${width}" height="${height}"`)
}

// Renders a mermaid diagram definition (raw mermaid syntax) to inline SVG,
// inside a pan/zoom viewport: drag to move it around, scroll/pinch or the
// toolbar buttons to zoom, in case the diagram is too dense to read at a
// glance. Each instance gets a stable id derived from useId so multiple
// diagrams can safely render on the same page.
export default function MermaidDiagram({ chart, className }) {
  const rawId = useId()
  const id = `mermaid-${rawId.replace(/[^a-zA-Z0-9]/g, '')}`
  const [svg, setSvg] = useState(null)
  const [error, setError] = useState(null)
  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const viewportRef = useRef(null)
  const contentRef = useRef(null)
  const dragRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    loadMermaid()
      .then(mermaid => mermaid.render(id, chart))
      .then(result => { if (!cancelled) setSvg(pinToNaturalSize(result.svg)) })
      .catch(err => { if (!cancelled) setError(err instanceof Error ? err.message : String(err)) })
    return () => { cancelled = true }
  }, [chart, id])

  const fitToViewport = useCallback(() => {
    const viewport = viewportRef.current
    const svgEl = contentRef.current?.querySelector('svg')
    if (!viewport || !svgEl) return
    const naturalWidth = svgEl.viewBox?.baseVal?.width || svgEl.getBoundingClientRect().width
    const naturalHeight = svgEl.viewBox?.baseVal?.height || svgEl.getBoundingClientRect().height
    const { clientWidth, clientHeight } = viewport
    const fitScale = clamp(Math.min(clientWidth / naturalWidth, clientHeight / naturalHeight), MIN_SCALE, 1)
    setTransform({
      scale: fitScale,
      x: (clientWidth - naturalWidth * fitScale) / 2,
      y: (clientHeight - naturalHeight * fitScale) / 2,
    })
  }, [])

  // Fit the diagram to the viewport once it's rendered.
  useEffect(() => {
    if (svg) fitToViewport()
  }, [svg, fitToViewport])

  // Zooms by `factor`, keeping whatever point sits at (clientX, clientY)
  // (viewport center if omitted) visually fixed in place.
  const zoomAt = useCallback((factor, clientX, clientY) => {
    const viewport = viewportRef.current
    if (!viewport) return
    const rect = viewport.getBoundingClientRect()
    const cx = clientX != null ? clientX - rect.left : rect.width / 2
    const cy = clientY != null ? clientY - rect.top : rect.height / 2
    setTransform(prev => {
      const nextScale = clamp(prev.scale * factor, MIN_SCALE, MAX_SCALE)
      const ratio = nextScale / prev.scale
      return { scale: nextScale, x: cx - ratio * (cx - prev.x), y: cy - ratio * (cy - prev.y) }
    })
  }, [])

  // React registers onWheel as a passive listener at the root, so
  // e.preventDefault() inside a JSX handler silently no-ops — the page
  // would scroll right along with (or instead of) the diagram zooming.
  // Attaching a real, non-passive listener directly to the DOM node is
  // the only way to actually block the native scroll here.
  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const onWheel = e => {
      e.preventDefault()
      zoomAt(e.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP, e.clientX, e.clientY)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [zoomAt])

  const handlePointerDown = e => {
    // Toolbar buttons sit inside the pannable viewport (for absolute
    // positioning against it) — without this check, their pointerdown
    // bubbles up here first and setPointerCapture steals the click before
    // it reaches the button.
    if (e.target.closest('button')) return
    if (e.button !== 0 && e.pointerType === 'mouse') return
    dragRef.current = { startX: e.clientX, startY: e.clientY, originX: transform.x, originY: transform.y }
    e.currentTarget.setPointerCapture(e.pointerId)
    setIsDragging(true)
  }

  const handlePointerMove = e => {
    if (!dragRef.current) return
    const { startX, startY, originX, originY } = dragRef.current
    setTransform(prev => ({ ...prev, x: originX + (e.clientX - startX), y: originY + (e.clientY - startY) }))
  }

  const endDrag = e => {
    dragRef.current = null
    setIsDragging(false)
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
  }

  if (error) return <p className={className}>Diagram failed to render: {error}</p>

  return (
    <div className={className}>
      <div
        ref={viewportRef}
        className={styles.viewport}
        data-dragging={isDragging || undefined}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        role="group"
        aria-label="Diagram viewer — drag to pan, use the controls to zoom"
      >
        <div
          ref={contentRef}
          className={styles.content}
          style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})` }}
          aria-busy={!svg}
          dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
        />
        {svg && <span className={styles.hint}>Drag to pan · Scroll to zoom</span>}
        <div className={styles.toolbar}>
          <button type="button" className={styles.toolbarButton} onClick={() => zoomAt(1 / ZOOM_STEP)} aria-label="Zoom out">−</button>
          <span className={styles.zoomLabel}>{Math.round(transform.scale * 100)}%</span>
          <button type="button" className={styles.toolbarButton} onClick={() => zoomAt(ZOOM_STEP)} aria-label="Zoom in">+</button>
          <button type="button" className={`${styles.toolbarButton} ${styles.resetButton}`} onClick={fitToViewport} aria-label="Reset view">⤾</button>
        </div>
      </div>
    </div>
  )
}
