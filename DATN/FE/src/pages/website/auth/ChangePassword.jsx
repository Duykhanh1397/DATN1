// import { useState } from "react";
// import API from "../services/api";

// const ChangePassword = () => {
//   const [currentPassword, setCurrentPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [message, setMessage] = useState("");

//   const handleChangePassword = async (e) => {
//     e.preventDefault();

//     if (newPassword !== confirmPassword) {
//       setMessage("Xác nhận mật khẩu không trùng khớp!");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setMessage("Bạn chưa đăng nhập.");
//         return;
//       }

//       const { data } = await API.post(
//         "/auth/change-password",
//         {
//           current_password: currentPassword,
//           new_password: newPassword,
//           new_password_confirmation: confirmPassword,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setMessage(data.message);
//     } catch (error) {
//       console.error("Lỗi đổi mật khẩu:", error);
//       setMessage(error.response?.data?.message || "Lỗi hệ thống, thử lại sau.");
//     }
//   };

//   return (
//     <div>
//       <h2>Đổi Mật Khẩu</h2>
//       {message && <p style={{ color: "red" }}>{message}</p>}
//       <form onSubmit={handleChangePassword}>
//         <input
//           type="password"
//           placeholder="Mật khẩu hiện tại"
//           value={currentPassword}
//           onChange={(e) => setCurrentPassword(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Mật khẩu mới"
//           value={newPassword}
//           onChange={(e) => setNewPassword(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Xác nhận mật khẩu mới"
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//           required
//         />
//         <button type="submit">Đổi Mật Khẩu</button>
//       </form>
//     </div>
//   );
// };

// export default ChangePassword;




import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("❌ Xác nhận mật khẩu không trùng khớp!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("⚠ Bạn chưa đăng nhập.");
        return;
      }

      const { data } = await API.post(
        "/auth/change-password",
        {
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: confirmPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("✅ Đổi mật khẩu thành công!");
      setError("");

      // Chuyển hướng về Dashboard sau 2 giây
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
      
    } catch (error) {
      console.error("Lỗi đổi mật khẩu:", error);
      setError(error.response?.data?.message || "❌ Lỗi hệ thống, thử lại sau.");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>🔒 Đổi Mật Khẩu</h2>

      {/* Hiển thị thông báo lỗi hoặc thành công */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", maxWidth: "300px", margin: "auto" }}>
        <input
          type="password"
          placeholder="🔑 Mật khẩu hiện tại"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="🔐 Mật khẩu mới"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="✅ Xác nhận mật khẩu mới"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit" style={{ marginTop: "10px" }}>Đổi Mật Khẩu</button>
      </form>

      {/* ✅ Nút quay lại Dashboard */}
      <button 
        onClick={() => navigate("/dashboard")} 
        style={{ marginTop: "20px", backgroundColor: "gray", color: "white" }}
      >
        ⬅ Quay lại Dashboard
      </button>
    </div>
  );
};

export default ChangePassword;


