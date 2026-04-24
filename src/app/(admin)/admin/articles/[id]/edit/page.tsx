"use client"

import { useParams } from "next/navigation"
import { reviewerArticlesService, simplificationService } from "@/services"
import { useArticleEditor } from "@/hooks/useArticleEditor"
import { ArticleEditorShell } from "@/components/article/ArticleEditorShell"

export default function AdminEditArticlePage() {
  const { id } = useParams()

  const editor = useArticleEditor({
    articleId: id as string,
    articleService: reviewerArticlesService,
    simplificationService: simplificationService,
    redirectPath: '/admin/articles',
  })

  return (
    <ArticleEditorShell
      title="Edit Article (Admin)"
      backHref="/admin/articles"
      {...editor}
    />
  )
}
