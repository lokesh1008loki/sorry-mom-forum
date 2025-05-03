export interface PinnedLink {
  id: string
  url: string
  title: string
  pinnedBy: string
  pinnedAt: string
  type: 'video' | 'telegram'
} 