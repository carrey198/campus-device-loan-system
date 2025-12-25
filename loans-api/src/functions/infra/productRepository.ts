import { Container } from "@azure/cosmos";
import { getCosmosContainer } from "./cosmosClient";

export interface Product {
  id: string;
  name: string;
  category: string;
  status?: "available" | "reserved" | "on_loan" | "unavailable";
}

export class ProductRepository {
  private container: Container;

  constructor() {
    this.container = getCosmosContainer("products");
  }

  async listAll(): Promise<Product[]> {
    const { resources } = await this.container.items
      .query<Product>("SELECT * FROM c")
      .fetchAll();

    return resources;
  }
}
