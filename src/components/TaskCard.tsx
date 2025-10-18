import { Task } from "@/types";
import { teamMembers } from "@/data/mockData";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { predictTaskDelay } from "@/lib/ai";

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

const statusColors = {
  todo: "bg-muted text-muted-foreground",
  "in-progress": "bg-primary/10 text-primary border-primary/20",
  review: "bg-warning/10 text-warning border-warning/20",
  done: "bg-success/10 text-success border-success/20",
};

const priorityColors = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-primary/10 text-primary",
  high: "bg-warning/10 text-warning",
  critical: "bg-danger/10 text-danger",
};

export default function TaskCard({ task, onClick }: TaskCardProps) {
  const assignee = teamMembers.find((m) => m.id === task.assigneeId);
  const { risk, reason } = predictTaskDelay(task);

  const daysUntilDeadline = Math.ceil(
    (task.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card
      className={cn(
        "p-4 cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm line-clamp-2">{task.title}</h3>
          <Badge
            variant="outline"
            className={cn("shrink-0 text-xs", priorityColors[task.priority])}
          >
            {task.priority}
          </Badge>
        </div>

        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <Badge
            variant="outline"
            className={cn("text-xs", statusColors[task.status])}
          >
            {task.status}
          </Badge>

          {assignee && (
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={assignee.avatar} alt={assignee.name} />
                <AvatarFallback>{assignee.name[0]}</AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>
              {daysUntilDeadline > 0
                ? `${daysUntilDeadline}d left`
                : "Overdue"}
            </span>
          </div>

          {risk !== "low" && (
            <div
              className={cn(
                "flex items-center gap-1",
                risk === "high" && "text-danger",
                risk === "medium" && "text-warning"
              )}
            >
              <AlertCircle className="h-3 w-3" />
              <span className="text-xs capitalize">{risk} risk</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
