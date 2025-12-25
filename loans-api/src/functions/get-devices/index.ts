import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
  app,
} from "@azure/functions";
import { ProductRepository } from "../infra/productRepository";

const productRepo = new ProductRepository();

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function getDevicesHandler(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("GET /devices");

  const devices = await productRepo.listAll();

  return {
    status: 200,
    headers: corsHeaders,
    jsonBody: devices,
  };
}

app.http("get-devices", {
  methods: ["GET", "OPTIONS"],
  authLevel: "anonymous",
  route: "devices",
  handler: getDevicesHandler,
});
