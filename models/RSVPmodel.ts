import {
  backendRsvp,
  rsvpBackendSchema,
  rsvpBackendReadSchema,
  jumlahKehadiran,
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

  async getQuotaTotal(): Promise<jumlahKehadiran | null> {
    const collection = await this.getCollection();
    // Only count those who are attending
    const documents = await collection.find({ kehadiran: "hadir" }).toArray();

    // Initialize counters
    const quotaTotals: Record<string, number> = {
      "100": 0,
      "200": 0,
      "300": 0,
      "400": 0,
    };
    let total = 0;

    for (const doc of documents) {
      const quota = doc.quota;
      const jumlah = parseInt(doc.jumlah_kehadiran, 10) || 0;
      if (quotaTotals.hasOwnProperty(quota)) {
        quotaTotals[quota] += jumlah;
      }
      total += jumlah;
    }

    // Return as jumlahKehadiran type (all as strings)
    return {
      kehadiran_100: quotaTotals["100"].toString(),
      kehadiran_200: quotaTotals["200"].toString(),
      kehadiran_300: quotaTotals["300"].toString(),
      kehadiran_400: quotaTotals["400"].toString(),
      jumlah_kehadiran: total.toString(),
    };
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
