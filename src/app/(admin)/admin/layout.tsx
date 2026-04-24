import PortalLayout from "@/components/portal/PortalLayout"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PortalLayout
      role="admin"
      loginPath="/admin"
      dashboardPath="/admin/dashboard"
      portalName="Admin Portal"
      portalSubtitle="Scory Admin"
    >
      {children}
    </PortalLayout>
  )
}
