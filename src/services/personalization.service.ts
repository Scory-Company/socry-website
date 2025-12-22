import api from './api';

// ============================================
// TYPES
// ============================================

export interface PersonalizationSettings {
    readingLevel: 'SIMPLE' | 'STUDENT' | 'ACADEMIC' | 'EXPERT';
    hasCompletedOnboarding: boolean;
}

export interface TopicInterest {
    id: string;
    categoryId: string;
    categoryName: string;
}

// ============================================
// API FUNCTIONS
// ============================================

export const personalizationApi = {
    /**
     * Get user's personalization settings
     * Returns null if user hasn't completed personalization
     */
    getSettings: async (): Promise<PersonalizationSettings | null> => {
        try {
            const response = await api.get('/personalization');
            return response.data.data || null;
        } catch (error: any) {
            // 404 means user hasn't set up personalization yet
            if (error.response?.status === 404) {
                return null;
            }
            throw error;
        }
    },

    /**
     * Check if user has completed personalization
     * Returns true if user has any personalization data (reading level set)
     */
    hasCompletedPersonalization: async (): Promise<boolean> => {
        try {
            const settings = await personalizationApi.getSettings();
            // If settings exist (not null/404), user has personalized
            return settings !== null;
        } catch (error) {
            console.error('[PersonalizationAPI] Error checking personalization:', error);
            return false;
        }
    },

    /**
     * Save reading level preference
     */
    saveSettings: (readingLevel: string) =>
        api.post('/personalization', { readingLevel }),

    /**
     * Get user's topic interests
     */
    getTopicInterests: async (): Promise<TopicInterest[]> => {
        try {
            const response = await api.get('/personalization/topics');
            return response.data.data || [];
        } catch (error) {
            return [];
        }
    },

    /**
     * Save topic interests (category IDs)
     */
    saveTopicInterests: (topicIds: string[]) =>
        api.post('/personalization/topics', { topicIds }),

    /**
     * Reset personalization (for testing)
     */
    resetPersonalization: () => api.delete('/personalization'),
};
