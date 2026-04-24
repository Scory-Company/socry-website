import {
  buildSimplifiedPayload,
  createRegeneratedBlocks,
  createRegeneratedQuizzes,
  getMockArticleById,
  getMockArticles,
  mockDelay,
  saveMockArticles,
  toSlug,
  updateMockArticleLevelContent,
  updateMockArticleLevelQuizzes,
  type ReadingLevel,
} from "@/mocks/scory";

export type { ReadingLevel };

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
  async resimplifyArticle(articleId: string, readingLevel: ReadingLevel, pdfUrl?: string): Promise<SimplifyResponse> {
    await mockDelay(300);
    const article = getMockArticleById(articleId);
    if (!article) {
      throw new Error("Mock article not found");
    }

    const blocks = createRegeneratedBlocks(article, readingLevel, pdfUrl);
    const quizzes = createRegeneratedQuizzes(readingLevel);
    updateMockArticleLevelContent(articleId, readingLevel, blocks);
    updateMockArticleLevelQuizzes(articleId, readingLevel, quizzes);
    return buildSimplifiedPayload(getMockArticleById(articleId)!, readingLevel);
  }

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
    await mockDelay(300);
    const level = data.readingLevel ?? "STUDENT";
    const category = getMockArticles()[0]?.category;
    const newArticleId = `external-${Math.random().toString(36).slice(2, 8)}`;
    const article = {
      ...getMockArticles()[0],
      id: newArticleId,
      slug: toSlug(data.title),
      title: data.title,
      excerpt: "Mock external simplification result created during frontend cleanup.",
      authorName: data.authors?.join(", ") || "External Author",
      category,
      isExternal: true,
      externalMetadata: {
        source: (data.source === "scholar" ? "scholar" : "openalex") as "openalex" | "scholar",
        externalId: data.externalId || newArticleId,
        pdfUrl: data.pdfUrl,
        landingPageUrl: data.landingPageUrl,
        year: data.year || 2026,
      },
    };
    const articles = getMockArticles();
    articles.unshift(article);
    saveMockArticles(articles);
    return buildSimplifiedPayload(article, level);
  }

  async uploadPdf(file: File): Promise<string> {
    await mockDelay(120);
    return `mock://pdf/${encodeURIComponent(file.name)}`;
  }

  async getSimplifiedArticle(articleId: string, readingLevel: ReadingLevel, includeQuiz = true) {
    await mockDelay();
    const article = getMockArticleById(articleId);
    if (!article) {
      throw new Error("Mock article not found");
    }
    const payload = buildSimplifiedPayload(article, readingLevel);
    if (!includeQuiz) {
      payload.data.quiz = [];
    }
    return payload;
  }
}

export const simplificationService = new SimplificationService();
export default simplificationService;
