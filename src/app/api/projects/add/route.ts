// src/app/api/projects/add/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { name } = await req.json();

  try {
    const newProject = await prisma.project.create({
      data: {
        name,
      },
    });
    return NextResponse.json(newProject);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add project" },
      { status: 500 }
    );
  }
}
