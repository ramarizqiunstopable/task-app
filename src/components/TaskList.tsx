"use client";

import { useEffect, useState } from "react";
import TaskForm from "./TaskForm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Task = {
  id: string;
  title: string;
  description: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  createdAt: string;
};

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const fetchTasks = async () => {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    fetchTasks();
  };

  const getStatusBadge = (status: Task["status"]) => {
    let colorClass = "";
    let text = "";

    switch (status) {
      case "PENDING":
        colorClass = "bg-red-100 text-red-600";
        text = "Pending";
        break;
      case "IN_PROGRESS":
        colorClass = "bg-orange-100 text-orange-600";
        text = "In Progress";
        break;
      case "COMPLETED":
        colorClass = "bg-green-100 text-green-600";
        text = "Completed";
        break;
    }

    return (
      <Badge
        className={`rounded-full px-2 py-1 text-xs font-medium ${colorClass}`}
      >
        {text}
      </Badge>
    );
  };

  const getTitleClass = (status: Task["status"]) => {
    switch (status) {
      case "PENDING":
        return "text-red-600";
      case "IN_PROGRESS":
        return "text-orange-600";
      case "COMPLETED":
        return "text-green-600";
      default:
        return "";
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">📝 Task Manager</h1>

      <TaskForm
        task={editingTask || undefined}
        onSuccess={() => {
          setEditingTask(null);
          fetchTasks();
        }}
      />

      <div className="space-y-4">
        {tasks.map((task) => (
          <Card key={task.id}>
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between items-center">
                <div
                  className={`text-lg font-semibold ${getTitleClass(
                    task.status
                  )}`}
                >
                  {task.title}
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(task.status)}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingTask(task)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(task.id)}
                  >
                    Hapus
                  </Button>
                </div>
              </div>
              <div className="text-muted-foreground text-sm">
                {task.description}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
