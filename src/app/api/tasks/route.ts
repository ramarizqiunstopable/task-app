import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { title, description, status } = body;

  const newTask = await prisma.task.create({
    data: { title, description, status },
  });

  return NextResponse.json(newTask);
}
