import { commits, pullRequests } from "@/data/mockData";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GitCommit, GitPullRequest, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Activity() {
  const sortedCommits = [...commits].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );
  const sortedPRs = [...pullRequests].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Activity</h1>
        <p className="text-muted-foreground">
          Track commits, pull requests, and contributions
        </p>
      </div>

      <Tabs defaultValue="commits" className="space-y-4">
        <TabsList>
          <TabsTrigger value="commits">Commits</TabsTrigger>
          <TabsTrigger value="pulls">Pull Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="commits" className="space-y-3">
          {sortedCommits.map((commit) => (
            <Card key={commit.id} className="p-4">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <GitCommit className="h-5 w-5 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="font-medium">{commit.message}</p>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {commit.timestamp.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{commit.author}</span>
                    <span>{commit.filesChanged} files changed</span>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-success">
                        <Plus className="h-3 w-3" />
                        {commit.linesAdded}
                      </span>
                      <span className="flex items-center gap-1 text-danger">
                        <Minus className="h-3 w-3" />
                        {commit.linesDeleted}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="pulls" className="space-y-3">
          {sortedPRs.map((pr) => (
            <Card key={pr.id} className="p-4">
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center shrink-0",
                    pr.status === "merged"
                      ? "bg-success/10"
                      : pr.status === "open"
                      ? "bg-primary/10"
                      : "bg-muted"
                  )}
                >
                  <GitPullRequest
                    className={cn(
                      "h-5 w-5",
                      pr.status === "merged"
                        ? "text-success"
                        : pr.status === "open"
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="font-medium">{pr.title}</p>
                    <Badge
                      variant="outline"
                      className={cn(
                        "shrink-0",
                        pr.status === "merged" &&
                          "bg-success/10 text-success border-success/20",
                        pr.status === "open" &&
                          "bg-primary/10 text-primary border-primary/20",
                        pr.status === "closed" && "bg-muted"
                      )}
                    >
                      {pr.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{pr.author}</span>
                    <span>
                      {pr.status === "merged" && pr.mergedAt
                        ? `Merged ${pr.mergedAt.toLocaleDateString()}`
                        : `Opened ${pr.createdAt.toLocaleDateString()}`}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
