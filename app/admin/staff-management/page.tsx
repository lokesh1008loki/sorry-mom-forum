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
import { StaffCreationDialog } from '@/components/staff-creation-dialog'
import { useToast } from '@/hooks/use-toast'
import { UserPlus, Pencil, Trash2 } from 'lucide-react'

interface StaffMember {
    id: string
    role: string
    department?: string
    status: string
    createdAt: string
    user: {
        username: string
        email: string
        profilePicture?: string
    }
}

export default function StaffManagementPage() {
    const [staff, setStaff] = useState<StaffMember[]>([])
    const [loading, setLoading] = useState(true)
    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const { toast } = useToast()

    useEffect(() => {
        fetchStaff()
    }, [])

    const fetchStaff = async () => {
        try {
            setLoading(true)
            const res = await fetch('/api/admin/staff')

            if (!res.ok) throw new Error('Failed to fetch staff')

            const data = await res.json()
            setStaff(data)
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to load staff members',
                variant: 'destructive'
            })
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to remove this staff member?')) {
            return
        }

        try {
            const res = await fetch(`/api/admin/staff/${id}`, {
                method: 'DELETE'
            })

            if (!res.ok) throw new Error('Failed to delete staff member')

            toast({
                title: 'Success',
                description: 'Staff member removed successfully'
            })

            fetchStaff()
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to remove staff member',
                variant: 'destructive'
            })
        }
    }

    const getRoleBadge = (role: string) => {
        const colors: Record<string, string> = {
            admin: 'bg-purple-500',
            moderator: 'bg-blue-500',
            developer: 'bg-green-500',
            support: 'bg-orange-500'
        }

        return (
            <Badge className={colors[role] || 'bg-gray-500'}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
            </Badge>
        )
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Active':
                return <Badge className="bg-green-500">Active</Badge>
            case 'Suspended':
                return <Badge variant="destructive">Suspended</Badge>
            case 'Inactive':
                return <Badge variant="secondary">Inactive</Badge>
            default:
                return <Badge>{status}</Badge>
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Staff Management</h1>
                    <p className="text-muted-foreground">
                        Manage staff members and their roles
                    </p>
                </div>
                <Button onClick={() => setCreateDialogOpen(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create Staff Member
                </Button>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Username</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : staff.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center text-muted-foreground">
                                    No staff members found. Create your first staff member!
                                </TableCell>
                            </TableRow>
                        ) : (
                            staff.map((member) => (
                                <TableRow key={member.id}>
                                    <TableCell className="font-medium">
                                        {member.user.username}
                                    </TableCell>
                                    <TableCell>{member.user.email}</TableCell>
                                    <TableCell>{getRoleBadge(member.role)}</TableCell>
                                    <TableCell>{member.department || '-'}</TableCell>
                                    <TableCell>{getStatusBadge(member.status)}</TableCell>
                                    <TableCell>
                                        {new Date(member.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleDelete(member.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <StaffCreationDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                onSuccess={fetchStaff}
            />
        </div>
    )
}
