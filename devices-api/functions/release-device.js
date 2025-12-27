"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("@azure/functions");
const device_repo_instance_1 = require("./repo/device-repo-instance");
functions_1.app.http("release-device", {
    methods: ["POST"],
    authLevel: "anonymous",
    route: "devices/{id}/release",
    handler: async (req, context) => {
        const deviceId = req.params.id;
        if (!deviceId) {
            return {
                status: 400,
                jsonBody: { error: "Device id is required" }
            };
        }
        const released = device_repo_instance_1.deviceRepo.release(deviceId);
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
