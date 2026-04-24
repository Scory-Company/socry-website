export type ReadingLevel = "SIMPLE" | "STUDENT" | "ACADEMIC" | "EXPERT";

export interface MockCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  articleCount: number;
}

export interface MockContentBlock {
  type: "heading" | "text" | "list" | "quote" | "callout" | "divider" | "image" | "infographic";
  data: {
    level?: number;
    text?: string;
    style?: "bullet" | "numbered";
    items?: string[];
    author?: string;
    caption?: string;
    variant?: "info" | "warning" | "success" | "error";
    url?: string;
    alt?: string;
  };
}

export interface MockQuiz {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  order: number;
  readingLevel: ReadingLevel;
}

export interface MockArticleRecord {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  authorName: string;
  category: MockCategory;
  rating: number;
  totalRatings: number;
  viewCount: number;
  readCount: number;
  bookmarkCount: number;
  readTimeMinutes: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  isFeatured: boolean;
  isExternal?: boolean;
  externalMetadata?: {
    source: "openalex" | "scholar";
    externalId: string;
    doi?: string;
    pdfUrl?: string;
    landingPageUrl?: string;
    year: number;
  };
  contents: Array<{
    id: string;
    readingLevel: ReadingLevel;
    blocks: MockContentBlock[];
  }>;
  quizzes: MockQuiz[];
}

export interface MockAuthUser {
  id: string;
  email: string;
  fullName: string;
  nickname: string | null;
  avatarUrl: string | null;
  authProvider: string;
  role: string;
  isVerified: boolean;
}

export interface StoredAuthState {
  admin?: MockAuthUser;
  reviewer?: MockAuthUser;
  client?: MockAuthUser;
}

interface PersonalizationState {
  readingLevel: ReadingLevel;
  hasCompletedOnboarding: boolean;
  topicIds: string[];
}

const STORAGE_KEYS = {
  articles: "scory_mock_articles",
  auth: "scory_mock_auth",
  personalization: "scory_mock_personalization",
} as const;

const categories: MockCategory[] = [
  { id: "cat-tech", name: "Technology", slug: "technology", icon: "cpu", articleCount: 3 },
  { id: "cat-bio", name: "Biology", slug: "biology", icon: "dna", articleCount: 2 },
  { id: "cat-business", name: "Business", slug: "business", icon: "briefcase", articleCount: 1 },
  { id: "cat-health", name: "Health", slug: "health", icon: "heart", articleCount: 1 },
  { id: "cat-education", name: "Education", slug: "education", icon: "book-open", articleCount: 1 },
  { id: "cat-environment", name: "Environment", slug: "environment", icon: "leaf", articleCount: 1 },
];

const articleSeeds = [
  {
    id: "a1f4d001",
    slug: "quantum-computing-cryptography",
    title: "The Future of Quantum Computing and Its Impact on Cryptography",
    excerpt: "A guided overview of how quantum machines may change modern security systems.",
    imageUrl: "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg",
    authorName: "Dr. Sarah Johnson",
    categorySlug: "technology",
    rating: 4.8,
    totalRatings: 128,
    viewCount: 12540,
    readCount: 8420,
    bookmarkCount: 421,
    readTimeMinutes: 9,
    publishedAt: "2026-03-12T09:00:00.000Z",
    isPublished: true,
    isFeatured: true,
  },
  {
    id: "a1f4d002",
    slug: "crispr-gene-editing-basics",
    title: "Understanding CRISPR: The Revolutionary Gene Editing Tool",
    excerpt: "A practical breakdown of CRISPR workflows, promises, and ethical concerns.",
    imageUrl: "https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg",
    authorName: "Dr. Emily Rodriguez",
    categorySlug: "biology",
    rating: 4.9,
    totalRatings: 212,
    viewCount: 18220,
    readCount: 11030,
    bookmarkCount: 603,
    readTimeMinutes: 11,
    publishedAt: "2026-02-18T09:00:00.000Z",
    isPublished: true,
    isFeatured: true,
  },
  {
    id: "a1f4d003",
    slug: "climate-change-temperature-trends",
    title: "Climate Change: Analyzing Global Temperature Trends",
    excerpt: "How researchers interpret long-term climate data and communicate uncertainty.",
    imageUrl: "https://images.pexels.com/photos/957024/forest-trees-perspective-bright-957024.jpeg",
    authorName: "Prof. David Thompson",
    categorySlug: "environment",
    rating: 4.7,
    totalRatings: 94,
    viewCount: 9800,
    readCount: 7430,
    bookmarkCount: 280,
    readTimeMinutes: 8,
    publishedAt: "2026-01-28T09:00:00.000Z",
    isPublished: true,
    isFeatured: false,
  },
  {
    id: "a1f4d004",
    slug: "ai-adoption-small-businesses",
    title: "AI Adoption for Small Businesses: Cost, Risk, and Opportunity",
    excerpt: "A business-focused look at when AI tools create leverage and when they do not.",
    imageUrl: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg",
    authorName: "Nadia Pratama",
    categorySlug: "business",
    rating: 4.5,
    totalRatings: 67,
    viewCount: 6430,
    readCount: 5010,
    bookmarkCount: 142,
    readTimeMinutes: 7,
    publishedAt: "2026-04-02T09:00:00.000Z",
    isPublished: false,
    isFeatured: false,
  },
  {
    id: "a1f4d005",
    slug: "hydration-cognitive-performance",
    title: "Hydration and Cognitive Performance in College Students",
    excerpt: "What current research says about hydration, focus, and day-to-day academic performance.",
    imageUrl: "https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg",
    authorName: "Dr. Maya Lestari",
    categorySlug: "health",
    rating: 4.6,
    totalRatings: 81,
    viewCount: 7320,
    readCount: 5890,
    bookmarkCount: 175,
    readTimeMinutes: 6,
    publishedAt: "2026-03-04T09:00:00.000Z",
    isPublished: true,
    isFeatured: false,
  },
  {
    id: "a1f4d006",
    slug: "adaptive-learning-feedback-loops",
    title: "Adaptive Learning Systems and Faster Feedback Loops",
    excerpt: "How adaptive platforms can improve student pacing and feedback quality.",
    imageUrl: "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg",
    authorName: "Farhan Kusuma",
    categorySlug: "education",
    rating: 4.4,
    totalRatings: 53,
    viewCount: 5210,
    readCount: 4020,
    bookmarkCount: 121,
    readTimeMinutes: 8,
    publishedAt: "2026-02-08T09:00:00.000Z",
    isPublished: true,
    isFeatured: false,
  },
];

const externalSearchResults = [
  {
    id: "ext-openalex-001",
    title: "BERT-Based Sentiment Analysis on Twitter During Crisis Events",
    excerpt: "An OpenAlex-style external paper result used to test the search flow without backend access.",
    authors: ["Jacob Devlin", "Ming-Wei Chang"],
    year: 2024,
    source: "openalex" as const,
    type: "journal-article" as const,
    link: "https://openalex.org/W2741809807",
    pdfUrl: "https://example.com/papers/bert-twitter.pdf",
    citations: 124,
    isOpenAccess: true,
    publisher: "OpenAlex Demo",
    doi: "10.0000/mock-openalex-bert",
    language: "en",
    journal: "IEEE Access",
    category: "Technology",
  },
  {
    id: "ext-scholar-001",
    title: "Systematic Review of CRISPR Applications in Medicine",
    excerpt: "A mock scholar result to keep external result cards alive while backend is disconnected.",
    authors: ["Alice Moore", "Rio Saputra"],
    year: 2023,
    source: "scholar" as const,
    type: "review" as const,
    link: "https://scholar.google.com/mock-crispr-review",
    pdfUrl: "https://example.com/papers/crispr-review.pdf",
    citations: 87,
    isOpenAccess: true,
    publisher: "Scholar Demo",
    doi: "10.0000/mock-scholar-crispr",
    language: "en",
    journal: "Nature Reviews",
    category: "Biology",
  },
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function readingLevelLabel(level: ReadingLevel): string {
  switch (level) {
    case "SIMPLE":
      return "simple";
    case "STUDENT":
      return "student";
    case "ACADEMIC":
      return "academic";
    case "EXPERT":
      return "expert";
  }
}

function makeBlocks(title: string, category: string, level: ReadingLevel): MockContentBlock[] {
  const label = readingLevelLabel(level);

  return [
    {
      type: "heading",
      data: { level: 2, text: `${title} for ${label} readers` },
    },
    {
      type: "text",
      data: {
        text: `This mock version explains the core ideas of ${title} in a ${label} tone so the frontend flow can be reviewed without any API dependency.`,
      },
    },
    {
      type: "callout",
      data: {
        variant: "info",
        text: `Focus area: ${category}. This block exists to keep preview, editor, and level switching behavior visible during cleanup.`,
      },
    },
    {
      type: "list",
      data: {
        style: "bullet",
        items: [
          `Main concept summary tailored for ${label} readers.`,
          "A short interpretation of the method and findings.",
          "One practical implication that makes the article easier to follow.",
        ],
      },
    },
    {
      type: "quote",
      data: {
        text: "Mock content is temporary, but a clean flow is permanent.",
        author: "Scory Admin Cleanup",
      },
    },
  ];
}

function makeQuizzes(title: string, level: ReadingLevel): MockQuiz[] {
  return [
    {
      question: `What is the main goal of "${title}" in ${readingLevelLabel(level)} mode?`,
      options: [
        "To clarify the central argument",
        "To remove all context",
        "To replace the article title",
        "To hide the findings",
      ],
      correctAnswer: "A",
      explanation: "The mock flow keeps the article understandable while preserving a realistic UI structure.",
      order: 1,
      readingLevel: level,
    },
    {
      question: "Why are mock quizzes useful during frontend cleanup?",
      options: [
        "They keep forms, validation, and save flows testable",
        "They speed up database migrations",
        "They remove the need for components",
        "They replace all page routing",
      ],
      correctAnswer: "A",
      explanation: "They let us test editing interactions without depending on backend responses.",
      order: 2,
      readingLevel: level,
    },
    {
      question: "What should happen after the cleanup phase finishes?",
      options: [
        "Reconnect services to the new core-api",
        "Restore the old backend URLs",
        "Delete all services",
        "Turn pages into static screenshots",
      ],
      correctAnswer: "A",
      explanation: "The service layer stays in place so reconnecting to the new backend is straightforward.",
      order: 3,
      readingLevel: level,
    },
  ];
}

function defaultArticles(): MockArticleRecord[] {
  return articleSeeds.map((seed, index) => {
    const category = categories.find((item) => item.slug === seed.categorySlug) ?? categories[0];
    const levels: ReadingLevel[] = ["SIMPLE", "STUDENT", "ACADEMIC", "EXPERT"];

    return {
      id: seed.id,
      slug: seed.slug,
      title: seed.title,
      excerpt: seed.excerpt,
      imageUrl: seed.imageUrl,
      authorName: seed.authorName,
      category,
      rating: seed.rating,
      totalRatings: seed.totalRatings,
      viewCount: seed.viewCount,
      readCount: seed.readCount,
      bookmarkCount: seed.bookmarkCount,
      readTimeMinutes: seed.readTimeMinutes,
      publishedAt: seed.publishedAt,
      createdAt: seed.publishedAt,
      updatedAt: `2026-04-${String(index + 10).padStart(2, "0")}T12:00:00.000Z`,
      isPublished: seed.isPublished,
      isFeatured: seed.isFeatured,
      contents: levels.map((level) => ({
        id: `${seed.id}-${level.toLowerCase()}`,
        readingLevel: level,
        blocks: makeBlocks(seed.title, category.name, level),
      })),
      quizzes: levels.flatMap((level) => makeQuizzes(seed.title, level)),
    };
  });
}

function defaultAuthState(): StoredAuthState {
  return {};
}

function defaultPersonalization(): PersonalizationState {
  return {
    readingLevel: "STUDENT",
    hasCompletedOnboarding: false,
    topicIds: [],
  };
}

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readStorage<T>(key: string, fallback: T): T {
  if (!isBrowser()) {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T): void {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.setItem(key, JSON.stringify(value));
}

function nextId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function mockDelay(ms = 180): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export function getMockCategories(): MockCategory[] {
  return [...categories];
}

export function getMockArticles(): MockArticleRecord[] {
  const articles = readStorage(STORAGE_KEYS.articles, defaultArticles());
  writeStorage(STORAGE_KEYS.articles, articles);
  return articles;
}

export function saveMockArticles(articles: MockArticleRecord[]): void {
  writeStorage(STORAGE_KEYS.articles, articles);
}

export function getMockArticleById(id: string): MockArticleRecord | undefined {
  return getMockArticles().find((article) => article.id === id);
}

export function getMockArticleBySlug(slug: string): MockArticleRecord | undefined {
  return getMockArticles().find((article) => article.slug === slug);
}

export function updateMockArticle(id: string, patch: Partial<MockArticleRecord>): MockArticleRecord | undefined {
  const articles = getMockArticles();
  const index = articles.findIndex((article) => article.id === id);
  if (index < 0) {
    return undefined;
  }

  articles[index] = {
    ...articles[index],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  saveMockArticles(articles);
  return articles[index];
}

export function updateMockArticleLevelContent(id: string, level: ReadingLevel, blocks: MockContentBlock[]): MockArticleRecord | undefined {
  const article = getMockArticleById(id);
  if (!article) {
    return undefined;
  }

  const nextContents = article.contents.map((content) =>
    content.readingLevel === level ? { ...content, blocks } : content,
  );

  return updateMockArticle(id, { contents: nextContents });
}

export function updateMockArticleLevelQuizzes(id: string, level: ReadingLevel, quizzes: MockQuiz[]): MockArticleRecord | undefined {
  const article = getMockArticleById(id);
  if (!article) {
    return undefined;
  }

  const preserved = article.quizzes.filter((quiz) => quiz.readingLevel !== level);
  return updateMockArticle(id, { quizzes: [...preserved, ...quizzes] });
}

export function deleteMockArticle(id: string): boolean {
  const articles = getMockArticles();
  const filtered = articles.filter((article) => article.id !== id);
  if (filtered.length === articles.length) {
    return false;
  }
  saveMockArticles(filtered);
  return true;
}

export function getMockSearchResults(query: string, source: "auto" | "internal" | "all" = "auto") {
  const normalized = query.trim().toLowerCase();
  const internal = getMockArticles()
    .filter((article) => article.isPublished)
    .filter((article) => {
      if (!normalized) {
        return true;
      }
      return [
        article.title,
        article.excerpt,
        article.authorName,
        article.category.name,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalized);
    })
    .map((article) => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      authors: [article.authorName],
      year: new Date(article.publishedAt).getFullYear(),
      source: "internal" as const,
      type: "article" as const,
      link: `/article/${article.slug}`,
      pdfUrl: article.externalMetadata?.pdfUrl ?? null,
      citations: article.totalRatings,
      rating: article.rating,
      isOpenAccess: true,
      publisher: "Scory Mock Library",
      doi: article.externalMetadata?.doi ?? null,
      language: "en",
      metadata: {
        isSimplified: true,
        isExternal: false,
        articleId: article.id,
      },
      category: article.category.name,
      journal: article.category.name,
    }));

  const external = externalSearchResults.filter((item) => {
    if (!normalized) {
      return true;
    }
    return [item.title, item.excerpt, item.category, item.journal].join(" ").toLowerCase().includes(normalized);
  });

  if (source === "internal") {
    return internal;
  }

  if (source === "all") {
    return [...internal, ...external];
  }

  return internal.length > 0 ? internal : [...internal, ...external];
}

export function getStoredAuthState(): StoredAuthState {
  return readStorage(STORAGE_KEYS.auth, defaultAuthState());
}

export function saveStoredAuthState(state: StoredAuthState): void {
  writeStorage(STORAGE_KEYS.auth, state);
}

export function createMockUser(role: "ADMIN" | "REVIEWER" | "CLIENT", email: string, fullName: string): MockAuthUser {
  return {
    id: nextId(role.toLowerCase()),
    email,
    fullName,
    nickname: null,
    avatarUrl: null,
    authProvider: "LOCAL",
    role,
    isVerified: true,
  };
}

export function getStoredPersonalization(): PersonalizationState {
  return readStorage(STORAGE_KEYS.personalization, defaultPersonalization());
}

export function saveStoredPersonalization(nextState: PersonalizationState): void {
  writeStorage(STORAGE_KEYS.personalization, nextState);
}

export function buildSimplifiedPayload(article: MockArticleRecord, level: ReadingLevel) {
  const content = article.contents.find((item) => item.readingLevel === level)?.blocks ?? [];
  const quiz = article.quizzes
    .filter((item) => item.readingLevel === level)
    .map((item) => ({
      question: item.question,
      options: item.options,
      correctAnswer: item.correctAnswer,
      explanation: item.explanation,
      order: item.order,
    }));

  return {
    success: true,
    message: "Mock simplification generated",
    data: {
      articleId: article.id,
      isNewSimplification: false,
      isCached: false,
      content,
      quiz,
      metadata: {
        extractionMethod: "mock-store",
        aiCost: 0,
        processingTime: 320,
        readingLevel: level,
      },
    },
  };
}

export function createRegeneratedBlocks(article: MockArticleRecord, level: ReadingLevel, pdfUrl?: string): MockContentBlock[] {
  return [
    {
      type: "heading",
      data: { level: 2, text: `${article.title} regenerated for ${readingLevelLabel(level)} mode` },
    },
    {
      type: "text",
      data: {
        text: `This regenerated mock content simulates a new AI result for ${article.title}. It keeps the editor flow alive while all old backend calls stay disconnected.`,
      },
    },
    {
      type: "callout",
      data: {
        variant: "success",
        text: pdfUrl
          ? `Mock PDF source attached: ${pdfUrl}`
          : "No PDF URL was attached, so the service used a local fallback response.",
      },
    },
    {
      type: "list",
      data: {
        style: "bullet",
        items: [
          "Fresh content blocks were generated in-memory.",
          "The article can now be previewed and edited without any backend.",
          "Saving will persist the new blocks in the local mock store.",
        ],
      },
    },
  ];
}

export function createRegeneratedQuizzes(level: ReadingLevel): MockQuiz[] {
  return [
    {
      question: `What is the goal of the regenerated ${readingLevelLabel(level)} mock content?`,
      options: [
        "Keep the editing flow testable",
        "Reconnect the old backend",
        "Delete article metadata",
        "Disable reading levels",
      ],
      correctAnswer: "A",
      explanation: "The mock response exists so you can keep validating the UI flow safely.",
      order: 1,
      readingLevel: level,
    },
    {
      question: "Where is the regenerated content stored after save?",
      options: [
        "In local mock storage",
        "In the old production API",
        "In a hidden iframe",
        "Only in the network tab",
      ],
      correctAnswer: "A",
      explanation: "The cleanup strategy uses local mock storage as the temporary source of truth.",
      order: 2,
      readingLevel: level,
    },
    {
      question: "What is the benefit of this cleanup mode?",
      options: [
        "Frontend flow becomes easier to inspect",
        "The backend becomes more complex",
        "Docs multiply automatically",
        "All routes disappear",
      ],
      correctAnswer: "A",
      explanation: "The main purpose is to make frontend behavior visible and easier to reason about.",
      order: 3,
      readingLevel: level,
    },
  ];
}

export function makeClientArticleLink(article: MockArticleRecord): string {
  return `/article/${article.slug}`;
}

export function toSlug(value: string): string {
  return slugify(value);
}
