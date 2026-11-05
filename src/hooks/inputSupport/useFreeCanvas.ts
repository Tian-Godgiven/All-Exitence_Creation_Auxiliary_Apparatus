import type { Ref } from "vue"

export type FreeCanvasViewport = { x: number, y: number, scale: number }
type Point = { x: number, y: number }

export function useFreeCanvas(canvasRef: Ref<HTMLElement | undefined>, getViewport: () => FreeCanvasViewport, options: { minScale?: number, maxScale?: number } = {}){
    const minScale = options.minScale ?? .5, maxScale = options.maxScale ?? 2
    let stopDragging: (() => void) | null = null
    let suppressContextMenu = false
    let suppressTimer: ReturnType<typeof setTimeout> | null = null

    function canvasPoint(event: MouseEvent | PointerEvent): Point {
        const rect = canvasRef.value?.getBoundingClientRect()
        if(!rect) return { x: 0, y: 0 }
        const viewport = getViewport()
        return { x: snap((event.clientX - rect.left - viewport.x) / viewport.scale), y: snap((event.clientY - rect.top - viewport.y) / viewport.scale) }
    }
    function createOnDoubleClick(event: MouseEvent, create: (point: Point) => void){ create(canvasPoint(event)) }
    function startCanvasPan(event: PointerEvent){
        if(event.button !== 1 && event.button !== 2) return
        const viewport = getViewport(), start = { x: event.clientX, y: event.clientY, viewport: { ...viewport } }
        let moved = false
        startPointerDrag(event.pointerId, move => {
            moved ||= Math.hypot(move.clientX - start.x, move.clientY - start.y) > 4
            viewport.x = start.viewport.x + move.clientX - start.x
            viewport.y = start.viewport.y + move.clientY - start.y
        }, () => { if(moved) markContextMenuSuppressed() })
    }
    function zoomCanvas(event: WheelEvent){
        const rect = canvasRef.value?.getBoundingClientRect()
        if(!rect) return
        const viewport = getViewport(), oldScale = viewport.scale, scale = Math.max(minScale, Math.min(maxScale, oldScale * (event.deltaY > 0 ? .9 : 1.1)))
        const pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top }, world = { x: (pointer.x - viewport.x) / oldScale, y: (pointer.y - viewport.y) / oldScale }
        viewport.scale = scale
        viewport.x = pointer.x - world.x * scale
        viewport.y = pointer.y - world.y * scale
    }
    function startPointerDrag(pointerId: number, move: (event: PointerEvent) => void, afterDrag?: () => void){
        stopDragging?.()
        const onMove = (event: PointerEvent) => { if(event.pointerId === pointerId) move(event) }
        const onEnd = (event: PointerEvent) => { if(event.pointerId === pointerId){ stopDragging?.(); afterDrag?.() } }
        document.addEventListener("pointermove", onMove)
        document.addEventListener("pointerup", onEnd)
        document.addEventListener("pointercancel", onEnd)
        stopDragging = () => {
            document.removeEventListener("pointermove", onMove)
            document.removeEventListener("pointerup", onEnd)
            document.removeEventListener("pointercancel", onEnd)
            stopDragging = null
        }
    }
    function markContextMenuSuppressed(){
        suppressContextMenu = true
        if(suppressTimer) clearTimeout(suppressTimer)
        suppressTimer = setTimeout(() => { suppressContextMenu = false; suppressTimer = null }, 700)
    }
    function consumeContextMenuSuppression(){
        if(!suppressContextMenu) return false
        suppressContextMenu = false
        if(suppressTimer) clearTimeout(suppressTimer)
        suppressTimer = null
        return true
    }
    function dispose(){ stopDragging?.(); if(suppressTimer) clearTimeout(suppressTimer) }

    return { canvasPoint, createOnDoubleClick, startCanvasPan, zoomCanvas, startPointerDrag, markContextMenuSuppressed, consumeContextMenuSuppression, dispose }
}

function snap(value: number){ return Math.round(value * 100) / 100 }
