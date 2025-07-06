import { RSVPModel } from "@/models/RSVPmodel";
import { rsvpBackendSchema } from "@/schemas/rsvpSchema";
import { createResponse, handleError } from "@/utils/apiHelper";
import { sanitizeObject } from "@/utils/sanitize";
import { NextRequest } from "next/server";

const rsvpModel = new RSVPModel();

export async function GET(request: NextRequest) {
  try {
    const ucapan = await rsvpModel.getLatestUcapan();

    return createResponse(ucapan);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const sanitizedData = sanitizeObject(body);

    // Add the current date
    const rsvpDataWithDate = {
      ...sanitizedData,
      date: new Date(),
    };

    const validationResult = rsvpBackendSchema.safeParse(rsvpDataWithDate);

    if (!validationResult.success) {
      console.error("Validation errors: ", validationResult.error.errors);
      return createResponse(
        { message: "Invalid input", errors: validationResult.error.errors },
        400
      );
    }

    await rsvpModel.insertRSVP(validationResult.data);

    return createResponse({ message: "RSVP created successfully" }, 200);
  } catch (error) {
    return handleError(error);
  }
}
