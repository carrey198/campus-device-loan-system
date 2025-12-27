// src/api/loans.ts
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type Loan = {
  id: string;
  deviceId: string;
  borrowerId: string;
  status: string;
  createdAt: string;
};

/* ===== API ===== */
export async function getLoans(): Promise<Loan[]> {
  const res = await fetch(`${BASE_URL}/loans`);
  if (!res.ok) {
    throw new Error("Failed to fetch loans");
  }
  return res.json();
}
