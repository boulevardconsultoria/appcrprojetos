import { useEffect, useRef, useState } from 'react'

export function useReveal(options?: { threshold?: number; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setRevealed(true), options?.delay ?? 0)
          observer.unobserve(el)
        }
      },
      { threshold: options?.threshold ?? 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [options?.threshold, options?.delay])

  return { ref, revealed }
}
