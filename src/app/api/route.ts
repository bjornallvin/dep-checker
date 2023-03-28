import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const packageName = searchParams.get("name");
  const res = await fetch(`https://registry.npmjs.org/${packageName}/latest`, {
    cache: "force-cache",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();

  return NextResponse.json(data);
}
