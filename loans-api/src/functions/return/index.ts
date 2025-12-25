import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { LoanRepository } from "../infra/loanRepository";
import { EventGridPublisher } from "../infra/EventGridPublisher";
import { ValidationError } from "../shared/errors";

const loanRepo = new LoanRepository();
const publisher = new EventGridPublisher();

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function returnDevice(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const body = (await req.json().catch(() => ({}))) as { loanId?: string };
    const loanId = body.loanId;

    if (!loanId) throw new ValidationError("loanId is required");

    const loan = await loanRepo.markReturned(loanId);

    await publisher.publish(
      "device.returned",
      `/loans/${loan.id}`,
      { loanId: loan.id, productId: loan.productId }
    );

    return {
      status: 200,
      headers: corsHeaders,
      jsonBody: loan,
    };
  } catch (err: any) {
    context.error("return error:", err);

    const status = err?.name === "ValidationError" ? 400 : 500;
    return {
      status,
      headers: corsHeaders,
      jsonBody: { error: err?.message ?? "Internal server error" },
    };
  }
}

app.http("return", {
  methods: ["POST", "OPTIONS"],
  authLevel: "anonymous",
  route: "return",
  handler: returnDevice,
});
