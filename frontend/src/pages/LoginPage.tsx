import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const isEnglishOnly = (value: string) => /^[a-zA-Z0-9]+$/.test(value);

export default function LoginPage() {
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [role, setRole] = useState<"student" | "staff">("student");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    const n = name.trim();
    const id = studentId.trim();

    if (!n || !id) {
      alert("Please enter your name and ID.");
      return;
    }
    if (!isEnglishOnly(n) || !isEnglishOnly(id)) {
      alert("English letters and numbers only (A-Z, 0-9).");
      return;
    }

    login({ name: n, studentId: id, role });
    navigate("/devices");
  };

  return (
    <div style={{ padding: 20, maxWidth: 420 }}>
      <h2>Login</h2>

      <div style={{ marginBottom: 12 }}>
        <label>Name</label>
        <br />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name (A-Z, 0-9)"
          style={{ width: "100%", padding: 8 }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>ID</label>
        <br />
        <input
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          placeholder="Enter student/staff ID (A-Z, 0-9)"
          style={{ width: "100%", padding: 8 }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Role</label>
        <br />
        <select value={role} onChange={(e) => setRole(e.target.value as "student" | "staff")}>
          <option value="student">Student</option>
          <option value="staff">Staff</option>
        </select>
      </div>

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
