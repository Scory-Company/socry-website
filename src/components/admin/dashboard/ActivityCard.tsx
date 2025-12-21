import type { Activity } from "@/services/dashboard.service";

interface ActivityCardProps {
  activities: Activity[];
}

export function ActivityCard({ activities }: ActivityCardProps) {
  return (
    <div className="border border-border rounded-lg p-6 bg-card">
      <h2 className="text-xl font-semibold mb-4 text-foreground">Recent Activity</h2>
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className={`flex justify-between items-center py-3 ${
              index !== activities.length - 1 ? 'border-b border-border' : ''
            }`}
          >
            <div>
              <p className="text-foreground font-medium">{activity.title}</p>
              <p className="text-sm text-muted-foreground">{activity.description}</p>
            </div>
            <span className="text-sm text-muted-foreground">{activity.timestamp}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
