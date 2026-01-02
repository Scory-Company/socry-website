# 🚀 API Guide untuk Frontend Web - Scory

> Dokumentasi singkat API public untuk frontend web

---

## 🔓 Semua Endpoint di Bawah Adalah PUBLIC (Tidak Perlu Auth)

---

## 1️⃣ Get Trending Articles

### Endpoint
```
GET /api/v1/articles/popular
```

### Query Parameters
| Parameter | Type | Default | Deskripsi |
|-----------|------|---------|-----------|
| `timeframe` | string | 'all' | `'7d'`, `'30d'`, atau `'all'` |
| `limit` | number | 20 | Max 50 |
| `page` | number | 1 | Halaman |

### Contoh Request
```typescript
// Trending minggu ini
const response = await fetch(
  'http://localhost:3000/api/v1/articles/popular?timeframe=7d&limit=10'
);
const data = await response.json();
```

### Response
```json
{
  "success": true,
  "data": {
    "articles": [
      {
        "id": "uuid",
        "title": "Article Title",
        "slug": "article-slug",
        "excerpt": "Article excerpt...",
        "imageUrl": "https://...",
        "authorName": "Author Name",
        "readTimeMinutes": 5,
        "rating": 4.5,
        "totalRatings": 100,
        "viewCount": 1000,
        "viewCountWeek": 150,
        "popularityScore": 95.5,
        "popularityRank": 1,
        "category": {
          "id": "uuid",
          "name": "Technology",
          "slug": "technology"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

---

## 2️⃣ Get Article Detail

### Endpoint
```
GET /api/v1/articles/:slug
```

### Contoh Request
```typescript
const slug = "article-slug";
const response = await fetch(
  `http://localhost:3000/api/v1/articles/${slug}`
);
const data = await response.json();
```

### Response
```json
{
  "id": "uuid",
  "title": "Article Title",
  "slug": "article-slug",
  "excerpt": "Article excerpt...",
  "imageUrl": "https://...",
  "authorName": "Author Name",
  "readTimeMinutes": 5,
  "rating": 4.5,
  "totalRatings": 100,
  "viewCount": 1001,
  "category": {
    "id": "uuid",
    "name": "Technology",
    "slug": "technology"
  },
  "topics": [
    {
      "id": "uuid",
      "name": "AI",
      "slug": "ai"
    }
  ],
  "isExternal": false,
  "externalMetadata": null
}
```

---

## 3️⃣ Get Article Content (SIMPLE Level)

### Endpoint
```
GET /api/v1/articles/:slug/content?readingLevel=SIMPLE
```

### Query Parameters
| Parameter | Type | Required | Deskripsi |
|-----------|------|----------|-----------|
| `readingLevel` | string | Yes | `'SIMPLE'`, `'STUDENT'`, `'ACADEMIC'`, `'EXPERT'` |

### Contoh Request
```typescript
const slug = "article-slug";
const response = await fetch(
  `http://localhost:3000/api/v1/articles/${slug}/content?readingLevel=SIMPLE`
);
const data = await response.json();
```

### Response
```json
{
  "id": "uuid",
  "articleId": "uuid",
  "readingLevel": "SIMPLE",
  "blocks": [
    {
      "type": "heading",
      "content": "Introduction"
    },
    {
      "type": "paragraph",
      "content": "This is a simplified paragraph..."
    },
    {
      "type": "list",
      "items": ["Point 1", "Point 2"]
    }
  ],
  "createdAt": "2025-12-30T00:00:00.000Z",
  "updatedAt": "2025-12-30T00:00:00.000Z"
}
```

---

## 📝 TypeScript Interfaces

```typescript
// Article dari trending
interface TrendingArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  imageUrl: string;
  authorName: string;
  readTimeMinutes: number;
  rating: number;
  totalRatings: number;
  viewCount: number;
  viewCountWeek: number;
  popularityScore: number;  // 0-100
  popularityRank: number;   // 1, 2, 3, ...
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

// Article detail
interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  imageUrl: string;
  authorName: string;
  authorAvatar: string | null;
  readTimeMinutes: number;
  rating: number;
  totalRatings: number;
  viewCount: number;
  isPublished: boolean;
  publishedAt: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  topics: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  isExternal: boolean;
  externalMetadata: any | null;
}

// Article content
interface ArticleContent {
  id: string;
  articleId: string;
  readingLevel: 'SIMPLE' | 'STUDENT' | 'ACADEMIC' | 'EXPERT';
  blocks: ContentBlock[];
  createdAt: string;
  updatedAt: string;
}

interface ContentBlock {
  type: 'heading' | 'paragraph' | 'list' | 'image' | 'quote';
  content?: string;
  items?: string[];
  url?: string;
  alt?: string;
}
```

---

## 🎨 Contoh Implementasi React

### 1. Trending Articles Page

```typescript
import { useState, useEffect } from 'react';

const TrendingPage = () => {
  const [articles, setArticles] = useState<TrendingArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch(
          'http://localhost:3000/api/v1/articles/popular?timeframe=7d&limit=10'
        );
        const data = await res.json();
        
        if (data.success) {
          setArticles(data.data.articles);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>🔥 Trending This Week</h1>
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
};
```

### 2. Article Detail Page

```typescript
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ArticleDetailPage = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [content, setContent] = useState<ArticleContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        // Get article detail
        const articleRes = await fetch(
          `http://localhost:3000/api/v1/articles/${slug}`
        );
        const articleData = await articleRes.json();
        setArticle(articleData);

        // Get SIMPLE content
        const contentRes = await fetch(
          `http://localhost:3000/api/v1/articles/${slug}/content?readingLevel=SIMPLE`
        );
        const contentData = await contentRes.json();
        setContent(contentData);

      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (loading) return <div>Loading...</div>;
  if (!article || !content) return <div>Article not found</div>;

  return (
    <article>
      <h1>{article.title}</h1>
      <p>{article.excerpt}</p>
      
      <div className="meta">
        <span>By {article.authorName}</span>
        <span>⭐ {article.rating} ({article.totalRatings} ratings)</span>
        <span>📖 {article.readTimeMinutes} min read</span>
      </div>

      <div className="content">
        {content.blocks.map((block, index) => (
          <ContentBlock key={index} block={block} />
        ))}
      </div>
    </article>
  );
};
```

### 3. Content Block Renderer

```typescript
const ContentBlock = ({ block }: { block: ContentBlock }) => {
  switch (block.type) {
    case 'heading':
      return <h2>{block.content}</h2>;
    
    case 'paragraph':
      return <p>{block.content}</p>;
    
    case 'list':
      return (
        <ul>
          {block.items?.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    
    case 'image':
      return <img src={block.url} alt={block.alt} />;
    
    case 'quote':
      return <blockquote>{block.content}</blockquote>;
    
    default:
      return null;
  }
};
```

---

## 🎯 Flow Lengkap

```
1. User buka homepage
   ↓
2. Fetch trending articles
   GET /api/v1/articles/popular?timeframe=7d&limit=10
   ↓
3. Tampilkan list artikel dengan ranking
   ↓
4. User klik artikel
   ↓
5. Fetch article detail
   GET /api/v1/articles/:slug
   ↓
6. Fetch SIMPLE content
   GET /api/v1/articles/:slug/content?readingLevel=SIMPLE
   ↓
7. Render article dengan content blocks
```

---

## 🌐 Base URL

**Development:**
```
http://localhost:3000/api/v1
```

**Production:**
```
https://your-domain.com/api/v1
```

---

## ✅ Checklist Implementasi

- [ ] Setup fetch trending articles
- [ ] Buat ArticleCard component
- [ ] Setup routing untuk article detail
- [ ] Fetch article detail by slug
- [ ] Fetch article content (SIMPLE)
- [ ] Buat ContentBlock renderer
- [ ] Handle loading states
- [ ] Handle error states
- [ ] Add pagination untuk trending

---

**Last Updated:** 2025-12-30  
**Status:** ✅ Ready to Use
