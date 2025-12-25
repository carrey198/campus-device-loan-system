import { CosmosClient, Container } from "@azure/cosmos";
import { Subscription } from "../domain/subscription";
import { SubscriptionRepo } from "./subscription-repo";
import { randomUUID } from "crypto";


export class CosmosSubscriptionRepo implements SubscriptionRepo {
  private container: Container;

  constructor() {
    const client = new CosmosClient({
      endpoint: process.env.COSMOS_DB_ENDPOINT!,
      key: process.env.COSMOS_DB_KEY!,
    });

    this.container = client
      .database(process.env.COSMOS_DB_DATABASE!)
      .container(process.env.COSMOS_DB_SUBSCRIPTIONS_CONTAINER!);
  }

  async create(deviceId: string): Promise<Subscription> {
    const subscription: Subscription = {
      id: randomUUID(),
      deviceId,
      createdAt: new Date().toISOString(),
    };

    await this.container.items.create(subscription);
    return subscription;
  }

  async listByDevice(deviceId: string): Promise<Subscription[]> {
    const { resources } = await this.container.items
      .query<Subscription>({
        query: "SELECT * FROM c WHERE c.deviceId = @deviceId",
        parameters: [{ name: "@deviceId", value: deviceId }],
      })
      .fetchAll();

    return resources;
  }
}
