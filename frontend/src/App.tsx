import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DevicesPage from "./pages/DevicesPage";
import StaffPage from "./pages/StaffPage";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { user, logout } = useAuth();

  return (
    <BrowserRouter>
      <header style={{ padding: 10, borderBottom: "1px solid #ccc" }}>
        <a href="/devices">Devices</a>{" "}
        <a href="/staff">Staff</a>{" "}
        {!user ? <a href="/login">Login</a> : <button onClick={logout}>Logout</button>}
      </header>

      <Routes>
        <Route path="/" element={<Navigate to="/devices" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/devices" element={<DevicesPage />} />
        <Route path="/staff" element={<StaffPage />} />
      </Routes>
    </BrowserRouter>
  );
}
