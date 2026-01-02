import api from './api';

// Article type
export interface Article {
    id: string;
    title: string;
    slug: string;
    isPublished: boolean;
    categoryId?: string;
    topicId?: string;
    imageUrl?: string; // Thumbnail image
    authorName?: string; // Author name
    externalArticle?: {
        id: string;
        doi?: string;
        pdfUrl?: string;
        landingPageUrl?: string;
        title?: string;
        source?: string;
    };
    createdAt: string;
    updatedAt: string;
    // Add other fields as needed
}

// Pagination metadata
export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

// Get articles params
export interface GetArticlesParams {
    page?: number;
    limit?: number;
    categoryId?: string;
    topicId?: string;
    isPublished?: boolean;
    search?: string;
}

// Quiz type
export interface Quiz {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    order: number;
}

// Update quizzes data
export interface UpdateQuizzesData {
    readingLevel: 'SIMPLE' | 'STUDENT' | 'ACADEMIC' | 'EXPERT';
    quizzes: Quiz[];
}

// Content Block type
export interface ContentBlock {
    type: 'paragraph' | 'image' | 'heading' | 'list';
    content?: string;
    url?: string;
    caption?: string;
    items?: string[];
}

// Update content data
export interface UpdateContentData {
    readingLevel: 'SIMPLE' | 'STUDENT' | 'ACADEMIC' | 'EXPERT';
    blocks: ContentBlock[];
}

/**
 * Reviewer Articles Service Class
 */
class ReviewerArticlesService {
    /**
     * Get all articles with filters and pagination
     */
    async getArticles(params?: GetArticlesParams): Promise<{ data: Article[]; pagination: Pagination }> {
        try {
            const response = await api.get<{
                success: boolean;
                data: Article[];
                pagination: Pagination;
            }>('/reviewer/articles', { params });

            if (response.data.success) {
                return {
                    data: response.data.data,
                    pagination: response.data.pagination,
                };
            }

            throw new Error('Failed to fetch articles');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch articles';
            throw new Error(errorMessage);
        }
    }

    /**
     * Get article detail by ID
     */
    async getArticleById(id: string): Promise<Article> {
        try {
            const response = await api.get<{
                success: boolean;
                data: Article;
            }>(`/reviewer/articles/${id}`);

            if (response.data.success) {
                return response.data.data;
            }

            throw new Error('Failed to fetch article');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch article';
            throw new Error(errorMessage);
        }
    }

    /**
     * Update article
     */
    async updateArticle(id: string, data: Partial<Article>): Promise<Article> {
        try {
            const response = await api.put<{
                success: boolean;
                message: string;
                data: Article;
            }>(`/reviewer/articles/${id}`, data);

            if (response.data.success) {
                return response.data.data;
            }

            throw new Error('Failed to update article');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to update article';
            throw new Error(errorMessage);
        }
    }

    /**
     * Update article content blocks
     */
    async updateContent(articleId: string, data: UpdateContentData): Promise<void> {
        try {
            console.log('[Service] updateContent called')
            console.log('[Service] Article ID:', articleId)
            console.log('[Service] Data:', JSON.stringify(data, null, 2))
            console.log('[Service] API URL:', `/reviewer/articles/${articleId}/content`)

            const response = await api.put<{
                success: boolean;
                message: string;
                data?: any;
            }>(`/reviewer/articles/${articleId}/content`, data);

            console.log('[Service] Response:', response.data)

            if (!response.data.success) {
                throw new Error('Failed to update content');
            }

            console.log('[Service] updateContent completed successfully')
        } catch (error: any) {
            console.error('[Service] updateContent error:', error)
            console.error('[Service] Error response:', error.response?.data)
            console.error('[Service] Error status:', error.response?.status)

            const errorMessage = error.response?.data?.message || 'Failed to update content';
            throw new Error(errorMessage);
        }
    }

    /**
     * Update article quizzes
     */
    async updateQuizzes(articleId: string, data: UpdateQuizzesData): Promise<void> {
        try {
            console.log('[Service] updateQuizzes called')
            console.log('[Service] Article ID:', articleId)
            console.log('[Service] Data:', JSON.stringify(data, null, 2))
            console.log('[Service] API URL:', `/reviewer/articles/${articleId}/quizzes`)

            const response = await api.put<{
                success: boolean;
                message: string;
            }>(`/reviewer/articles/${articleId}/quizzes`, data);

            console.log('[Service] Response:', response.data)

            if (!response.data.success) {
                throw new Error('Failed to update quizzes');
            }

            console.log('[Service] updateQuizzes completed successfully')
        } catch (error: any) {
            console.error('[Service] updateQuizzes error:', error)
            console.error('[Service] Error response:', error.response?.data)
            console.error('[Service] Error status:', error.response?.status)

            const errorMessage = error.response?.data?.message || 'Failed to update quizzes';
            throw new Error(errorMessage);
        }
    }
}

export const reviewerArticlesService = new ReviewerArticlesService();
