import { RSVPModel } from "@/models/RSVPmodel";
import { createResponse, handleError } from "@/utils/apiHelper";
import { NextRequest } from "next/server";

const rsvpModel = new RSVPModel();

export async function GET(request: NextRequest) {
  try {
    const RSVP = await rsvpModel.getAllRSVP();

    return createResponse(RSVP);
  } catch (error) {
    return handleError(error);
  }
}
