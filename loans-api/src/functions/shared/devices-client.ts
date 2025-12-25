export class DevicesClient {
  private baseUrl =
    process.env.DEVICES_API_URL ?? "http://localhost:7071/api";

  // 1️⃣ 查询设备
  async getDeviceById(deviceId: string): Promise<any | null> {
    const res = await fetch(`${this.baseUrl}/devices/${deviceId}`);
    if (!res.ok) return null;
    return res.json();
  }

  // 2️⃣ 预占库存（借出）
  async reserveDevice(deviceId: string): Promise<boolean> {
    const res = await fetch(
      `${this.baseUrl}/devices/${deviceId}/reserve`,
      { method: "POST" }
    );
    return res.ok;
  }

  // 3️⃣ 释放库存（归还）
  async releaseDevice(deviceId: string): Promise<void> {
    const res = await fetch(
      `${this.baseUrl}/devices/${deviceId}/release`,
      { method: "POST" }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to release device: ${text}`);
    }
  }
}
