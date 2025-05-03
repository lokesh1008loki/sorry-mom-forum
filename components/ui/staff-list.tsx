"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/contexts/language-context"

interface StaffMember {
  id: string
  username: string
  avatar: string
  role: string
  responsibilities: string[]
  joinDate: string
  contact?: string
}

export function StaffList() {
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)

  const adminText = useTranslation("admin")
  const moderatorText = useTranslation("moderator")
  const developerText = useTranslation("developer")
  const supportText = useTranslation("support")

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchStaff = async () => {
      try {
        // Mock data for now
        const mockStaff: StaffMember[] = [
          {
            id: "1",
            username: "AdminUser",
            avatar: "/avatars/admin.png",
            role: "Administrator",
            responsibilities: [
              "Overall forum management",
              "Staff coordination",
              "Policy enforcement",
              "User management"
            ],
            joinDate: "2023-01-01",
            contact: "admin@forum.com"
          },
          {
            id: "2",
            username: "ModUser",
            avatar: "/avatars/mod.png",
            role: "Moderator",
            responsibilities: [
              "Content moderation",
              "User support",
              "Rule enforcement",
              "Spam prevention"
            ],
            joinDate: "2023-03-15"
          },
          {
            id: "3",
            username: "DevUser",
            avatar: "/avatars/dev.png",
            role: "Developer",
            responsibilities: [
              "Forum maintenance",
              "Feature development",
              "Bug fixes",
              "Technical support"
            ],
            joinDate: "2023-02-01"
          },
          {
            id: "4",
            username: "SupportUser",
            avatar: "/avatars/support.png",
            role: "Support Staff",
            responsibilities: [
              "User assistance",
              "Ticket management",
              "FAQ maintenance",
              "Community guidance"
            ],
            joinDate: "2023-04-01"
          }
        ]
        setStaff(mockStaff)
      } catch (error) {
        console.error("Error fetching staff:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStaff()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {staff.map((member: StaffMember) => (
        <Card key={member.id} className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={member.avatar} alt={member.username} />
                <AvatarFallback>
                  {member.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">{member.username}</CardTitle>
                <p className="text-sm text-muted-foreground">{member.role}</p>
                <p className="text-xs text-muted-foreground">
                  Joined: {new Date(member.joinDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h4 className="font-medium">Responsibilities:</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                {member.responsibilities.map((resp: string, index: number) => (
                  <li key={index}>{resp}</li>
                ))}
              </ul>
              {member.contact && (
                <div className="mt-4">
                  <h4 className="font-medium">Contact:</h4>
                  <p className="text-sm text-muted-foreground">{member.contact}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 