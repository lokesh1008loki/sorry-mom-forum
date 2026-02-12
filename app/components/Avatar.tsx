import React from 'react'
import Image from 'next/image'

interface AvatarProps {
  username: string
  profilePicture: string | null
  size?: 'sm' | 'md' | 'lg'
}

const Avatar: React.FC<AvatarProps> = ({ username, profilePicture, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }

  const defaultAvatar = `https://avatar.vercel.sh/${username}?size=200`

  return (
    <div className={`relative ${sizeClasses[size]} rounded-full overflow-hidden`}>
      <Image
        src={profilePicture || defaultAvatar}
        alt={`${username}'s avatar`}
        fill
        className="object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement
          target.src = defaultAvatar
        }}
      />
    </div>
  )
}

export default Avatar 