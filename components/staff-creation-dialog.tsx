'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { UserPlus } from 'lucide-react'

interface StaffCreationDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

export function StaffCreationDialog({ open, onOpenChange, onSuccess }: StaffCreationDialogProps) {
    const [loading, setLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedUserId, setSelectedUserId] = useState('')
    const [role, setRole] = useState('')
    const [department, setDepartment] = useState('')
    const [users, setUsers] = useState<Array<{ id: string, username: string, email: string }>>([])
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)
    const { toast } = useToast()

    const handleSearchUsers = async (query: string) => {
        if (!query) {
            setUsers([])
            return
        }

        try {
            const res = await fetch(`/api/admin/users?search=${query}&limit=10`)
            if (res.ok) {
                const data = await res.json()
                setUsers(data.users || [])
            }
        } catch (error) {
            console.error('Error searching users:', error)
        }
    }

    const handleSearchChange = (value: string) => {
        setSearchQuery(value)

        if (searchTimeout) {
            clearTimeout(searchTimeout)
        }

        const timeout = setTimeout(() => {
            handleSearchUsers(value)
        }, 300)

        setSearchTimeout(timeout)
    }

    const handleCreate = async () => {
        if (!selectedUserId || !role) {
            toast({
                title: 'Error',
                description: 'Please select a user and role',
                variant: 'destructive'
            })
            return
        }

        setLoading(true)

        try {
            const res = await fetch('/api/admin/staff', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: selectedUserId,
                    role,
                    department: department || null,
                    permissions: []
                })
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.error || 'Failed to create staff member')
            }

            toast({
                title: 'Success',
                description: 'Staff member created successfully'
            })

            onSuccess()
            onOpenChange(false)

            // Reset form
            setSearchQuery('')
            setSelectedUserId('')
            setRole('')
            setDepartment('')
            setUsers([])
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to create staff member',
                variant: 'destructive'
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Staff Member</DialogTitle>
                    <DialogDescription>
                        Assign a staff role to an existing user
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label htmlFor="user-search">Search User</Label>
                        <Input
                            id="user-search"
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            placeholder="Search by username or email..."
                        />
                        {users.length > 0 && (
                            <div className="mt-2 border rounded-md max-h-40 overflow-y-auto">
                                {users.map((user) => (
                                    <button
                                        key={user.id}
                                        onClick={() => {
                                            setSelectedUserId(user.id)
                                            setSearchQuery(user.username)
                                            setUsers([])
                                        }}
                                        className="w-full px-3 py-2 text-left hover:bg-accent text-sm"
                                    >
                                        <div className="font-medium">{user.username}</div>
                                        <div className="text-xs text-muted-foreground">{user.email}</div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="role">Staff Role *</Label>
                        <Select value={role} onValueChange={setRole}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="moderator">Moderator</SelectItem>
                                <SelectItem value="developer">Developer</SelectItem>
                                <SelectItem value="support">Support</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="department">Department (Optional)</Label>
                        <Input
                            id="department"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            placeholder="e.g., Content Team, Technical, Customer Service"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCreate}
                        disabled={loading || !selectedUserId || !role}
                    >
                        <UserPlus className="h-4 w-4 mr-2" />
                        {loading ? 'Creating...' : 'Create Staff Member'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
