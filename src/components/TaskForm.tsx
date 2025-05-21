"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type Task = {
  id?: string;
  title: string;
  description: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
};

type Props = {
  task?: Task;
  onSuccess?: () => void;
};

export default function TaskForm({ task, onSuccess }: Props) {
  const [form, setForm] = useState<Task>({
    title: "",
    description: "",
    status: "PENDING",
  });

  useEffect(() => {
    if (task) setForm(task);
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = task ? "PUT" : "POST";
    const endpoint = task ? `/api/tasks/${task.id}` : "/api/tasks";

    await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({ title: "", description: "", status: "PENDING" });
    onSuccess?.();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{task ? "Edit Task" : "Tambah Task"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Judul Task"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <Textarea
            placeholder="Deskripsi Task"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />

          <Select
            value={form.status}
            onValueChange={(value) =>
              setForm({ ...form, status: value as Task["status"] })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">PENDING</SelectItem>
              <SelectItem value="IN_PROGRESS">IN PROGRESS</SelectItem>
              <SelectItem value="COMPLETED">COMPLETED</SelectItem>
            </SelectContent>
          </Select>

          <Button type="submit" className="w-full">
            {task ? "Update" : "Tambah"} Task
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
