"use client";

import { useState, useMemo, useCallback } from "react";
import {
  categories,
  getMostPopularArticles,
  getRecentlyAddedArticles,
  getTopThisWeekArticles,
  getArticlesByCategory,
  mockArticles,
} from "@/data/mock/articles";
import { ArticleCard } from "@/components/shared/ArticleCard";
import { CategoryCard } from "@/components/admin/articles/CategoryCard";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp, Clock, Flame } from "lucide-react";

type ViewType = "popular" | "recent" | "trending";

export default function ArticlesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState<ViewType>("popular");

  const mostPopular = getMostPopularArticles();
  const recentlyAdded = getRecentlyAddedArticles();
  const topThisWeek = getTopThisWeekArticles();

  // Filter by search query
  const filterBySearch = useCallback((articles: typeof mockArticles) => {
    if (!searchQuery) return articles;
    return articles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredMostPopular = useMemo(() => {
    const articles = selectedCategory === "All" ? mostPopular : getArticlesByCategory(selectedCategory);
    return filterBySearch(articles);
  }, [selectedCategory, filterBySearch, mostPopular]);

  const filteredRecentlyAdded = useMemo(() => {
    const articles = selectedCategory === "All" ? recentlyAdded : getArticlesByCategory(selectedCategory);
    return filterBySearch(articles);
  }, [selectedCategory, filterBySearch, recentlyAdded]);

  const filteredTopThisWeek = useMemo(() => {
    const articles = selectedCategory === "All" ? topThisWeek : getArticlesByCategory(selectedCategory);
    return filterBySearch(articles);
  }, [selectedCategory, filterBySearch, topThisWeek]);

  const currentArticles = useMemo(() => {
    switch (activeView) {
      case "popular":
        return filteredMostPopular;
      case "recent":
        return filteredRecentlyAdded;
      case "trending":
        return filteredTopThisWeek;
      default:
        return filteredMostPopular;
    }
  }, [activeView, filteredMostPopular, filteredRecentlyAdded, filteredTopThisWeek]);

  const viewTabs = [
    { id: "popular" as ViewType, label: "Most Popular", icon: TrendingUp },
    { id: "recent" as ViewType, label: "Recently Added", icon: Clock },
    { id: "trending" as ViewType, label: "Top This Week", icon: Flame },
  ];

  return (
    <div className="w-full pb-12">
      {/* Header Section */}
      <div className="mb-10">
        <div className="mb-6 align-middle">
          <h1 className="text-3xl font-bold text-foreground mb-2">Articles</h1>
          <p className="text-muted-foreground">
            Discover and manage educational content across various categories
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full ">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
          <Input
            type="text"
            placeholder="Search by title, author, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 h-11"
          />
        </div>
      </div>

      {/* Categories Section - Horizontal Scroll */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-foreground mb-4">Browse by Category</h2>
        <div className="flex gap-7 overflow-x-auto pb-2 -mx-1 px-5 py-2">
          <CategoryCard
            emoji="📚"
            label="All"
            backgroundColor="#26EE5A"
            isActive={selectedCategory === "All"}
            onPress={() => setSelectedCategory("All")}
          />
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              emoji={category.emoji}
              label={category.label}
              backgroundColor={category.backgroundColor}
              isActive={selectedCategory === category.label}
              onPress={() => setSelectedCategory(category.label)}
            />
          ))}
        </div>
      </div>

      {/* View Tabs */}
      <div className="mb-8">
        <div className="flex gap-1 border-b border-border overflow-x-auto">
          {viewTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 font-medium transition-colors relative whitespace-nowrap ${
                  activeView === tab.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="size-4" />
                <span className="text-sm">{tab.label}</span>
                {activeView === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Articles Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">
            {viewTabs.find((tab) => tab.id === activeView)?.label}
          </h2>
          <span className="text-xs font-medium text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full">
            {currentArticles.length} {currentArticles.length === 1 ? "article" : "articles"}
          </span>
        </div>

        {currentArticles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
            {currentArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onPress={() => console.log("Article clicked:", article.id)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-muted/30 border-2 border-dashed border-border rounded-xl py-20 px-8 text-center">
            <div className="flex flex-col items-center gap-3 max-w-sm mx-auto">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-2">
                <Search className="size-8 text-muted-foreground/50" />
              </div>
              <p className="text-lg font-semibold text-foreground">No articles found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or category filter to find what you&apos;re looking for
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
