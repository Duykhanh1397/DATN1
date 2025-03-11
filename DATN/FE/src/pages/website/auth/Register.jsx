// import { useState, useContext } from "react";
// import { AuthContext } from "../../../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import API from "../../../services/api";

// const Register = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [role] = useState("Customer"); // Mặc định đăng ký là Customer
//   const { setUser } = useContext(AuthContext);
//   const [errorMessages, setErrorMessages] = useState({});
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Kiểm tra xác nhận mật khẩu
//     if (password !== confirmPassword) {
//       setErrorMessages({ password_confirmation: ["Mật khẩu xác nhận không khớp!"] });
//       return;
//     }

//     try {
//       const response = await API.post("/auth/register", { name, email, password, password_confirmation: confirmPassword, role });
//       const data = response.data;

//       if (data.status && data.token && data.user) {
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("user", JSON.stringify(data.user));
//         setUser(data.user);
//         navigate("/dashboard", { replace: true });
//       } else {
//         setErrorMessages({ general: ["Lỗi phản hồi từ API: Thiếu token hoặc user"] });
//       }
//     } catch (error) {
//       if (error.response?.data?.errors) {
//         setErrorMessages(error.response.data.errors);
//       } else {
//         setErrorMessages({ general: ["Lỗi đăng ký: Không thể kết nối đến máy chủ"] });
//       }
//     }
//   };

//   return (
//     <div>
//       <h2>Đăng ký tài khoản</h2>
//       <form onSubmit={handleSubmit}>
//         <input type="text" placeholder="Họ và tên" value={name} onChange={(e) => setName(e.target.value)} required />
//         {errorMessages.name && <p style={{ color: "red" }}>{errorMessages.name[0]}</p>}

//         <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
//         {errorMessages.email && <p style={{ color: "red" }}>{errorMessages.email[0]}</p>}

//         <input type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} required />
//         {errorMessages.password && <p style={{ color: "red" }}>{errorMessages.password[0]}</p>}

//         <input type="password" placeholder="Xác nhận mật khẩu" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
//         {errorMessages.password_confirmation && <p style={{ color: "red" }}>{errorMessages.password_confirmation[0]}</p>}

//         <button type="submit">Đăng ký</button>
//       </form>

//       {errorMessages.general && <p style={{ color: "red" }}>{errorMessages.general[0]}</p>}

//       <p>Đã có tài khoản? <a href="/login">Đăng nhập ngay</a></p>
//     </div>
//   );
// };

// export default Register;

import { useState, useContext } from "react";
import { Form, Input, Button, Alert, Col, Row } from "antd";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import API from "../../../services/api";

const Register = () => {
  const [form] = Form.useForm();
  const [errorMessages, setErrorMessages] = useState({});
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  if (!auth) {
    console.error("Lỗi: AuthContext không khả dụng.");

    return (
      <Alert
        message="Lỗi hệ thống: Không thể sử dụng AuthContext!"
        type="error"
        showIcon
      />
    );

    return <Alert message="Lỗi hệ thống: Không thể sử dụng AuthContext!" type="error" showIcon />;

  }

  const handleSubmit = async (values) => {
    try {
      const { data } = await API.post("/auth/register", {
        name: values.name,
        email: values.email,
        password: values.password,
        password_confirmation: values.confirmPassword,
        phone: values.phone,
        address: values.address,
        role: "Customer",
      });

      console.log("📌 API Response:", data);

      if (data.status) {
        // ✅ Chuyển hướng sang trang đăng nhập sau khi đăng ký thành công
        navigate("/login", { replace: true });
      } else {

        setErrorMessages({
          general: ["❌ Đăng ký thất bại, vui lòng thử lại!"],
        });
      }
    } catch (error) {
      console.error("❌ Lỗi API:", error);
      setErrorMessages(
        error.response?.data?.errors || {
          general: ["⚠ Không thể kết nối đến máy chủ!"],
        }
      );

        setErrorMessages({ general: ["❌ Đăng ký thất bại, vui lòng thử lại!"] });
      }
    } catch (error) {
      console.error("❌ Lỗi API:", error);
      setErrorMessages(error.response?.data?.errors || { general: ["⚠ Không thể kết nối đến máy chủ!"] });

    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 50 }}>
      <h2 style={{ textAlign: "center" }}>Đăng ký tài khoản</h2>


      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="name"
          label="Họ và tên"
          rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
        >
          <Input />
        </Form.Item>

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
          <Input />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              rules={[
                { required: true, message: "Vui lòng xác nhận mật khẩu!" },
              ]}
            >
              <Input.Password />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="address"
              label="Địa chỉ"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <p>
          <Link to="/forgot-password">Quên mật khẩu?</Link>
        </p>

        {/* ✅ Hiển thị lỗi nếu có */}
        {Object.keys(errorMessages).length > 0 &&
          Object.values(errorMessages).map((msg, index) => (
            <Alert
              key={index}
              message={msg[0]}
              type="error"
              showIcon
              closable
              style={{ marginBottom: 10 }}
            />
          ))}

        <Form.Item style={{ textAlign: "center", marginTop: 20 }}>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: "40%", height: "45px", fontSize: "16px" }}
          >
            Tạo tài khoản
          </Button>
        </Form.Item>

        <hr style={{ borderTop: "2px dashed #444", marginTop: "20px" }} />

        <Form.Item style={{ textAlign: "center", marginTop: 10 }}>
          <Link to="/login">
            <Button
              type="primary"
              style={{ width: "20%", height: "45px", fontSize: "16px" }}
            >


      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item name="name" label="Họ và tên" rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}>
          <Input />
        </Form.Item>

        <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Vui lòng nhập email hợp lệ!" }]}>
          <Input />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}>
              <Input.Password />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="confirmPassword" label="Xác nhận mật khẩu" rules={[{ required: true, message: "Vui lòng xác nhận mật khẩu!" }]}>
              <Input.Password />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <p>
          <Link to="/forgot-password">Quên mật khẩu?</Link>
        </p>

        {/* ✅ Hiển thị lỗi nếu có */}
        {Object.keys(errorMessages).length > 0 &&
          Object.values(errorMessages).map((msg, index) => (
            <Alert key={index} message={msg[0]} type="error" showIcon closable style={{ marginBottom: 10 }} />
          ))}

        <Form.Item style={{ textAlign: "center", marginTop: 20 }}>
          <Button type="primary" htmlType="submit" style={{ width: "40%", height: "45px", fontSize: "16px" }}>
            Tạo tài khoản
          </Button>
        </Form.Item>

        <hr style={{ borderTop: "2px dashed #444", marginTop: "20px" }} />

        <Form.Item style={{ textAlign: "center", marginTop: 10 }}>
          <Link to="/login">
            <Button type="primary" style={{ width: "20%", height: "45px", fontSize: "16px" }}>

              Đăng nhập
            </Button>
          </Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;



