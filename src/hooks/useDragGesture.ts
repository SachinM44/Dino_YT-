import { useCallback, useRef } from 'react'

interface DragState {
  startY: number
  currentY: number
  isDragging: boolean
}

export function useDragGesture(
  onDragEnd: (offset: number, velocity: number) => void,
  threshold: number = 0.4
) {
  const stateRef = useRef<DragState>({ startY: 0, currentY: 0, isDragging: false })
  const startTimeRef = useRef<number>(0)
  const elementRef = useRef<HTMLDivElement>(null)

  const handleStart = useCallback((clientY: number) => {
    stateRef.current = { startY: clientY, currentY: clientY, isDragging: true }
    startTimeRef.current = Date.now()
  }, [])

  const handleMove = useCallback((clientY: number) => {
    if (!stateRef.current.isDragging) return

    stateRef.current.currentY = clientY
    const offset = clientY - stateRef.current.startY

    if (elementRef.current && offset > 0) {
      elementRef.current.style.transform = `translateY(${offset}px)`
      elementRef.current.style.transition = 'none'
    }
  }, [])

  const handleEnd = useCallback(() => {
    if (!stateRef.current.isDragging) return

    const offset = stateRef.current.currentY - stateRef.current.startY
    const duration = Date.now() - startTimeRef.current
    const velocity = offset / duration

    if (elementRef.current) {
      elementRef.current.style.transform = ''
      elementRef.current.style.transition = ''
    }

    const viewportHeight = window.innerHeight
    const shouldMinimize = offset > viewportHeight * threshold || velocity > 0.5

    stateRef.current.isDragging = false
    onDragEnd(offset, velocity)

    return shouldMinimize
  }, [onDragEnd, threshold])

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    handleStart(e.touches[0].clientY)
  }, [handleStart])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    handleMove(e.touches[0].clientY)
  }, [handleMove])

  const onTouchEnd = useCallback(() => {
    return handleEnd()
  }, [handleEnd])

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    handleStart(e.clientY)
    
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientY)
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
    handlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onMouseDown
    }
  }
}
