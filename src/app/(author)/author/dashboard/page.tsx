export default function AuthorDashboard() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-border p-6 rounded-lg hover:border-primary transition-colors bg-card">
          <h2 className="text-sm font-medium text-muted-foreground mb-2">My Posts</h2>
          <p className="text-4xl font-bold text-foreground">45</p>
        </div>
        <div className="border border-border p-6 rounded-lg hover:border-primary transition-colors bg-card">
          <h2 className="text-sm font-medium text-muted-foreground mb-2">Total Views</h2>
          <p className="text-4xl font-bold text-foreground">12,345</p>
        </div>
      </div>

      <div className="border border-border rounded-lg p-6 bg-card">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Recent Posts</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-foreground">Getting Started with Next.js</span>
            <span className="text-sm text-muted-foreground">2 days ago</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-foreground">Understanding React Hooks</span>
            <span className="text-sm text-muted-foreground">5 days ago</span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-foreground">Tailwind CSS Best Practices</span>
            <span className="text-sm text-muted-foreground">1 week ago</span>
          </div>
        </div>
      </div>
    </>
  );
}
