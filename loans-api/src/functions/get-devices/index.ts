import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";

export async function getDevicesHandler(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("GET /devices");

  return {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
    jsonBody: [
      { id: "dev-001", name: "MacBook Pro" },
      { id: "dev-002", name: "Dell XPS" },
    ],
  };
}
