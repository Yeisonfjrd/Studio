import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const tasks = await prisma.task.findMany()
  return NextResponse.json(tasks)
}

export async function POST(request: NextRequest) {
  const { title, description, status, tags } = await request.json();
  const task = await prisma.task.create({
    data: { title, description, status, tags },
  });
  return NextResponse.json(task);
}

export async function PUT(request: NextRequest) {
  const { id, title, description, status, tags } = await request.json();
  const updatedTask = await prisma.task.update({
    where: { id },
    data: { title, description, status, tags },
  });
  return NextResponse.json(updatedTask);
}

export async function DELETE(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await prisma.task.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}