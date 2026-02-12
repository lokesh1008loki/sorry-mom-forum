'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Loader2, Megaphone, Trash2 } from 'lucide-react'
import { format } from 'date-fns'

type Announcement = {
    id: string
    message: string
    type: 'info' | 'warning' | 'error' | 'success'
    isActive: boolean
    expiresAt: string | null
    createdAt: string
}

export default function AdminAnnouncementsPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([])
    const [loading, setLoading] = useState(true)
    const [creating, setCreating] = useState(false)

    // Form
    const [message, setMessage] = useState('')
    const [type, setType] = useState('info')
    const [isActive, setIsActive] = useState(true)

    useEffect(() => {
        fetchAnnouncements()
    }, [])

    const fetchAnnouncements = async () => {
        try {
            const res = await fetch('/api/admin/announcements')
            if (res.ok) {
                const data = await res.json()
                setAnnouncements(data)
            }
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        setCreating(true)

        try {
            const res = await fetch('/api/admin/announcements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, type, isActive })
            })

            if (res.ok) {
                const newAnnouncement = await res.json()
                setAnnouncements([newAnnouncement, ...announcements])
                toast.success('Announcement created')
                setMessage('')
            } else {
                toast.error('Failed to create announcement')
            }
        } catch (error) {
            toast.error('Error creating announcement')
        } finally {
            setCreating(false)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
                <p className="text-muted-foreground">
                    Manage global system announcements and banners.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Create Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Create Announcement</CardTitle>
                        <CardDescription>Publish a new site-wide message.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="message">Message</Label>
                                <Input
                                    id="message"
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    placeholder="e.g. Scheduled maintenance at midnight..."
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="type">Type</Label>
                                <Select value={type} onValueChange={setType}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="info">Info (Blue)</SelectItem>
                                        <SelectItem value="success">Success (Green)</SelectItem>
                                        <SelectItem value="warning">Warning (Yellow)</SelectItem>
                                        <SelectItem value="error">Error (Red)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Active Immediately</Label>
                                </div>
                                <Switch
                                    checked={isActive}
                                    onCheckedChange={setIsActive}
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={creating}>
                                {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Publish Announcement
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* List */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Active Announcements</h3>
                    {loading ? (
                        <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin" /></div>
                    ) : announcements.length === 0 ? (
                        <p className="text-muted-foreground text-sm">No announcements found.</p>
                    ) : (
                        announcements.map((announcement) => (
                            <Card key={announcement.id} className={!announcement.isActive ? 'opacity-60' : ''}>
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <div className="flex gap-2 items-center">
                                            <Megaphone className="h-4 w-4" />
                                            <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${announcement.type === 'error' ? 'bg-red-100 text-red-800' :
                                                    announcement.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                                                        announcement.type === 'success' ? 'bg-green-100 text-green-800' :
                                                            'bg-blue-100 text-blue-800'
                                                }`}>
                                                {announcement.type}
                                            </span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">{format(new Date(announcement.createdAt), 'MMM d, yyyy')}</span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm">{announcement.message}</p>
                                    <div className="mt-2 text-xs text-muted-foreground">
                                        Status: {announcement.isActive ? 'Active' : 'Inactive'}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
