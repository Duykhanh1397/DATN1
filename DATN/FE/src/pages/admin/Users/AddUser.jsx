import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api";

const AddUser = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Customer");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Bạn chưa đăng nhập.");
        return;
      }

      const { data } = await API.post(
        "/admin/users",
        { name, email, password, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.message) {
        setMessage("Tạo user thành công! Đang chuyển hướng...");
        setTimeout(() => navigate("/admin/users"), 2000);
      }
    } catch (error) {
      console.error("Lỗi tạo user:", error);
      setError(error.response?.data?.message || "Không thể tạo user.");
    }
  };

  return (
    <div>
      <h2>Thêm User</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Tên" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="Customer">Customer</option>
          <option value="Admin">Admin</option>
        </select>
        <button type="submit">Thêm User</button>
      </form>

      <button onClick={() => navigate("/admin/users")} style={{ marginTop: "10px" }}>
        Quay lại danh sách
      </button>
    </div>
  );
};

export default AddUser;

