"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("@azure/functions");
const device_repo_instance_1 = require("./repo/device-repo-instance");
functions_1.app.http("get-device-by-id", {
    methods: ["GET"],
    authLevel: "anonymous",
    route: "devices/{id}",
    handler: async (req) => {
        const deviceId = req.params.id;
        if (!deviceId) {
            return {
                status: 400,
                jsonBody: { error: "Device id is required" }
            };
        }
        const device = device_repo_instance_1.deviceRepo.getById(deviceId);
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
