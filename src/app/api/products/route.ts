// src/app/api/products/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const projectId = req.nextUrl.searchParams.get("projectId");

  if (!projectId) {
    return NextResponse.json(
      { error: "Project ID is required" },
      { status: 400 }
    );
  }
  try {
    const products = await prisma.product.findMany({
      where: {
        projectId: Number(projectId),
      },
      include: {
        features: {
          include: {
            options: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching project configuration:", error);
    return NextResponse.json(
      { error: "Failed to fetch product configuration" },
      { status: 500 }
    );
  }
}
