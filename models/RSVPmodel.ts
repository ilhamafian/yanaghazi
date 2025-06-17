import { backendRsvp, rsvpBackendSchema } from "@/schemas/rsvpSchema";
import { ModelBase } from "./ModelBase";

export class RSVPModel extends ModelBase<backendRsvp> {
  protected collectionName = "rsvp";
  protected schema = rsvpBackendSchema;

  constructor() {
    super();
  }

  async getQuotaRSVP(quota: string): Promise<backendRsvp | null> {
    const result = await this.find({ quota });
    return result && result.length > 0 ? result[0] : null;
  }

  async insertRSVP(rsvp: backendRsvp): Promise<void> {
    await this.create(rsvp);
  }
}
