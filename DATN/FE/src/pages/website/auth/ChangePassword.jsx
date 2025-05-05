// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../../../services/api";

// const ChangePassword = () => {
//   const [currentPassword, setCurrentPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleChangePassword = async (e) => {
//     e.preventDefault();

//     if (newPassword !== confirmPassword) {
//       setError("❌ Xác nhận mật khẩu không trùng khớp!");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setError("⚠ Bạn chưa đăng nhập.");
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
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       setMessage("✅ Đổi mật khẩu thành công!");
//       setError("");

//       // Chuyển hướng về trang gốc `/` sau 2 giây
//       setTimeout(() => {
//         navigate("/");
//       }, 1000);

//     } catch (error) {
//       console.error("Lỗi đổi mật khẩu:", error);
//       setError(error.response?.data?.message || "❌ Lỗi hệ thống, thử lại sau.");
//     }
//   };

//   return (
//     <div style={{ textAlign: "center", padding: "20px" }}>
//       <h2>🔒 Đổi Mật Khẩu</h2>

//       {/* Hiển thị thông báo lỗi hoặc thành công */}
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       {message && <p style={{ color: "green" }}>{message}</p>}

//       <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", maxWidth: "300px", margin: "auto" }}>
//         <input
//           type="password"
//           placeholder="🔑 Mật khẩu hiện tại"
//           value={currentPassword}
//           onChange={(e) => setCurrentPassword(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="🔐 Mật khẩu mới"
//           value={newPassword}
//           onChange={(e) => setNewPassword(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="✅ Xác nhận mật khẩu mới"
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//           required
//         />
//         <button type="submit" style={{ marginTop: "10px" }}>Đổi Mật Khẩu</button>
//       </form>

//       {/* ✅ Nút quay lại Trang Chủ */}
//       <button
//         onClick={() => navigate("/")}
//         style={{ marginTop: "20px", backgroundColor: "gray", color: "white" }}
//       >
//       </button>
//     </div>
//   );
// };

// export default ChangePassword;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import API from "../../../services/api";

const ChangePassword = () => {
  const [form] = Form.useForm();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChangePassword = async (values) => {
    const { currentPassword, newPassword, confirmPassword } = values;

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

      message.success("✅ Đổi mật khẩu thành công!");
      setError("");

      // Chuyển hướng về trang gốc `/` sau 2 giây
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Lỗi đổi mật khẩu:", error);
      setError(
        error.response?.data?.message || "❌ Lỗi hệ thống, thử lại sau."
      );
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 50 }}>
      <h2 style={{ textAlign: "center" }}> Đổi Mật Khẩu</h2>

      {/* Hiển thị thông báo lỗi hoặc thành công */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <Form form={form} layout="vertical" onFinish={handleChangePassword}>
        <Form.Item
          label="Mật khẩu hiện tại"
          name="currentPassword"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu hiện tại!" },
          ]}
        >
          <Input.Password placeholder=" Mật khẩu hiện tại" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu mới"
          name="newPassword"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới!" }]}
        >
          <Input.Password placeholder=" Mật khẩu mới" />
        </Form.Item>

        <Form.Item
          label="Xác nhận mật khẩu mới"
          name="confirmPassword"
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu mới!" },
          ]}
        >
          <Input.Password placeholder=" Xác nhận mật khẩu mới" />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            span: 24,
            style: { textAlign: "center", marginTop: 20 },
          }}
        >
          <button
            type="submit"
            className="signup-button"
            style={{
              width: "40%",
              height: "45px",
              fontSize: "16px",
              backgroundColor: "#d9d9d9",
              border: "1px solid #d9d9d9",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
          >
            Đổi Mật Khẩu
          </button>
        </Form.Item>
        <hr style={{ borderTop: "2px dashed #444", marginTop: "20px" }} />

        <Form.Item
          wrapperCol={{
            span: 24,
            style: { textAlign: "center", marginTop: 10 },
          }}
        >
          <Link to="/">
            <Button
              type="primary"
              style={{
                width: "30%",
                height: "45px",
                fontSize: "16px",
              }}
            >
              Quay lại Trang Chủ
            </Button>
          </Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangePassword;
