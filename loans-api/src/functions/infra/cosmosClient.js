"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLoansContainer = exports.getProductsContainer = void 0;
const cosmos_1 = require("@azure/cosmos");
const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const databaseId = process.env.COSMOS_DB;
const productsContainerId = process.env.COSMOS_PRODUCTS_CONTAINER;
const loansContainerId = process.env.COSMOS_LOANS_CONTAINER;
if (!endpoint || !key || !databaseId) {
    throw new Error("Cosmos DB environment variables are not set correctly.");
}
const client = new cosmos_1.CosmosClient({ endpoint, key });
const getProductsContainer = () => client.database(databaseId).container(productsContainerId);
exports.getProductsContainer = getProductsContainer;
const getLoansContainer = () => client.database(databaseId).container(loansContainerId);
exports.getLoansContainer = getLoansContainer;
