"use client";

import { useEffect, useState } from "react";
import { dashboardService } from "@/services/dashboard.service";
import type {
  Metrics,
  Subscription,
  TrendingArticle,
  Feedback,
  Activity
} from "@/services/dashboard.service";

import { MetricsCard } from "@/components/admin/dashboard/MetricsCard";
import { SubscriptionsCard } from "@/components/admin/dashboard/SubscriptionsCard";
import { TrendingArticlesCard } from "@/components/admin/dashboard/TrendingArticlesCard";
import { FeedbackCard } from "@/components/admin/dashboard/FeedbackCard";
import { ActivityCard } from "@/components/admin/dashboard/ActivityCard";
import { DashboardSkeleton } from "@/components/admin/dashboard/DashboardSkeleton";

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [trendingArticles, setTrendingArticles] = useState<TrendingArticle[]>([]);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch all data in parallel
        const [
          metricsData,
          subscriptionsData,
          trendingData,
          feedbackData,
          activityData
        ] = await Promise.all([
          dashboardService.getMetrics(),
          dashboardService.getSubscriptions(),
          dashboardService.getTrendingArticles(),
          dashboardService.getFeedback(),
          dashboardService.getRecentActivity()
        ]);

        setMetrics(metricsData);
        setSubscriptions(subscriptionsData);
        setTrendingArticles(trendingData);
        setFeedback(feedbackData);
        setRecentActivity(activityData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!metrics || !feedback) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Failed to load dashboard data</p>
      </div>
    );
  }

  return (
    <>
      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricsCard
          title="Readers"
          value={metrics.readers.total}
          subtitle={`+${metrics.readers.growth}% from last ${metrics.readers.period}`}
        />
        <MetricsCard
          title="Authors"
          value={metrics.authors.total}
          subtitle={`+${metrics.authors.growth}% from last ${metrics.authors.period}`}
        />
        <MetricsCard
          title="Articles"
          value={metrics.articles.total}
          subtitle={`+${metrics.articles.newToday} new today`}
        />
        <MetricsCard
          title="AI Usage"
          value={metrics.aiUsage.total}
          subtitle={`requests ${metrics.aiUsage.period}`}
        />
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SubscriptionsCard subscriptions={subscriptions} />
        <TrendingArticlesCard articles={trendingArticles} />
      </div>

      {/* Bottom Section - Feedback & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FeedbackCard feedback={feedback} />
        <ActivityCard activities={recentActivity} />
      </div>
    </>
  );
}
