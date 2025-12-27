"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deviceRepo = void 0;
const in_memory_device_repo_1 = require("./in-memory-device-repo");
const cosmos_device_repo_1 = require("./cosmos-device-repo");
let repo;
if (process.env.USE_COSMOS_DB === "true") {
    repo = new cosmos_device_repo_1.CosmosDeviceRepo();
}
else {
    repo = new in_memory_device_repo_1.InMemoryDeviceRepo();
}
exports.deviceRepo = repo;
