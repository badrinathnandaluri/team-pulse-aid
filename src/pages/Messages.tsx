import { useState } from "react";
import { messages, teamMembers, projects } from "@/data/mockData";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Smile } from "lucide-react";

export default function Messages() {
  const [newMessage, setNewMessage] = useState("");

  const groupedMessages = projects.map((project) => ({
    project,
    messages: messages
      .filter((m) => m.projectId === project.id)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()),
  }));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Messages</h1>
        <p className="text-muted-foreground">
          Project discussions and collaboration
        </p>
      </div>

      <Tabs defaultValue={projects[0].id} className="space-y-4">
        <TabsList className="w-full justify-start overflow-x-auto">
          {projects.map((project) => (
            <TabsTrigger key={project.id} value={project.id} className="text-sm">
              {project.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {groupedMessages.map(({ project, messages: projectMessages }) => (
          <TabsContent key={project.id} value={project.id}>
            <Card className="h-[600px] flex flex-col">
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {projectMessages.map((message) => {
                  const author = teamMembers.find(
                    (m) => m.name === message.author
                  );

                  return (
                    <div key={message.id} className="flex items-start gap-3">
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarImage
                          src={author?.avatar}
                          alt={message.author}
                        />
                        <AvatarFallback>{message.author[0]}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="font-semibold text-sm">
                            {message.author}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {message.timestamp.toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>

                        <p className="text-sm">{message.content}</p>

                        {message.reactions.length > 0 && (
                          <div className="flex gap-2 mt-2">
                            {message.reactions.map((reaction, idx) => (
                              <button
                                key={idx}
                                className="px-2 py-1 rounded-full bg-muted hover:bg-muted/80 text-xs flex items-center gap-1"
                              >
                                <span>{reaction.emoji}</span>
                                <span className="text-muted-foreground">
                                  {reaction.users.length}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t p-4">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Type a message... Use @ to mention someone"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && newMessage.trim()) {
                        setNewMessage("");
                      }
                    }}
                  />
                  <Button size="icon" variant="ghost">
                    <Smile className="h-5 w-5" />
                  </Button>
                  <Button size="icon">
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
