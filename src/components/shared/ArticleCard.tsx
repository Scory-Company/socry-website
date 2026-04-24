import { Star, Eye } from "lucide-react";
import Image from "next/image";

interface ArticleCardItem {
  id: number;
  image: string;
  title: string;
  author: string;
  category: string;
  rating: number;
  reads: string;
  publishedAt: string;
  status: "Published" | "Draft" | "Pending";
}

interface ArticleCardProps {
  article: ArticleCardItem;
  onPress?: () => void;
}

export function ArticleCard({ article, onPress }: ArticleCardProps) {
  // Format author name - max 2 authors, add "et al." if more
  const formatAuthorName = (authorString: string): string => {
    const authors = authorString.split(",").map((a) => a.trim());

    if (authors.length <= 2) {
      return authorString;
    }

    // More than 2 authors, show first 2 + "et al."
    return `${authors[0]}, ${authors[1]}, et al.`;
  };

  const displayAuthor = formatAuthorName(article.author);

  return (
    <div
      className="w-full h-full rounded-xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col"
      onClick={onPress}
    >
      {/* Image - Fixed aspect ratio */}
      <div className="relative w-full aspect-video bg-muted overflow-hidden shrink-0">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content - Fixed height structure */}
      <div className="p-5 flex-1 flex flex-col min-h-50">
        {/* Category Badge */}
        <div className="inline-block px-2.5 py-1 bg-secondary rounded-md mb-3 self-start shrink-0">
          <span className="text-xs font-medium text-secondary-foreground">
            {article.category}
          </span>
        </div>

        {/* Title - Fixed height with line clamp */}
        <h3 className="text-base font-semibold text-foreground mb-3 line-clamp-2 leading-tight min-h-10 shrink-0">
          {article.title}
        </h3>

        {/* Author - Fixed height with line clamp */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-1 shrink-0">
          {displayAuthor}
        </p>

        {/* Footer - Pushed to bottom */}
        <div className="flex items-center gap-4 mt-auto pt-2 border-t border-border/50 shrink-0">
          <div className="flex items-center gap-1.5">
            <Star className="size-4 fill-yellow-500 text-yellow-500" />
            <span className="text-sm font-medium text-foreground">
              {article.rating}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Eye className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              {article.reads}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
