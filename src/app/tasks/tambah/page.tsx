"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";

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

const taskSchema = z.object({
  title: z.string().min(1, "Judul harus diisi"),
  description: z.string().min(1, "Deskripsi harus diisi"),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]),
});

type TaskFormValues = z.infer<typeof taskSchema>;
type Props = {
  onSuccess?: () => void;
};

export default function TaskForm({ onSuccess }: Props) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "PENDING",
    },
  });

  const status = watch("status");

  const onSubmit = async (data: TaskFormValues) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Gagal menambah task");

      toast.success("Task berhasil ditambahkan!");
      reset();

      onSuccess?.();

      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Terjadi kesalahan saat menambahkan task.");
      }
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-10">
      <ToastContainer position="top-right" autoClose={3000} />
      <CardHeader>
        <CardTitle>Tambah Task</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input placeholder="Judul Task" {...register("title")} />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <Textarea
              placeholder="Deskripsi Task"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <Select
              value={status}
              onValueChange={(val) =>
                setValue("status", val as TaskFormValues["status"])
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
            {errors.status && (
              <p className="text-sm text-red-500 mt-1">
                {errors.status.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full">
            Tambah Task
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
