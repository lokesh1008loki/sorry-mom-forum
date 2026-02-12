'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Upload } from 'lucide-react'

export function ContentUploadForm() {
    const router = useRouter()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        contentType: 'post',
        contentUrl: '',
        body: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch('/api/contributor/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.error || 'Failed to upload content')
            }

            toast({
                title: 'Success',
                description: 'Content uploaded successfully! It will be reviewed by moderators.'
            })

            router.push('/contributor-panel/content')
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to upload content',
                variant: 'destructive'
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter content title"
                    required
                />
            </div>

            <div>
                <Label htmlFor="contentType">Content Type *</Label>
                <Select
                    value={formData.contentType}
                    onValueChange={(value) => setFormData({ ...formData, contentType: value })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="post">Post</SelectItem>
                        <SelectItem value="article">Article</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of your content"
                    rows={3}
                />
            </div>

            {(formData.contentType === 'video' || formData.contentType === 'image') && (
                <div>
                    <Label htmlFor="contentUrl">Content URL *</Label>
                    <Input
                        id="contentUrl"
                        value={formData.contentUrl}
                        onChange={(e) => setFormData({ ...formData, contentUrl: e.target.value })}
                        placeholder="Enter URL for video or image"
                        required
                    />
                </div>
            )}

            {(formData.contentType === 'post' || formData.contentType === 'article') && (
                <div>
                    <Label htmlFor="body">Content Body *</Label>
                    <Textarea
                        id="body"
                        value={formData.body}
                        onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                        placeholder="Write your content here..."
                        rows={12}
                        required
                    />
                </div>
            )}

            <div className="flex gap-3">
                <Button type="submit" disabled={loading}>
                    <Upload className="h-4 w-4 mr-2" />
                    {loading ? 'Uploading...' : 'Upload Content'}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/contributor-panel/content')}
                >
                    Cancel
                </Button>
            </div>
        </form>
    )
}
