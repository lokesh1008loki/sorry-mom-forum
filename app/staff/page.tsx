'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users2, Shield, Code, Headphones } from 'lucide-react'

interface StaffMember {
  id: string
  role: string
  department?: string
  user: {
    username: string
    profilePicture?: string
  }
}

type GroupedStaff = Record<string, StaffMember[]>

export default function PublicStaffPage() {
  const [staff, setStaff] = useState<GroupedStaff>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStaff()
  }, [])

  const fetchStaff = async () => {
    try {
      const res = await fetch('/api/public/staff')
      if (res.ok) {
        const data = await res.json()
        setStaff(data)
      }
    } catch (error) {
      console.error('Error fetching staff:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-5 w-5" />
      case 'moderator':
        return <Users2 className="h-5 w-5" />
      case 'developer':
        return <Code className="h-5 w-5" />
      case 'support':
        return <Headphones className="h-5 w-5" />
      default:
        return <Users2 className="h-5 w-5" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-500'
      case 'moderator':
        return 'bg-blue-500'
      case 'developer':
        return 'bg-green-500'
      case 'support':
        return 'bg-orange-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getRoleTitle = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1) + 's'
  }

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading staff directory...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Meet Our Team</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Our dedicated staff members work hard to keep the Sorry Mom Forum running smoothly and safely.
        </p>
      </div>

      <div className="space-y-8">
        {Object.keys(staff).length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No staff members to display</p>
            </CardContent>
          </Card>
        ) : (
          Object.entries(staff).map(([role, members]) => (
            <Card key={role}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getRoleColor(role)}`}>
                    {getRoleIcon(role)}
                  </div>
                  <div>
                    <CardTitle>{getRoleTitle(role)}</CardTitle>
                    <CardDescription>
                      {members.length} {members.length === 1 ? 'member' : 'members'}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        {member.user.profilePicture ? (
                          <img
                            src={member.user.profilePicture}
                            alt={member.user.username}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-xl font-bold">
                            {member.user.username.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{member.user.username}</p>
                        {member.department && (
                          <p className="text-sm text-muted-foreground">
                            {member.department}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}