'use client'

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useTranslation } from "@/contexts/language-context"
import { MessageSquare, Send, ChevronUp, ChevronDown, ExternalLink } from "lucide-react"
import Link from "next/link"

interface Message {
  id: number
  user: string
  avatar: string
  message: string
  time: string
  isModerator?: boolean
  isYou?: boolean
}

interface LiveChatProps {
  className?: string
  fullPage?: boolean
}

export function LiveChat({ className, fullPage = false }: LiveChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      user: "User123",
      avatar: "/diverse-avatars.png",
      message: "Hello everyone! Anyone here?",
      time: "2m ago",
    },
    {
      id: 2,
      user: "Moderator",
      avatar: "/diverse-group-avatars.png",
      message: "Welcome to the chat! Please keep it friendly.",
      time: "1m ago",
      isModerator: true,
    },
    {
      id: 3,
      user: "NewUser",
      avatar: "/diverse-group-avatars.png",
      message: "I'm new here. How does this forum work?",
      time: "Just now",
    },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [chatHeight, setChatHeight] = useState(fullPage ? 500 : 180) // Default height in pixels
  const [isResizing, setIsResizing] = useState(false)
  const [startY, setStartY] = useState(0)
  const [startHeight, setStartHeight] = useState(0)
  const resizeRef = useRef<HTMLDivElement>(null)
  const minHeight = fullPage ? 300 : 100 // Minimum chat height
  const maxHeight = fullPage ? 800 : 500 // Maximum chat height

  // Use translations
  const liveChatTitle = useTranslation("live_chat")
  const onlineUsersDesc = useTranslation("online_users_desc")
  const sendMessageText = useTranslation("send_message")
  const typeMessageText = useTranslation("type_message")
  const resizeChatText = useTranslation("resize_chat")
  const openInNewPageText = "Open in new page"

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          user: "You",
          avatar: "/avatar-you.png",
          message: newMessage,
          time: "Just now",
          isYou: true,
        },
      ])
      setNewMessage("")
    }
  }

  // Handle mouse down for resizing
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true)
    setStartY(e.clientY)
    setStartHeight(chatHeight)
    e.preventDefault() // Prevent text selection during resize
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

  // Add more messages for the full page view
  useEffect(() => {
    if (fullPage) {
      // Add more mock messages for the full page view
      const additionalMessages = [
        {
          id: 4,
          user: "ForumFan",
          avatar: "/diverse-avatars.png",
          message: "Has anyone seen the new content in the VIP section?",
          time: "5m ago",
        },
        {
          id: 5,
          user: "ContentCreator",
          avatar: "/diverse-group-avatars.png",
          message: "I just uploaded some new videos in the Desi section, check them out!",
          time: "7m ago",
        },
        {
          id: 6,
          user: "TechGuru",
          avatar: "/diverse-avatars.png",
          message: "Is the download speed better now? We made some server upgrades.",
          time: "10m ago",
        },
        {
          id: 7,
          user: "Moderator2",
          avatar: "/diverse-group-avatars.png",
          message: "Remember to report any broken links or issues with content.",
          time: "12m ago",
          isModerator: true,
        },
      ]

      setMessages((prev) => [...prev, ...additionalMessages])
    }
  }, [fullPage])

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        {!fullPage && (
          <div className="flex justify-end mb-2">
            <Link href="/live-chat" target="_blank" passHref>
              <Button variant="outline" size="sm" className="h-8 whitespace-nowrap">
                <ExternalLink className="h-4 w-4 mr-1" />
                {openInNewPageText}
              </Button>
            </Link>
          </div>
        )}
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              {liveChatTitle}
            </CardTitle>
            <CardDescription>{onlineUsersDesc} (24)</CardDescription>
          </div>
          <div className="flex -space-x-2 overflow-hidden max-w-[120px]">
              {[1, 2, 3].map((i) => (
              <Avatar key={i} className="h-6 w-6 border-2 border-background flex-shrink-0">
                  <AvatarImage src={`/abstract-geometric-shapes.png?height=24&width=24&query=user${i}`} />
                  <AvatarFallback>U{i}</AvatarFallback>
                </Avatar>
              ))}
            <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs border-2 border-background flex-shrink-0">
                +21
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <ScrollArea className={`pr-4 mb-4`} style={{ height: `${chatHeight}px` }}>
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-2 ${msg.isYou ? "justify-end" : "justify-start"}`}>
                  {!msg.isYou && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={msg.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{msg.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-lg px-3 py-2 max-w-[80%] text-sm flex-shrink-1 ${
                      msg.isYou
                        ? "bg-primary text-primary-foreground"
                        : msg.isModerator
                          ? "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
                          : "bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-1 min-w-0">
                      <span className="font-medium text-xs truncate">
                        {msg.user}
                        {msg.isModerator && (
                          <span className="ml-1 text-[10px] bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 px-1 rounded">
                            MOD
                          </span>
                        )}
                      </span>
                      <span className="text-[10px] opacity-70 ml-auto whitespace-nowrap">{msg.time}</span>
                    </div>
                    <p className="break-words">{msg.message}</p>
                  </div>
                  {msg.isYou && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={msg.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{msg.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Resize handle */}
          <div
            ref={resizeRef}
            className="absolute bottom-0 left-0 right-0 h-4 cursor-ns-resize flex items-center justify-center bg-muted/50 hover:bg-muted rounded-md -mb-2 group"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            aria-label={resizeChatText}
          >
            <div className="w-10 h-1 bg-muted-foreground/30 group-hover:bg-muted-foreground/60 rounded-full"></div>
          </div>

          {/* Resize buttons */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-1 -mr-10">
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6"
              onClick={increaseHeight}
              disabled={chatHeight >= maxHeight}
              title={useTranslation("increase_height")}
            >
              <ChevronUp className="h-3 w-3" />
              <span className="sr-only">{useTranslation("increase_height")}</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6"
              onClick={decreaseHeight}
              disabled={chatHeight <= minHeight}
              title={useTranslation("decrease_height")}
            >
              <ChevronDown className="h-3 w-3" />
              <span className="sr-only">{useTranslation("decrease_height")}</span>
            </Button>
          </div>
        </div>

        <form onSubmit={handleSendMessage} className="flex gap-2 mt-6">
          <Input
            placeholder={typeMessageText}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="sm">
            <Send className="h-4 w-4 mr-1" />
            <span className="sr-only">{sendMessageText}</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
