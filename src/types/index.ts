export type TaskStatus = "todo" | "in-progress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high" | "critical";
export type PRStatus = "open" | "merged" | "closed";
export type NotificationType = "deadline" | "overdue" | "idle" | "assignment" | "mention";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  skills: string[];
  currentWorkload: number;
  availability: number;
  tasksCompleted: number;
  performance: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  deadline: Date;
  progress: number;
  createdAt: Date;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assigneeId: string;
  status: TaskStatus;
  priority: TaskPriority;
  deadline: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Commit {
  id: string;
  projectId: string;
  author: string;
  timestamp: Date;
  message: string;
  filesChanged: number;
  linesAdded: number;
  linesDeleted: number;
}

export interface PullRequest {
  id: string;
  projectId: string;
  title: string;
  author: string;
  status: PRStatus;
  createdAt: Date;
  mergedAt?: Date;
}

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: Date;
  read: boolean;
  taskId?: string;
  projectId?: string;
}

export interface Message {
  id: string;
  projectId: string;
  taskId?: string;
  author: string;
  content: string;
  timestamp: Date;
  reactions: { emoji: string; users: string[] }[];
  mentions: string[];
}

export interface AIRecommendation {
  memberId: string;
  score: number;
  skillMatch: number;
  performance: number;
  workload: number;
  availability: number;
  explanation: string;
}
