
"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Plus, Pencil, Trash2, ExternalLink, X, Tag as TagIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    url: z.string().url("Must be a valid URL"),
    description: z.string().optional(),
    priority: z.coerce.number().int().default(0),
    iconUrl: z.string().optional(),
    isActive: z.boolean().default(true),
    tagIds: z.array(z.string()).default([]),
})

type ChannelTag = {
    id: string
    name: string
    color: string
}

type TelegramChannelTag = {
    tag: ChannelTag
}

type TelegramChannel = {
    id: string
    name: string
    url: string
    description?: string
    priority: number
    iconUrl?: string
    isActive: boolean
    createdAt: string
    tags?: TelegramChannelTag[]
}

// Predefined tags for quick selection
const PREDEFINED_TAGS = [
    { name: "hot", color: "#ef4444" },
    { name: "new", color: "#3b82f6" },
    { name: "top rated", color: "#eab308" },
    { name: "trending", color: "#f59e0b" },
    { name: "exclusive", color: "#a855f7" },
    { name: "official", color: "#22c55e" },
]

export default function TelegramChannelsPage() {
    const [channels, setChannels] = useState<TelegramChannel[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingChannel, setEditingChannel] = useState<TelegramChannel | null>(null)
    const [availableTags, setAvailableTags] = useState<ChannelTag[]>([])
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
    const [customTagName, setCustomTagName] = useState("")
    const [customTagColor, setCustomTagColor] = useState("#3b82f6")

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            url: "",
            description: "",
            priority: 0,
            iconUrl: "",
            isActive: true,
            tagIds: [],
        },
    })

    const fetchChannels = async () => {
        try {
            const res = await fetch("/api/admin/telegram-channels")
            if (!res.ok) throw new Error("Failed to fetch channels")
            const data = await res.json()
            setChannels(data)
        } catch (error) {
            console.error(error)
            toast.error("Failed to load channels")
        } finally {
            setIsLoading(false)
        }
    }

    const fetchTags = async () => {
        try {
            const res = await fetch("/api/admin/channel-tags")
            if (!res.ok) throw new Error("Failed to fetch tags")
            const data = await res.json()
            setAvailableTags(data)

            // Create predefined tags if they don't exist
            for (const predefTag of PREDEFINED_TAGS) {
                const exists = data.some((t: ChannelTag) => t.name.toLowerCase() === predefTag.name.toLowerCase())
                if (!exists) {
                    await createTag(predefTag.name, predefTag.color)
                }
            }
        } catch (error) {
            console.error(error)
            toast.error("Failed to load tags")
        }
    }

    const createTag = async (name: string, color: string) => {
        try {
            const res = await fetch("/api/admin/channel-tags", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, color }),
            })
            if (!res.ok) throw new Error("Failed to create tag")
            const newTag = await res.json()
            setAvailableTags(prev => [...prev, newTag])
            return newTag
        } catch (error) {
            console.error(error)
            toast.error("Failed to create tag")
            return null
        }
    }

    useEffect(() => {
        fetchChannels()
        fetchTags()
    }, [])

    useEffect(() => {
        if (editingChannel) {
            form.reset({
                name: editingChannel.name,
                url: editingChannel.url,
                description: editingChannel.description || "",
                priority: editingChannel.priority,
                iconUrl: editingChannel.iconUrl || "",
                isActive: editingChannel.isActive,
                tagIds: editingChannel.tags?.map(t => t.tag.id) || [],
            })
        } else {
            form.reset({
                name: "",
                url: "",
                description: "",
                priority: 0,
                iconUrl: "",
                isActive: true,
                tagIds: [],
            })
        }
    }, [editingChannel, form])

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = "/api/admin/telegram-channels"
            const method = editingChannel ? "PUT" : "POST"
            const body = editingChannel ? { ...values, id: editingChannel.id } : values

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            })

            if (!res.ok) throw new Error("Failed to save channel")

            toast.success(editingChannel ? "Channel updated" : "Channel created")
            setIsDialogOpen(false)
            setEditingChannel(null)
            fetchChannels() // Refresh list
        } catch (error) {
            console.error(error)
            toast.error("An error occurred")
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this channel?")) return

        try {
            const res = await fetch(`/api/admin/telegram-channels?id=${id}`, {
                method: "DELETE",
            })

            if (!res.ok) throw new Error("Failed to delete channel")

            toast.success("Channel deleted")
            fetchChannels()
        } catch (error) {
            console.error(error)
            toast.error("Failed to delete channel")
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Telegram Channels</h2>
                    <p className="text-muted-foreground">
                        Manage links appearing on the Telegram page.
                    </p>
                </div>
                <Button onClick={() => { setEditingChannel(null); setIsDialogOpen(true); }}>
                    <Plus className="mr-2 h-4 w-4" /> Add Channel
                </Button>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingChannel ? "Edit Channel" : "Add Channel"}</DialogTitle>
                        <DialogDescription>
                            Configure the Telegram channel details. Priority determines the sort order (higher = top).
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Premium Channel" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>URL</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://t.me/..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description (Optional)</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Join for exclusive content..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="space-y-4 rounded-lg border p-4 bg-muted/50">
                                <div className="flex items-center gap-2 mb-2">
                                    <TagIcon className="h-4 w-4" />
                                    <span className="font-semibold text-sm">Channel Tags</span>
                                </div>

                                {/* Selected Tags Display */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {form.watch("tagIds").map(tagId => {
                                        const tag = availableTags.find(t => t.id === tagId);
                                        if (!tag) return null;
                                        return (
                                            <Badge
                                                key={tag.id}
                                                style={{ backgroundColor: tag.color + '20', color: tag.color, borderColor: tag.color + '50' }}
                                                className="flex items-center gap-1 border"
                                            >
                                                {tag.name}
                                                <X
                                                    className="h-3 w-3 cursor-pointer hover:text-red-500"
                                                    onClick={() => {
                                                        const current = form.getValues("tagIds");
                                                        form.setValue("tagIds", current.filter(id => id !== tagId));
                                                    }}
                                                />
                                            </Badge>
                                        );
                                    })}
                                    {form.watch("tagIds").length === 0 && (
                                        <span className="text-xs text-muted-foreground italic">No tags selected</span>
                                    )}
                                </div>

                                {/* Suggested/Existing Tags */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground uppercase">Suggested Tags</label>
                                    <div className="flex flex-wrap gap-2">
                                        {availableTags.map(tag => {
                                            const isSelected = form.watch("tagIds").includes(tag.id);
                                            return (
                                                <Button
                                                    key={tag.id}
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={isSelected}
                                                    onClick={() => {
                                                        const current = form.getValues("tagIds");
                                                        form.setValue("tagIds", [...current, tag.id]);
                                                    }}
                                                    className="h-7 text-xs"
                                                >
                                                    {tag.name}
                                                </Button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Custom Tag Creator */}
                                <div className="pt-2 border-t mt-2">
                                    <label className="text-xs font-medium text-muted-foreground uppercase">Create Custom Tag</label>
                                    <div className="flex gap-2 mt-1">
                                        <Input
                                            placeholder="Tag name..."
                                            className="h-8 text-xs"
                                            value={customTagName}
                                            onChange={(e) => setCustomTagName(e.target.value)}
                                        />
                                        <Input
                                            type="color"
                                            className="h-8 w-12 p-1"
                                            value={customTagColor}
                                            onChange={(e) => setCustomTagColor(e.target.value)}
                                        />
                                        <Button
                                            type="button"
                                            size="sm"
                                            className="h-8 px-2"
                                            onClick={async () => {
                                                if (!customTagName) return;
                                                const tag = await createTag(customTagName, customTagColor);
                                                if (tag) {
                                                    const current = form.getValues("tagIds");
                                                    form.setValue("tagIds", [...current, tag.id]);
                                                    setCustomTagName("");
                                                }
                                            }}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <FormField
                                    control={form.control}
                                    name="priority"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Priority</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="isActive"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm flex-1">
                                            <div className="space-y-0.5">
                                                <FormLabel>Active</FormLabel>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <DialogFooter>
                                <Button type="submit" disabled={form.formState.isSubmitting}>
                                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Priority</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>URL</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                </TableCell>
                            </TableRow>
                        ) : channels.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No channels found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            channels.map((channel) => (
                                <TableRow key={channel.id}>
                                    <TableCell>{channel.priority}</TableCell>
                                    <TableCell className="font-medium">{channel.name}</TableCell>
                                    <TableCell>
                                        <a href={channel.url} target="_blank" rel="noreferrer" className="flex items-center text-blue-500 hover:underline">
                                            Link <ExternalLink className="ml-1 h-3 w-3" />
                                        </a>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {channel.isActive ? (
                                                <Badge variant="default" className="bg-green-500">Active</Badge>
                                            ) : (
                                                <Badge variant="secondary">Inactive</Badge>
                                            )}
                                            {channel.tags?.map(t => (
                                                <Badge
                                                    key={t.tag.id}
                                                    style={{ backgroundColor: t.tag.color + '15', color: t.tag.color, borderColor: t.tag.color + '30' }}
                                                    className="border text-[10px] px-1 h-5"
                                                >
                                                    {t.tag.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="sm" onClick={() => { setEditingChannel(channel); setIsDialogOpen(true); }}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(channel.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
