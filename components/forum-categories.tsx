"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  MessageSquare,
  Video,
  Star,
  Bookmark,
  FileVideo,
  Film,
  Crown,
  ChevronDown,
  Globe,
  HelpCircle,
  Heart,
  Play,
  Gamepad2,
  Image,
  User,
  Share2,
  Folder,
  Check,
  Calendar,
  Camera,
  Mic,
  Music,
  Shirt,
  Laugh,
  Tv,
  Users,
} from "lucide-react"
import { useTranslation } from "@/contexts/language-context"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

interface LatestPost {
  title: string
  user: string
  avatar: string
  timeAgo: string
}

interface LatestPosts {
  [key: string]: LatestPost
}

interface PostCounts {
  [key: string]: string
}

interface Descriptions {
  [key: string]: string
}

interface Category {
  title: string
  description: string
  icon: React.ReactNode
  color: string
  subcategories: Subcategory[]
}

interface Subcategory {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  color: string
  threads: number
  messages: number
}

interface ForumCategoriesProps {
  className?: string
}

export function ForumCategories({ className }: ForumCategoriesProps) {
  // Use translations
  const forumTitle = useTranslation("forum")
  const browseCategoriesDesc = useTranslation("browse_categories")
  const announcementsTitle = useTranslation("announcements")
  const announcementsDesc = useTranslation("announcements_desc")
  const galleriesTitle = useTranslation("galleries")
  const galleriesDesc = useTranslation("galleries_desc")
  const exclusiveTitle = useTranslation("exclusive")
  const exclusiveDesc = useTranslation("exclusive_desc")

  const mainCategories = [
    {
      id: "announcements",
      title: announcementsTitle,
      description: announcementsDesc,
      icon: <Star className="h-5 w-5 text-yellow-500" />,
      threads: 30,
      messages: 203,
      color: "bg-yellow-500/10 text-yellow-500",
    },
    {
      id: "galleries",
      title: "Galleries & Videos",
      description: "Premium video and picture galleries",
      icon: <Video className="h-5 w-5 text-blue-500" />,
      threads: 4100,
      messages: 19770,
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      id: "exclusive",
      title: "Exclusive Content",
      description: "Premium exclusive content for members",
      icon: <Crown className="h-5 w-5 text-purple-500" />,
      threads: 2300,
      messages: 8530,
      color: "bg-purple-500/10 text-purple-500",
    },
  ]

  const { t } = useTranslation("common") as unknown as { t: (key: string) => string }
  const [activeSections, setActiveSections] = useState<string[]>(['site-exclusive', 'general-discussion', 'content-sharing', 'help-support', 'off-topic'])

  const toggleSection = (sectionId: string) => {
    setActiveSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]
    )
  }

  const isSectionActive = (sectionId: string) => activeSections.includes(sectionId)

  const breadcrumbItems = [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Forums",
      href: "/forums",
    },
    {
      title: "Galleries & Videos",
      href: "/forums/galleries",
    },
  ]

  return (
    <div className={cn("space-y-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8", className)}>
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => (
            <BreadcrumbItem key={item.href}>
              <BreadcrumbLink href={item.href}>
                {item.title}
              </BreadcrumbLink>
              {index < breadcrumbItems.length - 1 && (
                <BreadcrumbSeparator />
              )}
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">{forumTitle}</CardTitle>
          <CardDescription>{browseCategoriesDesc}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
            {mainCategories.map((category) => (
              <Link
                key={category.id}
                href={`/forums/${category.id}`}
                className="flex flex-col p-4 hover:bg-accent/50 transition-colors rounded-md"
              >
                <div className="flex items-start gap-3 mb-2">
                  <div className={`p-2 rounded-full flex-shrink-0 ${category.color}`}>{category.icon}</div>
                  <div className="min-w-0">
                    <h3 className="font-medium truncate">{category.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{category.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-auto text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="font-normal">
                      <MessageSquare className="mr-1 h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{category.threads.toLocaleString()}</span>
                    </Badge>
                    <span className="truncate">{category.messages.toLocaleString()} posts</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <ForumCategoriesDetailed />
    </div>
  )
}

function ForumCategoriesDetailed() {
  const forumCategoriesTitle = useTranslation("forum_categories")
  // State to track which categories are expanded
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    "SITE_NAME EXCLUSIVE VIDEOS": true,
    "VIP SECTION": true,
    "DESI VIDEOS & PICS": true,
    "PREMIUM ONLYFANS VIDEOS & PICS": true,
    "TIK TOK": true,
    "ASIAN PORN": true,
    "HOLLYWOOD / CELEBRITIES HOT VIDEOS": true,
    "ARAB VIDEOS / PICS": true,
    "PORNSTAR SECTION": true,
    "LESBIAN / GAY PORN": true,
    "HENTAI SECTION": true,
    "REQUEST ZONE": true
  })

  // Toggle category expansion
  const toggleCategory = (categoryTitle: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryTitle]: !prev[categoryTitle],
    }))
  }

  // Mock data for latest posts in each subcategory
  const latestPosts: LatestPosts = {
    // SITE_NAME EXCLUSIVE VIDEOS
    "exclusive-videos": {
      title: "Premium content just released...",
      user: "Admin",
      avatar: "/diverse-avatars.png",
      timeAgo: "30 minutes ago",
    },

    // DESI VIDEOS & PICS
    "desi-new-video": {
      title: "Hijabi GF Boobs Pressed A...",
      user: "TikTok",
      avatar: "/diverse-avatars.png",
      timeAgo: "1 hour ago",
    },
    "desi-old-archive": {
      title: "Telugu Famous Aunty Dres...",
      user: "Kattawin",
      avatar: "/diverse-group-avatars.png",
      timeAgo: "2 hours ago",
    },
    "desi-new-pics": {
      title: "Beautiful Sexy Indian Babe",
      user: "tasnim",
      avatar: "/diverse-avatars.png",
      timeAgo: "21 hours ago",
    },
    "desi-old-pics": {
      title: "Sexy call girl showing boob...",
      user: "Naughty",
      avatar: "/diverse-group-avatars.png",
      timeAgo: "10 hours ago",
    },
    "desi-semi-nudes": {
      title: "Tamil Cute Girl Devi Priya B...",
      user: "King007ss",
      avatar: "/diverse-avatars.png",
      timeAgo: "11 hours ago",
    },
    "overseas-desi-videos": {
      title: "NRI couple leaked private...",
      user: "VideoLover",
      avatar: "/diverse-group-avatars.png",
      timeAgo: "5 hours ago",
    },
    "desi-models": {
      title: "Top model photoshoot leaked...",
      user: "ModelFan",
      avatar: "/diverse-avatars.png",
      timeAgo: "8 hours ago",
    },
    "live-streams": {
      title: "Recorded live session from...",
      user: "StreamMaster",
      avatar: "/diverse-group-avatars.png",
      timeAgo: "3 hours ago",
    },
    "social-media-famous": {
      title: "Instagram influencer private...",
      user: "SocialGuru",
      avatar: "/diverse-avatars.png",
      timeAgo: "4 hours ago",
    },

    // PREMIUM FANS VIDEOS & PICS
    "only-fans-video": {
      title: "New OF leak from popular...",
      user: "LeakMaster",
      avatar: "/diverse-group-avatars.png",
      timeAgo: "3 hours ago",
    },
    "patreon-video": {
      title: "Cosplayer new set just...",
      user: "PatreonFan",
      avatar: "/diverse-avatars.png",
      timeAgo: "5 hours ago",
    },

    // HOLLYWOOD / CELEBRITIES HOT VIDEOS
    "hollywood-hot-scene": {
      title: "Famous actress leaked scene...",
      user: "CelebHunter",
      avatar: "/diverse-group-avatars.png",
      timeAgo: "7 hours ago",
    },

    // ARAB VIDEOS / PICS
    "arab-porn-videos": {
      title: "Middle eastern beauty in...",
      user: "ArabicLover",
      avatar: "/diverse-avatars.png",
      timeAgo: "9 hours ago",
    },
    "arab-nudes": {
      title: "Collection of rare arabic...",
      user: "Collector",
      avatar: "/diverse-group-avatars.png",
      timeAgo: "12 hours ago",
    },
    "global-nudes-section": {
      title: "International models nude...",
      user: "WorldTraveler",
      avatar: "/diverse-avatars.png",
      timeAgo: "6 hours ago",
    },

    // REQUEST ZONE
    "indian-request-videos": {
      title: "Looking for this actress MMS...",
      user: "Searcher",
      avatar: "/diverse-group-avatars.png",
      timeAgo: "2 hours ago",
    },
    "indian-request-pics": {
      title: "Need collection of this model...",
      user: "PicCollector",
      avatar: "/diverse-avatars.png",
      timeAgo: "4 hours ago",
    },
    "celebrity-request-video": {
      title: "Anyone has the full scene of...",
      user: "MovieBuff",
      avatar: "/diverse-group-avatars.png",
      timeAgo: "8 hours ago",
    },
    "global-request-videos": {
      title: "Looking for this European...",
      user: "Requester",
      avatar: "/diverse-avatars.png",
      timeAgo: "5 hours ago",
    },

    // PORNSTAR SECTION
    "pornstar-videos": {
      title: "Complete collection of top...",
      user: "StarFan",
      avatar: "/diverse-group-avatars.png",
      timeAgo: "7 hours ago",
    },
    "watch-online-videos": {
      title: "Streaming links for latest...",
      user: "StreamProvider",
      avatar: "/diverse-avatars.png",
      timeAgo: "3 hours ago",
    },

    // LESBIAN / GAY PORN
    "lesbian-video": {
      title: "Two beauties passionate scene...",
      user: "LesLover",
      avatar: "/diverse-group-avatars.png",
      timeAgo: "6 hours ago",
    },
    "lesbian-photo": {
      title: "Professional photoshoot of...",
      user: "PhotoArt",
      avatar: "/diverse-avatars.png",
      timeAgo: "9 hours ago",
    },
    "gay-porn-videos": {
      title: "Male models exclusive content...",
      user: "GayFan",
      avatar: "/diverse-group-avatars.png",
      timeAgo: "10 hours ago",
    },
    "trans-porn-videos": {
      title: "Trans beauty in amazing scene...",
      user: "TransSupporter",
      avatar: "/diverse-avatars.png",
      timeAgo: "8 hours ago",
    },

    // VIP SECTION
    "vip-videos": {
      title: "Premium content for VIP...",
      user: "VIPMember",
      avatar: "/diverse-group-avatars.png",
      timeAgo: "2 hours ago",
    },
    "vip-pics": {
      title: "Exclusive photo collection...",
      user: "VIPAccess",
      avatar: "/diverse-avatars.png",
      timeAgo: "4 hours ago",
    },
    "vip-premium": {
      title: "Ultra premium content only...",
      user: "PremiumVIP",
      avatar: "/diverse-group-avatars.png",
      timeAgo: "1 hour ago",
    },

    // EXCLUSIVE SECTION
    "exclusive-pics": {
      title: "Members-only photo sets...",
      user: "ExclusivePhotog",
      avatar: "/diverse-group-avatars.png",
      timeAgo: "3 hours ago",
    },
    "exclusive-premium": {
      title: "Premium exclusive content...",
      user: "PremiumProvider",
      avatar: "/diverse-avatars.png",
      timeAgo: "5 hours ago",
    },

    // TIK TOK
    "tiktok-videos": {
      title: "Compilation of banned TikTok...",
      user: "TikTokFan",
      avatar: "/diverse-avatars.png",
      timeAgo: "4 hours ago",
    },
    "tiktok-pics": {
      title: "Screenshots from private...",
      user: "ScreenGrabber",
      avatar: "/diverse-group-avatars.png",
      timeAgo: "7 hours ago",
    },

    // HENTAI SECTION
    "hentai-videos": {
      title: "Latest uncensored anime...",
      user: "AnimeFan",
      avatar: "/diverse-avatars.png",
      timeAgo: "5 hours ago",
    },
    "animated-videos": {
      title: "3D animation collection of...",
      user: "3DLover",
      avatar: "/diverse-group-avatars.png",
      timeAgo: "9 hours ago",
    },

    // ASIAN PORN
    "asian-videos": {
      title: "Japanese uncensored rare...",
      user: "AsianExpert",
      avatar: "/diverse-avatars.png",
      timeAgo: "6 hours ago",
    },
    "asian-cam-videos": {
      title: "Korean cam girl private show...",
      user: "CamWatcher",
      avatar: "/diverse-group-avatars.png",
      timeAgo: "3 hours ago",
    },

    // CUCKOLD PREMIUM VIDEOS
    "cuckold-videos": {
      title: "Husband films wife with...",
      user: "CuckoldFan",
      avatar: "/diverse-avatars.png",
      timeAgo: "8 hours ago",
    },
    "cuckold-pics": {
      title: "Collection of amateur cuckold...",
      user: "Watcher",
      avatar: "/diverse-group-avatars.png",
      timeAgo: "11 hours ago",
    },
  }

  // Mock post counts for each subcategory
  const postCounts: PostCounts = {
    "exclusive-videos": "15.8k",
    "exclusive-pics": "9.3k",
    "exclusive-premium": "7.2k",
    "desi-new-video": "37.4k",
    "desi-old-archive": "46.2k",
    "desi-new-pics": "5.4k",
    "desi-old-pics": "9.5k",
    "desi-semi-nudes": "17.1k",
    "overseas-desi-videos": "12.3k",
    "desi-models": "8.7k",
    "live-streams": "3.9k",
    "social-media-famous": "7.2k",
    "only-fans-video": "28.7k",
    "patreon-video": "15.3k",
    "hollywood-hot-scene": "22.1k",
    "arab-porn-videos": "14.2k",
    "arab-nudes": "8.9k",
    "global-nudes-section": "11.5k",
    "indian-request-videos": "6.3k",
    "indian-request-pics": "4.8k",
    "celebrity-request-video": "7.6k",
    "global-request-videos": "5.2k",
    "pornstar-videos": "19.4k",
    "watch-online-videos": "13.7k",
    "lesbian-video": "9.8k",
    "lesbian-photo": "7.3k",
    "gay-porn-videos": "6.5k",
    "trans-porn-videos": "4.9k",
    "vip-videos": "10.2k",
    "vip-pics": "8.7k",
    "vip-premium": "5.3k",
    "tiktok-videos": "18.6k",
    "tiktok-pics": "12.4k",
    "hentai-videos": "8.3k",
    "animated-videos": "6.7k",
    "asian-videos": "15.9k",
    "asian-cam-videos": "11.2k",
    "cuckold-videos": "7.8k",
    "cuckold-pics": "5.6k",
  }

  // Mock descriptions for subcategories
  const descriptions: Descriptions = {
    "exclusive-videos": "Premium exclusive video content only available to our members",
    "exclusive-pics": "Premium exclusive photo content only available to our members",
    "exclusive-premium": "Ultra premium exclusive content for dedicated members",
    "desi-new-video":
      "Download new desi (solo show, boy-girl, couple), desi porn, homemade, selfie, video calls, amateur, hardcore, softcore videos here.",
    "desi-old-archive": "Download all old desi videos, mydesi, mydesitop, desi sex mms",
    "desi-new-pics":
      "Download new desi (solo pics, boy-girl,couple), homemade,selfie,desi, amateur, hardcore, softcore pics complete gallery collection",
    "desi-old-pics":
      "Download old desi viral Pictures, desi nude pics, desi nude photos, desi porn pictures, indian desi nude photos",
    "desi-semi-nudes": "Download new desi Random, mix picture collection, No face, Masked face, Semi-nude videos/pic",
    "overseas-desi-videos": "Videos featuring desi people living abroad, NRI content and international desi scenes",
    "desi-models": "Content featuring professional and amateur desi models from various platforms",
    "live-streams": "Recorded live streams, cam shows and interactive sessions",
    "social-media-famous": "Content from social media influencers and internet celebrities",
    "only-fans-video": "Premium OnlyFans videos and exclusive content from creators",
    "patreon-video": "Premium Patreon videos and exclusive content from creators",
    "hollywood-hot-scene": "Celebrity scenes, leaks and exclusive content from movies and shows",
    "arab-porn-videos": "Videos featuring middle eastern performers and amateur content",
    "arab-nudes": "Photo collections of middle eastern models and amateurs",
    "global-nudes-section": "International nude content from various regions around the world",
    "indian-request-videos": "Request section for specific Indian videos that members are looking for",
    "indian-request-pics": "Request section for specific Indian pictures and photo sets",
    "celebrity-request-video": "Request section for celebrity videos, scenes and leaked content",
    "global-request-videos": "Request section for international content from around the world",
    "pornstar-videos": "Videos featuring professional adult performers and pornstars",
    "watch-online-videos": "Streaming links and online sources for various adult content",
    "lesbian-video": "Videos featuring lesbian scenes, couples and group content",
    "lesbian-photo": "Photo sets and galleries of lesbian models and amateurs",
    "gay-porn-videos": "Videos featuring gay performers, couples and group content",
    "trans-porn-videos": "Videos featuring transgender performers and related content",
    "vip-videos": "Premium video content available only to VIP members of the community",
    "vip-pics": "Premium photo content available only to VIP members of the community",
    "vip-premium": "Ultra premium content for our most dedicated VIP members",
    "tiktok-videos": "Content from TikTok creators, leaked videos and compilations",
    "tiktok-pics": "Screenshots, photos and galleries from TikTok creators",
    "hentai-videos": "Animated adult content from Japanese and international sources",
    "animated-videos": "3D animations, CGI content and other animated adult material",
    "asian-videos": "Videos featuring Asian performers from various countries",
    "asian-cam-videos": "Cam shows and live streams featuring Asian performers",
    "cuckold-videos": "Videos featuring cuckold scenarios and related content",
    "cuckold-pics": "Photo sets and galleries of cuckold scenarios and related content",
  }

  const subCategories = [
    {
      id: "galleries-videos",
      title: "Videos",
      description: "Premium video content",
      icon: <Play className="h-5 w-5 text-blue-500" />,
      threads: 1200,
      messages: 4500,
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      id: "galleries-pictures",
      title: "Pictures",
      description: "Premium picture galleries",
      icon: <Image className="h-5 w-5 text-blue-500" />,
      threads: 1500,
      messages: 7200,
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      id: "galleries-collections",
      title: "Collections",
      description: "Curated content collections",
      icon: <Folder className="h-5 w-5 text-blue-500" />,
      threads: 800,
      messages: 3500,
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      id: "galleries-requests",
      title: "Requests",
      description: "Request specific content",
      icon: <HelpCircle className="h-5 w-5 text-blue-500" />,
      threads: 600,
      messages: 4570,
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      id: "exclusive-videos",
      title: "Exclusive Videos",
      description: "Premium exclusive video content",
      icon: <Play className="h-5 w-5 text-purple-500" />,
      threads: 800,
      messages: 3200,
      color: "bg-purple-500/10 text-purple-500",
    },
    {
      id: "exclusive-pictures",
      title: "Exclusive Pictures",
      description: "Premium exclusive picture galleries",
      icon: <Image className="h-5 w-5 text-purple-500" />,
      threads: 700,
      messages: 2800,
      color: "bg-purple-500/10 text-purple-500",
    },
    {
      id: "exclusive-collections",
      title: "Exclusive Collections",
      description: "Curated exclusive content collections",
      icon: <Folder className="h-5 w-5 text-purple-500" />,
      threads: 400,
      messages: 1500,
      color: "bg-purple-500/10 text-purple-500",
    },
    {
      id: "exclusive-requests",
      title: "Exclusive Requests",
      description: "Request exclusive content",
      icon: <HelpCircle className="h-5 w-5 text-purple-500" />,
      threads: 400,
      messages: 1030,
      color: "bg-purple-500/10 text-purple-500",
    },
  ]

  const detailedCategories: Category[] = [
    {
      title: "SITE_NAME EXCLUSIVE VIDEOS",
      description: "Premium exclusive video content",
      icon: <Crown className="h-5 w-5 text-purple-500" />,
      color: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
      subcategories: [
        {
          id: "latest-exclusive-videos",
          name: "Latest Exclusive Videos",
          description: "Newest exclusive video content",
          icon: <Play className="h-4 w-4" />,
          color: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
          threads: 1200,
          messages: 4500,
        },
        {
          id: "popular-exclusive-videos",
          name: "Popular Exclusive Videos",
          description: "Most popular exclusive videos",
          icon: <Play className="h-4 w-4" />,
          color: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
          threads: 800,
          messages: 3200,
        },
        {
          id: "hd-exclusive-videos",
          name: "HD Exclusive Videos",
          description: "High-quality exclusive videos",
          icon: <Play className="h-4 w-4" />,
          color: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
          threads: 500,
          messages: 2000,
        },
        {
          id: "exclusive-collections",
          name: "Exclusive Collections",
          description: "Exclusive video collections",
          icon: <Play className="h-4 w-4" />,
          color: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
          threads: 300,
          messages: 1200,
        }
      ],
    },
    {
      title: "VIP SECTION",
      description: "Premium VIP content",
      icon: <Crown className="h-5 w-5 text-amber-500" />,
      color: "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20",
      subcategories: [
        {
          id: "vip-videos",
          name: "VIP Videos",
          description: "Exclusive VIP video content",
          icon: <Play className="h-4 w-4" />,
          color: "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20",
          threads: 1000,
          messages: 4000,
        },
        {
          id: "vip-pics",
          name: "VIP Pictures",
          description: "Exclusive VIP picture content",
          icon: <Image className="h-4 w-4" />,
          color: "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20",
          threads: 600,
          messages: 2400,
        },
        {
          id: "vip-collections",
          name: "VIP Collections",
          description: "VIP content collections",
          icon: <Folder className="h-4 w-4" />,
          color: "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20",
          threads: 300,
          messages: 1200,
        },
        {
          id: "vip-requests",
          name: "VIP Requests",
          description: "VIP content requests",
          icon: <HelpCircle className="h-4 w-4" />,
          color: "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20",
          threads: 200,
          messages: 800,
        }
      ],
    },
    {
      title: "DESI VIDEOS & PICS",
      description: "Indian and South Asian content",
      icon: <Heart className="h-5 w-5 text-red-500" />,
      color: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
      subcategories: [
        {
          id: "desi-new-videos",
          name: "Desi New video Hd/Sd",
          description: "New desi videos in HD and SD quality",
          icon: <Play className="h-4 w-4" />,
          color: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
          threads: 1500,
          messages: 7500,
        },
        {
          id: "desi-old-archive",
          name: "Desi Old Archive",
          description: "Archive of old desi videos",
          icon: <Play className="h-4 w-4" />,
          color: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
          threads: 1200,
          messages: 4800,
        },
        {
          id: "desi-new-pics",
          name: "Desi New Pics",
          description: "Latest desi picture collections",
          icon: <Image className="h-4 w-4" />,
          color: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
          threads: 1000,
          messages: 4000,
        },
        {
          id: "desi-old-pics",
          name: "Desi Old pics",
          description: "Archive of old desi pictures",
          icon: <Image className="h-4 w-4" />,
          color: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
          threads: 800,
          messages: 3200,
        },
        {
          id: "desi-semi-nudes",
          name: "Desi Semi Nudes",
          description: "Semi-nude desi content",
          icon: <Image className="h-4 w-4" />,
          color: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
          threads: 600,
          messages: 2400,
        },
        {
          id: "overseas-desi-videos",
          name: "Overseas Desi Videos",
          description: "Desi content from abroad",
          icon: <Play className="h-4 w-4" />,
          color: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
          threads: 500,
          messages: 2000,
        },
        {
          id: "desi-models",
          name: "Desi Models",
          description: "Professional desi models content",
          icon: <User className="h-4 w-4" />,
          color: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
          threads: 400,
          messages: 1600,
        },
        {
          id: "live-streams",
          name: "Live Streams",
          description: "Live streaming content",
          icon: <Play className="h-4 w-4" />,
          color: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
          threads: 300,
          messages: 1200,
        },
        {
          id: "social-media-famous",
          name: "Social Media Famous",
          description: "Content from social media personalities",
          icon: <Share2 className="h-4 w-4" />,
          color: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
          threads: 700,
          messages: 2800,
        },
        {
          id: "desi-couples",
          name: "Desi Couples",
          description: "Couple content from desi creators",
          icon: <Users className="h-4 w-4" />,
          color: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
          threads: 600,
          messages: 2400,
        },
        {
          id: "desi-amateur",
          name: "Desi Amateur",
          description: "Amateur desi content",
          icon: <User className="h-4 w-4" />,
          color: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
          threads: 500,
          messages: 2000,
        },
        {
          id: "desi-professional",
          name: "Desi Professional",
          description: "Professional desi content",
          icon: <User className="h-4 w-4" />,
          color: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
          threads: 400,
          messages: 1600,
        },
        {
          id: "desi-web-series",
          name: "Desi Web Series",
          description: "Desi web series content",
          icon: <Play className="h-4 w-4" />,
          color: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
          threads: 300,
          messages: 1200,
        },
        {
          id: "desi-short-films",
          name: "Desi Short Films",
          description: "Short film content",
          icon: <Play className="h-4 w-4" />,
          color: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
          threads: 200,
          messages: 800,
        },
        {
          id: "desi-music-videos",
          name: "Desi Music Videos",
          description: "Music video content",
          icon: <Play className="h-4 w-4" />,
          color: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
          threads: 400,
          messages: 1600,
        },
        {
          id: "desi-behind-scenes",
          name: "Desi Behind The Scenes",
          description: "Behind the scenes content",
          icon: <Camera className="h-4 w-4" />,
          color: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
          threads: 300,
          messages: 1200,
        },
        {
          id: "desi-interviews",
          name: "Desi Interviews",
          description: "Interview content",
          icon: <Mic className="h-4 w-4" />,
          color: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
          threads: 200,
          messages: 800,
        },
        {
          id: "desi-events",
          name: "Desi Events",
          description: "Event coverage content",
          icon: <Calendar className="h-4 w-4" />,
          color: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
          threads: 300,
          messages: 1200,
        },
        {
          id: "desi-fashion-shows",
          name: "Desi Fashion Shows",
          description: "Fashion show content",
          icon: <Shirt className="h-4 w-4" />,
          color: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
          threads: 200,
          messages: 800,
        },
        {
          id: "desi-dance",
          name: "Desi Dance Performances",
          description: "Dance performance content",
          icon: <Music className="h-4 w-4" />,
          color: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
          threads: 400,
          messages: 1600,
        },
        {
          id: "desi-reality-shows",
          name: "Desi Reality Shows",
          description: "Reality show content",
          icon: <Tv className="h-4 w-4" />,
          color: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
          threads: 300,
          messages: 1200,
        },
        {
          id: "desi-documentaries",
          name: "Desi Documentaries",
          description: "Documentary content",
          icon: <Film className="h-4 w-4" />,
          color: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
          threads: 200,
          messages: 800,
        },
        {
          id: "desi-comedy",
          name: "Desi Comedy",
          description: "Comedy content",
          icon: <Laugh className="h-4 w-4" />,
          color: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
          threads: 300,
          messages: 1200,
        },
        {
          id: "desi-drama",
          name: "Desi Drama",
          description: "Drama content",
          icon: <Film className="h-4 w-4" />,
          color: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
          threads: 400,
          messages: 1600,
        }
      ],
    },
    {
      title: "PREMIUM ONLYFANS VIDEOS & PICS",
      description: "Premium OnlyFans content",
      icon: <Bookmark className="h-5 w-5 text-blue-500" />,
      color: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
      subcategories: [
        {
          id: "onlyfans-videos",
          name: "OnlyFans Videos",
          description: "Premium OnlyFans videos",
          icon: <Play className="h-4 w-4" />,
          color: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
          threads: 900,
          messages: 3600,
        },
        {
          id: "onlyfans-pics",
          name: "OnlyFans Pictures",
          description: "Premium OnlyFans pictures",
          icon: <Image className="h-4 w-4" />,
          color: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
          threads: 600,
          messages: 2400,
        },
        {
          id: "onlyfans-collections",
          name: "OnlyFans Collections",
          description: "OnlyFans content collections",
          icon: <Folder className="h-4 w-4" />,
          color: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
          threads: 300,
          messages: 1200,
        },
        {
          id: "onlyfans-requests",
          name: "OnlyFans Requests",
          description: "OnlyFans content requests",
          icon: <HelpCircle className="h-4 w-4" />,
          color: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
          threads: 200,
          messages: 800,
        }
      ],
    },
    {
      title: "TIK TOK",
      description: "TikTok content and videos",
      icon: <Play className="h-5 w-5 text-cyan-500" />,
      color: "bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20",
      subcategories: [
        {
          id: "tiktok-videos",
          name: "TikTok Videos",
          description: "Latest TikTok videos",
          icon: <Play className="h-4 w-4" />,
          color: "bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20",
          threads: 1200,
          messages: 4800,
        },
        {
          id: "tiktok-collections",
          name: "TikTok Collections",
          description: "TikTok video collections",
          icon: <Folder className="h-4 w-4" />,
          color: "bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20",
          threads: 800,
          messages: 3200,
        },
        {
          id: "popular-tiktok",
          name: "Popular TikTok",
          description: "Popular TikTok content",
          icon: <Star className="h-4 w-4" />,
          color: "bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20",
          threads: 500,
          messages: 2000,
        },
        {
          id: "tiktok-requests",
          name: "TikTok Requests",
          description: "TikTok content requests",
          icon: <HelpCircle className="h-4 w-4" />,
          color: "bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20",
          threads: 300,
          messages: 1200,
        }
      ],
    },
    {
      title: "ASIAN PORN",
      description: "Asian adult content",
      icon: <Globe className="h-5 w-5 text-emerald-500" />,
      color: "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20",
      subcategories: [
        {
          id: "asian-videos",
          name: "Asian Videos",
          description: "Asian adult videos",
          icon: <Play className="h-4 w-4" />,
          color: "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20",
          threads: 1000,
          messages: 4000,
        },
        {
          id: "asian-pics",
          name: "Asian Pictures",
          description: "Asian adult pictures",
          icon: <Image className="h-4 w-4" />,
          color: "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20",
          threads: 600,
          messages: 2400,
        },
        {
          id: "asian-collections",
          name: "Asian Collections",
          description: "Asian content collections",
          icon: <Folder className="h-4 w-4" />,
          color: "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20",
          threads: 300,
          messages: 1200,
        },
        {
          id: "asian-requests",
          name: "Asian Requests",
          description: "Asian content requests",
          icon: <HelpCircle className="h-4 w-4" />,
          color: "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20",
          threads: 200,
          messages: 800,
        }
      ],
    },
    {
      title: "HOLLYWOOD / CELEBRITIES HOT VIDEOS",
      description: "Celebrity hot content",
      icon: <Film className="h-5 w-5 text-purple-500" />,
      color: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
      subcategories: [
        {
          id: "celebrity-videos",
          name: "Celebrity Videos",
          description: "Celebrity hot videos",
          icon: <Play className="h-4 w-4" />,
          color: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
          threads: 800,
          messages: 3200,
        },
        {
          id: "celebrity-pics",
          name: "Celebrity Pictures",
          description: "Celebrity hot pictures",
          icon: <Image className="h-4 w-4" />,
          color: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
          threads: 600,
          messages: 2400,
        },
        {
          id: "celebrity-collections",
          name: "Celebrity Collections",
          description: "Celebrity content collections",
          icon: <Folder className="h-4 w-4" />,
          color: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
          threads: 300,
          messages: 1200,
        },
        {
          id: "celebrity-requests",
          name: "Celebrity Requests",
          description: "Celebrity content requests",
          icon: <HelpCircle className="h-4 w-4" />,
          color: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
          threads: 200,
          messages: 800,
        }
      ],
    },
    {
      title: "ARAB VIDEOS / PICS",
      description: "Arab videos and pictures",
      icon: <Globe className="h-5 w-5 text-green-500" />,
      color: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
      subcategories: [
        {
          id: "arab-videos",
          name: "Arab Videos",
          description: "Arab adult videos",
          icon: <Play className="h-4 w-4" />,
          color: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
          threads: 900,
          messages: 3600,
        },
        {
          id: "arab-pics",
          name: "Arab Pictures",
          description: "Arab adult pictures",
          icon: <Image className="h-4 w-4" />,
          color: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
          threads: 600,
          messages: 2400,
        },
        {
          id: "arab-collections",
          name: "Arab Collections",
          description: "Arab content collections",
          icon: <Folder className="h-4 w-4" />,
          color: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
          threads: 300,
          messages: 1200,
        },
        {
          id: "arab-requests",
          name: "Arab Requests",
          description: "Arab content requests",
          icon: <HelpCircle className="h-4 w-4" />,
          color: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
          threads: 200,
          messages: 800,
        }
      ],
    },
    {
      title: "PORNSTAR SECTION",
      description: "Professional adult content",
      icon: <Star className="h-5 w-5 text-pink-500" />,
      color: "bg-pink-500/10 text-pink-500 hover:bg-pink-500/20",
      subcategories: [
        {
          id: "pornstar-videos",
          name: "Pornstar Videos",
          description: "Professional adult videos",
          icon: <Play className="h-4 w-4" />,
          color: "bg-pink-500/10 text-pink-500 hover:bg-pink-500/20",
          threads: 1100,
          messages: 4400,
        },
        {
          id: "pornstar-pics",
          name: "Pornstar Pictures",
          description: "Professional adult pictures",
          icon: <Image className="h-4 w-4" />,
          color: "bg-pink-500/10 text-pink-500 hover:bg-pink-500/20",
          threads: 800,
          messages: 3200,
        },
        {
          id: "pornstar-collections",
          name: "Pornstar Collections",
          description: "Pornstar content collections",
          icon: <Folder className="h-4 w-4" />,
          color: "bg-pink-500/10 text-pink-500 hover:bg-pink-500/20",
          threads: 300,
          messages: 1200,
        },
        {
          id: "pornstar-requests",
          name: "Pornstar Requests",
          description: "Pornstar content requests",
          icon: <HelpCircle className="h-4 w-4" />,
          color: "bg-pink-500/10 text-pink-500 hover:bg-pink-500/20",
          threads: 200,
          messages: 800,
        }
      ],
    },
    {
      title: "LESBIAN / GAY PORN",
      description: "LGBTQ+ adult content",
      icon: <Heart className="h-5 w-5 text-red-500" />,
      color: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
      subcategories: [
        {
          id: "lesbian-videos",
          name: "Lesbian Videos",
          description: "Lesbian adult videos",
          icon: <Play className="h-4 w-4" />,
          color: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
          threads: 900,
          messages: 3600,
        },
        {
          id: "gay-videos",
          name: "Gay Videos",
          description: "Gay adult videos",
          icon: <Play className="h-4 w-4" />,
          color: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
          threads: 700,
          messages: 2800,
        },
        {
          id: "lgbtq-collections",
          name: "LGBTQ Collections",
          description: "LGBTQ content collections",
          icon: <Folder className="h-4 w-4" />,
          color: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
          threads: 300,
          messages: 1200,
        },
        {
          id: "lgbtq-requests",
          name: "LGBTQ Requests",
          description: "LGBTQ content requests",
          icon: <HelpCircle className="h-4 w-4" />,
          color: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
          threads: 200,
          messages: 800,
        }
      ],
    },
    {
      title: "HENTAI SECTION",
      description: "Animated adult content",
      icon: <Gamepad2 className="h-5 w-5 text-indigo-500" />,
      color: "bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20",
      subcategories: [
        {
          id: "hentai-videos",
          name: "Hentai Videos",
          description: "Animated adult videos",
          icon: <Play className="h-4 w-4" />,
          color: "bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20",
          threads: 1000,
          messages: 4000,
        },
        {
          id: "hentai-pics",
          name: "Hentai Pictures",
          description: "Animated adult pictures",
          icon: <Image className="h-4 w-4" />,
          color: "bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20",
          threads: 600,
          messages: 2400,
        },
        {
          id: "hentai-collections",
          name: "Hentai Collections",
          description: "Hentai content collections",
          icon: <Folder className="h-4 w-4" />,
          color: "bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20",
          threads: 300,
          messages: 1200,
        },
        {
          id: "hentai-requests",
          name: "Hentai Requests",
          description: "Hentai content requests",
          icon: <HelpCircle className="h-4 w-4" />,
          color: "bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20",
          threads: 200,
          messages: 800,
        }
      ],
    },
    {
      title: "REQUEST ZONE",
      description: "Content request section",
      icon: <HelpCircle className="h-5 w-5 text-orange-500" />,
      color: "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20",
      subcategories: [
        {
          id: "video-requests",
          name: "Video Requests",
          description: "Request specific videos",
          icon: <Play className="h-4 w-4" />,
          color: "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20",
          threads: 600,
          messages: 2400,
        },
        {
          id: "picture-requests",
          name: "Picture Requests",
          description: "Request specific pictures",
          icon: <Image className="h-4 w-4" />,
          color: "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20",
          threads: 400,
          messages: 1600,
        },
        {
          id: "content-requests",
          name: "Content Requests",
          description: "General content requests",
          icon: <HelpCircle className="h-4 w-4" />,
          color: "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20",
          threads: 500,
          messages: 2000,
        },
        {
          id: "fulfilled-requests",
          name: "Fulfilled Requests",
          description: "Successfully fulfilled requests",
          icon: <Check className="h-4 w-4" />,
          color: "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20",
          threads: 700,
          messages: 2800,
        }
      ],
    }
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">{forumCategoriesTitle}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1">
          {detailedCategories.map((category) => (
            <div key={category.title} className="border-b last:border-b-0">
              <button
                onClick={() => toggleCategory(category.title)}
                className="flex w-full items-center justify-between p-4 transition-all duration-300 bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/50"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full flex-shrink-0 ${category.color}`}>{category.icon}</div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">{category.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                  </div>
                </div>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-300",
                    expandedCategories[category.title] && "rotate-180"
                  )}
                />
              </button>
              <AnimatePresence>
                {expandedCategories[category.title] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-1 p-2">
                      {category.subcategories.map((subcategory) => (
                        <Link
                          key={subcategory.id}
                          href={`/forums/${subcategory.id}`}
                          className="flex items-center justify-between p-2 hover:bg-accent/50 rounded-md transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-1.5 rounded-full flex-shrink-0 ${subcategory.color}`}>
                              {subcategory.icon}
                                </div>
                            <div>
                              <h4 className="text-sm font-medium text-foreground">{subcategory.name}</h4>
                              <p className="text-xs text-muted-foreground line-clamp-1">
                                        {descriptions[subcategory.id]}
                                      </p>
                                  </div>
                                    </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Badge variant="outline" className="font-normal">
                              <MessageSquare className="mr-1 h-3 w-3 flex-shrink-0" />
                              <span className="truncate">{subcategory.threads.toLocaleString()}</span>
                            </Badge>
                            <span className="truncate">{subcategory.messages.toLocaleString()} posts</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
