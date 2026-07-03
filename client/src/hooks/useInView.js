import { useEffect, useRef, useState } from 'react'

/**
 * useInView — Returns [ref, inView] where inView becomes true once
 * the element enters the viewport. Stays true after first trigger (once).
 *
 * @param {object} options
 *   threshold — 0-1, how much of element must be visible (default 0.15)
 *   once      — if true, stays true after first intersection (default true)
 */
export function useInView({ threshold = 0.15, once = true } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, once])

  return [ref, inView]
}
