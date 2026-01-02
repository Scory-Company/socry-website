'use client';

import { TrendingUp, ChevronRight } from 'lucide-react';
import { ArticleCard } from '@/components/shared/ArticleCard';
import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { articlesApi, type ArticleResponse } from '@/services/articles.service';
import { toast } from 'sonner';

interface TrendingArticlesProps {
  timeframe?: '7d' | '30d' | 'all';
  limit?: number;
}

export default function TrendingArticles({ 
  timeframe = '7d', 
  limit = 6 
}: TrendingArticlesProps) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  
  const [articles, setArticles] = useState<ArticleResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch trending articles from API
  useEffect(() => {
    const fetchTrendingArticles = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await articlesApi.getPopular({
          timeframe,
          limit,
          page: 1,
        });

        if (response.data.success) {
          setArticles(response.data.data.articles);
        } else {
          throw new Error('Failed to fetch trending articles');
        }
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to load trending articles';
        setError(errorMessage);
        console.error('Error fetching trending articles:', err);
        toast.error('Error', {
          description: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingArticles();
  }, [timeframe, limit]);

  // Drag to scroll functionality
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Touch support
  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    let touchStartX = 0;
    let scrollLeftStart = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].pageX - element.offsetLeft;
      scrollLeftStart = element.scrollLeft;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const x = e.touches[0].pageX - element.offsetLeft;
      const walk = (x - touchStartX) * 2;
      element.scrollLeft = scrollLeftStart - walk;
    };

    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchmove', handleTouchMove);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // Convert ArticleResponse to Article format for ArticleCard
  const convertToArticleFormat = (article: ArticleResponse) => ({
    id: parseInt(article.id.substring(0, 8), 16) || 0,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt || '',
    image: article.imageUrl || '',
    author: article.authorName,
    authorAvatar: article.authorAvatar,
    category: article.category.name,
    rating: article.rating,
    reads: article.viewCount >= 1000
      ? `${(article.viewCount / 1000).toFixed(1)}k reads`
      : `${article.viewCount || 0} reads`,
    readTime: article.readTimeMinutes,
    views: article.viewCount,
    publishedAt: article.publishedAt,
    status: 'Published' as const,
  });

  return (
    <section ref={sectionRef} className="relative bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="space-y-1 sm:space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-primary/10 rounded-xl shrink-0">
                <TrendingUp className="w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-5 lg:h-5 text-primary" />
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                Trending <span className="text-primary-darker">Articles</span>
              </h2>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
              Most popular research papers simplified by our community
            </p>
          </div>

          {/* View All Link - Desktop */}
          <Link
            href="/articles"
            className="hidden lg:flex items-center gap-2 text-primary hover:text-primary-dark-shade transition-colors group shrink-0"
          >
            <span className="font-medium">View All Articles</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card border-2 border-border rounded-xl p-5 animate-pulse">
                <div className="h-48 bg-muted rounded-lg mb-4"></div>
                <div className="h-4 bg-muted rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-muted rounded w-full mb-2"></div>
                <div className="h-3 bg-muted rounded w-5/6"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 bg-destructive/10 rounded-full flex items-center justify-center">
              <TrendingUp className="w-10 h-10 text-destructive" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Failed to Load Trending Articles</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-dark-shade transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Horizontal Scrollable Cards */}
        {!isLoading && !error && articles.length > 0 && (
          <motion.div
            className="relative"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Gradient Overlay - Left */}
            <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-20 bg-linear-to-r from-background to-transparent z-10 pointer-events-none"></div>

            {/* Gradient Overlay - Right */}
            <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-20 bg-linear-to-l from-background to-transparent z-10 pointer-events-none"></div>

            {/* Scrollable Container */}
            <div
              ref={scrollRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              className={`overflow-x-auto scrollbar-hide w-full ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
              style={{ scrollBehavior: isDragging ? 'auto' : 'smooth' }}
            >
              <div className="flex gap-4 sm:gap-5 lg:gap-6 pb-4 px-2 sm:px-4 lg:px-5 py-3 sm:py-4 lg:py-5 py-6">
                {articles.map((article, index) => (
                  <motion.div
                    key={article.id}
                    className="flex-none w-72 sm:w-80 lg:w-80 relative group"
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={
                      isInView
                        ? { opacity: 1, y: 0, scale: 1 }
                        : { opacity: 0, y: 30, scale: 0.95 }
                    }
                    transition={{
                      duration: 0.5,
                      delay: 0.3 + index * 0.1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileHover={{
                      y: -8,
                      transition: { duration: 0.3, ease: 'easeOut' },
                    }}
                  >
                    {/* Trending Badge */}
                    {index < 3 && (
                      <motion.div
                        className="absolute -top-2 sm:-top-3 -left-2 sm:-left-3 z-20 flex items-center gap-1 sm:gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 lg:px-5 bg-primary rounded-full shadow-lg"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={
                          isInView
                            ? { scale: 1, rotate: 0 }
                            : { scale: 0, rotate: -180 }
                        }
                        transition={{
                          duration: 0.5,
                          delay: 0.5 + index * 0.1,
                          ease: [0.34, 1.56, 0.64, 1],
                        }}
                      >
                        <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary-foreground" />
                        <span className="text-[10px] sm:text-xs font-bold text-primary-foreground">
                          #{index + 1} Trending
                        </span>
                      </motion.div>
                    )}

                    <ArticleCard article={convertToArticleFormat(article)} />
                  </motion.div>
                ))}

                {/* View More Card - Mobile */}
                <motion.div
                  className="lg:hidden flex-none w-72 sm:w-80"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={
                    isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }
                  }
                  transition={{
                    duration: 0.5,
                    delay: 0.3 + articles.length * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link href="/search?sort=trending">
                    <div className="h-full flex items-center justify-center bg-card border-2 border-dashed border-border rounded-xl hover:border-primary/50 transition-colors cursor-pointer group">
                      <div className="text-center p-6 sm:p-8">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-3 sm:mb-4 bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary" />
                        </div>
                        <p className="font-semibold text-base sm:text-lg mb-1">View More</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Explore all trending articles
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && !error && articles.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <TrendingUp className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Trending Articles</h3>
            <p className="text-muted-foreground">Check back later for trending content</p>
          </div>
        )}

        {/* View All Link - Mobile */}
        {!isLoading && !error && articles.length > 0 && (
          <motion.div
            className="lg:hidden mt-4 sm:mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Link
              href="/search?sort=trending"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-dark-shade transition-colors group font-medium text-sm sm:text-base"
            >
              <span>View All Articles</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
