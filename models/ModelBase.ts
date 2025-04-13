import {
  MongoClient,
  Db,
  Collection,
  ObjectId,
  Sort,
  WithId,
  OptionalUnlessRequiredId,
  Filter,
  UpdateFilter,
  UpdateResult,
  Document,
} from "mongodb";
import clientPromise from "@/lib/mongodb";
import { z, ZodSchema } from "zod";
import { isString } from "@/utils/utils";
import { SearchField } from "@/types";

export abstract class ModelBase<T extends Record<string, any>> {
  protected abstract collectionName: string;
  protected abstract schema: ZodSchema<T>;

  private static client: MongoClient;
  private static db: Db;

  // Static method to initialize the client and db
  static async initialize() {
    if (!ModelBase.client || !ModelBase.db) {
      ModelBase.client = await clientPromise;
      ModelBase.db = ModelBase.client.db(process.env.MONGODB_MEMBER);
    }
  }

  // Get the collection for the model
  protected async getCollection(): Promise<Collection<T>> {
    // Ensure the client and db are initialized
    await ModelBase.initialize();
    return ModelBase.db.collection<T>(this.collectionName);
  }

  // Validate data using Zod schema
  protected validate(data: Partial<T>): T {
    return this.schema.parse(data);
  }

  // Common CRUD methods
  async findById(id: string): Promise<WithId<T> | null> {
    const collection = await this.getCollection();
    const document = await collection.findOne({
      _id: new ObjectId(id),
    } as object); // `as object` to bypass type issues

    if (document) {
      return document as WithId<T>; // Return as `WithId<T>`
    }

    return null;
  }

  async find(query: Filter<T> = {}, options: object = {}): Promise<T[]> {
    const collection = await this.getCollection();
    const documents = await collection.find(query, options).toArray();

    return documents.map((doc) => {
      return this.schema.parse({
        ...doc,
        _id: doc._id.toString(), // Convert ObjectId to string
      });
    });
  }

  async findOne(query: Filter<T>): Promise<WithId<T> | null> {
    const collection = await this.getCollection();
    const document = await collection.findOne(query);

    if (document) {
      return document as WithId<T>;
    }

    return null;
  }

  async count(query: Filter<T> = {}): Promise<number> {
    const collection = await this.getCollection();
    return collection.countDocuments(query);
  }

  async create(data: T): Promise<WithId<T>> {
    const validatedData = this.validate(data);
    const collection = await this.getCollection();
    const result = await collection.insertOne(
      validatedData as OptionalUnlessRequiredId<T>
    );

    if (!result.insertedId) {
      throw new Error("Failed to insert document");
    }

    return { _id: result.insertedId, ...validatedData } as WithId<T>;
  }

  // Update method that allows an optional schema override
  async update(
    id: string,
    updateData: Partial<T>,
    schemaOverride?: ZodSchema<Partial<T>>
  ) {
    // Use the schemaOverride if provided, otherwise use the default schema
    const schemaToUse = schemaOverride || this.schema;

    // Validate the update data
    const validatedData = schemaToUse.parse(updateData);

    // Ensure the ID is valid
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid ID");
    }

    // Perform the update operation
    const collection = await this.getCollection();
    const res = await collection.updateOne(
      { _id: new ObjectId(id) } as object,
      { $set: validatedData } as any
    );
    return res;
  }

  async delete(id: string): Promise<void> {
    const collection = await this.getCollection();
    await collection.deleteOne({ _id: new ObjectId(id) } as object);
  }

  async bulkAction(
    ids: string[],
    action: "delete" | "update",
    updateData?: Partial<T>
  ): Promise<void> {
    const collection = await this.getCollection();

    if (action === "delete") {
      await collection.deleteMany({
        _id: { $in: ids.map((id) => new ObjectId(id)) } as object, // Using `as object` to resolve type conflict
      });
    } else if (action === "update") {
      const validatedData = this.schema.parse(updateData);
      await collection.updateMany(
        { _id: { $in: ids.map((id) => new ObjectId(id)) } as object }, // Using `as object` to resolve type conflict
        { $set: validatedData }
      );
    }
  }

  async updateArrayField(
    filter: Filter<T>, // Filter for the document
    arrayField: "inbox" | "outbox", // Array field to target
    elementFilter: Record<string, any>, // Filter to match array elements
    updateData: Record<string, any> // Data to update for matched array elements
  ): Promise<number> {
    const collection = await this.getCollection();

    // Construct the dynamic update operation
    const updateOperation: UpdateFilter<Document> = {
      $set: {
        [`${arrayField}.$[elem].recipient_status`]: updateData.recipient_status,
        [`${arrayField}.$[elem].updated_at`]: new Date(),
      },
    };

    // Perform the update operation with array filters
    const result = collection.updateMany(
      filter, // Document-level filter
      updateOperation as T,
      {
        arrayFilters: [{ "elem.id": elementFilter.id }], // Filter for specific elements in the array
      }
    );

    return (result as unknown as UpdateResult).modifiedCount; // Safely cast and return modifiedCount
  }

  async search(
    searchFields: Partial<Record<keyof T, string | number | boolean>>, // Allow for multiple types
    page: number,
    limit: number,
    sortField: string,
    sortOrder: "asc" | "desc"
  ): Promise<{ items: WithId<T>[]; total: number }> {
    const collection = await this.getCollection();

    // Build the dynamic query
    const query: Filter<T> = {};
    Object.entries(searchFields).forEach(([field, value]) => {
      if (isString(value)) {
        // Apply regex search for string values
        (query as any)[field] = { $regex: value, $options: "i" };
      } else {
        // For non-string values, use direct matching
        (query as any)[field] = value;
      }
    });

    const options = {
      skip: (page - 1) * limit,
      limit,
      sort: { [sortField]: sortOrder === "asc" ? 1 : -1 } as Sort,
    };

    const items = await collection.find(query, options).toArray();
    const total = await collection.countDocuments(query);

    return { items, total };
  }

  protected buildQueryFromSearchFields(
    searchFields: SearchField[]
  ): Record<string, any> {
    const query: Record<string, any> = {};

    for (const searchField of searchFields) {
      const { field, value, operator } = searchField;

      // Ensure that value is correctly typed for the specific field (string/number/boolean/Date)
      const isStringValue = typeof value === "string";
      const isNumberValue = typeof value === "number";
      const isBooleanValue = typeof value === "boolean";
      const isDateValue = value instanceof Date;

      const parsedValue =
        value === "true" || value === "false" ? value === "true" : value;
      const dateValue = isDateValue ? (value as Date).toISOString() : undefined;

      // If the field already has a query, extend it (don't overwrite)
      if (!query[field]) {
        query[field] = {};
      }

      switch (operator) {
        case ">":
          query[field]["$gt"] = isDateValue
            ? new Date(value as Date)
            : isNumberValue
            ? value
            : parseFloat(value as string);
          break;
        case "<":
          query[field]["$lt"] = isDateValue
            ? new Date(value as Date)
            : isNumberValue
            ? value
            : parseFloat(value as string);
          break;
        case "=":
          query[field] = isBooleanValue
            ? parsedValue
            : isDateValue
            ? new Date(value as Date)
            : isNumberValue
            ? value
            : value; // Assuming string if neither
          break;
        case ">=":
          query[field]["$gte"] = isDateValue
            ? new Date(value as Date)
            : isNumberValue
            ? value
            : parseFloat(value as string);
          break;
        case "<=":
          query[field]["$lte"] = isDateValue
            ? new Date(value as Date)
            : isNumberValue
            ? value
            : parseFloat(value as string);
          break;
        case "!=":
          query[field]["$ne"] = isBooleanValue
            ? parsedValue
            : isNumberValue
            ? value
            : value;
          break;
        case "regex":
          if (!isStringValue) {
            throw new Error(`Value for regex search must be a string`);
          }
          query[field] = { $regex: value, $options: "i" }; // case-insensitive regex
          break;
        case "has_field":
          query[field] = { $exists: true };
          break;
        case "no_field":
          query[field] = { $exists: false };
          break;
        default:
          throw new Error(`Unsupported operator: ${operator}`);
      }
    }

    return query;
  }
}
