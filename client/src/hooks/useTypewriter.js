import { useState, useEffect } from 'react'

/**
 * useTypewriter — Cycles through an array of phrases with a typing effect.
 * Returns the current display string.
 *
 * @param {string[]} phrases   — array of strings to cycle through
 * @param {number}   typeSpeed — ms per character (default 60)
 * @param {number}   pauseMs   — ms to hold completed phrase (default 2000)
 * @param {number}   deleteSpeed — ms per deletion (default 35)
 */
export function useTypewriter(phrases = [], {
  typeSpeed   = 60,
  pauseMs     = 2200,
  deleteSpeed = 35,
} = {}) {
  const [display, setDisplay]   = useState('')
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [charIdx, setCharIdx]   = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [paused, setPaused]     = useState(false)

  useEffect(() => {
    if (!phrases.length) return
    const current = phrases[phraseIdx]

    if (paused) {
      const t = setTimeout(() => { setPaused(false); setDeleting(true) }, pauseMs)
      return () => clearTimeout(t)
    }

    if (!deleting) {
      // Typing forward
      if (charIdx < current.length) {
        const t = setTimeout(() => {
          setDisplay(current.slice(0, charIdx + 1))
          setCharIdx(i => i + 1)
        }, typeSpeed + Math.random() * 20)
        return () => clearTimeout(t)
      } else {
        setPaused(true)
      }
    } else {
      // Deleting
      if (charIdx > 0) {
        const t = setTimeout(() => {
          setDisplay(current.slice(0, charIdx - 1))
          setCharIdx(i => i - 1)
        }, deleteSpeed)
        return () => clearTimeout(t)
      } else {
        setDeleting(false)
        setPhraseIdx(i => (i + 1) % phrases.length)
      }
    }
  }, [phrases, phraseIdx, charIdx, deleting, paused, typeSpeed, pauseMs, deleteSpeed])

  return display
}
