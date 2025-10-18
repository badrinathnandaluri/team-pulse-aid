import { TeamMember, Task, AIRecommendation } from "@/types";

export function calculateTaskRecommendations(
  task: Task,
  teamMembers: TeamMember[]
): AIRecommendation[] {
  const recommendations = teamMembers.map((member) => {
    // Skill match (35%) - simplified matching based on role
    const skillMatch = calculateSkillMatch(task, member);

    // Performance (25%)
    const performance = member.performance / 100;

    // Workload (20%) - inverse relationship
    const workload = Math.max(0, (10 - member.currentWorkload) / 10);

    // Availability (15%)
    const availability = member.availability / 100;

    // Calculate weighted score
    const score =
      skillMatch * 0.35 +
      performance * 0.25 +
      workload * 0.2 +
      availability * 0.15;

    return {
      memberId: member.id,
      score: Math.round(score * 100),
      skillMatch: Math.round(skillMatch * 100),
      performance: Math.round(performance * 100),
      workload: Math.round(workload * 100),
      availability: Math.round(availability * 100),
      explanation: generateExplanation(member, score, skillMatch, workload),
    };
  });

  return recommendations.sort((a, b) => b.score - a.score);
}

function calculateSkillMatch(task: Task, member: TeamMember): number {
  // Simple heuristic based on role and task priority
  const roleMatch: Record<string, number> = {
    "Frontend Developer": 0.9,
    "Backend Developer": 0.8,
    "QA Engineer": 0.7,
    "DevOps Engineer": 0.6,
    "UI/UX Designer": 0.85,
  };

  const baseMatch = roleMatch[member.role] || 0.5;

  // Adjust for task priority - higher priority tasks need more experienced members
  if (task.priority === "critical") {
    return baseMatch * (member.performance / 100);
  }

  return baseMatch;
}

function generateExplanation(
  member: TeamMember,
  score: number,
  skillMatch: number,
  workload: number
): string {
  const reasons = [];

  if (skillMatch > 0.8) {
    reasons.push("Excellent skill match for this task");
  } else if (skillMatch > 0.6) {
    reasons.push("Good skill alignment");
  }

  if (workload > 0.7) {
    reasons.push("Low current workload");
  } else if (workload < 0.4) {
    reasons.push("High workload may cause delays");
  }

  if (member.performance > 90) {
    reasons.push("Outstanding past performance");
  }

  if (member.availability > 85) {
    reasons.push("High availability");
  }

  return reasons.join(". ") + ".";
}

export function predictTaskDelay(task: Task): {
  risk: "low" | "medium" | "high";
  reason: string;
} {
  const now = new Date();
  const daysUntilDeadline = Math.ceil(
    (task.deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  const daysSinceUpdate = Math.ceil(
    (now.getTime() - task.updatedAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  // High risk conditions
  if (daysUntilDeadline < 3 && task.status !== "done") {
    return {
      risk: "high",
      reason: "Deadline in less than 3 days and task not completed",
    };
  }

  if (daysSinceUpdate > 5 && task.status !== "done") {
    return {
      risk: "high",
      reason: "No updates in over 5 days",
    };
  }

  if (
    task.priority === "critical" &&
    task.status === "todo" &&
    daysUntilDeadline < 7
  ) {
    return {
      risk: "high",
      reason: "Critical task not started with approaching deadline",
    };
  }

  // Medium risk conditions
  if (daysUntilDeadline < 7 && task.status === "todo") {
    return {
      risk: "medium",
      reason: "Task not started with deadline less than a week away",
    };
  }

  if (daysSinceUpdate > 2 && task.status === "in-progress") {
    return {
      risk: "medium",
      reason: "In-progress task with no recent updates",
    };
  }

  // Low risk
  return {
    risk: "low",
    reason: "Task progressing normally",
  };
}
