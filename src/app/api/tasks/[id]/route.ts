import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Params = {
  params: { id: string };
};

// Get Task by ID
export async function GET(_req: Request, { params }: Params) {
  try {
    const task = await prisma.task.findUnique({
      where: { id: params.id },
    });

    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { message: "Failed to fetch task" },
      { status: 500 }
    );
  }
}

// Update Task
export async function PUT(req: Request, { params }: Params) {
  try {
    const body = await req.json();
    const { title, description, status } = body;

    const updated = await prisma.task.update({
      where: { id: params.id },
      data: { title, description, status },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { message: "Failed to update task" },
      { status: 500 }
    );
  }
}

// Delete Task
export async function DELETE(_req: Request, { params }: Params) {
  const deleted = await prisma.task.delete({
    where: { id: params.id },
  });

  return NextResponse.json(deleted);
}
