"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast, ToastContainer } from "react-toastify";

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
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      setTasks(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Terjadi kesalahan saat mengupdate task.");
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");

      toast.success("Task berhasil dihapus");
      fetchTasks();
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Terjadi kesalahan saat mengupdate task.");
      }
    }
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

  // Format the createdAt date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return new Intl.DateTimeFormat("id-ID", options).format(date);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-center sm:text-left w-full">
          📝 Task Manager App
        </h1>
        <ToastContainer position="top-right" autoClose={2000} />
        <Button
          onClick={() => router.push("/tasks/tambah")}
          className="flex items-center gap-2"
        >
          <FaPlus className="text-sm" />
          Tambah Task
        </Button>
      </div>

      {tasks.length === 0 ? (
        <p className="text-center text-muted-foreground mt-10">
          Belum ada task. Yuk tambah dulu!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <Card
              key={task.id}
              className="w-full h-full flex flex-col justify-between"
            >
              <CardContent className="p-4 space-y-3 flex flex-col justify-between h-full">
                <div>
                  {/* Display the createdAt date */}
                  <div className="font-bold  text-xs text-neutral-300 ">
                    dibuat pada {formatDate(task.createdAt)}
                  </div>
                  <div
                    className={`text-lg font-semibold ${getTitleClass(
                      task.status
                    )}`}
                  >
                    {task.title}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {task.description}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  {getStatusBadge(task.status)}

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => router.push(`/tasks/edit/${task.id}`)}
                      className="rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 p-2"
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
