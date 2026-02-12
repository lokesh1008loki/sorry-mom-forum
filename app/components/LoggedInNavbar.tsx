import React, { useState, useEffect } from 'react'
import Avatar from '@/app/components/Avatar'

interface LoggedInNavbarProps {
  initialUser: {
    username: string
    email: string
    isContributor: boolean
    profilePicture: string | null
  }
  hasUsername: boolean
  hasEmail: boolean
  isContributor: boolean
  hasProfilePicture: boolean
}

const LoggedInNavbar: React.FC<LoggedInNavbarProps> = ({ initialUser }) => {
  const [profilePicture, setProfilePicture] = useState<string | null>(initialUser.profilePicture)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadProfilePicture = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/get-profile-pic')
        if (response.ok) {
          const data = await response.json()
          console.log('Profile picture data:', data)
          if (data.profilePicture) {
            setProfilePicture(data.profilePicture)
          }
        }
      } catch (error) {
        console.error('Error loading profile picture:', error)
      } finally {
        setIsLoading(false)
      }
    }

    // Only load if we don't have an initial profile picture
    if (!initialUser.profilePicture) {
      loadProfilePicture()
    }
  }, [initialUser.profilePicture])

  // Listen for profile picture updates
  useEffect(() => {
    const handleProfileUpdate = (event: CustomEvent) => {
      console.log('Profile update event received:', event.detail)
      if (event.detail?.profilePicture) {
        console.log('Setting new profile picture:', event.detail.profilePicture)
        setProfilePicture(event.detail.profilePicture)
      }
    }

    window.addEventListener('profile-updated', handleProfileUpdate as EventListener)
    return () => {
      window.removeEventListener('profile-updated', handleProfileUpdate as EventListener)
    }
  }, [])

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* ... other navbar items ... */}
          
          <div className="flex items-center">
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            ) : (
              <Avatar
                username={initialUser.username}
                profilePicture={profilePicture || `https://avatar.vercel.sh/${initialUser.username}?size=200`}
                size="sm"
              />
            )}
            {/* ... rest of the navbar items ... */}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default LoggedInNavbar 