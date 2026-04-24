import type { MockContentBlock, MockQuiz, ReadingLevel } from "@/mocks/scory";

export type { ReadingLevel };

export interface Article {
  id: string;
  title: string;
  slug: string;
  isPublished: boolean;
  categoryId?: string;
  topicId?: string;
  imageUrl?: string;
  authorName?: string;
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
  contents?: Array<{
    id: string;
    readingLevel: ReadingLevel;
    blocks: MockContentBlock[];
  }>;
  quizzes?: Array<Quiz & { readingLevel: ReadingLevel }>;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetArticlesParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  topicId?: string;
  isPublished?: boolean;
  search?: string;
}

export interface Quiz {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  order: number;
}

export interface UpdateQuizzesData {
  readingLevel: ReadingLevel;
  quizzes: Quiz[];
}

export interface ContentBlock {
  type: string;
  data: Record<string, unknown>;
}

export interface UpdateContentData {
  readingLevel: ReadingLevel;
  blocks: ContentBlock[];
}
