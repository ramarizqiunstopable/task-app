"use client";

import { useEffect, useState } from "react";
import TaskForm from "./TaskForm";

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

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Task Manager</h1>

      <TaskForm
        task={editingTask || undefined}
        onSuccess={() => {
          setEditingTask(null);
          fetchTasks();
        }}
      />

      <ul className="space-y-4">
        {tasks.map((task) => (
          <li key={task.id} className="border p-4 rounded">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">{task.title}</h2>
                <p className="text-sm text-gray-600">{task.description}</p>
                <span className="text-xs text-blue-600">{task.status}</span>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => setEditingTask(task)}
                  className="px-3 py-1 text-sm bg-yellow-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded"
                >
                  Hapus
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
