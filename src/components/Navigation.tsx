import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { User } from '@/types'
import { Palette, Home, Users, LogOut, ChevronDown } from 'lucide-react'

interface NavigationProps {
  currentUser: User | null
  currentPage: 'home' | 'feed' | 'profile'
  onPageChange: (page: 'home' | 'feed' | 'profile') => void
  onLogout: () => void
}

export const Navigation: React.FC<NavigationProps> = ({
  currentUser,
  currentPage,
  onPageChange,
  onLogout,
}) => {
  return (
    <Card className="sticky top-0 z-40 rounded-none border-b border-t-0 border-l-0 border-r-0">
      <CardHeader className="py-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
              <Palette className="w-5 h-5" />
            </div>
            <CardTitle className="text-lg">GeoArt</CardTitle>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={currentPage === 'home' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onPageChange('home')}
            >
              <Home className="w-4 h-4 mr-2" />
              Запись
            </Button>
            <Button
              variant={currentPage === 'feed' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onPageChange('feed')}
            >
              <Users className="w-4 h-4 mr-2" />
              Галерея
            </Button>
            <Button
              variant={currentPage === 'profile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onPageChange('profile')}
            >
              <Avatar className="w-5 h-5 mr-2">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                  {currentUser?.name.charAt(0).toUpperCase()}
                </div>
              </Avatar>
              Профиль
            </Button>

            {currentUser && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5 text-sm font-medium text-gray-700">
                    {currentUser.name}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Выход
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}
