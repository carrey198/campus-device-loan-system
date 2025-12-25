import { Subscription } from "../domain/subscription";

export interface SubscriptionRepo {
  create(deviceId: string): Promise<Subscription>;
  listByDevice(deviceId: string): Promise<Subscription[]>;
}
