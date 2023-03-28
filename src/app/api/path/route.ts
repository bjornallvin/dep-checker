import { setRootPath } from "@/analyze";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const res = await request.json();
  const path = res.path;
  const isValid = setRootPath(path);
  return NextResponse.json({ isValid });
}
