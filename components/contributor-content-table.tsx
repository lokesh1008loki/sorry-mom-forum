'use client'

import { useState, useEffect } from 'react'
import { Eye, DollarSign, ThumbsUp } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'

interface Content {
    id: string
    title: string
    contentType: string
    status: string
    views: number
    likes: number
    earnings: number
    verifier?: {
        username: string
    }
    createdAt: string
    verificationDate?: string
    rejectionReason?: string
}

export function ContributorContentTable() {
    const [contents, setContents] = useState<Content[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<string>('')
    const { toast } = useToast()

    useEffect(() => {
        fetchContents()
    }, [filter])

    const fetchContents = async () => {
        try {
            setLoading(true)
            const url = filter ? `/api/contributor/content?status=${filter}` : '/api/contributor/content'
            const res = await fetch(url)

            if (!res.ok) throw new Error('Failed to fetch content')

            const data = await res.json()
            setContents(data)
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to load content',
                variant: 'destructive'
            })
        } finally {
            setLoading(false)
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Approved':
                return <Badge className="bg-green-500">Approved</Badge>
            case 'Rejected':
                return <Badge variant="destructive">Rejected</Badge>
            case 'Pending':
                return <Badge variant="secondary">Pending Review</Badge>
            default:
                return <Badge>{status}</Badge>
        }
    }

    return (
        <div className="space-y-4">
            <Tabs value={filter} onValueChange={setFilter}>
                <TabsList>
                    <TabsTrigger value="">All</TabsTrigger>
                    <TabsTrigger value="Pending">Pending</TabsTrigger>
                    <TabsTrigger value="Approved">Approved</TabsTrigger>
                    <TabsTrigger value="Rejected">Rejected</TabsTrigger>
                </TabsList>

                <TabsContent value={filter} className="mt-4">
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Views</TableHead>
                                    <TableHead>Likes</TableHead>
                                    <TableHead>Earnings</TableHead>
                                    <TableHead>Uploaded</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center">
                                            Loading...
                                        </TableCell>
                                    </TableRow>
                                ) : contents.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center">
                                            No content found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    contents.map((content) => (
                                        <TableRow key={content.id}>
                                            <TableCell className="font-medium max-w-xs truncate">
                                                {content.title}
                                            </TableCell>
                                            <TableCell className="capitalize">{content.contentType}</TableCell>
                                            <TableCell>{getStatusBadge(content.status)}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                                    {content.views.toLocaleString()}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                                                    {content.likes.toLocaleString()}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                                    {content.earnings.toFixed(2)}
                                                </div>
                                            </TableCell>
                                            <TableCell>{new Date(content.createdAt).toLocaleDateString()}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {contents.filter(c => c.status === 'Rejected' && c.rejectionReason).length > 0 && (
                        <div className="mt-4 space-y-2">
                            <h3 className="font-semibold">Rejection Reasons:</h3>
                            {contents.filter(c => c.status === 'Rejected' && c.rejectionReason).map((content) => (
                                <div key={content.id} className="p-3 border rounded-md bg-destructive/5">
                                    <p className="  font-medium text-sm">{content.title}</p>
                                    <p className="text-sm text-muted-foreground">{content.rejectionReason}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}
