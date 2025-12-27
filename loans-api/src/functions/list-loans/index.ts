import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";

export async function listLoansHandler(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("GET /loans");

  return {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
    jsonBody: [
      { id: "loan-001", device: "MacBook Pro", status: "active" },
    ],
  };
}
