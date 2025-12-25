import { DeviceRepo } from "./device-repo";
import { InMemoryDeviceRepo } from "./in-memory-device-repo";
import { CosmosDeviceRepo } from "./cosmos-device-repo";

let repo: DeviceRepo;

if (process.env.USE_COSMOS_DB === "true") {
  repo = new CosmosDeviceRepo();
} else {
  repo = new InMemoryDeviceRepo();
}

export const deviceRepo = repo;
