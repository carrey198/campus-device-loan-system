"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("@azure/functions");
const device_repo_instance_1 = require("./repo/device-repo-instance");
const subscription_repo_instance_1 = require("./repo/subscription-repo-instance");
functions_1.app.http("subscribe-device", {
    methods: ["POST"],
    authLevel: "anonymous",
    route: "devices/{id}/subscribe",
    handler: async (req) => {
        const deviceId = req.params.id;
        if (!deviceId) {
            return {
                status: 400,
                jsonBody: { error: "Device id is required" },
            };
        }
        const device = await device_repo_instance_1.deviceRepo.getById(deviceId);
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
        const subscription = await subscription_repo_instance_1.subscriptionRepo.create(deviceId);
        return {
            status: 201,
            jsonBody: {
                message: "Subscribed successfully",
                subscription,
            },
        };
    },
});
