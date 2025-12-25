import { LoanRepo } from "../domain/loan-repo";
import { Loan } from "../domain/loan";


import { CosmosClient } from "@azure/cosmos";


export class CosmosLoanRepo implements LoanRepo {
  private container: any;

  constructor() {
    const endpoint = process.env.COSMOS_ENDPOINT!;
    const key = process.env.COSMOS_KEY!;
    const dbName = process.env.COSMOS_DB!;
    const containerName = process.env.COSMOS_CONTAINER!;

    const client = new CosmosClient({ endpoint, key });
    this.container = client.database(dbName).container(containerName);
  }

  async createLoan(loan: Loan): Promise<void> {
    await this.container.items.create(loan);
  }

  async getLoan(id: string): Promise<Loan | null> {
    const query = `SELECT * FROM c WHERE c.id = @id`;
    const result = await this.container.items.query({
      query,
      parameters: [{ name: "@id", value: id }]
    }).fetchAll();

    return result.resources[0] || null;
  }

  async listLoans(): Promise<Loan[]> {
    const result = await this.container.items.query("SELECT * FROM c").fetchAll();
    return result.resources;
  }
}
