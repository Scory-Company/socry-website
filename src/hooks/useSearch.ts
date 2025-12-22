"use client"

import { useState, useEffect, useCallback } from 'react';
import { searchApi, articlesApi, type SearchResult, type ArticleResponse } from '@/services';
import { UnifiedSearchResult } from '@/types/search';
import { toast } from 'sonner';

/**
 * Mapper: Convert ArticleResponse to UnifiedSearchResult
 * 
 * This allows us to use the same card component for both search results and articles
 */
function mapArticleToSearchResult(article: ArticleResponse): UnifiedSearchResult {
    return {
        id: article.id,
        title: article.title,
        excerpt: article.excerpt || '',
        authors: [article.authorName],
        year: article.publishedAt ? new Date(article.publishedAt).getFullYear() : null,
        source: article.isExternal ? (article.externalMetadata?.source || 'openalex') : 'internal',
        type: 'article',
        link: `/article/${article.slug}`,
        pdfUrl: article.externalMetadata?.pdfUrl || null,
        citations: 0,
        rating: article.rating,
        isOpenAccess: false,
        publisher: null,
        doi: article.externalMetadata?.doi || null,
        language: null,
        metadata: {
            isSimplified: true,
            articleId: article.id,
            isExternal: article.isExternal,
            externalSource: article.externalMetadata?.source,
        },
        category: article.category.name,
        reads: article.readCount ? `${article.readCount} reads` : undefined,
        journal: undefined,
    };
}

/**
 * Mapper: Convert SearchResult to UnifiedSearchResult
 */
function mapSearchResultToUnified(result: SearchResult): UnifiedSearchResult {
    return {
        ...result,
        category: undefined,
        reads: undefined,
        journal: undefined,
    };
}

export interface UseSearchOptions {
    initialQuery?: string;
    autoFetch?: boolean;
    limit?: number;
    source?: 'auto' | 'internal' | 'all';
}

export function useSearch(options: UseSearchOptions = {}) {
    const { initialQuery = '', autoFetch = true, limit = 20, source = 'auto' } = options;

    const [results, setResults] = useState<UnifiedSearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [query, setQuery] = useState(initialQuery);
    const [searchSource, setSearchSource] = useState<'auto' | 'internal' | 'all'>(source);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [totalResults, setTotalResults] = useState(0);

    /**
     * Fetch all simplified articles (default mode - no search query)
     */
    const fetchAllSimplified = useCallback(async (page: number = 1, append: boolean = false) => {
        if (append) {
            setIsLoadingMore(true);
        } else {
            setIsLoading(true);
        }
        setError(null);

        try {
            const response = await articlesApi.getArticles({
                page,
                limit,
                sort: 'recent',
            });

            const mappedResults = response.data.data.articles.map(mapArticleToSearchResult);

            if (append) {
                setResults(prev => [...prev, ...mappedResults]);
            } else {
                setResults(mappedResults);
            }

            // Update pagination state
            const { pagination } = response.data.data;
            setCurrentPage(pagination.page);
            setHasMore(pagination.page < pagination.totalPages);
            setTotalResults(pagination.total);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to fetch articles';
            setError(errorMessage);
            toast.error('Error', {
                description: errorMessage,
            });
            if (!append) {
                setResults([]);
            }
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    }, [limit]);

    /**
     * Search articles using search API
     */
    const searchArticles = useCallback(async (
        searchQuery: string,
        page: number = 1,
        append: boolean = false,
        sourceOverride?: 'auto' | 'internal' | 'all'
    ) => {
        if (!searchQuery.trim()) {
            await fetchAllSimplified(page, append);
            return;
        }

        if (append) {
            setIsLoadingMore(true);
        } else {
            setIsLoading(true);
        }
        setError(null);

        try {
            const activeSource = sourceOverride || searchSource;

            const response = await searchApi.search(searchQuery, {
                sources: activeSource,
                page,
                limit,
            });

            const mappedResults = response.data.results.map(mapSearchResultToUnified);

            if (append) {
                setResults(prev => [...prev, ...mappedResults]);
            } else {
                setResults(mappedResults);
            }

            // Update pagination state from meta
            const { meta } = response.data;
            setCurrentPage(meta.page);
            setHasMore(meta.hasMore);
            setTotalResults(meta.total);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Search failed';
            setError(errorMessage);
            toast.error('Search Error', {
                description: errorMessage,
            });
            if (!append) {
                setResults([]);
            }
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    }, [limit, searchSource, fetchAllSimplified]);

    /**
     * Auto-fetch on mount or when query/source changes
     */
    useEffect(() => {
        if (autoFetch) {
            setCurrentPage(1);
            if (query.trim()) {
                searchArticles(query, 1, false);
            } else {
                fetchAllSimplified(1, false);
            }
        }
    }, [query, searchSource, autoFetch]);

    /**
     * Manual search trigger
     */
    const search = useCallback((newQuery: string, newSource?: 'auto' | 'internal' | 'all') => {
        setQuery(newQuery);
        setCurrentPage(1);
        if (newSource) {
            setSearchSource(newSource);
        }
    }, []);

    /**
     * Load more results (infinite scroll)
     */
    const loadMore = useCallback(() => {
        if (!hasMore || isLoadingMore) return;

        const nextPage = currentPage + 1;
        if (query.trim()) {
            searchArticles(query, nextPage, true);
        } else {
            fetchAllSimplified(nextPage, true);
        }
    }, [hasMore, isLoadingMore, currentPage, query, searchArticles, fetchAllSimplified]);

    /**
     * Change search source
     */
    const changeSource = useCallback((newSource: 'auto' | 'internal' | 'all') => {
        setSearchSource(newSource);
        setCurrentPage(1);
        if (query.trim()) {
            searchArticles(query, 1, false, newSource);
        }
    }, [query, searchArticles]);

    /**
     * Refresh current results
     */
    const refresh = useCallback(() => {
        setCurrentPage(1);
        if (query.trim()) {
            searchArticles(query, 1, false);
        } else {
            fetchAllSimplified(1, false);
        }
    }, [query, searchArticles, fetchAllSimplified]);

    return {
        results,
        isLoading,
        isLoadingMore,
        error,
        query,
        searchSource,
        currentPage,
        hasMore,
        totalResults,
        search,
        loadMore,
        refresh,
        setQuery,
        changeSource,
    };
}
