import { mockArticlesRepository } from "@/services/core/mock-articles";
import type { Article, ContentBlock, GetArticlesParams, Pagination, Quiz, UpdateContentData, UpdateQuizzesData } from "@/types/article";

export type { Article, Pagination, GetArticlesParams, Quiz, UpdateQuizzesData, ContentBlock, UpdateContentData };

class ReviewerArticlesService {
  async getArticles(params?: GetArticlesParams): Promise<{ data: Article[]; pagination: Pagination }> {
    return mockArticlesRepository.list(params);
  }

  async getArticleById(id: string): Promise<Article> {
    return mockArticlesRepository.getById(id);
  }

  async updateArticle(id: string, data: Partial<Article>): Promise<Article> {
    return mockArticlesRepository.update(id, data);
  }

  async updateContent(articleId: string, data: UpdateContentData): Promise<void> {
    return mockArticlesRepository.updateContent(articleId, data);
  }

  async updateQuizzes(articleId: string, data: UpdateQuizzesData): Promise<void> {
    return mockArticlesRepository.updateQuizzes(articleId, data);
  }

  async deleteArticle(id: string): Promise<void> {
    return mockArticlesRepository.delete(id);
  }
}

export const reviewerArticlesService = new ReviewerArticlesService();
