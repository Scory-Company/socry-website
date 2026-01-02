import api from './api';

export interface SearchResult {
    id: string; // OpenAlex ID or UUID
    title: string;
    excerpt?: string;
    authors: string[];
    year?: number;
    source: 'internal' | 'openalex' | 'scholar';
    type: 'paper' | 'article';
    link?: string; // DOI link or internal link
    pdfUrl?: string; // Link to PDF
    citations?: number;
    isOpenAccess?: boolean;
    publisher?: string;
    doi?: string;
    isSimplified: boolean; // True if already in Scory DB
    articleId?: string; // If simplified, this is the internal UUID
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
    searchTime: string;
    scholarUsed: boolean;
}

export interface ReviewerSearchParams {
    q: string;
    page?: number;
    limit?: number;
    source?: 'all' | 'internal' | 'external';
    useScholar?: boolean;
    year?: number;
}

export interface ReviewerSearchResponse {
    success: boolean;
    data: {
        results: SearchResult[];
        meta: SearchMeta;
    };
}

class ReviewerSearchService {
    /**
     * Unified Search (Internal + External)
     */
    async search(params: ReviewerSearchParams): Promise<ReviewerSearchResponse['data']> {
        try {
            const response = await api.get<ReviewerSearchResponse>('/reviewer/search', {
                params,
            });

            if (response.data.success) {
                return response.data.data;
            }

            throw new Error('Search failed');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to perform search';
            throw new Error(errorMessage);
        }
    }
}

export const reviewerSearchService = new ReviewerSearchService();
