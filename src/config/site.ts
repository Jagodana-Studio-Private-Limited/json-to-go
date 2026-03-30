export const siteConfig = {
  // ====== CUSTOMIZE THESE FOR EACH TOOL ======
  name: "JSON to Go Struct Converter",
  title: "JSON to Go Struct Converter - Free Online Tool",
  description: "Convert any JSON to Go structs instantly. Paste JSON, get clean Go struct definitions with proper types, tags, and nested struct support. 100% free, browser-based.",
  url: "https://json-to-go.tools.jagodana.com",
  ogImage: "/opengraph-image",

  // Header
  headerIcon: "Code2", // lucide-react icon name (e.g., Image, Map, Code, Palette, Globe, FileSearch)
  // Brand gradient colors for Tailwind are in globals.css (--brand / --brand-accent)
  // Use text-brand, from-brand, to-brand-accent etc. in components
  brandAccentColor: "#06b6d4", // hex accent for OG image gradient (must match --brand-accent in globals.css)

  // SEO
  keywords: [
    "json to go struct",
    "json to golang",
    "go struct generator",
    "json converter go",
    "golang json struct",
    "json unmarshal go",
    "go struct from json",
    "json to go online",
  ],
  applicationCategory: "DeveloperApplication", // or "DesignApplication", "UtilitiesApplication"

  // Theme
  themeColor: "#10b981", // used in manifest and meta tags

  // Branding
  creator: "Jagodana",
  creatorUrl: "https://jagodana.com",
  twitterHandle: "@jagodana",

  // Social Profiles (for Organization schema sameAs)
  socialProfiles: [
    "https://twitter.com/jagodana",
    // Add more: LinkedIn, YouTube, etc.
  ],

  // Links
  links: {
    github: "https://github.com/Jagodana-Studio-Private-Limited/json-to-go",
    website: "https://jagodana.com",
  },

  // Footer
  footer: {
    about: "A free online tool to instantly convert JSON to Go struct definitions. Paste any JSON and get clean, idiomatic Go code with proper json tags, nested structs, and type inference.",
    featuresTitle: "Features",
    features: [
      "Instant JSON to Go struct conversion",
      "Nested struct support",
      "Proper json tags generated",
      "100% browser-based, no data sent",
    ],
  },

  // Hero Section
  hero: {
    badge: "Free JSON to Go Converter",
    titleLine1: "Convert JSON to",
    titleGradient: "Go Structs Instantly",
    subtitle: "Paste any JSON and get clean, idiomatic Go struct definitions with proper json tags, nested structs, and type inference — all in your browser, no data sent to any server.",
  },

  // Feature Cards (shown on homepage)
  featureCards: [
    {
      icon: "⚡",
      title: "Instant Conversion",
      description: "Real-time conversion as you type. No button press needed — see Go structs update live.",
    },
    {
      icon: "🔒",
      title: "100% Private",
      description: "All processing happens in your browser. Your JSON data never leaves your machine.",
    },
    {
      icon: "🎯",
      title: "Idiomatic Go",
      description: "Generated structs follow Go conventions with proper naming, json tags, and type inference.",
    },
  ],

  // Related Tools (cross-linking to sibling Jagodana tools for internal SEO)
  relatedTools: [
    {
      name: "JSON to TypeScript",
      url: "https://json-to-typescript.tools.jagodana.com",
      icon: "🔷",
      description: "Convert JSON to TypeScript interfaces and types instantly.",
    },
    {
      name: "JSON to Zod",
      url: "https://json-to-zod.tools.jagodana.com",
      icon: "🛡️",
      description: "Generate Zod validation schemas from JSON data.",
    },
    {
      name: "Favicon Generator",
      url: "https://favicon-generator.jagodana.com",
      icon: "🎨",
      description: "Generate all favicon sizes + manifest from any image.",
    },
    {
      name: "Sitemap Checker",
      url: "https://sitemap-checker.jagodana.com",
      icon: "🔍",
      description: "Discover and validate sitemaps on any website.",
    },
    {
      name: "Regex Playground",
      url: "https://regex-playground.jagodana.com",
      icon: "🧪",
      description: "Build, test & debug regular expressions in real-time.",
    },
    {
      name: "Screenshot Beautifier",
      url: "https://screenshot-beautifier.jagodana.com",
      icon: "📸",
      description: "Transform screenshots into beautiful images.",
    },
  ],

  // HowTo Steps (drives HowTo JSON-LD schema for rich results)
  howToSteps: [
    { name: "Paste Your JSON", text: "Paste or type your JSON data into the input panel on the left.", url: "" },
    { name: "Instant Conversion", text: "Your Go struct definitions appear automatically in the output panel on the right.", url: "" },
    { name: "Copy the Code", text: "Click the copy button to copy the generated Go structs to your clipboard.", url: "" },
  ],
  howToTotalTime: "PT30S", // ISO 8601 duration (e.g., PT2M = 2 minutes)

  // FAQ (drives both the FAQ UI section and FAQPage JSON-LD schema)
  faq: [
    {
      question: "What JSON types are supported?",
      answer: "All standard JSON types are supported: objects, arrays, strings, numbers, booleans, and null. Nested objects generate nested structs, and arrays generate slice types.",
    },
    {
      question: "Are json tags added automatically?",
      answer: 'Yes! Every field gets a json tag matching the original JSON key name. For example, "user_id" becomes `json:"user_id"` in the struct tag.',
    },
    {
      question: "Is my JSON data sent to any server?",
      answer: "No. All conversion happens entirely in your browser using JavaScript/WebAssembly. Your data never leaves your machine.",
    },
    {
      question: "What happens with nullable fields?",
      answer: "JSON null values are converted to interface{} type. If a field is sometimes null in different JSON samples, consider using a pointer type (*string, *int) in your final code.",
    },
    {
      question: "Can it handle large JSON files?",
      answer: "Yes, the tool handles JSON files of any size since it runs entirely in your browser. For very large files, there may be a brief delay while the struct is generated.",
    },
  ],

  // ====== PAGES (for sitemap + per-page SEO) ======
  // Add every route here. Sitemap and generatePageMetadata() read from this.
  pages: {
    "/": {
      title: "JSON to Go Struct Converter - Free Online Tool",
      description: "Convert any JSON to Go structs instantly. Paste JSON, get clean Go struct definitions with proper types, tags, and nested struct support. 100% free, browser-based.",
      changeFrequency: "weekly" as const,
      priority: 1,
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
