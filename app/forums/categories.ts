export interface CategoryInfo {
  title: string
  description: string
  slug: string
  subCategories?: SubCategoryInfo[]
}

export interface SubCategoryInfo {
  title: string
  description: string
  slug: string
}

export const forumCategories: CategoryInfo[] = [
  {
    title: "Exclusive Videos",
    description: "Premium exclusive video content",
    slug: "exclusive-videos",
    subCategories: [
      {
        title: "Latest Exclusive Videos",
        description: "Newest exclusive video content",
        slug: "latest-exclusive-videos"
      },
      {
        title: "Popular Exclusive Videos",
        description: "Most popular exclusive videos",
        slug: "popular-exclusive-videos"
      },
      {
        title: "HD Exclusive Videos",
        description: "High-quality exclusive videos",
        slug: "hd-exclusive-videos"
      },
      {
        title: "Exclusive Collections",
        description: "Exclusive video collections",
        slug: "exclusive-collections"
      }
    ]
  },
  {
    title: "VIP Section",
    description: "Premium VIP content",
    slug: "vip-section",
    subCategories: [
      {
        title: "VIP Videos",
        description: "Exclusive VIP video content",
        slug: "vip-videos"
      },
      {
        title: "VIP Pictures",
        description: "Exclusive VIP picture content",
        slug: "vip-pics"
      },
      {
        title: "VIP Collections",
        description: "VIP content collections",
        slug: "vip-collections"
      },
      {
        title: "VIP Requests",
        description: "VIP content requests",
        slug: "vip-requests"
      }
    ]
  },
  {
    title: "Desi Videos & Pics",
    description: "Indian and South Asian content",
    slug: "desi-content",
    subCategories: [
      {
        title: "Desi New video Hd/Sd",
        description: "New desi videos in HD and SD quality",
        slug: "desi-new-videos"
      },
      {
        title: "Desi Old Archive",
        description: "Archive of old desi videos",
        slug: "desi-old-archive"
      },
      {
        title: "Desi New Pics",
        description: "Latest desi picture collections",
        slug: "desi-new-pics"
      },
      {
        title: "Desi Old pics",
        description: "Archive of old desi pictures",
        slug: "desi-old-pics"
      },
      {
        title: "Desi Semi Nudes",
        description: "Semi-nude desi content",
        slug: "desi-semi-nudes"
      },
      {
        title: "Overseas Desi Videos",
        description: "Desi content from abroad",
        slug: "overseas-desi-videos"
      },
      {
        title: "Desi Models",
        description: "Professional desi models content",
        slug: "desi-models"
      },
      {
        title: "Live Streams",
        description: "Live streaming content",
        slug: "live-streams"
      },
      {
        title: "Social Media Famous",
        description: "Content from social media personalities",
        slug: "social-media-famous"
      },
      {
        title: "Desi Couples",
        description: "Couple content from desi creators",
        slug: "desi-couples"
      },
      {
        title: "Desi Amateur",
        description: "Amateur desi content",
        slug: "desi-amateur"
      },
      {
        title: "Desi Professional",
        description: "Professional desi content",
        slug: "desi-professional"
      },
      {
        title: "Desi Web Series",
        description: "Desi web series content",
        slug: "desi-web-series"
      },
      {
        title: "Desi Short Films",
        description: "Short film content",
        slug: "desi-short-films"
      },
      {
        title: "Desi Music Videos",
        description: "Music video content",
        slug: "desi-music-videos"
      },
      {
        title: "Desi Behind The Scenes",
        description: "Behind the scenes content",
        slug: "desi-behind-scenes"
      },
      {
        title: "Desi Interviews",
        description: "Interview content",
        slug: "desi-interviews"
      },
      {
        title: "Desi Events",
        description: "Event coverage content",
        slug: "desi-events"
      },
      {
        title: "Desi Fashion Shows",
        description: "Fashion show content",
        slug: "desi-fashion-shows"
      },
      {
        title: "Desi Dance Performances",
        description: "Dance performance content",
        slug: "desi-dance"
      },
      {
        title: "Desi Reality Shows",
        description: "Reality show content",
        slug: "desi-reality-shows"
      },
      {
        title: "Desi Documentaries",
        description: "Documentary content",
        slug: "desi-documentaries"
      },
      {
        title: "Desi Comedy",
        description: "Comedy content",
        slug: "desi-comedy"
      },
      {
        title: "Desi Drama",
        description: "Drama content",
        slug: "desi-drama"
      }
    ]
  },
  {
    title: "Premium OnlyFans",
    description: "Premium OnlyFans content",
    slug: "premium-onlyfans",
    subCategories: [
      {
        title: "OnlyFans Videos",
        description: "Premium OnlyFans videos",
        slug: "onlyfans-videos"
      },
      {
        title: "OnlyFans Pictures",
        description: "Premium OnlyFans pictures",
        slug: "onlyfans-pics"
      },
      {
        title: "OnlyFans Collections",
        description: "OnlyFans content collections",
        slug: "onlyfans-collections"
      },
      {
        title: "OnlyFans Requests",
        description: "OnlyFans content requests",
        slug: "onlyfans-requests"
      }
    ]
  },
  {
    title: "Tik Tok",
    description: "TikTok content and videos",
    slug: "tiktok",
    subCategories: [
      {
        title: "TikTok Videos",
        description: "Latest TikTok videos",
        slug: "tiktok-videos"
      },
      {
        title: "TikTok Collections",
        description: "TikTok video collections",
        slug: "tiktok-collections"
      },
      {
        title: "Popular TikTok",
        description: "Popular TikTok content",
        slug: "popular-tiktok"
      },
      {
        title: "TikTok Requests",
        description: "TikTok content requests",
        slug: "tiktok-requests"
      }
    ]
  },
  {
    title: "Asian Porn",
    description: "Asian adult content",
    slug: "asian-porn",
    subCategories: [
      {
        title: "Asian Videos",
        description: "Asian adult videos",
        slug: "asian-videos"
      },
      {
        title: "Asian Pictures",
        description: "Asian adult pictures",
        slug: "asian-pics"
      },
      {
        title: "Asian Collections",
        description: "Asian content collections",
        slug: "asian-collections"
      },
      {
        title: "Asian Requests",
        description: "Asian content requests",
        slug: "asian-requests"
      }
    ]
  },
  {
    title: "Hollywood & Celebrities",
    description: "Celebrity hot content",
    slug: "hollywood-celebrities",
    subCategories: [
      {
        title: "Celebrity Videos",
        description: "Celebrity hot videos",
        slug: "celebrity-videos"
      },
      {
        title: "Celebrity Pictures",
        description: "Celebrity hot pictures",
        slug: "celebrity-pics"
      },
      {
        title: "Celebrity Collections",
        description: "Celebrity content collections",
        slug: "celebrity-collections"
      },
      {
        title: "Celebrity Requests",
        description: "Celebrity content requests",
        slug: "celebrity-requests"
      }
    ]
  },
  {
    title: "Arab Content",
    description: "Arab videos and pictures",
    slug: "arab-content",
    subCategories: [
      {
        title: "Arab Videos",
        description: "Arab adult videos",
        slug: "arab-videos"
      },
      {
        title: "Arab Pictures",
        description: "Arab adult pictures",
        slug: "arab-pics"
      },
      {
        title: "Arab Collections",
        description: "Arab content collections",
        slug: "arab-collections"
      },
      {
        title: "Arab Requests",
        description: "Arab content requests",
        slug: "arab-requests"
      }
    ]
  },
  {
    title: "Pornstar Section",
    description: "Professional adult content",
    slug: "pornstar-section",
    subCategories: [
      {
        title: "Pornstar Videos",
        description: "Professional adult videos",
        slug: "pornstar-videos"
      },
      {
        title: "Pornstar Pictures",
        description: "Professional adult pictures",
        slug: "pornstar-pics"
      },
      {
        title: "Pornstar Collections",
        description: "Pornstar content collections",
        slug: "pornstar-collections"
      },
      {
        title: "Pornstar Requests",
        description: "Pornstar content requests",
        slug: "pornstar-requests"
      }
    ]
  },
  {
    title: "LGBTQ Content",
    description: "Lesbian and gay adult content",
    slug: "lgbtq-content",
    subCategories: [
      {
        title: "Lesbian Videos",
        description: "Lesbian adult videos",
        slug: "lesbian-videos"
      },
      {
        title: "Gay Videos",
        description: "Gay adult videos",
        slug: "gay-videos"
      },
      {
        title: "LGBTQ Collections",
        description: "LGBTQ content collections",
        slug: "lgbtq-collections"
      },
      {
        title: "LGBTQ Requests",
        description: "LGBTQ content requests",
        slug: "lgbtq-requests"
      }
    ]
  },
  {
    title: "Hentai Section",
    description: "Animated adult content",
    slug: "hentai-section",
    subCategories: [
      {
        title: "Hentai Videos",
        description: "Animated adult videos",
        slug: "hentai-videos"
      },
      {
        title: "Hentai Pictures",
        description: "Animated adult pictures",
        slug: "hentai-pics"
      },
      {
        title: "Hentai Collections",
        description: "Hentai content collections",
        slug: "hentai-collections"
      },
      {
        title: "Hentai Requests",
        description: "Hentai content requests",
        slug: "hentai-requests"
      }
    ]
  },
  {
    title: "Request Zone",
    description: "Content request section",
    slug: "request-zone",
    subCategories: [
      {
        title: "Video Requests",
        description: "Request specific videos",
        slug: "video-requests"
      },
      {
        title: "Picture Requests",
        description: "Request specific pictures",
        slug: "picture-requests"
      },
      {
        title: "Content Requests",
        description: "General content requests",
        slug: "content-requests"
      },
      {
        title: "Fulfilled Requests",
        description: "Successfully fulfilled requests",
        slug: "fulfilled-requests"
      }
    ]
  }
] 