// src/app/api/projects/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Fetch all projects
export async function GET() {
  try {
    const projects = await prisma.project.findMany();
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
