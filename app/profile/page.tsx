"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Camera, Loader2 } from "lucide-react"
import { useTranslation } from "@/contexts/language-context"
import { database, auth, storage } from "@/lib/firebase"
import { ref as dbRef, update } from "firebase/database"
import { ref as storageRef } from "firebase/storage"
import { onAuthStateChanged, signInAnonymously } from "firebase/auth"
import { Progress } from "@/components/ui/progress"
import { uploadProfilePicture, UploadProgress } from "@/lib/storage"
import { getDownloadURL, uploadBytesResumable, uploadBytes } from "firebase/storage"
import { useSession } from "next-auth/react"

interface User {
  id: string
  username: string
  email: string
  isContributor: boolean
  profilePicture?: string | null
}

// Add image compression function
const compressImage = async (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height
        
        // Calculate new dimensions while maintaining aspect ratio
        const maxSize = 1024 // Max dimension
        if (width > height && width > maxSize) {
          height = Math.round((height * maxSize) / width)
          width = maxSize
        } else if (height > maxSize) {
          width = Math.round((width * maxSize) / height)
          height = maxSize
        }
        
        canvas.width = width
        canvas.height = height
        
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)
        
        // Convert to blob with quality adjustment
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'))
              return
            }
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            })
            resolve(compressedFile)
          },
          'image/jpeg',
          0.7 // Adjust quality (0.7 = 70% quality)
        )
      }
      img.onerror = () => reject(new Error('Failed to load image'))
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
  })
}

export default function ProfilePage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [profilePicture, setProfilePicture] = useState<string | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<any>(null)

  // Use translations
  const profileTitle = useTranslation("profile")
  const profileDesc = useTranslation("profile_desc")
  const usernameLabel = useTranslation("username")
  const emailLabel = useTranslation("email")
  const changePhotoText = useTranslation("change_photo")
  const uploadPhotoText = useTranslation("upload_photo")
  const saveChangesText = useTranslation("save_changes")
  const changesSavedText = useTranslation("changes_saved")
  const errorSavingText = useTranslation("error_saving")

  const getInitials = (name: string | undefined) => {
    if (!name) return ''
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
  }

  const fetchUserData = async () => {
    try {
      setIsLoading(true)
      
      if (status === "unauthenticated") {
        router.push('/login')
        return
      }

      if (!session?.user?.username) {
        router.push('/login')
        return
      }

      const response = await fetch(`/api/users/${session.user.username}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch user data')
      }

      const userData = await response.json()
      setUser(userData)
      setProfilePicture(userData.profilePicture)
      setFormData(prev => ({
        ...prev,
        username: userData.username,
        email: userData.email,
      }))
    } catch (error) {
      console.error('Error fetching user data:', error)
      toast.error('Failed to load profile data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (status === "authenticated") {
      fetchUserData()
    }
  }, [status, session])

  // Handle Firebase Authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        console.log("Firebase user authenticated:", firebaseUser.uid)
        setFirebaseUser(firebaseUser)
      } else {
        // If no Firebase user, try to sign in anonymously
        try {
          const anonUser = await signInAnonymously(auth)
          console.log("Anonymous user created:", anonUser.user.uid)
          setFirebaseUser(anonUser.user)
        } catch (error) {
          console.error("Error creating anonymous user:", error)
        }
      }
    })

    return () => unsubscribe()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 400) {
          toast.error(data.message || "Email already exists")
        } else {
          throw new Error("Failed to update profile")
        }
        return
      }

      toast.success("Profile updated successfully")
      setIsEditing(false)
      setProfilePicture(data.profilePicture)
    } catch (error) {
      toast.error("Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/user/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to change password")
      }

      toast.success("Password changed successfully")
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }))
    } catch (error) {
      toast.error("Failed to change password")
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    console.log('File selected:', file.name, file.size, file.type)

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file")
      return
    }

    if (!user?.username) {
      toast.error("Please sign in to upload profile picture")
      return
    }

    try {
      setIsUploading(true)
      console.log('Starting upload process...')

      // Compress image if larger than 1MB
      let fileToUpload = file
      if (file.size > 1024 * 1024) { // 1MB in bytes
        console.log('Image larger than 1MB, compressing...')
        fileToUpload = await compressImage(file)
        console.log('Compressed image size:', fileToUpload.size)
      }

      // Ensure we have a Firebase user
      let currentUser = auth.currentUser
      if (!currentUser) {
        console.log('No Firebase user found, signing in anonymously...')
        const anonUser = await signInAnonymously(auth)
        currentUser = anonUser.user
        console.log('Created anonymous user:', currentUser.uid)
      }

      // Create storage reference using username
      const fileRef = storageRef(storage, `profile_pics_forum/${user.username}/profile-picture`)
      console.log('Storage reference created:', fileRef.fullPath)

      // Add metadata
      const metadata = {
        contentType: fileToUpload.type,
        customMetadata: {
          userId: currentUser.uid,
          username: user.username
        }
      }

      // Upload file
      console.log('Starting upload with metadata:', metadata)
      const snapshot = await uploadBytes(fileRef, fileToUpload, metadata)
      console.log('Upload completed:', snapshot)

      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref)
      console.log('Download URL:', downloadURL)

      // Update profile in database
      const response = await fetch('/api/update-profile-pic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          profilePicture: downloadURL,
          username: user.username 
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update profile in database')
      }

      const updatedUser = await response.json()
      console.log('Updated user data:', updatedUser)

      // Update session with new profile picture
      const sessionResponse = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profilePicture: downloadURL,
          isContributor: user.isContributor // Preserve contributor status
        })
      })

      if (!sessionResponse.ok) {
        console.error('Failed to update session')
      }

      // Update local state
      setProfilePicture(downloadURL)
      setUser(prev => prev ? { ...prev, profilePicture: downloadURL } : null)
      
      // Update navbar and force refresh
      window.dispatchEvent(new CustomEvent('profile-updated', {
        detail: { 
          profilePicture: downloadURL,
          username: user.username,
          isContributor: user.isContributor // Preserve contributor status
        }
      }))

      // Force a re-render of the avatar component
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      toast.success("Profile picture updated successfully")

      // Wait for state updates to complete before reloading
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Force refresh the page to ensure all components update
      window.location.reload()
    } catch (error: any) {
      console.error('Upload error:', error)
      toast.error(error.message || 'Failed to upload profile picture')
    } finally {
      setIsUploading(false)
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated" || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Not Signed In</h2>
          <p className="text-muted-foreground mb-4">Please sign in to view your profile</p>
          <Button onClick={() => router.push('/login')}>Sign In</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>{profileTitle}</CardTitle>
              <CardDescription>{profileDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col items-center gap-4">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative group">
                      <Avatar className="h-32 w-32 cursor-pointer" onClick={handleImageClick}>
                        {profilePicture ? (
                          <AvatarImage 
                            src={profilePicture}
                            alt={user?.username || 'Profile'} 
                            className="object-cover"
                            onError={(e) => {
                              console.error('Error loading profile picture:', e)
                              setProfilePicture(null)
                              // Force a re-render
                              const target = e.target as HTMLImageElement
                              target.src = ''
                            }}
                          />
                        ) : (
                          <AvatarFallback className="text-lg bg-primary/10">
                            {getInitials(user?.username)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={handleImageClick}>
                        <Camera className="h-8 w-8 text-white" />
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isUploading}
                      />
                    </div>
                    {isUploading && (
                      <div className="w-full max-w-xs space-y-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>{uploadPhotoText}</span>
                        </div>
                        <Progress value={uploadProgress} className="w-full" />
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </Button>
                </div>

                <form onSubmit={handleProfileUpdate} className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">{usernameLabel}</Label>
                    <Input
                      id="username"
                      name="username"
                      value={formData.username}
                      disabled={true}
                      className="bg-muted"
                    />
                    <p className="text-sm text-muted-foreground">Username cannot be changed</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{emailLabel}</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                      pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                    />
                  </div>

                  {isEditing && (
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  )}
                </form>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Update your password and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 