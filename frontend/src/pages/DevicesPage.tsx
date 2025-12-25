import { useEffect, useState } from "react";
import {
  getDevices,
  reserveDevice,
  subscribeDevice,
  type Device,
} from "../api/devices";
import { useAuth } from "../context/AuthContext";

export default function DevicesPage() {
  const { user } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);

  async function load() {
    const d = await getDevices();
    setDevices(d);
  }

  useEffect(() => {
    load();
  }, []);

  const onReserve = async (device: Device) => {
    if (!user) return alert("Please login first.");

    const res = await reserveDevice(device.id, user.studentId);
    if (!res.ok) return alert("Reservation failed.");

    alert(
      `Reservation successful.\nPlease collect at pickup point.\nDue date: ${res.dueAt}`
    );
    await load();
  };

  const onSubscribe = async (device: Device) => {
    if (!user) return alert("Please login first.");

    await subscribeDevice(device.id, user.studentId);
    alert("Subscription successful. You will be notified by email.");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Devices</h2>

      {devices.map((d) => (
        <div key={d.id} style={{ border: "1px solid #ccc", padding: 12 }}>
          <strong>{d.name}</strong>
          <p>
            Total: {d.totalCount} | Available: {d.availableCount}
          </p>

          {d.availableCount > 0 ? (
            <button onClick={() => onReserve(d)}>Reserve</button>
          ) : (
            <button onClick={() => onSubscribe(d)}>Subscribe (Out of stock)</button>
          )}
        </div>
      ))}
    </div>
  );
}
