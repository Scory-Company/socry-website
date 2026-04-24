import {
  getStoredPersonalization,
  mockDelay,
  saveStoredPersonalization,
  type ReadingLevel,
} from "@/mocks/scory";

export interface PersonalizationSettings {
  readingLevel: ReadingLevel;
  hasCompletedOnboarding: boolean;
}

export interface TopicInterest {
  id: string;
  categoryId: string;
  categoryName: string;
}

export const personalizationApi = {
  getSettings: async (): Promise<PersonalizationSettings | null> => {
    await mockDelay();
    const state = getStoredPersonalization();
    return state.hasCompletedOnboarding
      ? {
          readingLevel: state.readingLevel,
          hasCompletedOnboarding: state.hasCompletedOnboarding,
        }
      : null;
  },

  hasCompletedPersonalization: async (): Promise<boolean> => {
    await mockDelay(60);
    return getStoredPersonalization().hasCompletedOnboarding;
  },

  saveSettings: async (readingLevel: string) => {
    await mockDelay();
    const current = getStoredPersonalization();
    saveStoredPersonalization({
      ...current,
      readingLevel: readingLevel as ReadingLevel,
      hasCompletedOnboarding: true,
    });
    return { data: { success: true, message: "Mock personalization saved" } };
  },

  getTopicInterests: async (): Promise<TopicInterest[]> => {
    await mockDelay();
    const current = getStoredPersonalization();
    return current.topicIds.map((topicId) => ({
      id: topicId,
      categoryId: topicId,
      categoryName: topicId,
    }));
  },

  saveTopicInterests: async (topicIds: string[]) => {
    await mockDelay();
    const current = getStoredPersonalization();
    saveStoredPersonalization({
      ...current,
      topicIds,
      hasCompletedOnboarding: true,
    });
    return { data: { success: true, message: "Mock topic interests saved" } };
  },

  resetPersonalization: async () => {
    await mockDelay();
    saveStoredPersonalization({
      readingLevel: "STUDENT",
      hasCompletedOnboarding: false,
      topicIds: [],
    });
    return { data: { success: true, message: "Mock personalization reset" } };
  },
};
