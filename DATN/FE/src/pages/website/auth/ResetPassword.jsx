// import { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import API from "../services/api";

// const ResetPassword = () => {
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();
//   const location = useLocation();
//   const token = new URLSearchParams(location.search).get("token");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (password !== confirmPassword) {
//       setMessage("Mật khẩu xác nhận không khớp.");
//       return;
//     }

//     try {
//       await API.post("/auth/reset-password", { token, password, password_confirmation: confirmPassword });
//       setMessage("Mật khẩu đã được đặt lại thành công!");
//       setTimeout(() => navigate("/login"), 1500);
//     } catch (error) {
//       setMessage("Lỗi khi đặt lại mật khẩu. Vui lòng thử lại.");
//     }
//   };

//   return (
//     <div>
//       <h2>Đặt lại mật khẩu</h2>
//       <form onSubmit={handleSubmit}>
//         <input type="password" placeholder="Mật khẩu mới" value={password} onChange={(e) => setPassword(e.target.value)} required />
//         <input type="password" placeholder="Xác nhận mật khẩu" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
//         <button type="submit">Đặt lại mật khẩu</button>
//       </form>

//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default ResetPassword;




// import { useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import API from "../services/api";

// const ResetPassword = () => {
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const token = searchParams.get("token");
//   const email = searchParams.get("email");

//   const handleResetPassword = async (e) => {
//     e.preventDefault();
//     if (password !== confirmPassword) {
//       setMessage("⚠ Mật khẩu xác nhận không trùng khớp!");
//       return;
//     }

//     try {
//       const { data } = await API.post("/auth/reset-password", {
//         email,
//         token,
//         password,
//         password_confirmation: confirmPassword,
//       });

//       if (data.status) {
//         setMessage("✅ Đặt lại mật khẩu thành công! Đang chuyển hướng...");
//         setTimeout(() => navigate("/login"), 2000);
//       } else {
//         setMessage("❌ " + data.message);
//       }
//     } catch (error) {
//       console.error("Lỗi đặt lại mật khẩu:", error);
//       setMessage("❌ Lỗi hệ thống. Vui lòng thử lại sau.");
//     }
//   };

//   return (
//     <div>
//       <h2>🔄 Đặt lại mật khẩu</h2>
//       {message && <p style={{ color: message.includes("✅") ? "green" : "red" }}>{message}</p>}
//       <form onSubmit={handleResetPassword}>
//         <input type="password" placeholder="🔑 Mật khẩu mới" value={password} onChange={(e) => setPassword(e.target.value)} required />
//         <input type="password" placeholder="🔄 Xác nhận mật khẩu" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
//         <button type="submit">Xác nhận</button>
//       </form>
//     </div>
//   );
// };

// export default ResetPassword;




// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../services/api";

// const ResetPassword = () => {
//   const [email, setEmail] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const navigate = useNavigate();

//   const handleResetPassword = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setErrorMessage("");

//     if (newPassword !== confirmPassword) {
//       setErrorMessage("Mật khẩu xác nhận không khớp.");
//       return;
//     }

//     try {
//       const response = await API.post("/auth/reset-password", {
//         email,
//         new_password: newPassword,
//         new_password_confirmation: confirmPassword,
//       });

//       setMessage("Mật khẩu đã được cập nhật thành công!");

//       // ⏳ Sau 3 giây tự động chuyển về login
//       setTimeout(() => {
//         navigate("/login");
//       }, 3000);
      
//     } catch (error) {
//       console.error("Lỗi đặt lại mật khẩu:", error.response?.data || error);
//       setErrorMessage(error.response?.data?.message || "Lỗi hệ thống. Vui lòng thử lại sau.");
//     }
//   };

//   return (
//     <div>
//       <h2>Đặt Lại Mật Khẩu</h2>
//       {message && <p style={{ color: "green" }}>{message}</p>}
//       {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
//       <form onSubmit={handleResetPassword}>
//         <input
//           type="email"
//           placeholder="Nhập email của bạn"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
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
//         <button type="submit">Đặt lại mật khẩu</button>
//       </form>
//     </div>
//   );
// };

// export default ResetPassword;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      const response = await API.post("/auth/reset-password", {
        email,
        password,
        password_confirmation: confirmPassword,
      });

      setMessage("Mật khẩu đã được đặt lại thành công!");

      // ⏳ Sau 3 giây tự động chuyển về trang đăng nhập
      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (error) {
      console.error("Lỗi đặt lại mật khẩu:", error.response?.data || error);
      setErrorMessage(error.response?.data?.message || "Lỗi hệ thống.");
    }
  };

  return (
    <div>
      <h2>Đặt Lại Mật Khẩu</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <form onSubmit={handleResetPassword}>
        <input
          type="email"
          placeholder="Nhập email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mật khẩu mới"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Xác nhận mật khẩu mới"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Đặt lại mật khẩu</button>
      </form>
    </div>
  );
};

export default ResetPassword;
