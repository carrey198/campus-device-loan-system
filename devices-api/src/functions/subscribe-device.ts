import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { deviceRepo } from "./repo/device-repo-instance";
import { subscriptionRepo } from "./repo/subscription-repo-instance";

app.http("subscribe-device", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "devices/{id}/subscribe",

  handler: async (
    req: HttpRequest
  ): Promise<HttpResponseInit> => {
    const deviceId = req.params.id;

    if (!deviceId) {
      return {
        status: 400,
        jsonBody: { error: "Device id is required" },
      };
    }

    const device = await deviceRepo.getById(deviceId);

    if (!device) {
      return {
        status: 404,
        jsonBody: { error: "Device not found" },
      };
    }

    if (device.availableQuantity > 0) {
      return {
        status: 400,
        jsonBody: {
          error: "Device is currently available, no need to subscribe",
        },
      };
    }

    // ✅ 真正落库
    const subscription = await subscriptionRepo.create(deviceId);

    return {
      status: 201,
      jsonBody: {
        message: "Subscribed successfully",
        subscription,
      },
    };
  },
});
