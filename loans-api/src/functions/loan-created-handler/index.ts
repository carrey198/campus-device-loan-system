import { InvocationContext } from "@azure/functions";

export async function loanCreatedHandler(
  event: any,
  context: InvocationContext
): Promise<void> {
  context.log("LoanCreated event received", event);
}
