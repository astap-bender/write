import React, { useState, useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { User, Artwork } from '@/types'
import { storageService, getAllArtworksPublic, getArtworksByUserId } from '@/lib/storage'
import { AuthDialog } from '@/components/AuthDialog'
import { Navigation } from '@/components/Navigation'
import { RecordingPanel } from '@/components/RecordingPanel'
import { Feed } from '@/components/Feed'
import { UserProfile } from '@/components/UserProfile'
import { ArtworkCard } from '@/components/ArtworkCard'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

function AppContent() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [currentPage, setCurrentPage] = useState<'home' | 'feed' | 'profile'>('home')
  const [allArtworks, setAllArtworks] = useState<Artwork[]>([])
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const savedUser = storageService.getCurrentUser()
    if (savedUser) {
      setCurrentUser(savedUser)
    } else {
      setShowAuthDialog(true)
    }

    const savedArtworks = getAllArtworksPublic()
    setAllArtworks(savedArtworks)
  }, [])

  useEffect(() => {
    const pollArtworks = () => {
      const updatedArtworks = getAllArtworksPublic()
      setAllArtworks((prevArtworks) => {
        const prevSerialized = JSON.stringify(prevArtworks.sort((a, b) => a.id.localeCompare(b.id)))
        const newSerialized = JSON.stringify(updatedArtworks.sort((a, b) => a.id.localeCompare(b.id)))
        
        if (prevSerialized !== newSerialized) {
          return updatedArtworks
        }
        return prevArtworks
      })

      if (selectedArtwork) {
        const updated = updatedArtworks.find((a) => a.id === selectedArtwork.id)
        if (updated && JSON.stringify(updated) !== JSON.stringify(selectedArtwork)) {
          setSelectedArtwork(updated)
        }
      }
    }

    pollingIntervalRef.current = setInterval(pollArtworks, 1000)

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [selectedArtwork])

  const handleUserCreated = (user: User) => {
    setCurrentUser(user)
    storageService.saveUser(user)
    setShowAuthDialog(false)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    storageService.clearCurrentUser()
    setShowAuthDialog(true)
    setCurrentPage('home')
    setSelectedArtwork(null)
  }

  const handleArtworkSaved = (artwork: Artwork) => {
    const updatedArtworks = getAllArtworksPublic()
    setAllArtworks(updatedArtworks)
    setSelectedArtwork(null)
  }

  const handleLikeChange = () => {
    const updatedArtworks = getAllArtworksPublic()
    setAllArtworks(updatedArtworks)
    if (selectedArtwork) {
      const updated = updatedArtworks.find((a) => a.id === selectedArtwork.id)
      if (updated) {
        setSelectedArtwork(updated)
      }
    }
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <AuthDialog open={showAuthDialog} onUserCreated={handleUserCreated} />
      </div>
    )
  }

  if (selectedArtwork) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation
          currentUser={currentUser}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onLogout={handleLogout}
        />
        <div className="container mx-auto px-4 py-6">
          <Button variant="ghost" onClick={() => setSelectedArtwork(null)} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
          <ArtworkCard
            artwork={selectedArtwork}
            currentUserId={currentUser.id}
            onLikeChange={handleLikeChange}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation
        currentUser={currentUser}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onLogout={handleLogout}
      />

      <div className="container mx-auto px-4 py-6">
        {currentPage === 'home' && (
          <RecordingPanel currentUser={currentUser} onArtworkSaved={handleArtworkSaved} />
        )}

        {currentPage === 'feed' && (
          <Feed
            artworks={allArtworks}
            currentUserId={currentUser.id}
            onArtworkClick={setSelectedArtwork}
            onLikeChange={handleLikeChange}
          />
        )}

        {currentPage === 'profile' && (
          <UserProfile
            user={currentUser}
            artworks={getArtworksByUserId(currentUser.id)}
            currentUserId={currentUser.id}
            onArtworkClick={setSelectedArtwork}
            onLikeChange={handleLikeChange}
          />
        )}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<AppContent />} />
      </Routes>
    </BrowserRouter>
  )
}
