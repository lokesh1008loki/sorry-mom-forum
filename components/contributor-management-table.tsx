'use client'

import { useState, useEffect } from 'react'
import {
    CheckCircle,
    XCircle,
    Clock
} from 'lucide-react'
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
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'

interface Contributor {
    id: string
    status: string
    bio: string | null
    telegramId: string | null
    contributionCount: number
    user: {
        username: string
        email: string
    }
    platformLinks: Array<{
        platform: string
        url: string
    }>
    createdAt: string
}

export function ContributorManagementTable() {
    const [contributors, setContributors] = useState<Contributor[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<string>('Pending')

    const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
    const [selectedContributor, setSelectedContributor] = useState<Contributor | null>(null)

    const { toast } = useToast()

    useEffect(() => {
        fetchContributors()
    }, [filter])

    const fetchContributors = async () => {
        try {
            setLoading(true)
            const res = await fetch(`/api/admin/contributors?status=${filter}`)
            if (!res.ok) throw new Error('Failed to fetch contributors')

            const data = await res.json()
            setContributors(data)
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to load contributors',
                variant: 'destructive'
            })
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateStatus = async (contributorId: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/admin/contributors/${contributorId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            })

            if (!res.ok) throw new Error('Failed to update contributor')

            toast({
                title: 'Success',
                description: `Contributor ${newStatus.toLowerCase()} successfully`
            })

            setReviewDialogOpen(false)
            fetchContributors()
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update contributor',
                variant: 'destructive'
            })
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Approved':
                return <Badge className="bg-green-500">Approved</Badge>
            case 'Rejected':
                return <Badge variant="destructive">Rejected</Badge>
            case 'Pending':
                return <Badge variant="secondary">Pending</Badge>
            default:
                return <Badge>{status}</Badge>
        }
    }

    return (
        <div className="space-y-4">
            <Tabs value={filter} onValueChange={setFilter}>
                <TabsList>
                    <TabsTrigger value="Pending">
                        <Clock className="h-4 w-4 mr-2" />
                        Pending
                    </TabsTrigger>
                    <TabsTrigger value="Approved">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approved
                    </TabsTrigger>
                    <TabsTrigger value="Rejected">
                        <XCircle className="h-4 w-4 mr-2" />
                        Rejected
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={filter} className="mt-4">
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Username</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Telegram ID</TableHead>
                                    <TableHead>Contributions</TableHead>
                                    <TableHead>Platform Links</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Applied</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center">
                                            Loading...
                                        </TableCell>
                                    </TableRow>
                                ) : contributors.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center">
                                            No contributors found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    contributors.map((contributor) => (
                                        <TableRow key={contributor.id}>
                                            <TableCell className="font-medium">{contributor.user.username}</TableCell>
                                            <TableCell>{contributor.user.email}</TableCell>
                                            <TableCell>{contributor.telegramId || 'N/A'}</TableCell>
                                            <TableCell>{contributor.contributionCount}</TableCell>
                                            <TableCell>{contributor.platformLinks.length}</TableCell>
                                            <TableCell>{getStatusBadge(contributor.status)}</TableCell>
                                            <TableCell>{new Date(contributor.createdAt).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedContributor(contributor)
                                                        setReviewDialogOpen(true)
                                                    }}
                                                >
                                                    Review
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Review Dialog */}
            <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Review Contributor Application</DialogTitle>
                        <DialogDescription>
                            @{selectedContributor?.user.username}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedContributor && (
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold mb-2">Bio</h4>
                                <p className="text-sm text-muted-foreground">
                                    {selectedContributor.bio || 'No bio provided'}
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-2">Platform Links</h4>
                                {selectedContributor.platformLinks.length > 0 ? (
                                    <ul className="space-y-2">
                                        {selectedContributor.platformLinks.map((link, idx) => (
                                            <li key={idx} className="text-sm">
                                                <span className="font-medium">{link.platform}:</span>{' '}
                                                <a
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:underline"
                                                >
                                                    {link.url}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-muted-foreground">No platform links</p>
                                )}
                            </div>

                            <div>
                                <h4 className="font-semibold mb-2">Contact</h4>
                                <p className="text-sm">
                                    <span className="font-medium">Email:</span> {selectedContributor.user.email}
                                </p>
                                {selectedContributor.telegramId && (
                                    <p className="text-sm">
                                        <span className="font-medium">Telegram:</span> {selectedContributor.telegramId}
                                    </p>
                                )}
                            </div>

                            <div>
                                <h4 className="font-semibold mb-2">Current Status</h4>
                                {getStatusBadge(selectedContributor.status)}
                            </div>
                        </div>
                    )}

                    <DialogFooter className="gap-2">
                        {selectedContributor?.status === 'Pending' && (
                            <>
                                <Button
                                    variant="destructive"
                                    onClick={() => handleUpdateStatus(selectedContributor.id, 'Rejected')}
                                >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Reject
                                </Button>
                                <Button
                                    onClick={() => handleUpdateStatus(selectedContributor.id, 'Approved')}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Approve
                                </Button>
                            </>
                        )}
                        {selectedContributor?.status === 'Approved' && (
                            <Button
                                variant="destructive"
                                onClick={() => handleUpdateStatus(selectedContributor.id, 'Rejected')}
                            >
                                Revoke Approval
                            </Button>
                        )}
                        {selectedContributor?.status === 'Rejected' && (
                            <Button
                                onClick={() => handleUpdateStatus(selectedContributor.id, 'Approved')}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                Approve Now
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
