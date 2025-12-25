// src/api/devices.ts

export type Device = {
  id: string;
  name: string;
  totalCount: number;
  availableCount: number;
};

export type Reservation = {
  id: string;
  deviceId: string;
  studentId: string;
  status: "reserved" | "collected" | "returned";
  createdAt: string;
  dueAt: string;
};

// ================= MOCK DATABASE =================

let devices: Device[] = [
  {
    id: "dev-mac-01",
    name: "MacBook Pro",
    totalCount: 5,
    availableCount: 0, // 缺货
  },
  {
    id: "dev-dell-01",
    name: "Dell XPS",
    totalCount: 3,
    availableCount: 1,
  },
  {
    id: "dev-ipad-01",
    name: "iPad Pro",
    totalCount: 2,
    availableCount: 2,
  },
];

let reservations: Reservation[] = [
  {
    id: "loan-001",
    deviceId: "dev-mac-01",
    studentId: "student001",
    status: "reserved",
    createdAt: new Date().toISOString(),
    dueAt: new Date(Date.now() + 7 * 86400000).toISOString(),
  },
];

// ================= API FUNCTIONS =================

export async function getDevices(): Promise<Device[]> {
  return [...devices];
}

export async function getReservations(): Promise<Reservation[]> {
  return [...reservations];
}

export async function markCollected(id: string) {
  const r = reservations.find((x) => x.id === id);
  if (r) r.status = "collected";
}

export async function markReturned(id: string) {
  const r = reservations.find((x) => x.id === id);
  if (r) r.status = "returned";
}

export async function staffAdjustCounts(
  deviceId: string,
  total: number,
  available: number
) {
  const d = devices.find((x) => x.id === deviceId);
  if (!d) return;
  d.totalCount = total;
  d.availableCount = available;
}
export async function reserveDevice(
  deviceId: string,
  studentId: string
): Promise<{ ok: boolean; dueAt?: string }> {
  const device = devices.find((d) => d.id === deviceId);
  if (!device || device.availableCount <= 0) {
    return { ok: false };
  }

  device.availableCount -= 1;

  const dueAt = new Date(Date.now() + 7 * 86400000).toISOString();

  reservations.push({
    id: `loan-${Date.now()}`,
    deviceId,
    studentId,
    status: "reserved",
    createdAt: new Date().toISOString(),
    dueAt,
  });

  return { ok: true, dueAt };
}

export async function subscribeDevice(
  deviceId: string,
  studentId: string
): Promise<{ ok: boolean }> {
  // 这里只做“成功订阅”的模拟，不改库存
  return { ok: true };
}
