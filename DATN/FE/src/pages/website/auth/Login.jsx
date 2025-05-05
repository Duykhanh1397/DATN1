// import { useState, useContext } from "react";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate, Link } from "react-router-dom";
// import API from "../services/api";

// const Login = () => {
//   const { setUser } = useContext(AuthContext); // Đảm bảo lấy được setUser từ context
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   if (!setUser) {
//     console.error("Lỗi: setUser không tồn tại trong AuthContext. Kiểm tra AuthProvider.");
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const { data } = await API.post("/auth/login", { email, password });

//       if (data.token && data.user) {
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("user", JSON.stringify(data.user));
//         setUser(data.user); // Đảm bảo không bị lỗi

//         setTimeout(() => {
//           navigate("/dashboard", { replace: true });
//         }, 100);
//       } else {
//         console.error("Lỗi phản hồi từ API: Thiếu token hoặc user");
//       }
//     } catch (error) {
//       console.error("Lỗi đăng nhập:", error);
//     }
//   };

//   return (
//     <div>
//       <h2>Đăng nhập</h2>
//       <form onSubmit={handleSubmit}>
//         <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
//         <input type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} required />
//         <button type="submit">Đăng nhập</button>
//       </form>

//       <p><Link to="/forgot-password">Quên mật khẩu?</Link></p>
//       <p>Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></p>
//     </div>
//   );
// };

// export default Login;

// import { useState, useContext } from "react";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate, Link } from "react-router-dom";
// import API from "../services/api";

// const Login = () => {
//   const { login } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setErrorMessage("");

//     try {
//       const response = await API.post("/auth/login", { email, password });

//       console.log("API Response:", response.data); // Log API response

//       if (response.data.token && response.data.user) {
//         localStorage.setItem("token", response.data.token);
//         localStorage.setItem("user", JSON.stringify(response.data.user));
//         login(response.data.user);

//         if (response.data.user.role === "Admin") {
//           navigate("/admin/users", { replace: true });
//         } else {
//           navigate("/dashboard", { replace: true });
//         }
//       } else {
//         setErrorMessage("Lỗi phản hồi từ API: Thiếu token hoặc user");
//       }
//     } catch (error) {
//       console.error("Lỗi đăng nhập:", error.response?.data);
//       setErrorMessage(error.response?.data?.message || "Lỗi đăng nhập. Vui lòng thử lại.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h2>Đăng nhập</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Mật khẩu"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <button type="submit" disabled={loading}>
//           {loading ? "Đang đăng nhập..." : "Đăng nhập"}
//         </button>
//       </form>

//       {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

//       <p><Link to="/forgot-password">Quên mật khẩu?</Link></p>
//       <p>Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></p>
//     </div>
//   );
// };

// export default Login;

// import { useState, useContext } from "react";
// import { AuthContext } from "../../../context/AuthContext";
// import { useNavigate, Link } from "react-router-dom";
// import API from "../../../services/api";

// const Login = () => {
//   const { login } = useContext(AuthContext);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(""); // Xóa lỗi cũ

//     try {
//       const response = await API.post("/auth/login", { email, password });

//       // Kiểm tra nếu dữ liệu phản hồi không đúng định dạng
//       if (!response.data || !response.data.status || !response.data.token || !response.data.user) {
//         setError("Phản hồi từ server không hợp lệ.");
//         console.error("Phản hồi API lỗi:", response.data);
//         return;
//       }

//       // Gọi login từ AuthContext để lưu token & user
//       login(response.data.user, response.data.token);
//     } catch (error) {
//       console.error("Lỗi đăng nhập:", error.response);
//       setError(error.response?.data?.message || "Lỗi đăng nhập. Vui lòng thử lại.");
//     }
//   };

//   return (
//     <div>
//       <h2>Đăng nhập</h2>
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       <form onSubmit={handleSubmit}>
//         <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
//         <input type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} required />
//         <button type="submit">Đăng nhập</button>
//       </form>

//       <p><Link to="/forgot-password">Quên mật khẩu?</Link></p>
//       <p>Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></p>
//     </div>
//   );
// };

// export default Login;

import { useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import API from "../../../services/api";
import { Form, Input, Button, Alert } from "antd";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError(""); // Xóa lỗi cũ

    try {
      const response = await API.post("/auth/login", { email, password });

      // Kiểm tra nếu dữ liệu phản hồi không đúng định dạng
      if (
        !response.data ||
        !response.data.status ||
        !response.data.token ||
        !response.data.user
      ) {
        setError("Phản hồi từ server không hợp lệ.");
        console.error("Phản hồi API lỗi:", response.data);
        return;
      }

      // Gọi login từ AuthContext để lưu token & user
      login(response.data.user, response.data.token);
    } catch (error) {
      console.error("Lỗi đăng nhập:", error.response);
      setError(
        error.response?.data?.message || "Lỗi đăng nhập. Vui lòng thử lại."
      );
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 50 }}>
      <h2 style={{ textAlign: "center" }}>Đăng nhập</h2>
      <Form onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              required: true,
              type: "email",
              message: "Vui lòng nhập email hợp lệ!",
            },
          ]}
        >
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        </Form.Item>
        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>
        <p>
          <a href="/forgot-password">Quên mật khẩu?</a>
        </p>
        {error && <Alert message={error} type="error" showIcon closable />}

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
            Đăng nhập
          </button>
        </Form.Item>
        <hr style={{ borderTop: "2px dashed #444", marginTop: "20px" }} />

        <Form.Item
          wrapperCol={{
            span: 24,
            style: { textAlign: "center", marginTop: 10 },
          }}
        >
          <Link to="/register">
            <Button
              type="primary"
              style={{
                width: "30%",
                height: "45px",
                fontSize: "16px",
              }}
            >
              Tạo tài khoản
            </Button>
          </Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
