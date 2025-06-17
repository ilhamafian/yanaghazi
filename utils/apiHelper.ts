import { NextResponse } from "next/server";

export const createResponse = (data: any, status: number = 200) => {
  return NextResponse.json(data, { status });
};

export const handleError = (error: any) => {
  console.error("API Error:", error);
  return createResponse({ message: "Internal server error" }, 500);
};
