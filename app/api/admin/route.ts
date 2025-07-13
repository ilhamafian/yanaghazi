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

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ error: "ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await rsvpModel.deleteRSVP(id);

    return createResponse({ message: "RSVP deleted successfully" });
  } catch (error) {
    return handleError(error);
  }
}
