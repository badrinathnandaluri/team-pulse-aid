import { useState } from "react";
import { projects, tasks } from "@/data/mockData";
import { Project } from "@/types";
import ProjectCard from "@/components/ProjectCard";
import TaskCard from "@/components/TaskCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  if (selectedProject) {
    const projectTasks = tasks.filter(
      (t) => t.projectId === selectedProject.id
    );

    return (
      <div className="p-6 space-y-6">
        <Button
          variant="ghost"
          onClick={() => setSelectedProject(null)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Button>

        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {selectedProject.name}
              </h1>
              <p className="text-muted-foreground">
                {selectedProject.description}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-sm">
                {projectTasks.length} tasks
              </Badge>
              <Badge
                variant="outline"
                className="text-sm bg-success/10 text-success"
              >
                {selectedProject.progress}% complete
              </Badge>
              <Badge variant="outline" className="text-sm">
                Due:{" "}
                {selectedProject.deadline.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </Badge>
            </div>
          </div>
        </Card>

        <div>
          <h2 className="text-xl font-semibold mb-4">Project Tasks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projectTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Projects</h1>
        <p className="text-muted-foreground">
          Manage and track all your projects
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => setSelectedProject(project)}
          />
        ))}
      </div>
    </div>
  );
}
