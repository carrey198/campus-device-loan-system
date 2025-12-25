import { Container } from "@azure/cosmos";
import { randomUUID } from "crypto";
import { getCosmosContainer } from "./cosmosClient";

export type LoanStatus = "reserved" | "on_loan" | "returned";

export interface Loan {
  id: string;
  productId: string;
  userId: string;
  status: LoanStatus;
  createdAt: string;
  collectedAt?: string;
  returnedAt?: string;
}

export class LoanRepository {
  private container: Container;

  constructor() {
    this.container = getCosmosContainer("loans");
  }

  async createReservation(input: {
    productId: string;
    userId: string;
  }): Promise<Loan> {
    const loan: Loan = {
      id: randomUUID(),
      productId: input.productId,
      userId: input.userId,
      status: "reserved",
      createdAt: new Date().toISOString(),
    };

    await this.container.items.create(loan);
    return loan;
  }

  async markCollected(loanId: string): Promise<Loan> {
    const { resource } = await this.container.item(loanId, loanId).read<Loan>();
    if (!resource) throw new Error("Loan not found");

    const updated: Loan = {
      ...resource,
      status: "on_loan",
      collectedAt: new Date().toISOString(),
    };

    await this.container.item(loanId, loanId).replace(updated);
    return updated;
  }

  async markReturned(loanId: string): Promise<Loan> {
    const { resource } = await this.container.item(loanId, loanId).read<Loan>();
    if (!resource) throw new Error("Loan not found");

    const updated: Loan = {
      ...resource,
      status: "returned",
      returnedAt: new Date().toISOString(),
    };

    await this.container.item(loanId, loanId).replace(updated);
    return updated;
  }
}
