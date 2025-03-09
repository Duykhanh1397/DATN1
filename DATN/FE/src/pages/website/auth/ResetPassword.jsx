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












// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../../../services/api";

// const ResetPassword = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const navigate = useNavigate();

//   const handleResetPassword = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setErrorMessage("");

//     if (password !== confirmPassword) {
//       setErrorMessage("Mật khẩu xác nhận không khớp.");
//       return;
//     }

//     try {
//       const response = await API.post("/auth/reset-password", {
//         email,
//         password,
//         password_confirmation: confirmPassword,
//       });

//       setMessage("Mật khẩu đã được đặt lại thành công!");

//       // ⏳ Sau 3 giây tự động chuyển về trang đăng nhập
//       setTimeout(() => {
//         navigate("/login");
//       }, 3000);

//     } catch (error) {
//       console.error("Lỗi đặt lại mật khẩu:", error.response?.data || error);
//       setErrorMessage(error.response?.data?.message || "Lỗi hệ thống.");
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
//           placeholder="Nhập email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Mật khẩu mới"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
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
import { useNavigate, Link } from "react-router-dom";
import API from "../../../services/api";
import { Form, Input, Button, Typography, Card, Alert } from "antd";

const { Title, Paragraph } = Typography;

const ResetPassword = () => {
  const [form] = Form.useForm();
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (values) => {
    setMessage("");
    setErrorMessage("");
    setLoading(true);

    if (values.password !== values.confirmPassword) {
      setErrorMessage("Mật khẩu xác nhận không khớp.");
      setLoading(false);
      return;
    }

    try {
      const response = await API.post("/auth/reset-password", {
        email: values.email,
        password: values.password,
        password_confirmation: values.confirmPassword,
      });

      setMessage("✅ Mật khẩu đã được đặt lại thành công!");

      // ⏳ Sau 3 giây tự động chuyển về trang đăng nhập
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("❌ Lỗi đặt lại mật khẩu:", error.response?.data || error);
      setErrorMessage(error.response?.data?.message || "❌ Lỗi hệ thống. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 450, margin: "auto", padding: "50px 0" }}>
      <Card bordered style={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: 10 }}>
          🔄 Đặt Lại Mật Khẩu
        </Title>
        <Paragraph style={{ textAlign: "center" }}>
          Nhập email và mật khẩu mới của bạn để đặt lại mật khẩu.
        </Paragraph>

        {message && <Alert message={message} type="success" showIcon closable />}
        {errorMessage && <Alert message={errorMessage} type="error" showIcon closable />}

        <Form form={form} onFinish={handleResetPassword} layout="vertical" style={{ marginTop: 20 }}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Định dạng email không hợp lệ!" }
            ]}
          >
            <Input size="large" placeholder="Nhập email của bạn" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password size="large" placeholder="Nhập mật khẩu mới" />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu mới"
            name="confirmPassword"
            rules={[{ required: true, message: "Vui lòng nhập lại mật khẩu!" }]}
          >
            <Input.Password size="large" placeholder="Nhập lại mật khẩu mới" />
          </Form.Item>

          <Form.Item style={{ textAlign: "center" }}>
            <Button type="primary" htmlType="submit" size="large" loading={loading} style={{ width: "100%" }}>
              {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
            </Button>
          </Form.Item>

          <hr style={{ borderTop: "2px dashed #ccc", margin: "20px 0" }} />

       
        </Form>
      </Card>
    </div>
  );
};

export default ResetPassword;
