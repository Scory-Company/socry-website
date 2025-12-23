import React from 'react';
import { Star, Eye, Clock } from 'lucide-react';

interface ArticleMetadataProps {
  category: string;
  title: string;
  author: string;
  rating: number;
  reads?: string;
  readTime?: string;
}

export const ArticleMetadata: React.FC<ArticleMetadataProps> = ({
  category,
  title,
  author,
  rating,
  reads = '10k',
  readTime = '5 min read',
}) => {
  // Format author name - max 2 authors, add "et al." if more
  const formatAuthorName = (authorString: string): string => {
    const authors = authorString.split(',').map((a) => a.trim());

    if (authors.length <= 2) {
      return authorString;
    }

    // More than 2 authors, show first 2 + "et al."
    return `${authors[0]}, ${authors[1]}, et al.`;
  };

  const displayAuthor = formatAuthorName(author);

  return (
    <div className="space-y-4">
      {/* Category Badge */}
      <div className="inline-block px-4 py-1.5 bg-primary rounded-lg">
        <span className="text-sm font-semibold text-primary-foreground">{category}</span>
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
        {title}
      </h1>

      {/* Metadata Row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        {/* Author */}
        <p className="text-base font-semibold text-foreground">{displayAuthor}</p>

        {/* Stats */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          {/* Separator (desktop only) */}
          <div className="hidden sm:block w-1 h-1 rounded-full bg-border" />

          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
            <span className="text-sm font-medium text-muted-foreground">{rating.toFixed(1)}</span>
          </div>

          {/* Separator */}
          <div className="w-1 h-1 rounded-full bg-border" />

          {/* Reads */}
          <div className="flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">{reads}</span>
          </div>

          {/* Separator */}
          <div className="w-1 h-1 rounded-full bg-border" />

          {/* Read Time */}
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">{readTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
