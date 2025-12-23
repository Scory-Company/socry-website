import React from 'react';

// Content Block Types
export interface ContentBlock {
  type: 'heading' | 'text' | 'list' | 'quote' | 'callout' | 'divider' | 'image' | 'infographic';
  data: {
    // For heading
    level?: number;
    text?: string;

    // For list
    style?: 'bullet' | 'numbered';
    items?: string[];

    // For quote
    author?: string;
    caption?: string;

    // For callout
    variant?: 'info' | 'warning' | 'success' | 'error';

    // For image/infographic
    url?: string;
    alt?: string;
  };
}

// Individual Block Components
export const HeadingBlock: React.FC<{ text?: string; level?: number }> = ({ text, level = 2 }) => {
  const validLevel = Math.min(Math.max(level, 1), 6);
  const sizeClasses = {
    1: 'text-4xl font-bold mb-6 mt-8',
    2: 'text-3xl font-bold mb-5 mt-7',
    3: 'text-2xl font-bold mb-4 mt-6',
    4: 'text-xl font-semibold mb-3 mt-5',
    5: 'text-lg font-semibold mb-2 mt-4',
    6: 'text-base font-semibold mb-2 mt-3',
  };

  const className = `text-foreground ${sizeClasses[validLevel as keyof typeof sizeClasses] || sizeClasses[2]}`;

  return React.createElement(`h${validLevel}`, { className }, text);
};

export const TextBlock: React.FC<{ text?: string }> = ({ text }) => {
  if (!text) return null;

  // Parse formatted text (bold, italic, code)
  const parseFormattedText = (content: string) => {
    // Split by formatting markers
    const parts = content.split(/((\*\*.*?\*\*)|(\*.*?\*)|(`.*?`)|('.*?'))/g);

    return parts.map((part, index) => {
      // Bold: **text**
      if (part?.startsWith('**') && part?.endsWith('**')) {
        return (
          <strong key={index} className="font-bold text-foreground">
            {part.slice(2, -2)}
          </strong>
        );
      }
      // Italic: *text*
      if (part?.startsWith('*') && part?.endsWith('*') && part.length > 2) {
        return (
          <em key={index} className="italic">
            {part.slice(1, -1)}
          </em>
        );
      }
      // Code/Highlight: `text` or 'text'
      if ((part?.startsWith('`') && part?.endsWith('`')) || (part?.startsWith("'") && part?.endsWith("'"))) {
        const cleanText = part.slice(1, -1);
        if (cleanText.length === 0) return <span key={index}>{part}</span>;
        return (
          <code key={index} className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-sm font-mono">
            {cleanText}
          </code>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <p className="text-base text-muted-foreground leading-relaxed mb-4">
      {parseFormattedText(text)}
    </p>
  );
};

export const ListBlock: React.FC<{ style?: 'bullet' | 'numbered'; items?: string[] }> = ({ 
  style = 'bullet', 
  items = [] 
}) => {
  const parseTextWithBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-bold text-foreground">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const ListTag = style === 'numbered' ? 'ol' : 'ul';
  const listClass = style === 'numbered' 
    ? 'list-decimal list-inside space-y-2 mb-4 pl-4'
    : 'list-disc list-inside space-y-2 mb-4 pl-4';

  return (
    <ListTag className={listClass}>
      {items.map((item, index) => (
        <li key={index} className="text-base text-muted-foreground leading-relaxed">
          {parseTextWithBold(item)}
        </li>
      ))}
    </ListTag>
  );
};

export const QuoteBlock: React.FC<{ text?: string; author?: string }> = ({ text, author }) => {
  return (
    <blockquote className="border-l-4 border-primary pl-6 py-2 my-6 italic">
      <p className="text-lg text-foreground leading-relaxed mb-2">
        &quot;{text}&quot;
      </p>
      {author && (
        <footer className="text-sm text-muted-foreground font-semibold">
          — {author}
        </footer>
      )}
    </blockquote>
  );
};

export const CalloutBlock: React.FC<{ text?: string; variant?: 'info' | 'warning' | 'success' | 'error' }> = ({ 
  text, 
  variant = 'info' 
}) => {
  const variantStyles = {
    info: {
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      border: 'border-blue-200 dark:border-blue-800',
      icon: '💡',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-950/30',
      border: 'border-yellow-200 dark:border-yellow-800',
      icon: '⚠️',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
    },
    success: {
      bg: 'bg-green-50 dark:bg-green-950/30',
      border: 'border-green-200 dark:border-green-800',
      icon: '✅',
      iconColor: 'text-green-600 dark:text-green-400',
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-950/30',
      border: 'border-red-200 dark:border-red-800',
      icon: '❌',
      iconColor: 'text-red-600 dark:text-red-400',
    },
  };

  const style = variantStyles[variant];

  return (
    <div className={`flex gap-3 p-4 rounded-lg border-2 ${style.bg} ${style.border} my-4`}>
      <span className="text-2xl shrink-0">{style.icon}</span>
      <p className="text-base text-foreground leading-relaxed flex-1">
        {text}
      </p>
    </div>
  );
};

export const DividerBlock: React.FC = () => {
  return <hr className="my-8 border-t border-border" />;
};

export const ImageBlock: React.FC<{ url?: string; caption?: string; alt?: string }> = ({ 
  url, 
  caption, 
  alt 
}) => {
  if (!url) return null;

  return (
    <figure className="my-6">
      <img 
        src={url} 
        alt={alt || caption || 'Article image'} 
        className="w-full h-auto rounded-xl object-cover"
      />
      {caption && (
        <figcaption className="text-sm text-muted-foreground italic text-center mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

export const InfographicBlock: React.FC<{ url?: string; caption?: string; alt?: string }> = ({ 
  url, 
  caption, 
  alt 
}) => {
  if (!url) return null;

  return (
    <figure className="my-6 flex flex-col items-center">
      <img 
        src={url} 
        alt={alt || caption || 'Infographic'} 
        className="w-full max-w-3xl h-auto rounded-xl object-contain"
      />
      {caption && (
        <figcaption className="text-sm text-muted-foreground italic text-center mt-2 px-4">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

// Main Block Renderer
export const BlockRenderer: React.FC<{ block: ContentBlock; index: number }> = ({ block, index }) => {
  switch (block.type) {
    case 'text':
      return <TextBlock text={block.data.text} />;
    
    case 'heading':
      return <HeadingBlock text={block.data.text} level={block.data.level} />;
    
    case 'quote':
      return <QuoteBlock text={block.data.text} author={block.data.author} />;
    
    case 'list':
      return <ListBlock style={block.data.style} items={block.data.items} />;
    
    case 'image':
      return <ImageBlock url={block.data.url} caption={block.data.caption} alt={block.data.alt} />;
    
    case 'infographic':
      return <InfographicBlock url={block.data.url} caption={block.data.caption} alt={block.data.alt} />;
    
    case 'callout':
      return <CalloutBlock text={block.data.text} variant={block.data.variant} />;
    
    case 'divider':
      return <DividerBlock />;
    
    default:
      return null;
  }
};
