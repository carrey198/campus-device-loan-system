import { useEffect, useState } from "react";

// devices api
import { getDevices } from "../api/devices";
import type { Device } from "../api/devices";

// loans api
import { getLoans } from "../api/loans";
import type { Loan } from "../api/loans";

export default function StaffPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadAll() {
    try {
      setLoading(true);
      const [devicesData, loansData] = await Promise.all([
        getDevices(),
        getLoans(),
      ]);

      setDevices(devicesData);
      setLoans(loansData);
    } catch (err: any) {
      setError(err.message ?? "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  if (loading) {
    return <p>Loading staff dashboard…</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Staff Dashboard</h1>

      {/* ===== Devices ===== */}
      <section>
        <h2>Devices</h2>
        {devices.length === 0 ? (
          <p>No devices found.</p>
        ) : (
          <table border={1} cellPadding={8}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Total</th>
                <th>Available</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((d) => (
                <tr key={d.id}>
                  <td>{d.id}</td>
                  <td>{d.name}</td>
                  <td>{d.totalCount}</td>
                  <td>{d.availableCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <hr />

      {/* ===== Loans ===== */}
      <section>
        <h2>Loans</h2>
        {loans.length === 0 ? (
          <p>No loans found.</p>
        ) : (
          <table border={1} cellPadding={8}>
            <thead>
              <tr>
                <th>Loan ID</th>
                <th>Device ID</th>
                <th>Borrower ID</th>
                <th>Status</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr key={loan.id}>
                  <td>{loan.id}</td>
                  <td>{loan.deviceId}</td>
                  <td>{loan.borrowerId}</td>
                  <td>{loan.status}</td>
                  <td>{new Date(loan.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
