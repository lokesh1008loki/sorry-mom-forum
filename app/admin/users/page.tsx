'use client'

import { UserManagementTable } from '@/components/user-management-table'

export default function UsersPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">User Management</h1>
                <p className="text-muted-foreground">
                    Manage all registered users, edit details, reset passwords, and control permissions.
                </p>
            </div>

            <UserManagementTable />
        </div>
    )
}
