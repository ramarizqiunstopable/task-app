"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast, ToastContainer } from "react-toastify";
import {
  FaHourglassStart,
  FaSpinner,
  FaCheckCircle,
  FaEdit,
  FaTrash,
  FaPlus,
  FaCalendarAlt,
  FaSearch,
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
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      setTasks(data);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Gagal mengambil data.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");

      toast.success("Task berhasil dihapus");
      fetchTasks();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Gagal menghapus task.");
    }
  };

  const getStatusBadge = (status: Task["status"]) => {
    const statusMap = {
      PENDING: {
        color: "bg-red-100 text-red-600",
        text: "Pending",
        icon: FaHourglassStart,
      },
      IN_PROGRESS: {
        color: "bg-yellow-100 text-yellow-600",
        text: "In Progress",
        icon: FaSpinner,
      },
      COMPLETED: {
        color: "bg-green-100 text-green-600",
        text: "Completed",
        icon: FaCheckCircle,
      },
    };
    const { color, text, icon: Icon } = statusMap[status];
    return (
      <Badge
        className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${color}`}
      >
        <Icon className="text-sm" />
        {text}
      </Badge>
    );
  };

  const getTitleClass = (status: Task["status"]) => {
    const map = {
      PENDING: "text-red-600",
      IN_PROGRESS: "text-yellow-600",
      COMPLETED: "text-green-600",
    };
    return map[status] || "";
  };

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

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-center sm:text-left w-full">
          📝 Task Manager App
        </h1>
        <Button
          onClick={() => router.push("/tasks/tambah")}
          className="flex items-center gap-2"
        >
          <FaPlus className="text-sm" />
          Tambah Task
        </Button>
      </div>

      {/* 🔍 Search with autocomplete */}
      <div className="relative w-full max-w-md mx-auto">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        <input
          type="text"
          placeholder="Cari task berdasarkan judul..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowSuggestions(true);
          }}
          className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {searchTerm && showSuggestions && (
          <ul className="absolute z-10 w-full bg-white border rounded-md mt-1 shadow-md max-h-48 overflow-auto">
            {filteredTasks.slice(0, 5).map((task) => (
              <li
                key={task.id}
                onClick={() => {
                  setSearchTerm(task.title);
                  setShowSuggestions(false);
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                {task.title}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 📋 Task List */}
      {filteredTasks.length === 0 ? (
        <p className="text-center text-muted-foreground mt-10">
          {tasks.length === 0
            ? "Belum ada task. Yuk tambah dulu!"
            : "Task tidak ditemukan."}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <Card
              key={task.id}
              className="w-full h-full flex flex-col justify-between"
            >
              <CardContent className="p-4 space-y-3 flex flex-col justify-between h-full">
                <div>
                  <div className="font-bold flex gap-2 text-xs text-neutral-300">
                    <FaCalendarAlt />
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
