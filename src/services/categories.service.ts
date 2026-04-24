import { getMockCategories, mockDelay } from "@/mocks/scory";

export interface CategoryResponse {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  articleCount: number;
}

export interface CategoriesListResponse {
  data: CategoryResponse[];
  message: string;
  success: boolean;
}

export interface SingleCategoryResponse {
  data: CategoryResponse;
  message: string;
  success: boolean;
}

export const categoriesApi = {
  getAll: async (): Promise<{ data: CategoriesListResponse }> => {
    await mockDelay();
    return {
      data: {
        success: true,
        message: "Mock categories loaded",
        data: getMockCategories(),
      },
    };
  },
  getBySlug: async (slug: string): Promise<{ data: SingleCategoryResponse }> => {
    await mockDelay();
    const category = getMockCategories().find((item) => item.slug === slug) ?? getMockCategories()[0];
    return {
      data: {
        success: true,
        message: "Mock category loaded",
        data: category,
      },
    };
  },
};
