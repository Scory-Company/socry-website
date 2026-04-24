import {
  deleteMockArticle,
  getMockArticleById,
  getMockArticles,
  mockDelay,
  updateMockArticle,
  updateMockArticleLevelContent,
  updateMockArticleLevelQuizzes,
  type MockContentBlock,
} from "@/mocks/scory";
import type { Article, GetArticlesParams, Pagination, UpdateContentData, UpdateQuizzesData } from "@/types/article";

function mapArticleRecord(article: ReturnType<typeof getMockArticles>[number]): Article {
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    isPublished: article.isPublished,
    categoryId: article.category.id,
    imageUrl: article.imageUrl,
    authorName: article.authorName,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
    contents: article.contents,
    quizzes: article.quizzes,
  };
}

function paginate(items: Article[], page = 1, limit = 10): { data: Article[]; pagination: Pagination } {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * limit;

  return {
    data: items.slice(start, start + limit),
    pagination: {
      page: currentPage,
      limit,
      total,
      totalPages,
    },
  };
}

export class MockArticlesRepository {
  async list(params?: GetArticlesParams): Promise<{ data: Article[]; pagination: Pagination }> {
    await mockDelay();
    let articles = getMockArticles().map(mapArticleRecord);

    if (params?.categoryId) {
      articles = articles.filter((article) => article.categoryId === params.categoryId);
    }
    if (typeof params?.isPublished === "boolean") {
      articles = articles.filter((article) => article.isPublished === params.isPublished);
    }
    if (params?.search) {
      const query = params.search.toLowerCase();
      articles = articles.filter((article) => [article.title, article.authorName].join(" ").toLowerCase().includes(query));
    }

    articles.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    return paginate(articles, params?.page, params?.limit);
  }

  async getById(id: string): Promise<Article> {
    await mockDelay();
    const article = getMockArticleById(id);
    if (!article) {
      throw new Error("Mock article not found");
    }
    return mapArticleRecord(article);
  }

  async update(id: string, data: Partial<Article>): Promise<Article> {
    await mockDelay();
    const updated = updateMockArticle(id, {
      title: data.title,
      authorName: data.authorName,
      imageUrl: data.imageUrl,
      isPublished: data.isPublished,
    });
    if (!updated) {
      throw new Error("Failed to update mock article");
    }
    return mapArticleRecord(updated);
  }

  async updateContent(articleId: string, data: UpdateContentData): Promise<void> {
    await mockDelay();
    const updated = updateMockArticleLevelContent(articleId, data.readingLevel, data.blocks as MockContentBlock[]);
    if (!updated) {
      throw new Error("Failed to update mock content");
    }
  }

  async updateQuizzes(articleId: string, data: UpdateQuizzesData): Promise<void> {
    await mockDelay();
    const updated = updateMockArticleLevelQuizzes(
      articleId,
      data.readingLevel,
      data.quizzes.map((quiz) => ({ ...quiz, readingLevel: data.readingLevel })),
    );
    if (!updated) {
      throw new Error("Failed to update mock quizzes");
    }
  }

  async delete(id: string): Promise<void> {
    await mockDelay();
    const deleted = deleteMockArticle(id);
    if (!deleted) {
      throw new Error("Failed to delete mock article");
    }
  }
}

export const mockArticlesRepository = new MockArticlesRepository();
