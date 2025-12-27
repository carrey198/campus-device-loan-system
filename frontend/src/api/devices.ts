// src/api/devices.ts
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* ===== 类型 ===== */
export type Device = {
  id: string;
  name: string;
  totalCount: number;
  availableCount: number;
};

/* ===== API ===== */
export async function getDevices(): Promise<Device[]> {
  const res = await fetch(`${BASE_URL}/devices`);
  if (!res.ok) {
    throw new Error("Failed to fetch devices");
  }
  return res.json();
}

/**
 * 如果你后端目前还没做 release API
 * 👉 先注释掉，不要在前端用
 */
// export async function releaseDevice(deviceId: string) {
//   const res = await fetch(`${BASE_URL}/devices/${deviceId}/release`, {
//     method: "POST",
//   });
//   if (!res.ok) {
//     throw new Error("Failed to release device");
//   }
// }
