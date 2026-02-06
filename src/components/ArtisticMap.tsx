import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { GeoLocation, DrawingPoint } from '@/types'
import { Card, CardContent } from '@/components/ui/card'

interface ArtisticMapProps {
  path: GeoLocation[]
  onLocationSelect?: (location: GeoLocation) => void
  isDrawingMode?: boolean
  onDrawingPoint?: (point: DrawingPoint) => void
  drawingColor?: string
  drawingSize?: number
  existingDrawings?: DrawingPoint[]
  readOnly?: boolean
}

export const ArtisticMap: React.FC<ArtisticMapProps> = ({
  path,
  onLocationSelect,
  isDrawingMode = false,
  onDrawingPoint,
  drawingColor = '#FF6B6B',
  drawingSize = 3,
  existingDrawings = [],
  readOnly = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const isDrawingRef = useRef(false)
  const [mapKey, setMapKey] = useState(0)

  useEffect(() => {
    if (!mapContainerRef.current) return

    if (mapRef.current) {
      mapRef.current.remove()
      mapRef.current = null
    }

    mapRef.current = L.map(mapContainerRef.current).setView([55.7558, 37.6173], 13)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    }).addTo(mapRef.current)

    const map = mapRef.current

    if (path && path.length > 0) {
      const coordinates = path.map(p => [p.latitude, p.longitude] as [number, number])
      L.polyline(coordinates, {
        color: '#667eea',
        weight: 3,
        opacity: 0.7,
        dashArray: undefined,
      }).addTo(map)

      if (coordinates.length > 0) {
        const bounds = L.latLngBounds(coordinates)
        setTimeout(() => {
          map.fitBounds(bounds, { padding: [50, 50], animate: false })
        }, 100)

        L.circleMarker([path[0].latitude, path[0].longitude], {
          radius: 6,
          fillColor: '#4facfe',
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8,
        }).addTo(map)

        if (path.length > 1) {
          const lastPoint = path[path.length - 1]
          L.circleMarker([lastPoint.latitude, lastPoint.longitude], {
            radius: 6,
            fillColor: '#f5576c',
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8,
          }).addTo(map)
        }
      }
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [path, mapKey])

  useEffect(() => {
    if (!mapContainerRef.current || !mapRef.current) return

    const container = mapContainerRef.current
    let canvas = canvasRef.current

    if (!canvas) {
      canvas = document.createElement('canvas')
      canvas.style.position = 'absolute'
      canvas.style.top = '0'
      canvas.style.left = '0'
      canvas.style.zIndex = '400'
      canvas.style.cursor = isDrawingMode && !readOnly ? 'crosshair' : 'default'
      container.appendChild(canvas)
      canvasRef.current = canvas
    }

    canvas.width = container.offsetWidth
    canvas.height = container.offsetHeight
    canvas.style.pointerEvents = isDrawingMode && !readOnly ? 'auto' : 'none'
    canvas.style.cursor = isDrawingMode && !readOnly ? 'crosshair' : 'default'

    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      existingDrawings.forEach(point => {
        ctx.fillStyle = point.color
        ctx.beginPath()
        ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    if (isDrawingMode && !readOnly) {
      const handleMouseDown = () => {
        isDrawingRef.current = true
      }

      const handleMouseMove = (e: MouseEvent) => {
        if (!isDrawingRef.current) return

        const rect = canvas!.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const ctx = canvas!.getContext('2d')
        if (ctx) {
          ctx.fillStyle = drawingColor
          ctx.beginPath()
          ctx.arc(x, y, drawingSize, 0, Math.PI * 2)
          ctx.fill()
        }

        onDrawingPoint?.({
          x,
          y,
          color: drawingColor,
          size: drawingSize,
        })
      }

      const handleMouseUp = () => {
        isDrawingRef.current = false
      }

      canvas.addEventListener('mousedown', handleMouseDown)
      canvas.addEventListener('mousemove', handleMouseMove)
      canvas.addEventListener('mouseup', handleMouseUp)
      window.addEventListener('mouseup', handleMouseUp)

      return () => {
        canvas?.removeEventListener('mousedown', handleMouseDown)
        canvas?.removeEventListener('mousemove', handleMouseMove)
        canvas?.removeEventListener('mouseup', handleMouseUp)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDrawingMode, drawingColor, drawingSize, existingDrawings, onDrawingPoint, readOnly])

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div
          ref={mapContainerRef}
          className="w-full relative bg-gray-100"
          style={{ height: '500px' }}
        />
      </CardContent>
    </Card>
  )
}
