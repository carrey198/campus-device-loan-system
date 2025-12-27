import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

app.http("get-device-by-id", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "devices/{id}",
  handler: async (
    req: HttpRequest,
    ctx: InvocationContext
  ): Promise<HttpResponseInit> => {

    const id = req.params.id;

    return {
      status: 200,
      jsonBody: {
        message: "Get device by id",
        id
      }
    };
  }
});
