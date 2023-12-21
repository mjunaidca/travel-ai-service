import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/gemini_streaming_travel_ai/mapstate`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return new NextResponse(
        `API request failed with status ${response.status}`,
        { status: response.status }
      );
    }

    const data = await response.json();

    console.log(data);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Fetch error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
