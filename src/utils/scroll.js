const easeInOutCubic = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

// Native `scrollTo({ behavior: 'smooth' })` is fast (~300ms) and its easing
// isn't controllable, so we drive the scroll ourselves for a slower, eased feel.
export function animateScrollTo(targetY, duration = 1600) {
  const startY = window.scrollY
  const diff = targetY - startY
  if (diff === 0) return () => {}

  const startTime = performance.now()
  let rafId

  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1)
    window.scrollTo(0, startY + diff * easeInOutCubic(progress))
    if (progress < 1) rafId = requestAnimationFrame(step)
  }
  rafId = requestAnimationFrame(step)

  return () => cancelAnimationFrame(rafId)
}
