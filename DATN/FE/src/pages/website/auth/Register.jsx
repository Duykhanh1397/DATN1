import { useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role] = useState("Customer"); // Mặc định đăng ký là Customer
  const { setUser } = useContext(AuthContext);
  const [errorMessages, setErrorMessages] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra xác nhận mật khẩu
    if (password !== confirmPassword) {
      setErrorMessages({ password_confirmation: ["Mật khẩu xác nhận không khớp!"] });
      return;
    }

    try {
      const response = await API.post("/auth/register", { name, email, password, password_confirmation: confirmPassword, role });
      const data = response.data;

      if (data.status && data.token && data.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        navigate("/dashboard", { replace: true });
      } else {
        setErrorMessages({ general: ["Lỗi phản hồi từ API: Thiếu token hoặc user"] });
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrorMessages(error.response.data.errors);
      } else {
        setErrorMessages({ general: ["Lỗi đăng ký: Không thể kết nối đến máy chủ"] });
      }
    }
  };

  return (
    <div>
      <h2>Đăng ký tài khoản</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Họ và tên" value={name} onChange={(e) => setName(e.target.value)} required />
        {errorMessages.name && <p style={{ color: "red" }}>{errorMessages.name[0]}</p>}

        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        {errorMessages.email && <p style={{ color: "red" }}>{errorMessages.email[0]}</p>}

        <input type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {errorMessages.password && <p style={{ color: "red" }}>{errorMessages.password[0]}</p>}

        <input type="password" placeholder="Xác nhận mật khẩu" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        {errorMessages.password_confirmation && <p style={{ color: "red" }}>{errorMessages.password_confirmation[0]}</p>}

        <button type="submit">Đăng ký</button>
      </form>

      {errorMessages.general && <p style={{ color: "red" }}>{errorMessages.general[0]}</p>}

      <p>Đã có tài khoản? <a href="/login">Đăng nhập ngay</a></p>
    </div>
  );
};

export default Register;
