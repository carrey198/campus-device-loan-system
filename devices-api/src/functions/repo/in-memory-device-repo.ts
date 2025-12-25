import { Device } from "../domain/device";
import { DeviceRepo } from "./device-repo";

export class InMemoryDeviceRepo implements DeviceRepo {
  private devices: Device[] = [
    {
      id: "dev-mac-01",
      brand: "Apple",
      model: "MacBook Air",
      category: "Laptop",
      totalQuantity: 3,
      availableQuantity: 0,
    },
  ];

  async list(): Promise<Device[]> {
    return this.devices;
  }

  async getById(id: string): Promise<Device | undefined> {
    return this.devices.find(d => d.id === id);
  }

  async save(device: Device): Promise<void> {
    const index = this.devices.findIndex(d => d.id === device.id);
    if (index >= 0) this.devices[index] = device;
  }

  async release(id: string): Promise<Device | undefined> {
    const device = await this.getById(id);
    if (!device) return undefined;

    if (device.availableQuantity < device.totalQuantity) {
      device.availableQuantity++;
      await this.save(device);
      return device;
    }

    return undefined;
  }

  async subscribe(id: string): Promise<Device | undefined> {
    const device = await this.getById(id);
    if (!device) return undefined;

    // 订阅只在“无库存”时允许
    if (device.availableQuantity === 0) {
      return device;
    }

    return undefined;
  }
}
