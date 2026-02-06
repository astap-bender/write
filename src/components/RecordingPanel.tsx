import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { ArtisticMap } from './ArtisticMap'
import { GeoLocation, DrawingPoint, RecordingSession, Artwork } from '@/types'
import { geolocationService } from '@/lib/geolocation'
import { storageService } from '@/lib/storage'
import { MapPin, Pause, Play, Save, Palette } from 'lucide-react'

interface RecordingPanelProps {
  currentUser: { id: string; name: string } | null
  onArtworkSaved: (artwork: Artwork) => void
}

export const RecordingPanel: React.FC<RecordingPanelProps> = ({ currentUser, onArtworkSaved }) => {
  const [session, setSession] = useState<RecordingSession>({
    isRecording: false,
    currentPath: [],
    drawings: [],
  })

  const [isDrawingMode, setIsDrawingMode] = useState(false)
  const [drawingColor, setDrawingColor] = useState('#FF6B6B')
  const [drawingSize, setDrawingSize] = useState(3)
  const [watchId, setWatchId] = useState<number | null>(null)
  const [artworkTitle, setArtworkTitle] = useState('')
  const [artworkDescription, setArtworkDescription] = useState('')
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        geolocationService.clearWatch(watchId)
      }
    }
  }, [watchId])

  const handleStartRecording = async () => {
    try {
      setIsLoading(true)
      const position = await geolocationService.getCurrentPosition()

      const newWatchId = geolocationService.watchPosition(
        (position) => {
          setSession(prev => ({
            ...prev,
            currentPath: [...prev.currentPath, position],
            startTime: prev.startTime || Date.now(),
          }))
        },
        (error) => {
          console.error('Ошибка геолокации:', error)
          setSession(prev => ({ ...prev, isRecording: false }))
        }
      )

      setWatchId(newWatchId)
      setSession(prev => ({
        ...prev,
        isRecording: true,
        currentPath: [position],
        startTime: Date.now(),
        drawings: [],
      }))
      setIsDrawingMode(false)
      setArtworkTitle('')
      setArtworkDescription('')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStopRecording = () => {
    if (watchId !== null) {
      geolocationService.clearWatch(watchId)
      setWatchId(null)
    }
    setSession(prev => ({ ...prev, isRecording: false }))
    setShowSaveDialog(true)
  }

  const handleAddDrawingPoint = (point: DrawingPoint) => {
    setSession(prev => ({
      ...prev,
      drawings: [...prev.drawings, point],
    }))
  }

  const handleSaveArtwork = () => {
    if (!currentUser || !artworkTitle.trim() || session.currentPath.length === 0) {
      return
    }

    const artwork: Artwork = {
      id: `artwork_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: currentUser.id,
      userName: currentUser.name,
      title: artworkTitle,
      description: artworkDescription,
      path: session.currentPath,
      drawings: session.drawings,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      likes: 0,
      dislikes: 0,
      commentCount: 0,
      rating: 0,
      dateKey: new Date().toISOString().split('T')[0],
    }

    storageService.saveArtwork(artwork)
    onArtworkSaved(artwork)

    setSession({
      isRecording: false,
      currentPath: [],
      drawings: [],
    })
    setShowSaveDialog(false)
    setArtworkTitle('')
    setArtworkDescription('')
    setIsDrawingMode(false)
  }

  const handleClearRecording = () => {
    if (watchId !== null) {
      geolocationService.clearWatch(watchId)
      setWatchId(null)
    }
    setSession({
      isRecording: false,
      currentPath: [],
      drawings: [],
    })
    setShowSaveDialog(false)
    setArtworkTitle('')
    setArtworkDescription('')
    setIsDrawingMode(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Панель управления записью
          </CardTitle>
          <CardDescription>
            Записывайте ваш путь движения и рисуйте на карте
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!session.isRecording ? (
            <Button
              onClick={handleStartRecording}
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              <Play className="w-4 h-4 mr-2" />
              {isLoading ? 'Загрузка...' : 'Начать запись'}
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Button
                  onClick={handleStopRecording}
                  variant="destructive"
                  className="flex-1"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Остановить запись
                </Button>
                <Button
                  onClick={() => setIsDrawingMode(!isDrawingMode)}
                  variant={isDrawingMode ? 'default' : 'outline'}
                  className="flex-1"
                >
                  <Palette className="w-4 h-4 mr-2" />
                  {isDrawingMode ? 'Рисование включено' : 'Рисование'}
                </Button>
              </div>

              {isDrawingMode && (
                <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="drawing-color">Цвет рисования</Label>
                    <div className="flex gap-2">
                      <input
                        id="drawing-color"
                        type="color"
                        value={drawingColor}
                        onChange={(e) => setDrawingColor(e.target.value)}
                        className="w-12 h-10 rounded cursor-pointer"
                      />
                      <span className="text-sm text-gray-600 self-center flex-1">
                        {drawingColor}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="drawing-size">Размер кисти: {drawingSize}px</Label>
                    <input
                      id="drawing-size"
                      type="range"
                      min="1"
                      max="20"
                      value={drawingSize}
                      onChange={(e) => setDrawingSize(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              <div className="text-sm text-gray-600">
                <div>📍 Точек пути: {session.currentPath.length}</div>
                <div>✏️ Точек рисования: {session.drawings.length}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {session.currentPath.length > 0 && (
        <ArtisticMap
          path={session.currentPath}
          isDrawingMode={isDrawingMode && session.isRecording}
          onDrawingPoint={handleAddDrawingPoint}
          drawingColor={drawingColor}
          drawingSize={drawingSize}
          existingDrawings={session.drawings}
        />
      )}

      {session.currentPath.length > 0 && !session.isRecording && (
        <AlertDialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <AlertDialogContent>
            <AlertDialogTitle>Сохранить работу</AlertDialogTitle>
            <AlertDialogDescription>
              Введите название и описание вашей художественной работы
            </AlertDialogDescription>

            <div className="space-y-4">
              <div>
                <Label htmlFor="artwork-title">Название работы *</Label>
                <Input
                  id="artwork-title"
                  value={artworkTitle}
                  onChange={(e) => setArtworkTitle(e.target.value)}
                  placeholder="Введите название..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="artwork-description">Описание</Label>
                <Textarea
                  id="artwork-description"
                  value={artworkDescription}
                  onChange={(e) => setArtworkDescription(e.target.value)}
                  placeholder="Опишите вашу работу..."
                  className="mt-1"
                />
              </div>

              <div className="flex gap-2 text-xs text-gray-600">
                <Badge variant="secondary">📍 {session.currentPath.length} точек</Badge>
                <Badge variant="secondary">✏️ {session.drawings.length} штрихов</Badge>
              </div>
            </div>

            <div className="flex gap-2">
              <AlertDialogCancel onClick={handleClearRecording}>
                Отменить
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleSaveArtwork}
                disabled={!artworkTitle.trim()}
              >
                <Save className="w-4 h-4 mr-2" />
                Сохранить работу
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
