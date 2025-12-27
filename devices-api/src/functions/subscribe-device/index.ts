import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

app.http("subscribe-device", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "devices/{id}/subscribe",
  handler: async (
    req: HttpRequest,
    ctx: InvocationContext
  ): Promise<HttpResponseInit> => {

    const id = req.params.id;
    const body = await req.json();

    return {
      status: 201,
      jsonBody: {
        message: "Device subscribed",
        id,
        body
      }
    };
  }
});
