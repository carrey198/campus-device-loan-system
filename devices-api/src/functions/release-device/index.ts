import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

app.http("release-device", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "devices/{id}/release",
  handler: async (
    req: HttpRequest,
    ctx: InvocationContext
  ): Promise<HttpResponseInit> => {

    const id = req.params.id;

    return {
      status: 200,
      jsonBody: {
        message: "Device released",
        id
      }
    };
  }
});
