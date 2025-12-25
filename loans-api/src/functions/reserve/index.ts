import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { LoanRepository } from "../infra/loanRepository";
import { ValidationError } from "../shared/errors";

const loanRepo = new LoanRepository();

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function reserveDevice(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      productId?: string;
      userId?: string;
    };

    const productId = body.productId;
    const userId = body.userId;

    if (!productId || !userId) {
      throw new ValidationError("productId and userId are required");
    }

    const loan = await loanRepo.createReservation({ productId, userId });

    return {
      status: 201,
      headers: corsHeaders,
      jsonBody: loan,
    };
  } catch (err: any) {
    context.error("reserve error:", err);

    const status = err?.name === "ValidationError" ? 400 : 500;
    return {
      status,
      headers: corsHeaders,
      jsonBody: { error: err?.message ?? "Internal server error" },
    };
  }
}

app.http("reserve", {
  methods: ["POST", "OPTIONS"],
  authLevel: "anonymous",
  route: "reserve",
  handler: reserveDevice,
});
