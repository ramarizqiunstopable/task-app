import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Params = {
  params: { id: string };
};

// Update Task
// ✅ GET handler yang kurang
export async function GET(_req: Request, { params }: Params) {
  try {
    const task = await prisma.task.findUnique({
      where: { id: params.id },
    });

    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
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
