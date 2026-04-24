import { getMockSearchResults, mockDelay } from "@/mocks/scory";

export type SearchSource = "auto" | "internal" | "openalex" | "scholar" | "all";

export interface SearchOptions {
  sources?: SearchSource;
  page?: number;
  limit?: number;
  year?: number;
  openAccess?: boolean;
  language?: string;
}

export interface SearchResultMetadata {
  isSimplified?: boolean;
  isExternal?: boolean;
  articleId?: string;
  externalId?: string;
  externalSource?: "openalex" | "scholar";
}

export interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  authors: string[];
  year: number | null;
  source: "internal" | "openalex" | "scholar";
  type: "article" | "paper" | "preprint" | "journal-article" | "review";
  link: string;
  pdfUrl: string | null;
  citations: number;
  rating?: number;
  isOpenAccess: boolean;
  publisher: string | null;
  doi: string | null;
  language: string | null;
  metadata?: SearchResultMetadata;
  category?: string;
  journal?: string;
}

export interface SearchMeta {
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  sources: {
    internal: number;
    openalex: number;
    scholar: number;
  };
  scholarUsed: boolean;
  searchTime: string;
}

export interface SearchResponse {
  success: boolean;
  query: string;
  data: {
    results: SearchResult[];
    meta: SearchMeta;
  };
}

export const searchApi = {
  search: async (query: string, options: SearchOptions = {}): Promise<SearchResponse> => {
    await mockDelay();
    const page = options.page ?? 1;
    const limit = options.limit ?? 20;
    const source = options.sources === "openalex" || options.sources === "scholar" ? "all" : options.sources ?? "auto";
    const allResults = getMockSearchResults(query, source as "auto" | "internal" | "all");
    const start = (page - 1) * limit;
    const results = allResults.slice(start, start + limit);

    return {
      success: true,
      query,
      data: {
        results,
        meta: {
          total: allResults.length,
          page,
          limit,
          hasMore: start + limit < allResults.length,
          sources: {
            internal: allResults.filter((item) => item.source === "internal").length,
            openalex: allResults.filter((item) => item.source === "openalex").length,
            scholar: allResults.filter((item) => item.source === "scholar").length,
          },
          scholarUsed: allResults.some((item) => item.source === "scholar"),
          searchTime: "42ms",
        },
      },
    };
  },

  healthCheck: async () => {
    await mockDelay(40);
    return {
      success: true,
      message: "Mock search service ready",
      data: {
        database: true,
        external: {
          openAlex: true,
          scholar: true,
          scholarEnabled: true,
        },
      },
    };
  },

  searchWithFallback: async (query: string): Promise<SearchResult[]> => {
    const response = await searchApi.search(query, { sources: "auto", limit: 20 });
    return response.data.results;
  },

  searchInternal: async (query: string, limit = 20): Promise<SearchResult[]> => {
    const response = await searchApi.search(query, { sources: "internal", limit });
    return response.data.results;
  },

  searchExternal: async (query: string, limit = 20): Promise<SearchResult[]> => {
    const response = await searchApi.search(query, { sources: "all", limit });
    return response.data.results.filter((item) => item.source !== "internal");
  },
};
