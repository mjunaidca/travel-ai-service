import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const message = searchParams.get("query");

  if (!message) {
    return new NextResponse("Bad Request - No Message Found!", { status: 400 });
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/gemini_streaming_travel_ai/?query=${message}`
    );

    if (!response.ok) {
      return new NextResponse(
        `API request failed with status ${response.status}`,
        { status: response.status }
      );
    }

    return new NextResponse(response.body);
  } catch (error) {
    console.error("Fetch error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
