'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Loader2, Plus, Trophy } from 'lucide-react'

type Badge = {
    id: string
    name: string
    description: string | null
    iconUrl: string
    criteria: string | null
    _count: {
        users: number
    }
}

export default function AdminGamificationPage() {
    const [badges, setBadges] = useState<Badge[]>([])
    const [loading, setLoading] = useState(true)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [creating, setCreating] = useState(false)

    // Form state
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [iconUrl, setIconUrl] = useState('')
    const [criteria, setCriteria] = useState('')

    useEffect(() => {
        fetchBadges()
    }, [])

    const fetchBadges = async () => {
        try {
            const res = await fetch('/api/admin/badges')
            if (res.ok) {
                const data = await res.json()
                setBadges(data)
            }
        } catch (error) {
            toast.error('Error loading badges')
        } finally {
            setLoading(false)
        }
    }

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        setCreating(true)

        try {
            const res = await fetch('/api/admin/badges', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description, iconUrl, criteria })
            })

            if (res.ok) {
                const newBadge = await res.json()
                setBadges([newBadge, ...badges])
                setIsCreateOpen(false)
                toast.success('Badge created successfully')
                // Reset form
                setName('')
                setDescription('')
                setIconUrl('')
                setCriteria('')
            } else {
                const err = await res.json()
                toast.error(err.error || 'Failed to create badge')
            }
        } catch (error) {
            toast.error('Error creating badge')
        } finally {
            setCreating(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gamification</h1>
                    <p className="text-muted-foreground">
                        Manage badges and reputation settings.
                    </p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Badge
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Badge</DialogTitle>
                            <DialogDescription>
                                Add a new achievement badge for users to earn.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Badge Name</Label>
                                <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="iconUrl">Icon URL</Label>
                                <Input id="iconUrl" value={iconUrl} onChange={e => setIconUrl(e.target.value)} placeholder="https://..." required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="criteria">Criteria (Internal Note)</Label>
                                <Input id="criteria" value={criteria} onChange={e => setCriteria(e.target.value)} placeholder="e.g. 100 Posts" />
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={creating}>
                                    {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Create Badge
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {badges.map((badge) => (
                    <Card key={badge.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {badge.name}
                            </CardTitle>
                            <Trophy className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-center py-4">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={badge.iconUrl} alt={badge.name} className="h-16 w-16 object-contain" />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {badge.description}
                            </p>
                            <div className="mt-4 text-xs font-bold">
                                Awarded to: {badge._count?.users || 0} users
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
