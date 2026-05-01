import { Suspense } from "react"
import WorkspaceChatPage from "@/components/client/workspace/WorkspaceChatPage"

function WorkspaceLoading() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.10),_transparent_32%),linear-gradient(to_bottom,_hsl(var(--background)),_hsl(var(--background)))]">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center px-4">
        <div className="w-full rounded-[26px] border border-border/80 bg-background/95 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.05)]">
          <div className="h-3 w-28 animate-pulse rounded-full bg-muted" />
          <div className="mt-5 h-4 w-3/4 animate-pulse rounded-full bg-muted" />
          <div className="mt-3 h-4 w-1/2 animate-pulse rounded-full bg-muted" />
        </div>
      </div>
    </div>
  )
}

export default function WorkspacePage() {
  return (
    <Suspense fallback={<WorkspaceLoading />}>
      <WorkspaceChatPage />
    </Suspense>
  )
}
