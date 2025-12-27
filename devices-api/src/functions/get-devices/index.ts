import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

app.http("get-devices", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "devices",
  handler: async (req: HttpRequest, ctx: InvocationContext): Promise<HttpResponseInit> => {
    return {
      status: 200,
      jsonBody: { message: "Devices list" }
    };
  }
});
