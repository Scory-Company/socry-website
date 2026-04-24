import PortalLoginPage from "@/components/portal/PortalLoginPage"

export default function AdminPage() {
  return (
    <PortalLoginPage
      role="admin"
      title="Admin Portal"
      description="Sign in to access the admin dashboard. This area is being simplified before API-based auth is connected."
      dashboardPath="/admin/dashboard"
    />
  )
}
