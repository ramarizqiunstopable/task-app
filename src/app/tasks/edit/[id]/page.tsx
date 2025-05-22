"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { toast, ToastContainer } from "react-toastify";
import * as z from "zod";
import "react-toastify/dist/ReactToastify.css";

const schema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  description: z.string().min(5, "Deskripsi minimal 5 karakter"),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]),
});

type FormData = z.infer<typeof schema>;

export default function EditTaskPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<FormData>({
    title: "",
    description: "",
    status: "PENDING",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      const res = await fetch(`/api/tasks/${id}`);
      if (!res.ok) {
        toast.error("Gagal memuat data task");
        return;
      }
      const data = await res.json();
      setForm({
        title: data.title,
        description: data.description,
        status: data.status,
      });
      setLoading(false);
    };

    fetchTask();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validate = schema.safeParse(form);
    if (!validate.success) {
      toast.error(validate.error.errors[0].message);
      return;
    }

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Gagal memperbarui task");

      toast.success("Task berhasil diperbarui");
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Terjadi kesalahan saat mengupdate task.");
      }
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <Card className="w-full max-w-md mx-auto mt-10">
      <ToastContainer position="top-right" autoClose={2000} />
      <CardHeader>
        <CardTitle>Edit Task</CardTitle>
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
              setForm({ ...form, status: value as FormData["status"] })
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
            Simpan Perubahan
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
