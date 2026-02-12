'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Users,
    UserCheck,
    Link as LinkIcon,
    Settings,
    Menu,
    X,
    Shield,
    Users2,
    FileText,
    Trophy,
    Megaphone
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Staff Management', href: '/admin/staff-management', icon: Users2 },
    { name: 'Contributors', href: '/admin/contributors', icon: UserCheck },
    { name: 'Platform Links', href: '/admin/platform-links', icon: LinkIcon },
    { name: 'Content Moderation', href: '/admin/moderation', icon: Shield },
    { name: 'Activity Logs', href: '/admin/activity-logs', icon: FileText },
    { name: 'Gamification', href: '/admin/gamification', icon: Trophy },
    { name: 'Announcements', href: '/admin/announcements', icon: Megaphone },
    { name: 'System Settings', href: '/admin/settings', icon: Settings },
]

interface AdminLayoutProps {
    children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
    const pathname = usePathname()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="flex h-screen bg-background">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform lg:translate-x-0 lg:static lg:z-auto",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex items-center justify-between h-16 px-6 border-b">
                    <h1 className="text-xl font-bold">Admin Panel</h1>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <ScrollArea className="flex-1 py-4">
                    <nav className="space-y-1 px-3">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                    )}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.name}
                                </Link>
                            )
                        })}
                    </nav>
                </ScrollArea>

                <div className="p-4 border-t">
                    <Link href="/">
                        <Button variant="outline" className="w-full">
                            Back to Forum
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top header */}
                <div className="h-16 border-b bg-card px-4 flex items-center justify-between lg:px-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                    <h2 className="text-lg font-semibold">Sorry Mom Forum Administration</h2>
                    <div className="w-10 lg:hidden" /> {/* Spacer for mobile */}
                </div>

                {/* Page content */}
                <ScrollArea className="flex-1">
                    <div className="p-4 lg:p-6">
                        {children}
                    </div>
                </ScrollArea>
            </div>
        </div>
    )
}
