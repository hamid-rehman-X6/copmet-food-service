// Category API route for public and admin category data.
import { NextResponse } from "next/server";
import { createSuccessResponse } from "@/lib/api";
import { categoryRepository } from "@/lib/repositories/mock";

export async function GET() {
  const categories = await categoryRepository.getCategories();
  return NextResponse.json(createSuccessResponse(categories));
}
