import PortalLayout from "@/components/portal/PortalLayout"

export default function AuthorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PortalLayout
      role="reviewer"
      loginPath="/author"
      dashboardPath="/author/dashboard"
      portalName="Reviewer Portal"
      portalSubtitle="Scory Reviewer"
    >
      {children}
    </PortalLayout>
  )
}
