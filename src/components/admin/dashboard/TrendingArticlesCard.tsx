import type { TrendingArticle } from "@/services/dashboard.service";

interface TrendingArticlesCardProps {
  articles: TrendingArticle[];
}

export function TrendingArticlesCard({ articles }: TrendingArticlesCardProps) {
  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  return (
    <div className="border border-border rounded-lg p-6 bg-card">
      <h2 className="text-xl font-semibold mb-4 text-foreground">Trending Articles</h2>
      <div className="space-y-3">
        {articles.map((article, index) => (
          <div
            key={article.id}
            className={`flex justify-between items-center py-2 ${
              index !== articles.length - 1 ? 'border-b border-border' : ''
            }`}
          >
            <div className="flex-1">
              <p className="text-foreground font-medium text-sm">{article.title}</p>
              <p className="text-xs text-muted-foreground">{formatViews(article.views)} views</p>
            </div>
            <span className="text-xs text-primary font-medium">↑ {article.growth}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
