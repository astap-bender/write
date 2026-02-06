import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User } from '@/types'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Palette, LogIn, UserPlus } from 'lucide-react'

interface AuthDialogProps {
  open: boolean
  onUserCreated: (user: User) => void
}

export const AuthDialog: React.FC<AuthDialogProps> = ({ open, onUserCreated }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim() || !email.trim()) {
      setError('Заполните все поля')
      return
    }

    if (!email.includes('@')) {
      setError('Введите корректный email')
      return
    }

    const user: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      email: email.trim(),
      createdAt: Date.now(),
    }

    onUserCreated(user)
    setName('')
    setEmail('')
    setError('')
  }

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Художественная геолокация
        </DialogTitle>
        <DialogDescription>
          Создавайте работы, отслеживая ваш путь с помощью геолокации
        </DialogDescription>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Имя художника</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ваше имя"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="mt-1"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded text-sm">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" size="lg">
            <LogIn className="w-4 h-4 mr-2" />
            Начать работу
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
