'use client'

import { useState, useEffect } from 'react'
import {
    MoreHorizontal,
    Pencil,
    Trash2,
    Key,
    Search
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'

interface User {
    id: string
    username: string
    email: string
    isContributor: boolean
    isAdmin: boolean
    isPartner: boolean
    role: string
    createdAt: string
}

export function UserManagementTable() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)

    const [editForm, setEditForm] = useState({ username: '', email: '', isContributor: false, isAdmin: false, isPartner: false, role: 'user' })
    const [newPassword, setNewPassword] = useState('')

    const { toast } = useToast()

    useEffect(() => {
        fetchUsers()
    }, [page, search])

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const res = await fetch(`/api/admin/users?page=${page}&limit=10&search=${search}`)
            if (!res.ok) throw new Error('Failed to fetch users')

            const data = await res.json()
            setUsers(data.users)
            setTotalPages(data.pagination.totalPages)
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to load users',
                variant: 'destructive'
            })
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (user: User) => {
        setSelectedUser(user)
        setEditForm({
            username: user.username,
            email: user.email,
            isContributor: user.isContributor,
            isAdmin: user.isAdmin,
            isPartner: user.isPartner,
            role: user.role
        })
        setEditDialogOpen(true)
    }

    const handleSaveEdit = async () => {
        if (!selectedUser) return

        try {
            const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm)
            })

            if (!res.ok) throw new Error('Failed to update user')

            toast({
                title: 'Success',
                description: 'User updated successfully'
            })

            setEditDialogOpen(false)
            fetchUsers()
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update user',
                variant: 'destructive'
            })
        }
    }

    const handleResetPassword = async () => {
        if (!selectedUser || !newPassword) return

        try {
            const res = await fetch(`/api/admin/users/${selectedUser.id}/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: newPassword })
            })

            if (!res.ok) throw new Error('Failed to reset password')

            toast({
                title: 'Success',
                description: 'Password reset successfully'
            })

            setPasswordDialogOpen(false)
            setNewPassword('')
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to reset password',
                variant: 'destructive'
            })
        }
    }

    const handleDelete = async () => {
        if (!selectedUser) return

        try {
            const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
                method: 'DELETE'
            })

            if (!res.ok) throw new Error('Failed to delete user')

            toast({
                title: 'Success',
                description: 'User deleted successfully'
            })

            setDeleteDialogOpen(false)
            fetchUsers()
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to delete user',
                variant: 'destructive'
            })
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value)
                            setPage(1)
                        }}
                        className="pl-8"
                    />
                </div>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Username</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Contributor</TableHead>
                            <TableHead>Partner</TableHead>
                            <TableHead>Admin</TableHead>
                            <TableHead>Joined</TableHead>
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
                        ) : users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center">
                                    No users found
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.username}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="capitalize">
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.isContributor ? 'default' : 'secondary'}>
                                            {user.isContributor ? 'Yes' : 'No'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.isPartner ? 'default' : 'secondary'} className="bg-purple-600">
                                            {user.isPartner ? 'Yes' : 'No'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.isAdmin ? 'destructive' : 'outline'}>
                                            {user.isAdmin ? 'Yes' : 'No'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleEdit(user)}>
                                                    <Pencil className="h-4 w-4 mr-2" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setSelectedUser(user)
                                                        setPasswordDialogOpen(true)
                                                    }}
                                                >
                                                    <Key className="h-4 w-4 mr-2" />
                                                    Reset Password
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setSelectedUser(user)
                                                        setDeleteDialogOpen(true)
                                                    }}
                                                    className="text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                    >
                        Next
                    </Button>
                </div>
            </div>

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>
                            Update user information and permissions
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                value={editForm.username}
                                onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={editForm.email}
                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="contributor">Contributor</Label>
                            <Switch
                                id="contributor"
                                checked={editForm.isContributor}
                                onCheckedChange={(checked) => setEditForm({ ...editForm, isContributor: checked })}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="partner">Partner</Label>
                            <Switch
                                id="partner"
                                checked={editForm.isPartner}
                                onCheckedChange={(checked) => setEditForm({ ...editForm, isPartner: checked })}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="admin">Admin</Label>
                            <Switch
                                id="admin"
                                checked={editForm.isAdmin}
                                onCheckedChange={(checked) => setEditForm({ ...editForm, isAdmin: checked })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="role">Role</Label>
                            <select
                                id="role"
                                value={editForm.role}
                                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                className="w-full px-3 py-2 border rounded-md"
                            >
                                <option value="user">User</option>
                                <option value="moderator">Moderator</option>
                                <option value="developer">Developer</option>
                                <option value="support">Support</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveEdit}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Password Reset Dialog */}
            <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reset Password</DialogTitle>
                        <DialogDescription>
                            Set a new password for {selectedUser?.username}
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setPasswordDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleResetPassword}>Reset Password</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete User</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {selectedUser?.username}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
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
