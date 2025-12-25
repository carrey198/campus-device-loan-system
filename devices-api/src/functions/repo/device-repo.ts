import { Device } from "../domain/device";

export interface DeviceRepo {
  list(): Promise<Device[]>;
  getById(id: string): Promise<Device | undefined>;

  release(id: string): Promise<Device | undefined>;
  subscribe(id: string): Promise<Device | undefined>;
}
