'use client'

import { ContributorContentTable } from '@/components/contributor-content-table'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'

export default function MyContentPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">My Content</h1>
                    <p className="text-muted-foreground">
                        Manage and track all your uploaded content
                    </p>
                </div>
                <Link href="/contributor-panel/upload">
                    <Button>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload New
                    </Button>
                </Link>
            </div>

            <ContributorContentTable />
        </div>
    )
}
