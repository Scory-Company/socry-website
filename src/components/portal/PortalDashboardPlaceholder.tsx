interface PortalDashboardPlaceholderProps {
  title: string
  description: string
}

export default function PortalDashboardPlaceholder({
  title,
  description,
}: PortalDashboardPlaceholderProps) {
  return (
    <div className="rounded-3xl border border-dashed border-border/80 bg-card/60 p-8">
      <div className="max-w-2xl space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">Dashboard</p>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">{title}</h2>
        <p className="text-sm leading-7 text-muted-foreground sm:text-base">{description}</p>
      </div>
    </div>
  )
}
