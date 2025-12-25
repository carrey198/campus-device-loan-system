import { CosmosClient, Container } from "@azure/cosmos";
import { DeviceRepo } from "./device-repo";
import { Device } from "../domain/device";

export class CosmosDeviceRepo implements DeviceRepo {
  private container: Container;

  constructor() {
    const client = new CosmosClient({
      endpoint: process.env.COSMOS_DB_ENDPOINT!,
      key: process.env.COSMOS_DB_KEY!,
    });

    this.container = client
      .database(process.env.COSMOS_DB_DATABASE!)
      .container(process.env.COSMOS_DB_CONTAINER!);
  }

  async list(): Promise<Device[]> {
    const { resources } = await this.container.items
      .query<Device>("SELECT * FROM c")
      .fetchAll();

    return resources;
  }

  async getById(id: string): Promise<Device | undefined> {
    try {
      const { resource } = await this.container
        .item(id, id)
        .read<Device>();
      return resource;
    } catch {
      return undefined;
    }
  }

  async save(device: Device): Promise<void> {
    await this.container.items.upsert(device);
  }
  async release(id: string): Promise<Device | undefined> {
  const device = await this.getById(id);
  if (!device) return undefined;

  if (device.availableQuantity < device.totalQuantity) {
    device.availableQuantity++;
    await this.container.item(device.id, device.id).replace(device);
    return device;
  }

  return undefined;
}

async subscribe(id: string): Promise<Device | undefined> {
  const device = await this.getById(id);
  if (!device) return undefined;

  // 只有在无库存时才允许订阅（业务规则）
  if (device.availableQuantity === 0) {
    return device;
  }

  return undefined;
}

}
