"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CosmosSubscriptionRepo = void 0;
const cosmos_1 = require("@azure/cosmos");
const crypto_1 = require("crypto");
class CosmosSubscriptionRepo {
    constructor() {
        const client = new cosmos_1.CosmosClient({
            endpoint: process.env.COSMOS_DB_ENDPOINT,
            key: process.env.COSMOS_DB_KEY,
        });
        this.container = client
            .database(process.env.COSMOS_DB_DATABASE)
            .container(process.env.COSMOS_DB_SUBSCRIPTIONS_CONTAINER);
    }
    async create(deviceId) {
        const subscription = {
            id: (0, crypto_1.randomUUID)(),
            deviceId,
            createdAt: new Date().toISOString(),
        };
        await this.container.items.create(subscription);
        return subscription;
    }
    async listByDevice(deviceId) {
        const { resources } = await this.container.items
            .query({
            query: "SELECT * FROM c WHERE c.deviceId = @deviceId",
            parameters: [{ name: "@deviceId", value: deviceId }],
        })
            .fetchAll();
        return resources;
    }
}
exports.CosmosSubscriptionRepo = CosmosSubscriptionRepo;
