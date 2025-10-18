import { notifications } from "@/data/mockData";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Clock, AlertTriangle, UserPlus, AtSign } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap = {
  deadline: Clock,
  overdue: AlertTriangle,
  idle: Clock,
  assignment: UserPlus,
  mention: AtSign,
};

const colorMap = {
  deadline: "text-warning",
  overdue: "text-danger",
  idle: "text-muted-foreground",
  assignment: "text-primary",
  mention: "text-primary",
};

export default function Notifications() {
  const sortedNotifications = [...notifications].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Notifications</h1>
        <p className="text-muted-foreground">
          Stay updated with project activities and deadlines
        </p>
      </div>

      <div className="space-y-3">
        {sortedNotifications.map((notification) => {
          const Icon = iconMap[notification.type];

          return (
            <Card
              key={notification.id}
              className={cn(
                "p-4 transition-colors",
                !notification.read && "bg-primary/5 border-primary/20"
              )}
            >
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0",
                    !notification.read && "bg-primary/10"
                  )}
                >
                  <Icon
                    className={cn("h-5 w-5", colorMap[notification.type])}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="font-medium">{notification.message}</p>
                    {!notification.read && (
                      <Badge
                        variant="default"
                        className="shrink-0 h-2 w-2 p-0 rounded-full"
                      >
                        <span className="sr-only">Unread</span>
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>
                      {notification.timestamp.toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {notification.type}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
