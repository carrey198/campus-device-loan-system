"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addLoan = addLoan;
const functions_1 = require("@azure/functions");
const cosmos_1 = require("@azure/cosmos");
const crypto_1 = require("crypto");
const devices_client_1 = require("../shared/devices-client");
const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const dbName = process.env.COSMOS_DB;
const loansContainer = "loans";
const client = new cosmos_1.CosmosClient({ endpoint, key });
async function addLoan(req, context) {
    context.log("POST /add-loan called");
    const body = (await req.json().catch(() => null));
    if (!(body === null || body === void 0 ? void 0 : body.userId) || !(body === null || body === void 0 ? void 0 : body.deviceId)) {
        return {
            status: 400,
            jsonBody: { error: "userId and deviceId required" }
        };
    }
    const { userId, deviceId } = body;
    // 1️⃣ 调用 devices-api
    const devicesClient = new devices_client_1.DevicesClient();
    const device = await devicesClient.getDeviceById(deviceId);
    if (!device) {
        return {
            status: 400,
            jsonBody: { error: "Device does not exist" }
        };
    }
    const reserved = await devicesClient.reserveDevice(deviceId);
    if (!reserved) {
        return {
            status: 400,
            jsonBody: { error: "Device out of stock" }
        };
    }
    const now = new Date();
    const dueAt = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    const loan = {
        id: (0, crypto_1.randomUUID)(),
        userId,
        productId: deviceId,
        createdAt: now.toISOString(),
        dueAt: dueAt.toISOString(),
        status: "reserved"
    };
    await client
        .database(dbName)
        .container(loansContainer)
        .items.create(loan);
    return {
        status: 201,
        jsonBody: { message: "Loan created", loan }
    };
}
functions_1.app.http("add-loan", {
    route: "add-loan",
    methods: ["POST"],
    authLevel: "anonymous",
    handler: addLoan
});
