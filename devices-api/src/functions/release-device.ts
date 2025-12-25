import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { deviceRepo } from "./repo/device-repo-instance";

app.http("release-device", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "devices/{id}/release",

  handler: async (
    req: HttpRequest,
    context
  ): Promise<HttpResponseInit> => {
    const deviceId = req.params.id;

    if (!deviceId) {
      return {
        status: 400,
        jsonBody: { error: "Device id is required" }
      };
    }

    const released = deviceRepo.release(deviceId);

    if (!released) {
      return {
        status: 404,
        jsonBody: { error: "Device not found or cannot be released" }
      };
    }

    return {
      status: 200,
      jsonBody: {
        message: "Device released successfully",
        device: released
      }
    };
  }
});
