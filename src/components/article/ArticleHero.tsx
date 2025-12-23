'use client';

import React from 'react';
import { ArrowLeft, Bookmark, Share2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface ArticleHeroProps {
  image: string;
  title: string;
  onBookmark?: () => void;
  onShare?: () => void;
  isBookmarked?: boolean;
  isBookmarking?: boolean;
}

export const ArticleHero: React.FC<ArticleHeroProps> = ({
  image,
  title,
  onBookmark,
  onShare,
  isBookmarked = false,
  isBookmarking = false,
}) => {
  const router = useRouter();

  return (
    <div className="relative w-full h-[360px] sm:h-[400px] lg:h-[450px] overflow-hidden rounded-b-3xl">
      {/* Hero Image */}
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover"
        priority
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

      {/* Header Actions */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 sm:p-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full transition-all hover:scale-105"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Bookmark Button */}
          <button
            onClick={onBookmark}
            disabled={isBookmarking}
            className={`flex items-center justify-center w-10 h-10 backdrop-blur-sm rounded-full transition-all hover:scale-105 ${
              isBookmarked
                ? 'bg-primary hover:bg-primary-dark-shade'
                : 'bg-black/50 hover:bg-black/70'
            }`}
          >
            {isBookmarking ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Bookmark
                className={`w-5 h-5 ${isBookmarked ? 'fill-white text-white' : 'text-white'}`}
              />
            )}
          </button>

          {/* Share Button */}
          {onShare && (
            <button
              onClick={onShare}
              className="flex items-center justify-center w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full transition-all hover:scale-105"
            >
              <Share2 className="w-5 h-5 text-white" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
