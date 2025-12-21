import type { Subscription } from "@/services/dashboard.service";

interface SubscriptionsCardProps {
  subscriptions: Subscription[];
}

export function SubscriptionsCard({ subscriptions }: SubscriptionsCardProps) {
  return (
    <div className="border border-border rounded-lg p-6 bg-card">
      <h2 className="text-xl font-semibold mb-4 text-foreground">Active Subscriptions</h2>
      <div className="space-y-4">
        {subscriptions.map((sub) => (
          <div key={sub.plan}>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">{sub.plan}</span>
              <span className="text-sm font-medium text-foreground">{sub.users} users</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${sub.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
