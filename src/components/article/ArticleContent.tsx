import React from 'react';
import { ContentBlock, BlockRenderer } from './BlockRenderer';

interface ArticleContentProps {
  blocks: ContentBlock[];
}

export const ArticleContent: React.FC<ArticleContentProps> = ({ blocks }) => {
  if (!blocks || blocks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No content available</p>
      </div>
    );
  }

  return (
    <div className="prose prose-lg max-w-none">
      {blocks.map((block, index) => (
        <BlockRenderer key={index} block={block} index={index} />
      ))}
    </div>
  );
};
