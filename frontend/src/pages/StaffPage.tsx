// src/pages/StaffPage.tsx
import { useEffect, useState } from "react";
import {
  getDevices,
  getReservations,
  markCollected,
  markReturned,
  staffAdjustCounts,
} from "../api/devices";

import type { Device, Reservation } from "../api/devices";
import { useAuth } from "../context/AuthContext";

export default function StaffPage() {
  const { user } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const isStaff = user?.role === "staff";

  async function load() {
    setLoading(true);
    const [d, r] = await Promise.all([
      getDevices(),
      getReservations(),
    ]);
    setDevices(d);
    setReservations(r);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const onCollected = async (id: string) => {
    await markCollected(id);
    await load();
  };

  const onReturned = async (id: string) => {
    await markReturned(id);
    await load();
  };

  const onAdjust = async (d: Device) => {
    const totalStr = prompt("New total count:", String(d.totalCount));
    const availableStr = prompt("New available count:", String(d.availableCount));

    if (totalStr === null || availableStr === null) return;

    const total = Number(totalStr);
    const available = Number(availableStr);

    if (Number.isNaN(total) || Number.isNaN(available)) return;

    await staffAdjustCounts(d.id, total, available);
    await load();
  };

  if (!user) return <p>Please login.</p>;
  if (!isStaff) return <p>Access denied.</p>;
  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Staff Dashboard</h2>

      <h3>Devices</h3>
      {devices.map(d => (
        <div key={d.id}>
          {d.name} — {d.availableCount}/{d.totalCount}
          <button onClick={() => onAdjust(d)}>Adjust</button>
        </div>
      ))}

      <h3>Reservations</h3>
      {reservations.map(r => (
        <div key={r.id}>
          {r.deviceId} — {r.status}
          {r.status === "reserved" && (
            <button onClick={() => onCollected(r.id)}>Collected</button>
          )}
          {r.status === "collected" && (
            <button onClick={() => onReturned(r.id)}>Returned</button>
          )}
        </div>
      ))}
    </div>
  );
}
