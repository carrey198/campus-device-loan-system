"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("@azure/functions");
const device_repo_instance_1 = require("./repo/device-repo-instance");
functions_1.app.http("get-devices", {
    methods: ["GET"],
    authLevel: "anonymous",
    route: "devices",
    handler: async (_req) => {
        const devices = await device_repo_instance_1.deviceRepo.list();
        return {
            status: 200,
            jsonBody: devices,
        };
    },
});
