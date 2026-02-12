'use client'

import { useState, useEffect } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { FileText, ChevronLeft, ChevronRight } from 'lucide-react'

interface ActivityLog {
    id: string
    action: string
    entityType?: string
    entityId?: string
    metadata?: Record<string, any>
    ipAddress?: string
    createdAt: string
    user?: {
        username: string
        email: string
    }
}

interface PaginatedResponse {
    logs: ActivityLog[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

export default function ActivityLogsPage() {
    const [logs, setLogs] = useState<ActivityLog[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<string>('all')
    const [page, setPage] = useState(1)
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 50,
        total: 0,
        totalPages: 1
    })

    useEffect(() => {
        fetchLogs()
    }, [filter, page])

    const fetchLogs = async () => {
        try {
            setLoading(true)
            let url = `/api/admin/activity-logs?page=${page}&limit=50`

            if (filter !== 'all') {
                url += `&action=${filter}`
            }

            const res = await fetch(url)

            if (!res.ok) throw new Error('Failed to fetch logs')

            const data: PaginatedResponse = await res.json()
            setLogs(data.logs)
            setPagination(data.pagination)
        } catch (error) {
            console.error('Error fetching logs:', error)
        } finally {
            setLoading(false)
        }
    }

    const getActionBadge = (action: string) => {
        const colors: Record<string, string> = {
            LOGIN: 'bg-green-500',
            LOGOUT: 'bg-gray-500',
            CREATE_STAFF: 'bg-blue-500',
            DELETE_STAFF: 'bg-red-500',
            APPROVE_CONTENT: 'bg-green-500',
            REJECT_CONTENT: 'bg-red-500',
            CREATE_CONTENT: 'bg-blue-500',
            APPROVE_CONTRIBUTOR: 'bg-green-500',
            REJECT_CONTRIBUTOR: 'bg-red-500',
        }

        return (
            <Badge className={colors[action] || 'bg-gray-500'}>
                {action.replace(/_/g, ' ')}
            </Badge>
        )
    }

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Activity Logs</h1>
                    <p className="text-muted-foreground">
                        Track all user actions and system events
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Select value={filter} onValueChange={setFilter}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Filter by action" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Actions</SelectItem>
                            <SelectItem value="LOGIN">Logins</SelectItem>
                            <SelectItem value="LOGOUT">Logouts</SelectItem>
                            <SelectItem value="CREATE_STAFF">Create Staff</SelectItem>
                            <SelectItem value="DELETE_STAFF">Delete Staff</SelectItem>
                            <SelectItem value="APPROVE_CONTENT">Approve Content</SelectItem>
                            <SelectItem value="REJECT_CONTENT">Reject Content</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                        Showing {pagination.total} total activities
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Entity</TableHead>
                                    <TableHead>IP Address</TableHead>
                                    <TableHead>Timestamp</TableHead>
                                    <TableHead>Details</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center">
                                            Loading logs...
                                        </TableCell>
                                    </TableRow>
                                ) : logs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                                            No activity logs found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    logs.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell>
                                                {log.user ? (
                                                    <div>
                                                        <p className="font-medium">{log.user.username}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {log.user.email}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground">System</span>
                                                )}
                                            </TableCell>
                                            <TableCell>{getActionBadge(log.action)}</TableCell>
                                            <TableCell>
                                                {log.entityType ? (
                                                    <span className="text-sm">
                                                        {log.entityType}
                                                    </span>
                                                ) : (
                                                    '-'
                                                )}
                                            </TableCell>
                                            <TableCell className="font-mono text-xs">
                                                {log.ipAddress || '-'}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {formatDate(log.createdAt)}
                                            </TableCell>
                                            <TableCell>
                                                {log.metadata && Object.keys(log.metadata).length > 0 ? (
                                                    <details className="cursor-pointer">
                                                        <summary className="text-xs text-blue-500 hover:underline">
                                                            View
                                                        </summary>
                                                        <pre className="mt-2 text-xs bg-muted p-2 rounded max-w-xs overflow-auto">
                                                            {JSON.stringify(log.metadata, null, 2)}
                                                        </pre>
                                                    </details>
                                                ) : (
                                                    '-'
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-4">
                        <p className="text-sm text-muted-foreground">
                            Page {pagination.page} of {pagination.totalPages}
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => p + 1)}
                                disabled={page >= pagination.totalPages}
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
