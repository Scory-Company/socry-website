import {
  mockMetrics,
  mockSubscriptions,
  mockTrendingArticles,
  mockFeedback,
  mockRecentActivity
} from "@/data/mock/dashboard";

// Types
export interface Metrics {
  readers: {
    total: number;
    growth: number;
    period: string;
  };
  authors: {
    total: number;
    growth: number;
    period: string;
  };
  articles: {
    total: number;
    newToday: number;
  };
  aiUsage: {
    total: number;
    period: string;
  };
}

export interface Subscription {
  plan: string;
  users: number;
  percentage: number;
}

export interface TrendingArticle {
  id: number;
  title: string;
  views: number;
  growth: number;
}

export interface FeedbackItem {
  id: number;
  type: string;
  message: string;
  user: string;
  timestamp: string;
}

export interface Feedback {
  total: number;
  new: number;
  items: FeedbackItem[];
}

export interface Activity {
  id: number;
  type: string;
  title: string;
  description: string;
  timestamp: string;
}

// Service Class
class DashboardService {
  // Simulate API delay
  private async delay(ms: number = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getMetrics(): Promise<Metrics> {
    await this.delay();
    // TODO: Replace with real API call
    // const response = await fetch('/api/admin/metrics');
    // return response.json();
    return mockMetrics;
  }

  async getSubscriptions(): Promise<Subscription[]> {
    await this.delay();
    // TODO: Replace with real API call
    // const response = await fetch('/api/admin/subscriptions');
    // return response.json();
    return mockSubscriptions;
  }

  async getTrendingArticles(): Promise<TrendingArticle[]> {
    await this.delay();
    // TODO: Replace with real API call
    // const response = await fetch('/api/admin/trending-articles');
    // return response.json();
    return mockTrendingArticles;
  }

  async getFeedback(): Promise<Feedback> {
    await this.delay();
    // TODO: Replace with real API call
    // const response = await fetch('/api/admin/feedback');
    // return response.json();
    return mockFeedback;
  }

  async getRecentActivity(): Promise<Activity[]> {
    await this.delay();
    // TODO: Replace with real API call
    // const response = await fetch('/api/admin/recent-activity');
    // return response.json();
    return mockRecentActivity;
  }
}

export const dashboardService = new DashboardService();
