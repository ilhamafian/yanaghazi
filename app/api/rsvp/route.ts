import { RSVPModel } from "@/models/RSVPmodel";
import { rsvpBackendSchema } from "@/schemas/rsvpSchema";
import { createResponse, handleError } from "@/utils/apiHelper";
import { sanitizeObject } from "@/utils/sanitize";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const sanitizedData = sanitizeObject(body);

    console.log("In sanitizedData: ", sanitizedData);

    const validationResult = rsvpBackendSchema.safeParse(sanitizedData);
    if (!validationResult.success) {
      console.error("Validation errors: ", validationResult.error.errors);
      return createResponse(
        { message: "Invalid input", errors: validationResult.error.errors },
        400
      );
    }

    console.log("In validationResult.data: ", validationResult.data);

    const rsvpModel = new RSVPModel();
    await rsvpModel.insertRSVP(validationResult.data);

    return createResponse({ message: "RSVP created successfully" }, 200);
  } catch (error) {
    return handleError(error);
  }
}
