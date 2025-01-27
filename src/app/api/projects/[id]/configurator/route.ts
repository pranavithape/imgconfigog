// src/app/api/projects/[id]/configurator/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  let requestData;
  try {
    requestData = await req.json();
  } catch (e) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
  const {
    productName,
    description,
    features,
    projectDetails,
  }: {
    productName: string;
    description: string;
    features: {
      featureName: string;
      options: {
        name: string;
        images: string[];
      }[];
    }[];
    projectDetails: any;
  } = requestData;

  if (!productName || !projectDetails || !features) {
    return NextResponse.json(
      { error: "Please provide all required fields" },
      { status: 400 }
    );
  }
  try {
    const product = await prisma.product.create({
      data: {
        name: productName,
        description,
        projectId: Number(id),
        features: {
          create: features.map((feature) => ({
            name: feature.featureName,
            options: {
              create: feature.options.map((option) => ({
                name: option.name,
                images: {
                  create: option.images.map((img) => ({
                    url: img,
                  })),
                },
              })),
            },
          })),
        },
      },
    });
    return NextResponse.json(product);
  } catch (error: any) {
    console.error("Failed to create project configuration:", error);
    return NextResponse.json(
      {
        error: "Failed to create product configurator",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
