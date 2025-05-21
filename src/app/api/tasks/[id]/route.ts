import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Params = {
  params: { id: string };
};

// Update Task
export async function PUT(req: Request, { params }: Params) {
  const body = await req.json();
  const { title, description, status } = body;

  const updated = await prisma.task.update({
    where: { id: params.id },
    data: { title, description, status },
  });

  return NextResponse.json(updated);
}

// Delete Task
export async function DELETE(_req: Request, { params }: Params) {
  const deleted = await prisma.task.delete({
    where: { id: params.id },
  });

  return NextResponse.json(deleted);
}
