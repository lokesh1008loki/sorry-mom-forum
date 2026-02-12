'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { CheckCircle, XCircle, Eye } from 'lucide-react'

interface Content {
    id: string
    title: string
    description?: string
    contentType: string
    contentUrl?: string
    body?: string
    status: string
    contributor: {
        user: {
            username: string
            email: string
        }
    }
    createdAt: string
}

export function ModerationQueue() {
    const [contents, setContents] = useState<Content[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedContent, setSelectedContent] = useState<Content | null>(null)
    const [previewOpen, setPreviewOpen] = useState(false)
    const [actionDialog, setActionDialog] = useState<{ open: boolean, type: 'approve' | 'reject' | null }>({
        open: false,
        type: null
    })
    const [rejectionReason, setRejectionReason] = useState('')
    const [processing, setProcessing] = useState(false)
    const { toast } = useToast()

    useEffect(() => {
        fetchQueue()
    }, [])

    const fetchQueue = async () => {
        try {
            setLoading(true)
            const res = await fetch('/api/moderation/content?status=Pending')

            if (!res.ok) throw new Error('Failed to fetch moderation queue')

            const data = await res.json()
            setContents(data)
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to load moderation queue',
                variant: 'destructive'
            })
        } finally {
            setLoading(false)
        }
    }

    const handlePreview = (content: Content) => {
        setSelectedContent(content)
        setPreviewOpen(true)
    }

    const handleAction = (content: Content, type: 'approve' | 'reject') => {
        setSelectedContent(content)
        setActionDialog({ open: true, type })
        setRejectionReason('')
    }

    const confirmAction = async () => {
        if (!selectedContent || !actionDialog.type) return

        setProcessing(true)

        try {
            const res = await fetch(`/api/moderation/content/${selectedContent.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: actionDialog.type === 'approve' ? 'Approved' : 'Rejected',
                    ...(actionDialog.type === 'reject' && { rejectionReason })
                })
            })

            if (!res.ok) throw new Error('Failed to update content')

            toast({
                title: 'Success',
                description: `Content ${actionDialog.type === 'approve' ? 'approved' : 'rejected'} successfully`
            })

            setActionDialog({ open: false, type: null })
            fetchQueue() // Refresh the queue
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update content',
                variant: 'destructive'
            })
        } finally {
            setProcessing(false)
        }
    }

    return (
        <div className="space-y-4">
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Contributor</TableHead>
                            <TableHead>Submitted</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : contents.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground">
                                    No pending content to review
                                </TableCell>
                            </TableRow>
                        ) : (
                            contents.map((content) => (
                                <TableRow key={content.id}>
                                    <TableCell className="font-medium max-w-xs truncate">
                                        {content.title}
                                    </TableCell>
                                    <TableCell className="capitalize">{content.contentType}</TableCell>
                                    <TableCell>{content.contributor.user.username}</TableCell>
                                    <TableCell>{new Date(content.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handlePreview(content)}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="default"
                                                onClick={() => handleAction(content, 'approve')}
                                            >
                                                <CheckCircle className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleAction(content, 'reject')}
                                            >
                                                <XCircle className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Preview Dialog */}
            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{selectedContent?.title}</DialogTitle>
                        <DialogDescription>
                            By {selectedContent?.contributor.user.username} • {selectedContent?.contentType}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        {selectedContent?.description && (
                            <div>
                                <h4 className="font-semibold mb-2">Description</h4>
                                <p className="text-sm text-muted-foreground">{selectedContent.description}</p>
                            </div>
                        )}
                        {selectedContent?.contentUrl && (
                            <div>
                                <h4 className="font-semibold mb-2">Content URL</h4>
                                <a href={selectedContent.contentUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
                                    {selectedContent.contentUrl}
                                </a>
                            </div>
                        )}
                        {selectedContent?.body && (
                            <div>
                                <h4 className="font-semibold mb-2">Content</h4>
                                <div className="p-4 bg-muted rounded-md text-sm whitespace-pre-wrap">
                                    {selectedContent.body}
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Action Confirmation Dialog */}
            <Dialog open={actionDialog.open} onOpenChange={(open) => setActionDialog({ ...actionDialog, open })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {actionDialog.type === 'approve' ? 'Approve Content' : 'Reject Content'}
                        </DialogTitle>
                        <DialogDescription>
                            {actionDialog.type === 'approve'
                                ? 'This content will be published and visible to all users.'
                                : 'This content will be rejected and the contributor will be notified.'}
                        </DialogDescription>
                    </DialogHeader>
                    {actionDialog.type === 'reject' && (
                        <div>
                            <Label htmlFor="reason">Reason for Rejection *</Label>
                            <Textarea
                                id="reason"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Please provide a reason..."
                                rows={4}
                            />
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setActionDialog({ open: false, type: null })}>
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmAction}
                            disabled={processing || (actionDialog.type === 'reject' && !rejectionReason)}
                            variant={actionDialog.type === 'approve' ? 'default' : 'destructive'}
                        >
                            {processing ? 'Processing...' : actionDialog.type === 'approve' ? 'Approve' : 'Reject'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
