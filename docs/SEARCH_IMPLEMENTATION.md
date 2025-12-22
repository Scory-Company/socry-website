# Search Implementation Documentation

## 📋 Overview
Implementasi fitur search dengan integrasi backend API menggunakan custom hooks pattern.

## 🏗️ Architecture

### Services Layer
```
src/services/
├── search.service.ts      # Search API integration
├── articles.service.ts    # Articles API integration
└── index.ts              # Central exports
```

### Hooks Layer
```
src/hooks/
└── useSearch.ts          # Custom hook untuk search logic
```

### Components Layer
```
src/app/(client)/search/
└── page.tsx              # Search page (UI only)
```

## 🔄 Flow Diagram

```
User Input
    ↓
Search Page (page.tsx)
    ↓
useSearch Hook
    ↓
    ├─ Query exists? → searchApi.search()
    └─ No query? → articlesApi.getArticles()
    ↓
Mapper Functions
    ↓
UnifiedSearchResult[]
    ↓
SearchResultCard Components
```

## 🎯 Features Implemented

### 1. **Dual Mode Search**
- **Search Mode**: Ketika ada query → panggil `/search` API
- **Default Mode**: Tanpa query → panggil `/articles` API (semua artikel yang sudah di-simplify)

### 2. **Custom Hook: `useSearch`**
```typescript
const { 
  results, 
  isLoading,
  isLoadingMore,
  hasMore,
  totalResults,
  search,
  loadMore 
} = useSearch({
  initialQuery: queryParam,
  autoFetch: true,
  limit: 20,
})
```

**Features:**
- Auto-fetch on mount
- Automatic mode switching
- Loading & error states
- Response mapping/normalization
- **Infinite scroll pagination**
- Load more functionality

### 3. **Infinite Scroll Pagination** ✨
- **Load More Button**: User-friendly button untuk load hasil berikutnya
- **Append Results**: Hasil baru ditambahkan ke existing results (tidak replace)
- **Loading States**: 
  - `isLoading` - Initial load
  - `isLoadingMore` - Loading more results
- **Smart Pagination**:
  - Track current page
  - `hasMore` flag dari backend
  - Total results count
- **Auto Reset**: Reset ke page 1 saat query/source berubah

### 4. **Response Mapping**
Karena response structure berbeda antara Search API dan Articles API, dibuat mapper functions:

```typescript
// ArticleResponse → UnifiedSearchResult
mapArticleToSearchResult(article: ArticleResponse): UnifiedSearchResult

// SearchResult → UnifiedSearchResult  
mapSearchResultToUnified(result: SearchResult): UnifiedSearchResult
```

## 📡 API Endpoints

### Search API
```typescript
GET /search?q={query}&sources=internal&limit=20

Response:
{
  success: boolean,
  query: string,
  data: {
    results: SearchResult[],
    meta: SearchMeta
  }
}
```

### Articles API
```typescript
GET /articles?limit=20&sort=recent

Response:
{
  success: boolean,
  message: string,
  data: {
    articles: ArticleResponse[],
    pagination: {...}
  }
}
```

## 🎨 UI/UX Features

✅ Real-time search dengan URL sync  
✅ Loading states dengan skeleton  
✅ Error handling dengan toast notifications  
✅ Filter by category & source  
✅ Highlight search query di results  
✅ Empty state handling  
✅ Responsive design  
✅ **Infinite scroll dengan Load More button**  
✅ **Loading spinner saat load more**  
✅ **Results counter (showing X of Y results)**  

## 🔧 Usage Example

```typescript
// In any component
import { useSearch } from '@/hooks/useSearch'

function MyComponent() {
  const { results, isLoading, search, refresh } = useSearch({
    initialQuery: 'machine learning',
    autoFetch: true,
    limit: 20,
  })

  return (
    <div>
      {isLoading ? <Loading /> : <Results data={results} />}
    </div>
  )
}
```

## 🚀 Next Steps (Optional Enhancements)

1. **Advanced Filters**: Year, openAccess, language filters UI
2. **Search History**: Save recent searches
3. **Debounced Search**: Optimize API calls dengan debouncing
4. **Cache Results**: Implement caching untuk better performance
5. **Keyboard Shortcuts**: Add keyboard navigation (arrow keys, enter)
6. **Export Results**: Allow users to export search results

## 📝 Notes

- Hook menggunakan `useCallback` untuk optimize re-renders
- Error handling dengan toast notifications (user-friendly)
- Semua API calls melalui axios instance dengan auto token refresh
- Response mapping memastikan compatibility dengan existing UI components

---

**Created**: 2025-12-23  
**Author**: Scory Development Team
