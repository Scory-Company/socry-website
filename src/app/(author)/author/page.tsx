import PortalLoginPage from "@/components/portal/PortalLoginPage"

export default function AuthorPage() {
  return (
    <PortalLoginPage
      role="reviewer"
      title="Reviewer Portal"
      description="Sign in to access the reviewer dashboard. This area is being trimmed down before API-based auth is integrated."
      dashboardPath="/author/dashboard"
    />
  )
}
