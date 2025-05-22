"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Import icon
import {
  FaHourglassStart,
  FaSpinner,
  FaCheckCircle,
  FaEdit,
  FaTrash,
  FaPlus,
} from "react-icons/fa";

type Task = {
  id: string;
  title: string;
  description: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  createdAt: string;
};

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const router = useRouter();

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
    let IconComponent;

    switch (status) {
      case "PENDING":
        colorClass = "bg-red-100 text-red-600";
        text = "Pending";
        IconComponent = FaHourglassStart;
        break;
      case "IN_PROGRESS":
        colorClass = "bg-yellow-100 text-yellow-600";
        text = "In Progress";
        IconComponent = FaSpinner;
        break;
      case "COMPLETED":
        colorClass = "bg-green-100 text-green-600";
        text = "Completed";
        IconComponent = FaCheckCircle;
        break;
    }

    return (
      <Badge
        className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${colorClass}`}
      >
        <IconComponent className="text-sm" />
        {text}
      </Badge>
    );
  };

  const getTitleClass = (status: Task["status"]) => {
    switch (status) {
      case "PENDING":
        return "text-red-600";
      case "IN_PROGRESS":
        return "text-yellow-600";
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">📝 Task Manager App</h1>
        <Button onClick={() => router.push("/tasks/tambah")}>
          <FaPlus className="text-sm" />
          Tambah Task
        </Button>
      </div>

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
                    onClick={() => router.push(`/tasks/edit/${task.id}`)}
                    className="rounded-full mx-auto bg-yellow-100 text-yellow-600 hover:bg-yellow-200 p-2"
                    size="icon"
                  >
                    <FaEdit className="text-sm" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(task.id)}
                    className="rounded-full bg-red-100 text-red-600 hover:bg-red-200 p-2"
                    size="icon"
                  >
                    <FaTrash className="text-sm" />
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
