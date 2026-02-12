'use client'

import { PlatformLinksTable } from '@/components/platform-links-table'

export default function PlatformLinksPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Platform Links Management</h1>
                <p className="text-muted-foreground">
                    View and manage all contributor platform links across the forum.
                </p>
            </div>

            <PlatformLinksTable />
        </div>
    )
}
