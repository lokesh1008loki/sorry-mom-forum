'use client'

import { ContentUploadForm } from '@/components/content-upload-form'

export default function UploadContentPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Upload Content</h1>
                <p className="text-muted-foreground">
                    Create and upload new content for review. All content must be approved by moderators before going live.
                </p>
            </div>

            <ContentUploadForm />
        </div>
    )
}
