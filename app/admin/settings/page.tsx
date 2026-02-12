'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Loader2, Save } from 'lucide-react'

type Setting = {
    value: string
    type: string
    description?: string
}

type SettingsMap = Record<string, Setting>

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<SettingsMap>({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState<string | null>(null)

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/settings')
            if (res.ok) {
                const data = await res.json()
                setSettings(data)
            } else {
                toast.error('Failed to load settings')
            }
        } catch (error) {
            toast.error('Error loading settings')
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async (key: string, value: string | boolean) => {
        setSaving(key)
        try {
            const currentSetting = settings[key]
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    key,
                    value: String(value),
                    type: typeof value === 'boolean' ? 'boolean' : 'string',
                    description: currentSetting?.description
                })
            })

            if (res.ok) {
                toast.success('Setting updated')
                setSettings(prev => ({
                    ...prev,
                    [key]: {
                        ...prev[key],
                        value: String(value),
                        type: typeof value === 'boolean' ? 'boolean' : 'string'
                    }
                }))
            } else {
                toast.error('Failed to update setting')
            }
        } catch (error) {
            toast.error('Error updating setting')
        } finally {
            setSaving(null)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
                <p className="text-muted-foreground">
                    Manage global configuration and platform behavior.
                </p>
            </div>

            <div className="grid gap-6">
                {/* General Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle>General Configuration</CardTitle>
                        <CardDescription>Basic site settings and metadata.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="site_name">Site Name</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="site_name"
                                    defaultValue={settings['site_name']?.value || 'Sorry Mom Forum'}
                                    onChange={(e) => handleSave('site_name', e.target.value)} // In real app, create a separate save button for text inputs to avoid spamming API
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label className="text-base">Maintenance Mode</Label>
                                <div className="text-sm text-muted-foreground">
                                    Disable access for non-admin users.
                                </div>
                            </div>
                            <Switch
                                checked={settings['maintenance_mode']?.value === 'true'}
                                onCheckedChange={(checked) => handleSave('maintenance_mode', checked)}
                                disabled={saving === 'maintenance_mode'}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Feature Toggles */}
                <Card>
                    <CardHeader>
                        <CardTitle>Feature Toggles</CardTitle>
                        <CardDescription>Enable or disable specific platform features.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label className="text-base">User Registration</Label>
                                <div className="text-sm text-muted-foreground">
                                    Allow new users to sign up.
                                </div>
                            </div>
                            <Switch
                                checked={settings['enable_registration']?.value !== 'false'} // Default true
                                onCheckedChange={(checked) => handleSave('enable_registration', checked)}
                                disabled={saving === 'enable_registration'}
                            />
                        </div>

                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label className="text-base">Public Content View</Label>
                                <div className="text-sm text-muted-foreground">
                                    Allow guests to view content without logging in.
                                </div>
                            </div>
                            <Switch
                                checked={settings['public_view_enabled']?.value === 'true'}
                                onCheckedChange={(checked) => handleSave('public_view_enabled', checked)}
                                disabled={saving === 'public_view_enabled'}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
