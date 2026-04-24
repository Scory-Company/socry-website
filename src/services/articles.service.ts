import { getMockArticleById, getMockArticleBySlug, getMockArticles, mockDelay, type MockContentBlock } from "@/mocks/scory";

export interface ArticleListParams {
  page?: number;
  limit?: number;
  category?: string;
  topic?: string;
  search?: string;
  sort?: "recent" | "popular" | "top_rated" | "trending" | "random";
  excludeRead?: boolean;
}

export enum ReadingLevel {
  SIMPLE = "SIMPLE",
  STUDENT = "STUDENT",
  ACADEMIC = "ACADEMIC",
  EXPERT = "EXPERT",
}

export type ContentBlock = MockContentBlock;

export interface ArticleContent {
  id: string;
  articleId: string;
  readingLevel: ReadingLevel;
  blocks: ContentBlock[];
  createdAt: string;
  updatedAt: string;
}

export interface ArticleResponse {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  imageUrl?: string;
  authorName: string;
  authorAvatar?: string;
  category: { id: string; name: string; slug: string };
  rating: number;
  totalRatings: number;
  viewCount: number;
  viewCountWeek?: number;
  readCount?: number;
  bookmarkCount?: number;
  readTimeMinutes: number;
  publishedAt: string;
  isFeatured?: boolean;
  popularityScore?: number;
  popularityRank?: number;
  contents?: ArticleContent[];
  externalMetadata?: {
    source: "openalex" | "scholar";
    externalId: string;
    doi?: string;
    pdfUrl?: string;
    landingPageUrl?: string;
    year: number;
  };
  isExternal?: boolean;
}

export interface PaginatedResponse<T> {
  data: {
    articles: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    meta?: {
      algorithm?: string;
      timeframe?: string;
      lastUpdated?: string;
    };
  };
  message: string;
  success: boolean;
}

export interface SingleResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

function mapArticle(article: ReturnType<typeof getMockArticles>[number]): ArticleResponse {
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    imageUrl: article.imageUrl,
    authorName: article.authorName,
    category: article.category,
    rating: article.rating,
    totalRatings: article.totalRatings,
    viewCount: article.viewCount,
    viewCountWeek: Math.round(article.viewCount * 0.25),
    readCount: article.readCount,
    bookmarkCount: article.bookmarkCount,
    readTimeMinutes: article.readTimeMinutes,
    publishedAt: article.publishedAt,
    isFeatured: article.isFeatured,
    popularityScore: article.viewCount + article.bookmarkCount * 5,
    popularityRank: 0,
    isExternal: article.isExternal,
    externalMetadata: article.externalMetadata,
    contents: article.contents.map((content) => ({
      id: content.id,
      articleId: article.id,
      readingLevel: content.readingLevel as ReadingLevel,
      blocks: content.blocks,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
    })),
  };
}

function filterAndSortArticles(params?: ArticleListParams): ArticleResponse[] {
  let items = getMockArticles()
    .filter((article) => article.isPublished)
    .map(mapArticle);

  if (params?.category) {
    items = items.filter((article) => article.category.name === params.category || article.category.slug === params.category);
  }

  if (params?.search) {
    const query = params.search.toLowerCase();
    items = items.filter((article) =>
      [article.title, article.excerpt, article.authorName, article.category.name]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }

  switch (params?.sort) {
    case "popular":
    case "trending":
      items.sort((a, b) => b.viewCount - a.viewCount);
      break;
    case "top_rated":
      items.sort((a, b) => b.rating - a.rating);
      break;
    case "random":
      items = [...items].sort(() => Math.random() - 0.5);
      break;
    case "recent":
    default:
      items.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      break;
  }

  return items;
}

function paginate<T>(items: T[], page = 1, limit = 12) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * limit;
  return {
    items: items.slice(start, start + limit),
    pagination: {
      page: currentPage,
      limit,
      total,
      totalPages,
    },
  };
}

export const articlesApi = {
  getArticles: async (params?: ArticleListParams): Promise<{ data: PaginatedResponse<ArticleResponse> }> => {
    await mockDelay();
    const limit = params?.limit ?? 12;
    const page = params?.page ?? 1;
    const filtered = filterAndSortArticles(params);
    const { items, pagination } = paginate(filtered, page, limit);
    return {
      data: {
        success: true,
        message: "Mock articles loaded",
        data: {
          articles: items,
          pagination,
          meta: {
            algorithm: "mock-store",
            timeframe: "local",
            lastUpdated: new Date().toISOString(),
          },
        },
      },
    };
  },

  getBySlug: async (slug: string): Promise<{ data: SingleResponse<ArticleResponse> }> => {
    await mockDelay();
    const article = getMockArticleBySlug(slug);
    if (!article) {
      throw new Error("Mock article not found");
    }
    return {
      data: {
        success: true,
        message: "Mock article loaded",
        data: mapArticle(article),
      },
    };
  },

  getById: async (id: string): Promise<{ data: SingleResponse<ArticleResponse> }> => {
    await mockDelay();
    const article = getMockArticleById(id);
    if (!article) {
      throw new Error("Mock article not found");
    }
    return {
      data: {
        success: true,
        message: "Mock article loaded",
        data: mapArticle(article),
      },
    };
  },

  getContent: async (slug: string, readingLevel: string) => {
    await mockDelay();
    const article = getMockArticleBySlug(slug);
    const content = article?.contents.find((item) => item.readingLevel === readingLevel);
    return {
      data: {
        success: true,
        message: "Mock content loaded",
        data: content ?? null,
      },
    };
  },

  getForYou: async (params?: { page?: number; limit?: number; excludeRead?: boolean; sort?: string; readingLevel?: string }) =>
    articlesApi.getArticles({
      page: params?.page,
      limit: params?.limit,
      sort: (params?.sort as ArticleListParams["sort"]) ?? "recent",
    }),

  getPopular: async (params?: { page?: number; limit?: number; timeframe?: "7d" | "30d" | "all" }) =>
    articlesApi.getArticles({
      page: params?.page,
      limit: params?.limit,
      sort: "popular",
    }),

  getTopRated: async (params?: { page?: number; limit?: number }) =>
    articlesApi.getArticles({
      page: params?.page,
      limit: params?.limit,
      sort: "top_rated",
    }),

  getTrending: async (params?: { page?: number; limit?: number }) =>
    articlesApi.getArticles({
      page: params?.page,
      limit: params?.limit,
      sort: "trending",
    }),

  getRecent: async (params?: { page?: number; limit?: number }) =>
    articlesApi.getArticles({
      page: params?.page,
      limit: params?.limit,
      sort: "recent",
    }),
};
