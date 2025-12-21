import type { UserStats } from "@/services/users.service";

interface UserStatsCardsProps {
  stats: UserStats;
}

export function UserStatsCards({ stats }: UserStatsCardsProps) {
  const cards = [
    { label: "Total Users", value: stats.total, color: "text-foreground" },
    { label: "Readers", value: stats.readers, color: "text-green-700 dark:text-green-500" },
    { label: "Authors", value: stats.authors, color: "text-green-700 dark:text-green-500" },
    { label: "Admins", value: stats.admins, color: "text-green-700 dark:text-green-500" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="border border-border p-6 rounded-lg hover:border-green-600 transition-colors bg-card"
        >
          <h2 className="text-sm font-medium text-muted-foreground mb-2">
            {card.label}
          </h2>
          <p className={`text-4xl font-bold ${card.color}`}>
            {card.value.toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
