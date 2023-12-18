import { NextResponse } from "next/server";
import { z } from "zod";
// Define a schema for the expected request body
const requestBodySchema = z.object({
  message: z.string(),
});

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();

    // Validate the request body using Zod
    const parsedBody = requestBodySchema.safeParse(body);
    if (!parsedBody.success) {
      // If validation fails, return a 400 Bad Request response
      return NextResponse.json(
        { error: "Invalid request format", details: parsedBody.error },
        { status: 400 }
      );
    }

    // Make the API call
    const callService = await fetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_API_URL
      }/travel_assistant/?prompt=${encodeURIComponent(
        parsedBody.data.message
      )}`,
      {
        method: "POST",
      }
    );

    // Check if the API call was successful
    if (!callService.ok) {
      // If API call fails, return the error status from the call
      return NextResponse.json(
        {
          error: `API call failed with status: ${callService.status} ${callService.statusText}`,
        },
        { status: callService.status }
      );
    }

    const response = await callService.json();
    return NextResponse.json({ response });
  } catch (error) {
    // Handle unexpected errors
    console.error("Error in POST API:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
