/**
 * Unified Search API Service
 *
 * Integrates with backend /search endpoint
 * Supports multiple sources: internal, OpenAlex, Google Scholar
 */

import api from './api';

// ==================== TYPES ====================

export type SearchSource = 'auto' | 'internal' | 'openalex' | 'scholar' | 'all';

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
    externalSource?: 'openalex' | 'scholar';
}

export interface SearchResult {
    id: string;
    title: string;
    excerpt: string;
    authors: string[];
    year: number | null;
    source: 'internal' | 'openalex' | 'scholar';
    type: 'article' | 'paper' | 'preprint' | 'journal-article' | 'review';
    link: string;
    pdfUrl: string | null;
    citations: number;
    rating?: number;
    isOpenAccess: boolean;
    publisher: string | null;
    doi: string | null;
    language: string | null;
    metadata?: SearchResultMetadata;
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

// ==================== API FUNCTIONS ====================

/**
 * Unified Search
 *
 * Search across multiple sources (internal DB, OpenAlex, Google Scholar)
 *
 * @param query - Search query string
 * @param options - Search options (sources, filters, pagination)
 *
 * @example
 * ```ts
 * const results = await searchApi.search('machine learning', {
 *   sources: 'auto',
 *   limit: 20,
 *   year: 2024,
 *   openAccess: true
 * });
 * ```
 */
export const searchApi = {
    search: async (query: string, options: SearchOptions = {}): Promise<SearchResponse> => {
        const params = new URLSearchParams();
        params.append('q', query);

        if (options.sources) params.append('sources', options.sources);
        if (options.page) params.append('page', String(options.page));
        if (options.limit) params.append('limit', String(options.limit));
        if (options.year) params.append('year', String(options.year));
        if (options.openAccess !== undefined) params.append('openAccess', String(options.openAccess));
        if (options.language) params.append('language', options.language);

        const response = await api.get<SearchResponse>(`/search?${params.toString()}`);
        return response.data;
    },

    /**
     * Search Health Check
     *
     * Check if search service is available
     */
    healthCheck: async (): Promise<{
        success: boolean;
        message: string;
        data?: {
            database: boolean;
            external: {
                openAlex: boolean;
                scholar: boolean;
                scholarEnabled: boolean;
            };
        };
    }> => {
        const response = await api.get('/search/health');
        return response.data;
    },

    /**
     * Search with automatic fallback
     *
     * Tries internal first, then external if no results
     */
    searchWithFallback: async (query: string): Promise<SearchResult[]> => {
        try {
            const internalResults = await searchApi.search(query, { sources: 'internal', limit: 20 });

            if (internalResults.data.results.length > 0) {
                return internalResults.data.results;
            }

            const externalResults = await searchApi.search(query, { sources: 'auto', limit: 20 });
            return externalResults.data.results;
        } catch (error) {
            return [];
        }
    },

    /**
     * Search only internal database
     */
    searchInternal: async (query: string, limit = 20): Promise<SearchResult[]> => {
        try {
            const response = await searchApi.search(query, { sources: 'internal', limit });
            return response.data.results;
        } catch (error) {
            return [];
        }
    },

    /**
     * Search only external sources (OpenAlex + Scholar)
     */
    searchExternal: async (query: string, limit = 20): Promise<SearchResult[]> => {
        try {
            const response = await searchApi.search(query, { sources: 'auto', limit });
            return response.data.results.filter((r) => r.source !== 'internal');
        } catch (error) {
            return [];
        }
    },
};
