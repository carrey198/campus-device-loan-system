"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CosmosLoanRepo = void 0;
const cosmos_1 = require("@azure/cosmos");
class CosmosLoanRepo {
    constructor() {
        const endpoint = process.env.COSMOS_ENDPOINT;
        const key = process.env.COSMOS_KEY;
        const dbName = process.env.COSMOS_DB;
        const containerName = process.env.COSMOS_CONTAINER;
        const client = new cosmos_1.CosmosClient({ endpoint, key });
        this.container = client.database(dbName).container(containerName);
    }
    async createLoan(loan) {
        await this.container.items.create(loan);
    }
    async getLoan(id) {
        const query = `SELECT * FROM c WHERE c.id = @id`;
        const result = await this.container.items.query({
            query,
            parameters: [{ name: "@id", value: id }]
        }).fetchAll();
        return result.resources[0] || null;
    }
    async listLoans() {
        const result = await this.container.items.query("SELECT * FROM c").fetchAll();
        return result.resources;
    }
}
exports.CosmosLoanRepo = CosmosLoanRepo;
