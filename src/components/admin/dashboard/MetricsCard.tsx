interface MetricsCardProps {
  title: string;
  value: number;
  subtitle: string;
}

export function MetricsCard({ title, value, subtitle }: MetricsCardProps) {
  return (
    <div className="border border-border p-6 rounded-lg hover:border-primary transition-colors bg-card">
      <h2 className="text-sm font-medium text-muted-foreground mb-2">{title}</h2>
      <p className="text-4xl font-bold text-foreground">{value.toLocaleString()}</p>
      <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
    </div>
  );
}
