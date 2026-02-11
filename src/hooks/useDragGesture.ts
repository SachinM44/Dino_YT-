import { useCallback, useRef } from 'react'

export function useDragGesture(
  onDragEnd: (offset: number) => void,
  threshold: number = 0.4
) {
  const startY = useRef(0)
  const currentY = useRef(0)
  const isDragging = useRef(false)
  const startTime = useRef(0)
  const elementRef = useRef<HTMLDivElement>(null)

  const handleStart = useCallback((clientY: number) => {
    startY.current = clientY
    currentY.current = clientY
    isDragging.current = true
    startTime.current = Date.now()
  }, [])

  const handleMove = useCallback((clientY: number) => {
    if (!isDragging.current) return
    currentY.current = clientY
    const offset = clientY - startY.current

    if (elementRef.current && offset > 0) {
      elementRef.current.style.transform = `translateY(${offset}px)`
      elementRef.current.style.transition = 'none'
    }
  }, [])

  const handleEnd = useCallback(() => {
    if (!isDragging.current) return

    const offset = currentY.current - startY.current
    const duration = Date.now() - startTime.current
    const velocity = offset / duration

    if (elementRef.current) {
      elementRef.current.style.transform = ''
      elementRef.current.style.transition = ''
    }

    isDragging.current = false

    // trigger minimize if dragged far enough or fast enough
    if (offset > window.innerHeight * threshold || velocity > 0.5) {
      onDragEnd(offset)
    }
  }, [onDragEnd, threshold])

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    handleStart(e.touches[0].clientY)
  }, [handleStart])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    handleMove(e.touches[0].clientY)
  }, [handleMove])

  const onTouchEnd = useCallback(() => {
    handleEnd()
  }, [handleEnd])

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    handleStart(e.clientY)

    const onMouseMove = (ev: MouseEvent) => handleMove(ev.clientY)
    const onMouseUp = () => {
      handleEnd()
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }, [handleStart, handleMove, handleEnd])

  return {
    elementRef,
    handlers: { onTouchStart, onTouchMove, onTouchEnd, onMouseDown }
  }
}
