export function generateMockThreads() {
  return Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    title: `Thread ${i + 1}`,
    author: {
      name: `User${i + 1}`,
      avatar: `/abstract-geometric-shapes.png?height=40&width=40&query=avatar${i + 1}`
    },
    category: {
      id: "galleries",
      title: "Galleries & Videos"
    },
    thumbnail: "/placeholder.jpg",
    views: (i + 1) * 100,
    replies: (i + 1) * 10,
    likes: (i + 1) * 5,
    date: new Date(2024, 0, i + 1).toISOString(),
    lastReply: {
      author: `User${i + 1}`,
      avatar: `/abstract-geometric-shapes.png?height=40&width=40&query=reply${i + 1}`,
      date: new Date(2024, 0, i + 1).toISOString()
    },
    isPinned: i < 2,
    isLocked: false,
    isHot: i % 3 === 0,
    isNew: i % 2 === 0
  }))
} 