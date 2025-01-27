import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Assuming you're using Prisma for database access

// DELETE: Delete a project
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const project = await prisma.project.delete({
      where: { id: Number(id) }, // Ensure 'id' is a number, Prisma expects a number
    });
    return NextResponse.json(project); // Return the deleted project info or success message
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}

// GET: Fetch project details by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params; // Get project ID from URL params

  try {
    // Fetch the project using Prisma
    const project = await prisma.project.findUnique({
      where: { id: Number(id) }, // Convert string ID to number
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch project details" },
      { status: 500 }
    );
  }
}
