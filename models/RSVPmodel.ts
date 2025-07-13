import {
  backendRsvp,
  rsvpBackendSchema,
  rsvpBackendReadSchema,
} from "@/schemas/rsvpSchema";
import { ModelBase } from "./ModelBase";

export class RSVPModel extends ModelBase<backendRsvp> {
  protected collectionName = "rsvp";
  protected schema = rsvpBackendSchema;

  constructor() {
    super();
  }

  async getAllRSVP(): Promise<backendRsvp[]> {
    // Use lenient schema for reading existing data
    const collection = await this.getCollection();
    const documents = await collection.find({}).toArray();

    return documents.map((doc) => {
      return rsvpBackendReadSchema.parse({
        ...doc,
        _id: doc._id.toString(), // Convert ObjectId to string
      });
    });
  }

  async deleteRSVP(id: string): Promise<void> {
    await this.delete(id);
  }

  async getQuotaRSVP(quota: string): Promise<backendRsvp | null> {
    const result = await this.find({ quota });
    return result && result.length > 0 ? result[0] : null;
  }

  async insertRSVP(rsvp: backendRsvp): Promise<void> {
    await this.create(rsvp);
  }

  async getLatestUcapan(): Promise<
    Array<{ ucapan: string; nama: string; date: Date }>
  > {
    // Find all, sort by date descending, limit 10
    const results = await this.find(
      {
        $and: [
          { ucapan: { $nin: [null, ""] } },
          { ucapan: { $regex: /^(?!\s*$).+/ } },
        ],
      } as any, // 👈 this bypasses the typing issue
      {
        sort: { date: -1 },
        limit: 10,
      }
    );

    // Map to only ucapan, nama, dates
    return results.map((item: any) => ({
      ucapan: item.ucapan,
      nama: item.nama,
      date: item.date,
    }));
  }
}
