"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { detectBrowserLanguage, hasLanguagePreference } from "@/lib/language-utils"

type Language = {
  code: string
  name: string
  nativeName: string
  direction?: "ltr" | "rtl"
}

type LanguageContextType = {
  currentLanguage: Language
  languages: Language[]
  setLanguage: (code: string) => void
  translations: Record<string, string>
}

// Complete list of languages (removed Tamil, Telugu, Kannada, Gujarati, Marathi, and Punjabi)
export const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "de", name: "German", nativeName: "Deutsch" },
  { code: "it", name: "Italian", nativeName: "Italiano" },
  { code: "pt", name: "Portuguese", nativeName: "Português" },
  { code: "ru", name: "Russian", nativeName: "Русский" },
  { code: "zh-CN", name: "Chinese (Simplified)", nativeName: "中文 - 简体" },
  { code: "zh-TW", name: "Chinese (Traditional)", nativeName: "中文 - 繁體" },
  { code: "ar", name: "Arabic", nativeName: "العربية", direction: "rtl" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "ur", name: "Urdu", nativeName: "اردو", direction: "rtl" },
  { code: "ja", name: "Japanese", nativeName: "日本語" },
  { code: "ko", name: "Korean", nativeName: "한국어" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe" },
  { code: "fa", name: "Persian", nativeName: "فارسی", direction: "rtl" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt" },
  { code: "th", name: "Thai", nativeName: "ไทย" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia" },
  { code: "ms", name: "Malay", nativeName: "Bahasa Melayu" },
  { code: "tl", name: "Filipino", nativeName: "Filipino / Tagalog" },
  { code: "my", name: "Burmese", nativeName: "မြန်မာဘာသာ" },
  { code: "sw", name: "Swahili", nativeName: "Swahili" },
  { code: "uk", name: "Ukrainian", nativeName: "Українська" },
  { code: "he", name: "Hebrew", nativeName: "עברית", direction: "rtl" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands" },
  { code: "el", name: "Greek", nativeName: "Ελληνικά" },
  { code: "pl", name: "Polish", nativeName: "Polski" },
  { code: "cs", name: "Czech", nativeName: "Čeština" },
  { code: "hu", name: "Hungarian", nativeName: "Magyar" },
  { code: "ro", name: "Romanian", nativeName: "Română" },
  { code: "sk", name: "Slovak", nativeName: "Slovenčina" },
  { code: "sr", name: "Serbian", nativeName: "Српски" },
  { code: "hr", name: "Croatian", nativeName: "Hrvatski" },
  { code: "bg", name: "Bulgarian", nativeName: "Български" },
  { code: "fi", name: "Finnish", nativeName: "Suomi" },
  { code: "sv", name: "Swedish", nativeName: "Svenska" },
  { code: "no", name: "Norwegian", nativeName: "Norsk" },
  { code: "da", name: "Danish", nativeName: "Dansk" },
  { code: "ms-MY", name: "Malay (Malaysia)", nativeName: "Bahasa Malaysia" },
  { code: "ne", name: "Nepali", nativeName: "नेपाली" },
  { code: "si", name: "Sinhala", nativeName: "සිංහල" },
  { code: "km", name: "Khmer", nativeName: "ភាសាខ្មែរ" },
]

// Base translations for English
const baseTranslations = {
  // Navigation
  home: "Home",
  forums: "Forums",
  videos: "Videos",
  live: "Live Sex",
  live_sex: "Live Sex",
  telegram: "Telegram",
  activity: "Today's Activity",
  today_activity: "Today's Activity",
  leaderboard: "Leaderboard",
  staff: "Staff",
  partners: "Partners",

  // User account
  login: "Log in",
  register: "Register",
  profile: "Profile",
  settings: "Settings",
  logout: "Log out",

  // Hero section
  welcome: "Welcome to SorryMom Forum",
  join_community: "Join our community for discussions, content sharing, and more",
  search: "Search forums, topics, or posts...",
  new_post: "New Post",

  // Forum categories
  forum: "Forum",
  forum_categories: "Forum Categories",
  browse_categories: "Browse all available forum categories",
  announcements: "Announcements",
  announcements_desc: "Important updates and news",
  galleries: "Galleries & Videos",
  galleries_desc: "Post and embed videos and image galleries",
  exclusive: "Exclusive",
  exclusive_desc: "Premium exclusive content",
  tiktok: "TikTok Videos",
  tiktok_desc: "TikTok related content and discussions",
  onlyfans: "OnlyFans",
  onlyfans_desc: "OnlyFans discussions and content",
  celebrity: "Celebrity",
  celebrity_desc: "Celebrity news and discussions",
  patreon: "Patreon",
  patreon_desc: "Patreon content and discussions",

  // Latest posts
  latest_posts: "Latest Posts",
  recent_activity: "Recent activity from our community",
  new_tag: "New",
  hot_tag: "Hot",
  by: "By",
  view: "view",
  views: "views",
  moment_ago: "A moment ago",
  minute_ago: "1 minute ago",
  minutes_ago: "minutes ago",

  // Network sidebar
  network: "Network",
  related_sites: "Related sites and resources",
  sexy_egirls: "Sexy eGirls",
  thotbook: "Thotbook.tv",
  famous_nudes: "Famous Nudes",
  cartoon_porn: "Cartoon Porn",
  thotflix: "ThotFlix",
  onlyfans_leaks: "OnlyFans Leaks",

  // Forum stats
  forum_statistics: "Forum Statistics",
  community_metrics: "Community activity metrics",
  members: "Members",
  total_posts: "Total Posts",
  latest_member: "Latest Member",

  // Footer
  copyright: "All rights reserved.",
  terms: "Terms",
  privacy: "Privacy",
  contact: "Contact",
  language: "Language",

  // Thread page
  threads: "Threads",
  replies: "Replies",
  reply: "Reply",
  like: "Like",
  share: "Share",
  report: "Report",
  post_reply: "Post Reply",

  // Advertisement
  advertisement: "Advertisement",

  // Language detection
  auto_detected: "Automatically detected",
  language_changed: "Language changed to",

  // Theme switcher
  light_mode: "Light mode",
  dark_mode: "Dark mode",
  system_theme: "System",
  theme: "Theme",

  // Live chat
  live_chat: "Live Chat",
  online_users_desc: "Online users",
  send_message: "Send message",
  type_message: "Type a message...",
  resize_chat: "Resize chat",
  increase_height: "Increase chat height",
  decrease_height: "Decrease chat height",
}

// Define translations for all languages
const translationSets: Record<string, Record<string, string>> = {
  en: baseTranslations,

  es: {
    // Navigation
    home: "Inicio",
    forums: "Foros",
    videos: "Videos",
    live: "En vivo",
    live_sex: "Sexo en vivo",
    today_activity: "Actividad de hoy",
    telegram: "Telegram",
    forum: "Foro",
    exclusive: "Exclusivo",
    exclusive_desc: "Contenido premium exclusivo",

    // User account
    login: "Iniciar sesión",
    register: "Registrarse",
    profile: "Perfil",
    settings: "Configuración",
    logout: "Cerrar sesión",

    // Hero section
    welcome: "Bienvenido al Foro SorryMom",
    join_community: "Únete a nuestra comunidad para discusiones, compartir contenido y más",
    search: "Buscar foros, temas o publicaciones...",
    new_post: "Nueva Publicación",

    // Forum categories
    forum_categories: "Categorías del Foro",
    browse_categories: "Explora todas las categorías disponibles",
    announcements: "Anuncios",
    announcements_desc: "Actualizaciones importantes y noticias",
    galleries: "Galerías y Videos",
    galleries_desc: "Publica e incrusta videos y galerías de imágenes",
    tiktok: "Videos de TikTok",
    tiktok_desc: "Contenido y discusiones relacionadas con TikTok",
    onlyfans: "OnlyFans",
    onlyfans_desc: "Discusiones y contenido de OnlyFans",
    celebrity: "Celebridades",
    celebrity_desc: "Noticias y discusiones sobre celebridades",
    patreon: "Patreon",
    patreon_desc: "Contenido y discusiones de Patreon",

    // Latest posts
    latest_posts: "Últimas Publicaciones",
    recent_activity: "Actividad reciente de nuestra comunidad",
    new_tag: "Nuevo",
    hot_tag: "Popular",
    by: "Por",
    view: "vista",
    views: "vistas",
    moment_ago: "Hace un momento",
    minute_ago: "Hace 1 minuto",
    minutes_ago: "minutos atrás",

    // Network sidebar
    network: "Red",
    related_sites: "Sitios relacionados y recursos",
    sexy_egirls: "Sexy eGirls",
    thotbook: "Thotbook.tv",
    famous_nudes: "Famous Nudes",
    cartoon_porn: "Cartoon Porn",
    thotflix: "ThotFlix",
    onlyfans_leaks: "OnlyFans Leaks",

    // Forum stats
    forum_statistics: "Estadísticas del Foro",
    community_metrics: "Métricas de actividad de la comunidad",
    members: "Miembros",
    total_posts: "Publicaciones Totales",
    latest_member: "Último Miembro",

    // Footer
    copyright: "Todos los derechos reservados.",
    terms: "Términos",
    privacy: "Privacidad",
    contact: "Contacto",
    language: "Idioma",

    // Thread page
    threads: "Hilos",
    replies: "Respuestas",
    reply: "Responder",
    like: "Me gusta",
    share: "Compartir",
    report: "Reportar",
    post_reply: "Publicar Respuesta",

    // Advertisement
    advertisement: "Publicidad",

    // Language detection
    auto_detected: "Detectado automáticamente",
    language_changed: "Idioma cambiado a",

    // Theme switcher
    light_mode: "Modo claro",
    dark_mode: "Modo oscuro",
    system_theme: "Sistema",
    theme: "Tema",

    // Live chat
    live_chat: "Chat en vivo",
    online_users_desc: "Usuarios en línea",
    send_message: "Enviar mensaje",
    type_message: "Escribe un mensaje...",
    resize_chat: "Cambiar tamaño del chat",
    increase_height: "Aumentar altura del chat",
    decrease_height: "Disminuir altura del chat",
  },

  fr: {
    // Navigation
    home: "Accueil",
    forums: "Forums",
    videos: "Vidéos",
    live: "En direct",
    live_sex: "Sexe en direct",
    today_activity: "Activité du jour",
    telegram: "Telegram",
    forum: "Forum",
    exclusive: "Exclusif",
    exclusive_desc: "Contenu premium exclusif",

    // User account
    login: "Se connecter",
    register: "S'inscrire",
    profile: "Profil",
    settings: "Paramètres",
    logout: "Se déconnecter",

    // Hero section
    welcome: "Bienvenue sur le Forum SorryMom",
    join_community: "Rejoignez notre communauté pour des discussions, du partage de contenu et plus encore",
    search: "Rechercher des forums, des sujets ou des messages...",
    new_post: "Nouveau Message",

    // Forum categories
    forum_categories: "Catégories du Forum",
    browse_categories: "Parcourir toutes les catégories disponibles",
    announcements: "Annonces",
    announcements_desc: "Mises à jour importantes et nouvelles",
    galleries: "Galeries et Vidéos",
    galleries_desc: "Publiez et intégrez des vidéos et des galeries d'images",
    tiktok: "Vidéos TikTok",
    tiktok_desc: "Contenu et discussions liés à TikTok",
    onlyfans: "OnlyFans",
    onlyfans_desc: "Discussions et contenu OnlyFans",
    celebrity: "Célébrités",
    celebrity_desc: "Nouvelles et discussions sur les célébrités",
    patreon: "Patreon",
    patreon_desc: "Contenu et discussions Patreon",

    // Latest posts
    latest_posts: "Derniers Messages",
    recent_activity: "Activité récente de notre communauté",
    new_tag: "Nouveau",
    hot_tag: "Populaire",
    by: "Par",
    view: "vue",
    views: "vues",
    moment_ago: "Il y a un instant",
    minute_ago: "Il y a 1 minute",
    minutes_ago: "minutes",

    // Network sidebar
    network: "Réseau",
    related_sites: "Sites et ressources connexes",
    sexy_egirls: "Sexy eGirls",
    thotbook: "Thotbook.tv",
    famous_nudes: "Famous Nudes",
    cartoon_porn: "Cartoon Porn",
    thotflix: "ThotFlix",
    onlyfans_leaks: "OnlyFans Leaks",

    // Forum stats
    forum_statistics: "Statistiques du Forum",
    community_metrics: "Métriques d'activité de la communauté",
    members: "Membres",
    total_posts: "Total des Messages",
    latest_member: "Dernier Membre",

    // Footer
    copyright: "Tous droits réservés.",
    terms: "Conditions",
    privacy: "Confidentialité",
    contact: "Contact",
    language: "Langue",

    // Thread page
    threads: "Fils de discussion",
    replies: "Réponses",
    reply: "Répondre",
    like: "J'aime",
    share: "Partager",
    report: "Signaler",
    post_reply: "Poster une Réponse",

    // Advertisement
    advertisement: "Publicité",

    // Language detection
    auto_detected: "Détecté automatiquement",
    language_changed: "Langue changée en",

    // Theme switcher
    light_mode: "Mode clair",
    dark_mode: "Mode sombre",
    system_theme: "Système",
    theme: "Thème",

    // Live chat
    live_chat: "Chat en direct",
    online_users_desc: "Utilisateurs en ligne",
    send_message: "Envoyer un message",
    type_message: "Tapez un message...",
    resize_chat: "Redimensionner le chat",
    increase_height: "Augmenter la hauteur",
    decrease_height: "Diminuer la hauteur",
  },

  de: {
    // Navigation
    home: "Startseite",
    forums: "Foren",
    videos: "Videos",
    live: "Live",
    live_sex: "Live Sex",
    today_activity: "Heutige Aktivität",
    telegram: "Telegram",
    forum: "Forum",
    exclusive: "Exklusiv",
    exclusive_desc: "Premium exklusive Inhalte",

    // User account
    login: "Anmelden",
    register: "Registrieren",
    profile: "Profil",
    settings: "Einstellungen",
    logout: "Abmelden",

    // Hero section
    welcome: "Willkommen im SorryMom Forum",
    join_community: "Treten Sie unserer Gemeinschaft bei für Diskussionen, Content-Sharing und mehr",
    search: "Foren, Themen oder Beiträge durchsuchen...",
    new_post: "Neuer Beitrag",

    // Forum categories
    forum_categories: "Forum-Kategorien",
    browse_categories: "Alle verfügbaren Kategorien durchsuchen",
    announcements: "Ankündigungen",
    announcements_desc: "Wichtige Updates und Neuigkeiten",
    galleries: "Galerien & Videos",
    galleries_desc: "Posten und einbetten von Videos und Bildergalerien",
    tiktok: "TikTok Videos",
    tiktok_desc: "TikTok-bezogene Inhalte und Diskussionen",
    onlyfans: "OnlyFans",
    onlyfans_desc: "OnlyFans Diskussionen und Inhalte",
    celebrity: "Prominente",
    celebrity_desc: "Promi-Nachrichten und Diskussionen",
    patreon: "Patreon",
    patreon_desc: "Patreon-Inhalte und Diskussionen",

    // Latest posts
    latest_posts: "Neueste Beiträge",
    recent_activity: "Aktuelle Aktivitäten unserer Community",
    new_tag: "Neu",
    hot_tag: "Beliebt",
    by: "Von",
    view: "Ansicht",
    views: "Ansichten",
    moment_ago: "Vor einem Moment",
    minute_ago: "Vor 1 Minute",
    minutes_ago: "Minuten her",

    // Network sidebar
    network: "Netzwerk",
    related_sites: "Verwandte Websites und Ressourcen",
    sexy_egirls: "Sexy eGirls",
    thotbook: "Thotbook.tv",
    famous_nudes: "Famous Nudes",
    cartoon_porn: "Cartoon Porn",
    thotflix: "ThotFlix",
    onlyfans_leaks: "OnlyFans Leaks",

    // Forum stats
    forum_statistics: "Forum-Statistiken",
    community_metrics: "Aktivitätsmetriken der Community",
    members: "Mitglieder",
    total_posts: "Gesamtbeiträge",
    latest_member: "Neuestes Mitglied",

    // Footer
    copyright: "Alle Rechte vorbehalten.",
    terms: "Nutzungsbedingungen",
    privacy: "Datenschutz",
    contact: "Kontakt",
    language: "Sprache",

    // Thread page
    threads: "Themen",
    replies: "Antworten",
    reply: "Antworten",
    like: "Gefällt mir",
    share: "Teilen",
    report: "Melden",
    post_reply: "Antwort posten",

    // Advertisement
    advertisement: "Werbung",

    // Language detection
    auto_detected: "Automatisch erkannt",
    language_changed: "Sprache geändert zu",

    // Theme switcher
    light_mode: "Heller Modus",
    dark_mode: "Dunkler Modus",
    system_theme: "System",
    theme: "Thema",

    // Live chat
    live_chat: "Live-Chat",
    online_users_desc: "Benutzer online",
    send_message: "Nachricht senden",
    type_message: "Nachricht eingeben...",
    resize_chat: "Chat-Größe ändern",
    increase_height: "Höhe vergrößern",
    decrease_height: "Höhe verringern",
  },

  it: {
    // Navigation
    home: "Home",
    forums: "Forum",
    videos: "Video",
    live: "Live",
    live_sex: "Sesso dal vivo",
    today_activity: "Attività di oggi",
    telegram: "Telegram",
    forum: "Forum",
    exclusive: "Esclusivo",
    exclusive_desc: "Contenuti premium esclusivi",

    // User account
    login: "Accedi",
    register: "Registrati",
    profile: "Profilo",
    settings: "Impostazioni",
    logout: "Esci",

    // Hero section
    welcome: "Benvenuto nel Forum SorryMom",
    join_community: "Unisciti alla nostra comunità per discussioni, condivisione di contenuti e altro",
    search: "Cerca forum, argomenti o post...",
    new_post: "Nuovo Post",

    // Forum categories
    forum_categories: "Categorie del Forum",
    browse_categories: "Sfoglia tutte le categorie disponibili",
    announcements: "Annunci",
    announcements_desc: "Aggiornamenti importanti e notizie",
    galleries: "Gallerie e Video",
    galleries_desc: "Pubblica e incorpora video e gallerie di immagini",
    tiktok: "Video TikTok",
    tiktok_desc: "Contenuti e discussioni relativi a TikTok",
    onlyfans: "OnlyFans",
    onlyfans_desc: "Discussioni e contenuti di OnlyFans",
    celebrity: "Celebrità",
    celebrity_desc: "Notizie e discussioni sulle celebrità",
    patreon: "Patreon",
    patreon_desc: "Contenuti e discussioni di Patreon",

    // Latest posts
    latest_posts: "Ultimi Post",
    recent_activity: "Attività recente della nostra comunità",
    new_tag: "Nuovo",
    hot_tag: "Popolare",
    by: "Da",
    view: "visualizzazione",
    views: "visualizzazioni",
    moment_ago: "Un momento fa",
    minute_ago: "1 minuto fa",
    minutes_ago: "minuti fa",

    // Network sidebar
    network: "Rete",
    related_sites: "Siti e risorse correlati",
    sexy_egirls: "Sexy eGirls",
    thotbook: "Thotbook.tv",
    famous_nudes: "Famous Nudes",
    cartoon_porn: "Cartoon Porn",
    thotflix: "ThotFlix",
    onlyfans_leaks: "OnlyFans Leaks",

    // Forum stats
    forum_statistics: "Statistiche del Forum",
    community_metrics: "Metriche di attività della comunità",
    members: "Membri",
    total_posts: "Post Totali",
    latest_member: "Ultimo Membro",

    // Footer
    copyright: "Tutti i diritti riservati.",
    terms: "Termini",
    privacy: "Privacy",
    contact: "Contatti",
    language: "Lingua",

    // Thread page
    threads: "Discussioni",
    replies: "Risposte",
    reply: "Rispondi",
    like: "Mi piace",
    share: "Condividi",
    report: "Segnala",
    post_reply: "Pubblica Risposta",

    // Advertisement
    advertisement: "Pubblicità",

    // Language detection
    auto_detected: "Rilevato automaticamente",
    language_changed: "Lingua cambiata in",

    // Theme switcher
    light_mode: "Modalità chiara",
    dark_mode: "Modalità scura",
    system_theme: "Sistema",
    theme: "Tema",
  },

  pt: {
    // Navigation
    home: "Início",
    forums: "Fóruns",
    videos: "Vídeos",
    live: "Ao vivo",
    live_sex: "Sexo ao vivo",
    today_activity: "Atividade de hoje",
    telegram: "Telegram",
    forum: "Fórum",
    exclusive: "Exclusivo",
    exclusive_desc: "Conteúdo premium exclusivo",

    // User account
    login: "Entrar",
    register: "Registrar",
    profile: "Perfil",
    settings: "Configurações",
    logout: "Sair",

    // Hero section
    welcome: "Bem-vindo ao Fórum SorryMom",
    join_community: "Junte-se à nossa comunidade para discussões, compartilhamento de conteúdo e mais",
    search: "Pesquisar fóruns, tópicos ou posts...",
    new_post: "Novo Post",

    // Forum categories
    forum_categories: "Categorias do Fórum",
    browse_categories: "Navegue por todas as categorias disponíveis",
    announcements: "Anúncios",
    announcements_desc: "Atualizações importantes e notícias",
    galleries: "Galerias e Vídeos",
    galleries_desc: "Poste e incorpore vídeos e galerias de imagens",
    tiktok: "Vídeos do TikTok",
    tiktok_desc: "Conteúdo e discussões relacionados ao TikTok",
    onlyfans: "OnlyFans",
    onlyfans_desc: "Discussões e conteúdo do OnlyFans",
    celebrity: "Celebridades",
    celebrity_desc: "Notícias e discussões sobre celebridades",
    patreon: "Patreon",
    patreon_desc: "Conteúdo e discussões do Patreon",

    // Latest posts
    latest_posts: "Últimos Posts",
    recent_activity: "Atividade recente da nossa comunidade",
    new_tag: "Novo",
    hot_tag: "Popular",
    by: "Por",
    view: "visualização",
    views: "visualizações",
    moment_ago: "Há um momento",
    minute_ago: "Há 1 minuto",
    minutes_ago: "minutos atrás",

    // Network sidebar
    network: "Rede",
    related_sites: "Sites e recursos relacionados",
    sexy_egirls: "Sexy eGirls",
    thotbook: "Thotbook.tv",
    famous_nudes: "Famous Nudes",
    cartoon_porn: "Cartoon Porn",
    thotflix: "ThotFlix",
    onlyfans_leaks: "OnlyFans Leaks",

    // Forum stats
    forum_statistics: "Estatísticas do Fórum",
    community_metrics: "Métricas de atividade da comunidade",
    members: "Membros",
    total_posts: "Total de Posts",
    latest_member: "Último Membro",

    // Footer
    copyright: "Todos os direitos reservados.",
    terms: "Termos",
    privacy: "Privacidade",
    contact: "Contato",
    language: "Idioma",

    // Thread page
    threads: "Tópicos",
    replies: "Respostas",
    reply: "Responder",
    like: "Curtir",
    share: "Compartilhar",
    report: "Denunciar",
    post_reply: "Postar Resposta",

    // Advertisement
    advertisement: "Publicidade",

    // Language detection
    auto_detected: "Detectado automaticamente",
    language_changed: "Idioma alterado para",

    // Theme switcher
    light_mode: "Modo claro",
    dark_mode: "Modo escuro",
    system_theme: "Sistema",
    theme: "Tema",
  },

  ru: {
    // Navigation
    home: "Главная",
    forums: "Форумы",
    videos: "Видео",
    live: "Прямой эфир",
    live_sex: "Секс в прямом эфире",
    today_activity: "Сегодняшняя активность",
    telegram: "Телеграм",
    forum: "Форум",
    exclusive: "Эксклюзив",
    exclusive_desc: "Премиум эксклюзивный контент",

    // User account
    login: "Войти",
    register: "Регистрация",
    profile: "Профиль",
    settings: "Настройки",
    logout: "Выйти",

    // Hero section
    welcome: "Добро пожаловать на форум SorryMom",
    join_community: "Присоединяйтесь к нашему сообществу для обсуждений, обмена контентом и многого другого",
    search: "Поиск по форумам, темам или сообщениям...",
    new_post: "Новое сообщение",

    // Forum categories
    forum_categories: "Категории форума",
    browse_categories: "Просмотр всех доступных категорий",
    announcements: "Объявления",
    announcements_desc: "Важные обновления и новости",
    galleries: "Галереи и видео",
    galleries_desc: "Публикация и встраивание видео и галерей изображений",
    tiktok: "Видео TikTok",
    tiktok_desc: "Контент и обсуждения, связанные с TikTok",
    onlyfans: "OnlyFans",
    onlyfans_desc: "Обсуждения и контент OnlyFans",
    celebrity: "Знаменитости",
    celebrity_desc: "Новости и обсуждения знаменитостей",
    patreon: "Patreon",
    patreon_desc: "Контент и обсуждения Patreon",

    // Latest posts
    latest_posts: "Последние сообщения",
    recent_activity: "Недавняя активность нашего сообщества",
    new_tag: "Новое",
    hot_tag: "Популярное",
    by: "От",
    view: "просмотр",
    views: "просмотров",
    moment_ago: "Только что",
    minute_ago: "1 минуту назад",
    minutes_ago: "минут назад",

    // Network sidebar
    network: "Сеть",
    related_sites: "Связанные сайты и ресурсы",
    sexy_egirls: "Sexy eGirls",
    thotbook: "Thotbook.tv",
    famous_nudes: "Famous Nudes",
    cartoon_porn: "Cartoon Porn",
    thotflix: "ThotFlix",
    onlyfans_leaks: "OnlyFans Leaks",

    // Forum stats
    forum_statistics: "Статистика форума",
    community_metrics: "Метрики активности сообщества",
    members: "Участники",
    total_posts: "Всего сообщений",
    latest_member: "Последний участник",

    // Footer
    copyright: "Все права защищены.",
    terms: "Условия",
    privacy: "Конфиденциальность",
    contact: "Контакты",
    language: "Язык",

    // Thread page
    threads: "Темы",
    replies: "Ответы",
    reply: "Ответить",
    like: "Нравится",
    share: "Поделиться",
    report: "Пожаловаться",
    post_reply: "Отправить ответ",

    // Advertisement
    advertisement: "Реклама",

    // Language detection
    auto_detected: "Автоматически определено",
    language_changed: "Язык изменен на",

    // Theme switcher
    light_mode: "Светлый режим",
    dark_mode: "Темный режим",
    system_theme: "Система",
    theme: "Тема",
  },

  "zh-CN": {
    // Navigation
    home: "首页",
    forums: "论坛",
    videos: "视频",
    live: "直播",
    live_sex: "在线性爱",
    today_activity: "今日活动",
    telegram: "电报",
    forum: "论坛",
    exclusive: "独家",
    exclusive_desc: "高级独家内容",

    // User account
    login: "登录",
    register: "注册",
    profile: "个人资料",
    settings: "设置",
    logout: "退出",

    // Hero section
    welcome: "欢迎来到 SorryMom 论坛",
    join_community: "加入我们的社区，参与讨论、分享内容等",
    search: "搜索论坛、主题或帖子...",
    new_post: "发布新帖",

    // Forum categories
    forum_categories: "论坛分类",
    browse_categories: "浏览所有可用分类",
    announcements: "公告",
    announcements_desc: "重要更新和新闻",
    galleries: "图库和视频",
    galleries_desc: "发布和嵌入视频和图片库",
    tiktok: "抖音视频",
    tiktok_desc: "抖音相关内容和讨论",
    onlyfans: "OnlyFans",
    onlyfans_desc: "OnlyFans 讨论和内容",
    celebrity: "名人",
    celebrity_desc: "名人新闻和讨论",
    patreon: "Patreon",
    patreon_desc: "Patreon 内容和讨论",

    // Latest posts
    latest_posts: "最新帖子",
    recent_activity: "我们社区的最近活动",
    new_tag: "新",
    hot_tag: "热门",
    by: "由",
    view: "查看",
    views: "查看",
    moment_ago: "刚刚",
    minute_ago: "1分钟前",
    minutes_ago: "分钟前",

    // Network sidebar
    network: "网络",
    related_sites: "相关网站和资源",
    sexy_egirls: "Sexy eGirls",
    thotbook: "Thotbook.tv",
    famous_nudes: "Famous Nudes",
    cartoon_porn: "Cartoon Porn",
    thotflix: "ThotFlix",
    onlyfans_leaks: "OnlyFans Leaks",

    // Forum stats
    forum_statistics: "论坛统计",
    community_metrics: "社区活动指标",
    members: "成员",
    total_posts: "总帖子",
    latest_member: "最新成员",

    // Footer
    copyright: "版权所有。",
    terms: "条款",
    privacy: "隐私",
    contact: "联系",
    language: "语言",

    // Thread page
    threads: "主题",
    replies: "回复",
    reply: "回复",
    like: "点赞",
    share: "分享",
    report: "举报",
    post_reply: "发表回复",

    // Advertisement
    advertisement: "广告",

    // Language detection
    auto_detected: "自动检测",
    language_changed: "语言已更改为",

    // Theme switcher
    light_mode: "浅色模式",
    dark_mode: "深色模式",
    system_theme: "系统",
    theme: "主题",
  },

  "zh-TW": {
    // Navigation
    home: "首頁",
    forums: "論壇",
    videos: "視頻",
    live: "直播",
    telegram: "電報",
    forum: "論壇",
    exclusive: "獨家",
    exclusive_desc: "高級獨家內容",

    // User account
    login: "登錄",
    register: "註冊",
    profile: "個人資料",
    settings: "設置",
    logout: "退出",

    // Hero section
    welcome: "歡迎來到 SorryMom 論壇",
    join_community: "加入我們的社區，參與討論、分享內容等",
    search: "搜索論壇、主題或帖子...",
    new_post: "發布新帖",

    // Forum categories
    forum_categories: "論壇分類",
    browse_categories: "瀏覽所有可用分類",
    announcements: "公告",
    announcements_desc: "重要更新和新聞",
    galleries: "圖庫和視頻",
    galleries_desc: "發布和嵌入視頻和圖片庫",
    tiktok: "抖音視頻",
    tiktok_desc: "抖音相關內容和討論",
    onlyfans: "OnlyFans",
    onlyfans_desc: "OnlyFans 討論和內容",
    celebrity: "名人",
    celebrity_desc: "名人新聞和討論",
    patreon: "Patreon",
    patreon_desc: "Patreon 內容和討論",

    // Latest posts
    latest_posts: "最新帖子",
    recent_activity: "我們社區的最近活動",
    new_tag: "新",
    hot_tag: "熱門",
    by: "由",
    view: "查看",
    views: "查看",
    moment_ago: "剛剛",
    minute_ago: "1分鐘前",
    minutes_ago: "分鐘前",

    // Network sidebar
    network: "網絡",
    related_sites: "相關網站和資源",
    sexy_egirls: "Sexy eGirls",
    thotbook: "Thotbook.tv",
    famous_nudes: "Famous Nudes",
    cartoon_porn: "Cartoon Porn",
    thotflix: "ThotFlix",
    onlyfans_leaks: "OnlyFans Leaks",

    // Forum stats
    forum_statistics: "論壇統計",
    community_metrics: "社區活動指標",
    members: "成員",
    total_posts: "總帖子",
    latest_member: "最新成員",

    // Footer
    copyright: "版權所有。",
    terms: "條款",
    privacy: "隱私",
    contact: "聯繫",
    language: "語言",

    // Thread page
    threads: "主題",
    replies: "回復",
    reply: "回復",
    like: "點讚",
    share: "分享",
    report: "舉報",
    post_reply: "發表回復",

    // Advertisement
    advertisement: "廣告",

    // Language detection
    auto_detected: "自動檢測",
    language_changed: "語言已更改為",

    // Theme switcher
    light_mode: "淺色模式",
    dark_mode: "深色模式",
    system_theme: "系統",
    theme: "主題",
  },

  ar: {
    // Navigation
    home: "الرئيسية",
    forums: "المنتديات",
    videos: "الفيديوهات",
    live: "البث المباشر",
    live_sex: "جنس مباشر",
    today_activity: "نشاط اليوم",
    telegram: "تيليجرام",
    forum: "منتدى",
    exclusive: "حصري",
    exclusive_desc: "محتوى حصري مميز",

    // User account
    login: "تسجيل الدخول",
    register: "التسجيل",
    profile: "الملف الشخصي",
    settings: "الإعدادات",
    logout: "تسجيل الخروج",

    // Hero section
    welcome: "مرحبًا بك في منتدى SorryMom",
    join_community: "انضم إلى مجتمعنا للمناقشات ومشاركة المحتوى والمزيد",
    search: "البحث في المنتديات والمواضيع أو المنشورات...",
    new_post: "منشور جديد",

    // Forum categories
    forum_categories: "فئات المنتدى",
    browse_categories: "تصفح جميع الفئات المتاحة",
    announcements: "الإعلانات",
    announcements_desc: "تحديثات وأخبار مهمة",
    galleries: "المعارض والفيديوهات",
    galleries_desc: "نشر وتضمين الفيديوهات ومعارض الصور",
    tiktok: "فيديوهات تيك توك",
    tiktok_desc: "محتوى ومناقشات متعلقة بتيك توك",
    onlyfans: "OnlyFans",
    onlyfans_desc: "مناقشات ومحتوى OnlyFans",
    celebrity: "المشاهير",
    celebrity_desc: "أخبار ومناقشات المشاهير",
    patreon: "Patreon",
    patreon_desc: "محتوى ومناقشات Patreon",

    // Latest posts
    latest_posts: "أحدث المنشورات",
    recent_activity: "النشاط الأخير من مجتمعنا",
    new_tag: "جديد",
    hot_tag: "شائع",
    by: "بواسطة",
    view: "مشاهدة",
    views: "مشاهدات",
    moment_ago: "منذ لحظة",
    minute_ago: "منذ دقيقة واحدة",
    minutes_ago: "دقائق مضت",

    // Network sidebar
    network: "الشبكة",
    related_sites: "مواقع وموارد ذات صلة",
    sexy_egirls: "Sexy eGirls",
    thotbook: "Thotbook.tv",
    famous_nudes: "Famous Nudes",
    cartoon_porn: "Cartoon Porn",
    thotflix: "ThotFlix",
    onlyfans_leaks: "OnlyFans Leaks",

    // Forum stats
    forum_statistics: "إحصائيات المنتدى",
    community_metrics: "مقاييس نشاط المجتمع",
    members: "الأعضاء",
    total_posts: "إجمالي المنشورات",
    latest_member: "أحدث عضو",

    // Footer
    copyright: "جميع الحقوق محفوظة.",
    terms: "الشروط",
    privacy: "الخصوصية",
    contact: "اتصل بنا",
    language: "اللغة",

    // Thread page
    threads: "المواضيع",
    replies: "الردود",
    reply: "رد",
    like: "إعجاب",
    share: "مشاركة",
    report: "إبلاغ",
    post_reply: "نشر رد",

    // Advertisement
    advertisement: "إعلان",

    // Language detection
    auto_detected: "تم الكشف تلقائيًا",
    language_changed: "تم تغيير اللغة إلى",

    // Theme switcher
    light_mode: "الوضع الفاتح",
    dark_mode: "الوضع الداكن",
    system_theme: "النظام",
    theme: "السمة",
  },

  hi: {
    // Navigation
    home: "होम",
    forums: "फोरम",
    videos: "वीडियो",
    live: "लाइव",
    telegram: "टेलीग्राम",
    live_sex: "लाइव सेक्स",
    today_activity: "आज की गतिविधि",
    forum: "फोरम",
    exclusive: "विशेष",
    exclusive_desc: "प्रीमियम विशेष सामग्री",

    // User account
    login: "लॉग इन",
    register: "रजिस्टर",
    profile: "प्रोफाइल",
    settings: "सेटिंग्स",
    logout: "लॉग आउट",

    // Hero section
    welcome: "SorryMom फोरम में आपका स्वागत है",
    join_community: "चर्चा, सामग्री साझा करने और अधिक के लिए हमारे समुदाय से जुड़ें",
    search: "फोरम, विषय या पोस्ट खोजें...",
    new_post: "नई पोस्ट",

    // Forum categories
    forum_categories: "फोरम श्रेणियां",
    browse_categories: "सभी उपलब्ध श्रेणियां ब्राउज़ करें",
    announcements: "घोषणाएँ",
    announcements_desc: "महत्वपूर्ण अपडेट और समाचार",
    galleries: "गैलरी और वीडियो",
    galleries_desc: "वीडियो और छवि गैलरी पोस्ट और एम्बेड करें",
    tiktok: "टिकटॉक वीडियो",
    tiktok_desc: "टिकटॉक संबंधित सामग्री और चर्चा",
    onlyfans: "OnlyFans",
    onlyfans_desc: "OnlyFans चर्चा और सामग्री",
    celebrity: "सेलिब्रिटी",
    celebrity_desc: "सेलिब्रिटी समाचार और चर्चा",
    patreon: "Patreon",
    patreon_desc: "Patreon सामग्री और चर्चा",

    // Latest posts
    latest_posts: "नवीनतम पोस्ट",
    recent_activity: "हमारे समुदाय की हाल की गतिविधि",
    new_tag: "नया",
    hot_tag: "लोकप्रिय",
    by: "द्वारा",
    view: "दृश्य",
    views: "दृश्य",
    moment_ago: "एक क्षण पहले",
    minute_ago: "1 मिनट पहले",
    minutes_ago: "मिनट पहले",

    // Network sidebar
    network: "नेटवर्क",
    related_sites: "संबंधित साइट और संसाधन",
    sexy_egirls: "Sexy eGirls",
    thotbook: "Thotbook.tv",
    famous_nudes: "Famous Nudes",
    cartoon_porn: "Cartoon Porn",
    thotflix: "ThotFlix",
    onlyfans_leaks: "OnlyFans Leaks",

    // Forum stats
    forum_statistics: "फोरम आंकड़े",
    community_metrics: "समुदाय गतिविधि मेट्रिक्स",
    members: "सदस्य",
    total_posts: "कुल पोस्ट",
    latest_member: "नवीनतम सदस्य",

    // Footer
    copyright: "सर्वाधिकार सुरक्षित।",
    terms: "शर्तें",
    privacy: "गोपनीयता",
    contact: "संपर्क",
    language: "भाषा",

    // Thread page
    threads: "थ्रेड्स",
    replies: "जवाब",
    reply: "जवाब दें",
    like: "पसंद",
    share: "शेयर",
    report: "रिपोर्ट",
    post_reply: "जवाब पोस्ट करें",

    // Advertisement
    advertisement: "विज्ञापन",

    // Language detection
    auto_detected: "स्वचालित रूप से पता लगाया गया",
    language_changed: "भाषा बदली गई",

    // Theme switcher
    light_mode: "लाइट मोड",
    dark_mode: "डार्क मोड",
    system_theme: "सिस्टम",
    theme: "थीम",
  },
  id: {
    // Navigation
    home: "Beranda",
    forums: "Forum",
    videos: "Video",
    live: "Langsung",
    telegram: "Telegram",
    forum: "Forum",
    exclusive: "Eksklusif",
    exclusive_desc: "Konten premium eksklusif",

    // User account
    login: "Masuk",
    register: "Daftar",
    profile: "Profil",
    settings: "Pengaturan",
    logout: "Keluar",

    // Hero section
    welcome: "Selamat Datang di Forum SorryMom",
    join_community: "Bergabunglah dengan komunitas kami untuk diskusi, berbagi konten, dan lainnya",
    search: "Cari forum, topik, atau postingan...",
    new_post: "Postingan Baru",

    // Forum categories
    forum_categories: "Kategori Forum",
    browse_categories: "Jelajahi semua kategori yang tersedia",
    announcements: "Pengumuman",
    announcements_desc: "Pembaruan dan berita penting",
    galleries: "Galeri & Video",
    galleries_desc: "Posting dan sematkan video dan galeri gambar",
    tiktok: "Video TikTok",
    tiktok_desc: "Konten dan diskusi terkait TikTok",
    onlyfans: "OnlyFans",
    onlyfans_desc: "Diskusi dan konten OnlyFans",
    celebrity: "Selebriti",
    celebrity_desc: "Berita dan diskusi selebriti",
    patreon: "Patreon",
    patreon_desc: "Konten dan diskusi Patreon",

    // Latest posts
    latest_posts: "Postingan Terbaru",
    recent_activity: "Aktivitas terbaru dari komunitas kami",
    new_tag: "Baru",
    hot_tag: "Populer",
    by: "Oleh",
    view: "tampilan",
    views: "tampilan",
    moment_ago: "Baru saja",
    minute_ago: "1 menit yang lalu",
    minutes_ago: "menit yang lalu",

    // Network sidebar
    network: "Jaringan",
    related_sites: "Situs dan sumber daya terkait",
    sexy_egirls: "Sexy eGirls",
    thotbook: "Thotbook.tv",
    famous_nudes: "Famous Nudes",
    cartoon_porn: "Cartoon Porn",
    thotflix: "ThotFlix",
    onlyfans_leaks: "OnlyFans Leaks",

    // Forum stats
    forum_statistics: "Statistik Forum",
    community_metrics: "Metrik aktivitas komunitas",
    members: "Anggota",
    total_posts: "Total Postingan",
    latest_member: "Anggota Terbaru",

    // Footer
    copyright: "Semua hak dilindungi undang-undang.",
    terms: "Ketentuan",
    privacy: "Privasi",
    contact: "Kontak",
    language: "Bahasa",

    // Thread page
    threads: "Utas",
    replies: "Balasan",
    reply: "Balas",
    like: "Suka",
    share: "Bagikan",
    report: "Laporkan",
    post_reply: "Kirim Balasan",

    // Advertisement
    advertisement: "Iklan",

    // Language detection
    auto_detected: "Terdeteksi secara otomatis",
    language_changed: "Bahasa diubah menjadi",

    // Theme switcher
    light_mode: "Mode terang",
    dark_mode: "Mode gelap",
    system_theme: "Sistem",
    theme: "Tema",
  },
}

// Create translations for all languages that don't have explicit translations
languages.forEach((lang) => {
  if (!translationSets[lang.code]) {
    // Create a deep copy of the base translations
    translationSets[lang.code] = JSON.parse(JSON.stringify(baseTranslations))
  }
})

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0])
  const [translations, setTranslations] = useState<Record<string, string>>(translationSets.en)

  useEffect(() => {
    // Get saved language from localStorage if available or detect from browser
    try {
      // Check if language has been set before
      if (hasLanguagePreference()) {
        const savedLanguage = localStorage.getItem("language")
        if (savedLanguage) {
          const language = languages.find((lang) => lang.code === savedLanguage)
          if (language) {
            setCurrentLanguage(language)
            setTranslations(translationSets[language.code] || translationSets.en)
          }
        }
      } else {
        // Auto-detect language from browser settings
        const detectedCode = detectBrowserLanguage()
        const detectedLanguage = languages.find((lang) => lang.code === detectedCode)

        if (detectedLanguage) {
          console.log(`Auto-detected language: ${detectedLanguage.name} (${detectedLanguage.code})`)
          setCurrentLanguage(detectedLanguage)
          setTranslations(translationSets[detectedLanguage.code] || translationSets.en)

          // Save to localStorage
          if (typeof window !== "undefined") {
            localStorage.setItem("language", detectedLanguage.code)
          }

          // Set the HTML dir attribute for RTL languages
          if (detectedLanguage.direction === "rtl") {
            document.documentElement.dir = "rtl"
          } else {
            document.documentElement.dir = "ltr"
          }

          // Set the HTML lang attribute
          document.documentElement.lang = detectedLanguage.code
        }
      }
    } catch (error) {
      console.error("Error accessing localStorage or detecting language:", error)
    }
  }, [])

  const setLanguage = (code: string) => {
    try {
      const language = languages.find((lang) => lang.code === code)
      if (language) {
        console.log(`Setting language to: ${language.name} (${language.code})`)

        // Set the current language
        setCurrentLanguage(language)

        // Set the translations
        const newTranslations = translationSets[language.code] || translationSets.en
        setTranslations(newTranslations)

        // Save to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("language", language.code)
        }

        // Set the HTML dir attribute for RTL languages
        if (language.direction === "rtl") {
          document.documentElement.dir = "rtl"
        } else {
          document.documentElement.dir = "ltr"
        }

        // Set the HTML lang attribute
        document.documentElement.lang = language.code

        // Force a re-render to apply translations
        window.dispatchEvent(new CustomEvent("languageChanged", { detail: language.code }))
      }
    } catch (error) {
      console.error("Error setting language:", error)
    }
  }

  return (
    <LanguageContext.Provider value={{ currentLanguage, languages, setLanguage, translations }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

export function useTranslation(key: string): string {
  const { translations } = useLanguage()
  return translations[key] || key
}
