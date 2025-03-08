// import { useState } from "react";
// import API from "../services/api";

// const ForgotPassword = () => {
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setErrorMessage("");

//     try {
//       const response = await API.post("/auth/forgot-password", { email });
//       setMessage("Liên kết đặt lại mật khẩu đã được gửi đến email của bạn.");
//     } catch (error) {
//       if (error.response?.data?.message) {
//         setErrorMessage(error.response.data.message);
//       } else {
//         setErrorMessage("Lỗi khi gửi yêu cầu đặt lại mật khẩu.");
//       }
//     }
//   };

//   return (
//     <div>
//       <h2>Quên mật khẩu</h2>
//       <form onSubmit={handleSubmit}>
//         <input type="email" placeholder="Nhập email của bạn" value={email} onChange={(e) => setEmail(e.target.value)} required />
//         <button type="submit">Gửi yêu cầu</button>
//       </form>

//       {message && <p style={{ color: "green" }}>{message}</p>}
//       {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
//     </div>
//   );
// };

// export default ForgotPassword;







import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrorMessage("");

    // ✅ Kiểm tra định dạng email trước khi gửi
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage("Vui lòng nhập địa chỉ email hợp lệ.");
      return;
    }

    setLoading(true); // Bắt đầu loading

    try {
      const response = await API.post("/auth/forgot-password", { email });

      if (response.data?.status) {
        setMessage("✅ Liên kết đặt lại mật khẩu đã được gửi đến email của bạn.");
        setTimeout(() => navigate("/login"), 3000); // ✅ Tự động điều hướng sau 3 giây
      } else {
        setErrorMessage(response.data?.message || "❌ Không thể gửi email. Hãy thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu đặt lại mật khẩu:", error);

      if (error.response?.status === 422) {
        setErrorMessage("❌ Email không hợp lệ hoặc không tồn tại.");
      } else {
        setErrorMessage("❌ Lỗi hệ thống. Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>🔑 Quên mật khẩu</h2>
      <p>Nhập email của bạn để nhận liên kết đặt lại mật khẩu.</p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", maxWidth: "300px", margin: "0 auto" }}>
        <input
          type="email"
          placeholder="Nhập email của bạn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: "10px", marginBottom: "10px", fontSize: "16px" }}
        />

        <button type="submit" disabled={loading} style={{ padding: "10px", fontSize: "16px", cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "Đang gửi yêu cầu..." : "Gửi yêu cầu"}
        </button>
      </form>

      {message && <p style={{ color: "green", marginTop: "10px" }}>{message}</p>}
      {errorMessage && <p style={{ color: "red", marginTop: "10px" }}>{errorMessage}</p>}

      {/* ✅ Nút quay về trang đăng nhập */}
      <button onClick={() => navigate("/login")} style={{ marginTop: "15px", backgroundColor: "#ccc", padding: "8px", fontSize: "14px" }}>
        Quay lại Đăng nhập
      </button>
    </div>
  );
};

export default ForgotPassword;
