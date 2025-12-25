"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDevices = getDevices;
const functions_1 = require("@azure/functions");
const cosmos_1 = require("@azure/cosmos");
const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const dbName = process.env.COSMOS_DB;
const containerName = process.env.COSMOS_CONTAINER;
const client = new cosmos_1.CosmosClient({ endpoint, key });
async function getDevices(request, context) {
    context.log("GET /devices called");
    try {
        const container = client.database(dbName).container(containerName);
        // 查询所有设备
        const query = "SELECT * FROM c";
        const { resources } = await container.items.query(query).fetchAll();
        return {
            status: 200,
            jsonBody: resources
        };
    }
    catch (err) {
        context.error("Error retrieving devices", err);
        return {
            status: 500,
            jsonBody: { error: "Failed to retrieve devices" }
        };
    }
}
functions_1.app.http("get-devices", {
    route: "devices",
    methods: ["GET"],
    authLevel: "anonymous",
    handler: getDevices
});
