'use client'

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useTranslation } from "@/contexts/language-context"
import { MessageSquare, Send, ChevronUp, ChevronDown, ExternalLink, LogIn, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { io, Socket } from "socket.io-client"
import { useSession } from "next-auth/react"
import { database } from '@/lib/firebase'
import { ref, push, onValue, off, query, orderByChild, limitToLast, serverTimestamp, set, update } from 'firebase/database'
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

interface User {
  id: string
  username: string
  profilePicture?: string
}

interface Message {
  id: string
  content: string
  type: 'text' | 'image' | 'file'
  fileUrl?: string
  fileSize?: number
  userId: string
  username: string
  profilePicture?: string
  timestamp: number
}

interface LiveChatProps {
  className?: string
  fullPage?: boolean
}

export function LiveChat({ className, fullPage = false }: LiveChatProps) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [chatHeight, setChatHeight] = useState(fullPage ? 500 : 180)
  const [isResizing, setIsResizing] = useState(false)
  const [startY, setStartY] = useState(0)
  const [startHeight, setStartHeight] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const resizeRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const socketRef = useRef<Socket | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const minHeight = fullPage ? 300 : 100
  const maxHeight = fullPage ? 800 : 500
  const [onlineUsers, setOnlineUsers] = useState<User[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const storage = getStorage()

  // Use translations
  const liveChatTitle = useTranslation("live_chat")
  const onlineUsersDesc = useTranslation("online_users_desc")
  const sendMessageText = useTranslation("send_message")
  const typeMessageText = useTranslation("type_message")
  const resizeChatText = useTranslation("resize_chat")
  const openInNewPageText = "Open in new page"
  const loginToChatText = "Login to chat"
  const loginRequiredText = "Please login to send messages"

  // Initialize Firebase listeners
  useEffect(() => {
    console.log('Session status:', status)
    console.log('Session user:', session?.user)

    if (status !== 'authenticated' || !session?.user) {
      console.log('Not authenticated, skipping Firebase initialization')
      return
    }

    console.log('Initializing Firebase listeners for user:', session.user.id)

    // Reference to the messages in Firebase
    const messagesRef = ref(database, 'messages')
    const messagesQuery = query(messagesRef, orderByChild('timestamp'), limitToLast(50))

    // Listen for new messages
    onValue(messagesQuery, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const messageList = Object.entries(data).map(([id, msg]: [string, any]) => ({
          id,
          ...msg,
          timestamp: msg.timestamp || Date.now()
        }))
        console.log('Received messages:', messageList.length)
        setMessages(messageList)
      }
    })

    // Handle online users
    const onlineUsersRef = ref(database, 'onlineUsers')
    
    // Set up presence system
    const userStatusRef = ref(database, `onlineUsers/${session.user.id}`)
    
    // When user connects, set their status
    const userStatus = {
      username: session.user.username,
      profilePicture: session.user.profilePicture,
      lastSeen: serverTimestamp(),
      status: 'online',
      userId: session.user.id
    }

    // Set user as online
    set(userStatusRef, userStatus)
      .then(() => {
        console.log('Successfully set user as online:', session.user.id)
      })
      .catch((error) => {
        console.error('Error setting user as online:', error)
        // If permission denied, try to update instead of set
        if (error.code === 'PERMISSION_DENIED') {
          update(userStatusRef, userStatus)
            .then(() => console.log('Updated user status instead'))
            .catch(updateError => console.error('Update also failed:', updateError))
        }
      })

    // Listen for online users
    onValue(onlineUsersRef, (snapshot) => {
      const data = snapshot.val()
      console.log('Online users data:', data)
      
      if (data) {
        const users = Object.entries(data)
          .filter(([_, user]: [string, any]) => user.status === 'online')
          .map(([id, user]: [string, any]) => ({
            id,
            ...user
          }))
        console.log('Filtered online users:', users)
        setOnlineUsers(users)
      } else {
        console.log('No online users found in database')
        setOnlineUsers([])
      }
    }, (error) => {
      console.error('Error listening to online users:', error)
    })

    // When user disconnects, set their status to offline
    const handleDisconnect = () => {
      const offlineStatus = {
        ...userStatus,
        status: 'offline',
        lastSeen: serverTimestamp()
      }

      set(userStatusRef, offlineStatus)
        .catch((error) => {
          console.error('Error setting user as offline:', error)
          // If permission denied, try to update instead
          if (error.code === 'PERMISSION_DENIED') {
            update(userStatusRef, offlineStatus)
              .catch(updateError => console.error('Update also failed:', updateError))
          }
        })
    }

    // Set up disconnect handler
    window.addEventListener('beforeunload', handleDisconnect)

    return () => {
      console.log('Cleaning up Firebase listeners')
      // Set user as offline before cleanup
      handleDisconnect()
      window.removeEventListener('beforeunload', handleDisconnect)
      off(messagesRef)
      off(onlineUsersRef)
    }
  }, [session, status])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async (type: 'text' | 'image' | 'file' = 'text', fileUrl?: string) => {
    if (!session?.user) {
      console.error('No session user found')
      toast.error("Please log in to participate in the chat")
      return
    }

    if (type === 'text' && !newMessage.trim()) {
      console.log('Empty message, not sending')
      return
    }

    try {
      console.log('Sending message:', { type, content: newMessage, fileUrl })
      setIsLoading(true)
      
      const messageRef = ref(database, 'messages')
      const messageData = {
        content: type === 'text' ? newMessage : '',
        type,
        userId: session.user.id,
        username: session.user.username,
        profilePicture: session.user.profilePicture,
        timestamp: serverTimestamp(),
        fileUrl: fileUrl || null
      }

      await push(messageRef, messageData)
      console.log('Message sent successfully')
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error("Failed to send message")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!session?.user) {
      toast.error("Please log in to upload images")
      return
    }

    const isImage = file.type.startsWith('image/')
    if (!isImage) {
      toast.error('Please upload an image file.')
      return
    }

    try {
      setIsLoading(true)
      console.log('Uploading file:', file.name)
      
      const fileRef = storageRef(storage, `livechat/images/${session.user.id}/${Date.now()}`)
      await uploadBytes(fileRef, file)
      const fileUrl = await getDownloadURL(fileRef)
      
      console.log('File uploaded successfully:', fileUrl)
      await handleSendMessage('image', fileUrl)
    } catch (error) {
      console.error('Error uploading file:', error)
      toast.error('Failed to upload image')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle mouse down for resizing
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true)
    setStartY(e.clientY)
    setStartHeight(chatHeight)
    e.preventDefault()
  }

  // Handle touch start for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsResizing(true)
    setStartY(e.touches[0].clientY)
    setStartHeight(chatHeight)
  }

  // Quick resize buttons
  const increaseHeight = () => {
    setChatHeight((prev) => Math.min(prev + 50, maxHeight))
  }

  const decreaseHeight = () => {
    setChatHeight((prev) => Math.max(prev - 50, minHeight))
  }

  // Set up event listeners for resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return

      const deltaY = startY - e.clientY
      const newHeight = Math.max(minHeight, Math.min(maxHeight, startHeight + deltaY))
      setChatHeight(newHeight)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isResizing) return

      const deltaY = startY - e.touches[0].clientY
      const newHeight = Math.max(minHeight, Math.min(maxHeight, startHeight + deltaY))
      setChatHeight(newHeight)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    const handleTouchEnd = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.addEventListener("touchmove", handleTouchMove)
      document.addEventListener("touchend", handleTouchEnd)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isResizing, startY, startHeight, minHeight, maxHeight])

  if (status === 'loading') {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg">{liveChatTitle}</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (status !== 'authenticated') {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg">{liveChatTitle}</CardTitle>
          <CardDescription>{loginToChatText}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push('/login')} className="w-full">
            <LogIn className="mr-2 h-4 w-4" />
            Sign In
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`flex flex-col h-[600px] ${className}`}>
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Live Chat</h2>
        <div className="flex items-center gap-2 mt-2">
          <div className="text-sm text-muted-foreground">
            Online: {onlineUsers.length} {isLoading && '(Updating...)'}
            {status === 'authenticated' && onlineUsers.length === 0 && ' (You are online)'}
          </div>
          <div className="flex -space-x-2">
            {onlineUsers.slice(0, 5).map((user) => (
              <Avatar key={user.id} className="w-6 h-6 border-2 border-background">
                <AvatarImage src={user.profilePicture} />
                <AvatarFallback>{user?.username?.[0] || '?'}</AvatarFallback>
              </Avatar>
            ))}
            {onlineUsers.length > 5 && (
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                +{onlineUsers.length - 5}
              </div>
            )}
          </div>
        </div>
      </div>

      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.userId === session?.user?.id ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src={message.profilePicture} />
                <AvatarFallback>{message.username?.[0] || '?'}</AvatarFallback>
              </Avatar>
              <div
                className={`flex flex-col ${
                  message.userId === session?.user?.id ? 'items-end' : 'items-start'
                }`}
              >
                <div className="text-sm font-medium">{message.username}</div>
                {message.type === 'text' ? (
                  <div className="bg-muted rounded-lg px-3 py-2 max-w-[80%]">
                    {message.content}
                  </div>
                ) : (
                  <div className="max-w-[300px]">
                    <img
                      src={message.fileUrl}
                      alt="Uploaded content"
                      className="rounded-lg max-w-full h-auto"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage('text')}
            placeholder={typeMessageText}
            disabled={isLoading}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            disabled={isLoading}
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={isLoading}
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Button onClick={() => handleSendMessage('text')} disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
