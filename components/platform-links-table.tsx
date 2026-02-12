'use client'

import { useState, useEffect } from 'react'
import { Trash2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'

interface PlatformLink {
    id: string
    platform: string
    url: string
    contributor: {
        user: {
            username: string
        }
    }
    createdAt: string
}

export function PlatformLinksTable() {
    const [links, setLinks] = useState<PlatformLink[]>([])
    const [loading, setLoading] = useState(true)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedLink, setSelectedLink] = useState<PlatformLink | null>(null)

    const { toast } = useToast()

    useEffect(() => {
        fetchLinks()
    }, [])

    const fetchLinks = async () => {
        try {
            setLoading(true)
            const res = await fetch('/api/admin/platform-links')
            if (!res.ok) throw new Error('Failed to fetch platform links')

            const data = await res.json()
            setLinks(data)
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to load platform links',
                variant: 'destructive'
            })
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!selectedLink) return

        try {
            const res = await fetch(`/api/admin/platform-links?id=${selectedLink.id}`, {
                method: 'DELETE'
            })

            if (!res.ok) throw new Error('Failed to delete link')

            toast({
                title: 'Success',
                description: 'Platform link deleted successfully'
            })

            setDeleteDialogOpen(false)
            fetchLinks()
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to delete platform link',
                variant: 'destructive'
            })
        }
    }

    return (
        <div className="space-y-4">
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Contributor</TableHead>
                            <TableHead>Platform</TableHead>
                            <TableHead>URL</TableHead>
                            <TableHead>Added</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : links.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">
                                    No platform links found
                                </TableCell>
                            </TableRow>
                        ) : (
                            links.map((link) => (
                                <TableRow key={link.id}>
                                    <TableCell className="font-medium">
                                        {link.contributor.user.username}
                                    </TableCell>
                                    <TableCell>{link.platform}</TableCell>
                                    <TableCell>
                                        <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline flex items-center gap-1"
                                        >
                                            {link.url}
                                            <ExternalLink className="h-3 w-3" />
                                        </a>
                                    </TableCell>
                                    <TableCell>{new Date(link.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                setSelectedLink(link)
                                                setDeleteDialogOpen(true)
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Platform Link</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this link? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedLink && (
                        <div className="py-4">
                            <p className="text-sm">
                                <span className="font-medium">Platform:</span> {selectedLink.platform}
                            </p>
                            <p className="text-sm break-all">
                                <span className="font-medium">URL:</span> {selectedLink.url}
                            </p>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
