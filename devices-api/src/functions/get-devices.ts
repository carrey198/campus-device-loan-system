import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { deviceRepo } from "./repo/device-repo-instance";

app.http("get-devices", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "devices",
  handler: async (_req: HttpRequest): Promise<HttpResponseInit> => {
    const devices = await deviceRepo.list();

    return {
      status: 200,
      jsonBody: devices,
    };
  },
});
