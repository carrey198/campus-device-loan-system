import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { deviceRepo } from "./repo/device-repo-instance";

app.http("get-device-by-id", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "devices/{id}",

  handler: async (
    req: HttpRequest
  ): Promise<HttpResponseInit> => {
    const deviceId = req.params.id;

    if (!deviceId) {
      return {
        status: 400,
        jsonBody: { error: "Device id is required" }
      };
    }

    const device = deviceRepo.getById(deviceId);

    if (!device) {
      return {
        status: 404,
        jsonBody: { error: "Device not found" }
      };
    }

    return {
      status: 200,
      jsonBody: device
    };
  }
});
