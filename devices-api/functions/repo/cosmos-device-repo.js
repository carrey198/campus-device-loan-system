"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CosmosDeviceRepo = void 0;
const cosmos_1 = require("@azure/cosmos");
class CosmosDeviceRepo {
    constructor() {
        const client = new cosmos_1.CosmosClient({
            endpoint: process.env.COSMOS_DB_ENDPOINT,
            key: process.env.COSMOS_DB_KEY,
        });
        this.container = client
            .database(process.env.COSMOS_DB_DATABASE)
            .container(process.env.COSMOS_DB_CONTAINER);
    }
    async list() {
        const { resources } = await this.container.items
            .query("SELECT * FROM c")
            .fetchAll();
        return resources;
    }
    async getById(id) {
        try {
            const { resource } = await this.container
                .item(id, id)
                .read();
            return resource;
        }
        catch {
            return undefined;
        }
    }
    async save(device) {
        await this.container.items.upsert(device);
    }
    async release(id) {
        const device = await this.getById(id);
        if (!device)
            return undefined;
        if (device.availableQuantity < device.totalQuantity) {
            device.availableQuantity++;
            await this.container.item(device.id, device.id).replace(device);
            return device;
        }
        return undefined;
    }
    async subscribe(id) {
        const device = await this.getById(id);
        if (!device)
            return undefined;
        // 只有在无库存时才允许订阅（业务规则）
        if (device.availableQuantity === 0) {
            return device;
        }
        return undefined;
    }
}
exports.CosmosDeviceRepo = CosmosDeviceRepo;
