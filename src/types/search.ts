export interface SearchResultMetadata {
  isSimplified?: boolean
  isExternal?: boolean
  articleId?: string
  externalId?: string
  externalSource?: "openalex" | "scholar"
}

export interface UnifiedSearchResult {
  id: string
  title: string
  excerpt: string
  authors: string[]
  year: number | null
  source: "internal" | "openalex" | "scholar"
  type?: "article" | "paper" | "preprint" | "journal-article" | "review"
  link?: string
  pdfUrl?: string | null
  citations?: number
  isOpenAccess?: boolean
  publisher?: string | null
  doi?: string | null
  language?: string | null
  metadata?: SearchResultMetadata

  // Legacy support
  category?: string
  rating?: number
  reads?: string
  journal?: string
}
