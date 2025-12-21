import type { Feedback } from "@/services/dashboard.service";

interface FeedbackCardProps {
  feedback: Feedback;
}

export function FeedbackCard({ feedback }: FeedbackCardProps) {
  const getTagStyle = (type: string) => {
    switch (type) {
      case "Bug":
        return "bg-destructive/10 text-destructive";
      case "Feature":
        return "bg-primary/10 text-primary";
      case "Praise":
        return "bg-accent/10 text-accent-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <div className="border border-border rounded-lg p-6 bg-card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-foreground">User Feedback</h2>
        {feedback.new > 0 && (
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
            {feedback.new} new
          </span>
        )}
      </div>
      <div className="mb-4 pb-4 border-b border-border">
        <div className="flex gap-4 text-sm">
          <div>
            <p className="text-2xl font-bold text-foreground">{feedback.total}</p>
            <p className="text-muted-foreground text-xs">Total</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{feedback.new}</p>
            <p className="text-muted-foreground text-xs">New</p>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {feedback.items.map((item) => (
          <div key={item.id} className="flex gap-2 py-2">
            <span className={`text-xs px-2 py-1 rounded font-medium h-fit ${getTagStyle(item.type)}`}>
              {item.type}
            </span>
            <div className="flex-1">
              <p className="text-sm text-foreground">"{item.message}"</p>
              <p className="text-xs text-muted-foreground">{item.user} • {item.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
