'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle } from 'lucide-react';
import { ArticleHero } from '@/components/article/ArticleHero';
import { ArticleMetadata } from '@/components/article/ArticleMetadata';
import { ArticleContent } from '@/components/article/ArticleContent';
import { ReadingLevelSelector } from '@/components/article/ReadingLevelSelector';
import { ContentBlock } from '@/components/article/BlockRenderer';
import { toast } from 'sonner';
import { articlesApi, type ArticleResponse, type ReadingLevel as APIReadingLevel } from '@/services';

// Type mapping
type ReadingLevel = 'simple' | 'intermediate' | 'advanced';

// Map API reading level to UI reading level
const mapAPIToUILevel = (apiLevel: APIReadingLevel): ReadingLevel => {
  switch (apiLevel) {
    case 'SIMPLE':
      return 'simple';
    case 'STUDENT':
      return 'intermediate';
    case 'ACADEMIC':
    case 'EXPERT':
      return 'advanced';
    default:
      return 'intermediate';
  }
};

// Map UI reading level to API reading level
const mapUIToAPILevel = (uiLevel: ReadingLevel): APIReadingLevel => {
  switch (uiLevel) {
    case 'simple':
      return 'SIMPLE' as APIReadingLevel;
    case 'intermediate':
      return 'STUDENT' as APIReadingLevel;
    case 'advanced':
      return 'ACADEMIC' as APIReadingLevel;
    default:
      return 'STUDENT' as APIReadingLevel;
  }
};

interface ArticleData {
  id: string;
  slug: string;
  title: string;
  author: string;
  category: string;
  rating: number;
  reads: string;
  readTime: string;
  image: string;
  isBookmarked: boolean;
  currentLevel: ReadingLevel;
  availableLevels: ReadingLevel[];
  content: ContentBlock[];
}

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [articleData, setArticleData] = useState<ArticleData | null>(null);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [isChangingLevel, setIsChangingLevel] = useState(false);

  // Fetch article data from API
  useEffect(() => {
    const fetchArticle = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await articlesApi.getBySlug(slug);
        const article = response.data.data;

        // Get available reading levels from contents
        const availableLevels: ReadingLevel[] = article.contents
          ? article.contents.map((content) => mapAPIToUILevel(content.readingLevel))
          : ['intermediate'];

        // Get current content (first available or default to first)
        const currentContent = article.contents?.[0];
        const currentLevel = currentContent
          ? mapAPIToUILevel(currentContent.readingLevel)
          : 'intermediate';

        // Map article response to component state
        setArticleData({
          id: article.id,
          slug: article.slug,
          title: article.title,
          author: article.authorName,
          category: article.category.name,
          rating: article.rating || 0,
          reads: article.viewCount ? `${(article.viewCount / 1000).toFixed(1)}K` : '0',
          readTime: `${article.readTimeMinutes} min read`,
          image: article.imageUrl || 'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg',
          isBookmarked: false, // TODO: Get from user bookmarks
          currentLevel,
          availableLevels: [...new Set(availableLevels)], // Remove duplicates
          content: (currentContent?.blocks as ContentBlock[]) || [],
        });
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to load article';
        setError(errorMessage);
        toast.error('Error', { description: errorMessage });
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  const handleBookmark = async () => {
    setIsBookmarking(true);
    try {
      // TODO: Replace with actual API call
      // await bookmarkApi.toggleBookmark(articleData.id);

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      setArticleData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          isBookmarked: !prev.isBookmarked,
        };
      });

      toast.success(articleData?.isBookmarked ? 'Bookmark removed' : 'Article bookmarked');
    } catch (err: any) {
      toast.error('Failed to update bookmark');
    } finally {
      setIsBookmarking(false);
    }
  };

  const handleShare = async () => {
    if (!articleData) return;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: articleData.title,
          text: `Check out this article: ${articleData.title}`,
          url: window.location.href,
        });
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard');
      }
    } catch (err) {
      // User cancelled or error occurred
      console.error('Share failed:', err);
    }
  };

  const handleReadingLevelChange = async (newLevel: 'simple' | 'intermediate' | 'advanced') => {
    if (!articleData || newLevel === articleData.currentLevel) return;

    setIsChangingLevel(true);
    try {
      // TODO: Replace with actual API call to re-simplify
      // const response = await simplifyApi.resimplifyArticle(articleData.id, newLevel);
      // setArticleData(prev => ({ ...prev, content: response.data.content, currentLevel: newLevel }));

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setArticleData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          currentLevel: newLevel,
        };
      });

      toast.success(`Switched to ${newLevel} level`);
    } catch (err: any) {
      toast.error('Failed to change reading level');
    } finally {
      setIsChangingLevel(false);
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading article...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Failed to Load Article</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-primary hover:bg-primary-dark-shade text-primary-foreground rounded-xl font-semibold transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // No data state (shouldn't happen if loading/error handled correctly)
  if (!articleData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <ArticleHero
        image={articleData.image}
        title={articleData.title}
        onBookmark={handleBookmark}
        onShare={handleShare}
        isBookmarked={articleData.isBookmarked}
        isBookmarking={isBookmarking}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          {/* Article Metadata */}
          <ArticleMetadata
            category={articleData.category}
            title={articleData.title}
            author={articleData.author}
            rating={articleData.rating}
            reads={articleData.reads}
            readTime={articleData.readTime}
          />

          {/* Reading Level Selector */}
          <ReadingLevelSelector
            currentLevel={articleData.currentLevel}
            availableLevels={articleData.availableLevels as any}
            onChange={handleReadingLevelChange}
            isLoading={isChangingLevel}
          />

          {/* Article Content */}
          <motion.div
            key={articleData.currentLevel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-card border-2 border-border rounded-xl p-6 sm:p-8 lg:p-10"
          >
            <ArticleContent blocks={articleData.content} />
          </motion.div>

          {/* TODO: Add ComprehensionSection (Quiz) here */}
        </motion.div>
      </div>
    </div>
  );
}
