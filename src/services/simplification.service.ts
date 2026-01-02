/**
 * Simplification API Service
 * 
 * Handles PDF upload and AI-powered article simplification
 */

import api from './api';

export type ReadingLevel = 'SIMPLE' | 'STUDENT' | 'ACADEMIC' | 'EXPERT';

export interface SimplifyResponse {
    success: boolean;
    message: string;
    data: {
        articleId: string;
        isNewSimplification: boolean;
        isCached: boolean;
        content: Array<{
            type: string;
            data: any;
        }>;
        quiz: Array<{
            question: string;
            options: string[];
            correctAnswer: string;
            explanation: string;
        }>;
        metadata: {
            extractionMethod: string;
            aiCost: number;
            processingTime: number;
            readingLevel: ReadingLevel;
        };
    };
}

class SimplificationService {
    /**
     * Re-simplify existing article to different reading level
     * 
     * @param articleId - Article UUID
     * @param readingLevel - Target reading level
     * @param pdfUrl - Optional PDF URL if not already stored
     */
    async resimplifyArticle(
        articleId: string,
        readingLevel: ReadingLevel,
        pdfUrl?: string
    ): Promise<SimplifyResponse> {
        try {
            const response = await api.post<SimplifyResponse>(
                `/reviewer/simplify/${articleId}/resimplify`,
                {
                    readingLevel,
                    ...(pdfUrl && { pdfUrl })
                }
            );

            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to simplify article';
            throw new Error(errorMessage);
        }
    }

    /**
     * Simplify an external paper (from OpenAlex or Scholar)
     */
    async simplifyExternal(data: {
        pdfUrl?: string;
        landingPageUrl?: string;
        title: string;
        externalId?: string;
        source?: string;
        readingLevel?: ReadingLevel;
        authors?: string[];
        year?: number;
    }): Promise<SimplifyResponse> {
        try {
            const response = await api.post<SimplifyResponse>(
                '/reviewer/simplify/external',
                data
            );
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to simplify external paper';
            throw new Error(errorMessage);
        }
    }

    /**
     * Upload PDF file and get URL
     * (This is a placeholder - implement based on your upload endpoint)
     */
    async uploadPdf(file: File): Promise<string> {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post<{
                success: boolean;
                data: {
                    url: string;
                    path: string;
                }
            }>('/upload/pdf', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success && response.data.data?.url) {
                return response.data.data.url;
            }

            throw new Error('Invalid response from upload server');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to upload PDF file';
            throw new Error(message);
        }
    }

    /**
     * Get simplified article
     */
    async getSimplifiedArticle(
        articleId: string,
        readingLevel: ReadingLevel,
        includeQuiz = true
    ) {
        try {
            const response = await api.get(
                `/reviewer/simplify/${articleId}`,
                {
                    params: { readingLevel, includeQuiz }
                }
            );

            return response.data;
        } catch (error: any) {
            throw new Error('Failed to fetch simplified article');
        }
    }
}

export const simplificationService = new SimplificationService();
export default simplificationService;
