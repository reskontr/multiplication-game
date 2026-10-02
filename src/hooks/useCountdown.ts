import { useEffect, useRef, useState } from 'react'

interface UseCountdownOptions {
  durationSeconds: number
  active: boolean
  resetKey: string | null
  onTimeout: () => void
}

export function useCountdown({
  durationSeconds,
  active,
  resetKey,
  onTimeout,
}: UseCountdownOptions) {
  const [remainingMs, setRemainingMs] = useState(durationSeconds * 1000)
  const onTimeoutRef = useRef(onTimeout)

  useEffect(() => {
    onTimeoutRef.current = onTimeout
  }, [onTimeout])

  useEffect(() => {
    if (!active) {
      setRemainingMs(durationSeconds * 1000)
      return
    }

    const deadline = Date.now() + durationSeconds * 1000
    let expired = false

    const update = () => {
      const nextRemainingMs = Math.max(0, deadline - Date.now())
      setRemainingMs(nextRemainingMs)

      if (nextRemainingMs === 0 && !expired) {
        expired = true
        onTimeoutRef.current()
      }
    }

    update()
    const intervalId = window.setInterval(update, 50)
    return () => window.clearInterval(intervalId)
  }, [active, durationSeconds, resetKey])

  return {
    remainingMs,
    remainingSeconds: Math.ceil(remainingMs / 1000),
    progress: Math.max(0, Math.min(100, (remainingMs / (durationSeconds * 1000)) * 100)),
  }
}
