import { useEffect, useState } from "react";
import { getDevices } from "../api/devices";
import type { Device } from "../api/devices";

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadDevices() {
    try {
      setLoading(true);
      const data = await getDevices();
      setDevices(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubscribe() {
  try {
    await loadDevices();
  } catch (err: any) {
    alert(err.message);
  }
}


  useEffect(() => {
    loadDevices();
  }, []);

  if (loading) return <p>Loading devices...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h1>Available Devices</h1>

      <ul>
        {devices.map(d => (
          <li key={d.id} style={{ marginBottom: 12 }}>
            <strong>{d.name}</strong> —{" "}
            {d.availableCount}/{d.totalCount}
            <br />
           <button onClick={handleSubscribe}>
  Refresh
</button>

          </li>
        ))}
      </ul>
    </div>
  );
}
