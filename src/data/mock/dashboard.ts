export const mockMetrics = {
  readers: {
    total: 1234,
    growth: 12,
    period: "week"
  },
  authors: {
    total: 89,
    growth: 5,
    period: "week"
  },
  articles: {
    total: 567,
    newToday: 23
  },
  aiUsage: {
    total: 2341,
    period: "today"
  }
};

export const mockSubscriptions = [
  {
    plan: "Free Plan",
    users: 892,
    percentage: 72
  },
  {
    plan: "Pro Plan",
    users: 284,
    percentage: 23
  },
  {
    plan: "Premium Plan",
    users: 58,
    percentage: 5
  }
];

export const mockTrendingArticles = [
  {
    id: 1,
    title: "Getting Started with Next.js",
    views: 2400,
    growth: 23
  },
  {
    id: 2,
    title: "Understanding React Hooks",
    views: 1800,
    growth: 18
  },
  {
    id: 3,
    title: "Tailwind CSS Best Practices",
    views: 1200,
    growth: 15
  }
];

export const mockFeedback = {
  total: 42,
  new: 5,
  items: [
    {
      id: 1,
      type: "Bug",
      message: "The simplify level is still too hard",
      user: "Reader",
      timestamp: "5 min ago"
    },
    {
      id: 2,
      type: "Feature",
      message: "Great app, but needs dark mode",
      user: "Reader",
      timestamp: "1 hour ago"
    },
    {
      id: 3,
      type: "Praise",
      message: "Article comparison is helpful",
      user: "Author",
      timestamp: "2 hours ago"
    }
  ]
};

export const mockRecentActivity = [
  {
    id: 1,
    type: "user_registered",
    title: "New user registered",
    description: "john.doe@example.com",
    timestamp: "2 min ago"
  },
  {
    id: 2,
    type: "article_published",
    title: "Article published",
    description: "Understanding React Hooks",
    timestamp: "10 min ago"
  },
  {
    id: 3,
    type: "author_joined",
    title: "New author joined",
    description: "jane.smith@example.com",
    timestamp: "45 min ago"
  },
  {
    id: 4,
    type: "subscription_upgraded",
    title: "Subscription upgraded",
    description: "user@example.com → Pro Plan",
    timestamp: "1 hour ago"
  }
];
