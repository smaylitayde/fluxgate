import { useEffect, useRef, useState } from 'react'

interface Props {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
  duration?: number
}

export default function AnimatedNumber({ value, decimals = 0, prefix = '', suffix = '', duration = 800 }: Props) {
  const [display, setDisplay] = useState(value)
  const prevRef = useRef(value)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const from = prevRef.current
    const to = value
    const start = performance.now()

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration)
      const ease = 1 - Math.pow(1 - p, 3)
      setDisplay(from + (to - from) * ease)
      if (p < 1) rafRef.current = requestAnimationFrame(tick)
      else {
        setDisplay(to)
        prevRef.current = to
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [value, duration])

  const formatted = display.toFixed(decimals)
  const parts = formatted.split('.')
  const intPart = parseInt(parts[0]).toLocaleString()
  const result = parts[1] !== undefined ? `${intPart}.${parts[1]}` : intPart

  return <>{prefix}{result}{suffix}</>
}
