// import { useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../../../context/AuthContext";
// import { Card, Button, Typography, Row, Col, Space, Form, Input } from "antd";

// const { Title, Text } = Typography;

// const Profile = () => {
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

//   return (
//     <div style={{ padding: "30px", backgroundColor: "#f5f5f5" }}>
//       <Title level={2} style={{ textAlign: "center", color: "#4a4a4a" }}>
//         👤 Hồ sơ của tôi
//       </Title>

//       {user ? (
//         <Card
//           style={{
//             maxWidth: "800px",
//             margin: "0 auto",
//             borderRadius: "8px",
//             boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
//             backgroundColor: "#fff",
//           }}
//         >
//           <Form
//             layout="vertical"
//             initialValues={{
//               name: user.name,
//               email: user.email,
//               role: user.role,
//               phone: user.phone,
//               address: user.address,
//             }}
//           >
//             <Row gutter={[16, 16]}>
//               <Col span={24}>
//                 <Form.Item label="👤 Tên đăng nhập" name="name">
//                   <Input  />
//                 </Form.Item>
//               </Col>
//               <Col span={24}>
//                 <Form.Item label="📧 Email" name="email">
//                   <Input disabled />
//                 </Form.Item>
//               </Col>
//               <Col span={24}>
//                 <Form.Item label="🔰 Vai trò" name="role">
//                   <Input disabled />
//                 </Form.Item>
//               </Col>
//               <Col span={24}>
//                 <Form.Item label="📞 Số điện thoại" name="phone">
//                   <Input  />
//                 </Form.Item>
//               </Col>
//               <Col span={24}>
//                 <Form.Item label="🏠 Địa chỉ" name="address">
//                   <Input  />
//                 </Form.Item>
//               </Col>
//             </Row>
//           </Form>
//         </Card>
//       ) : (
//         <Text
//           type="danger"
//           style={{ display: "block", textAlign: "center", marginTop: "20px" }}
//         >
//           ❌ Không tìm thấy thông tin người dùng.
//         </Text>
//       )}

//       <div style={{ textAlign: "center", marginTop: "30px" }}>
//         <Space>
//           {/* ✅ Nút quay lại về trang Gốc */}
//           <Button
//             type="primary"
//             onClick={() => navigate("/reset-password")}
//             style={{
//               padding: "12px 30px",
//               borderRadius: "5px",
//               fontSize: "16px",
//             }}
//           >
//             Đặt lại mật khẩu
//           </Button>
//         </Space>
//       </div>
//     </div>
//   );
// };

// export default Profile;












import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Typography, Row, Col, Space, Form, Input, Select, message, Skeleton } from "antd";
import API from "../../../services/api"; // Sử dụng API service

const { Title, Text } = Typography;
const { Option } = Select;

const Profile = () => {
  const [form] = Form.useForm(); // Form instance
  const [loading, setLoading] = useState(false); // Trạng thái cập nhật thông tin
  const [initialLoading, setInitialLoading] = useState(true); // Trạng thái tải thông tin ban đầu
  const navigate = useNavigate();

  // Hàm lấy thông tin người dùng từ API
  const fetchProfile = async () => {
    setInitialLoading(true); // Hiển thị trạng thái tải thông tin ban đầu
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("⚠ Bạn chưa đăng nhập.");
        navigate("/login");
        return;
      }

      const response = await API.put("/auth/profile", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { status, user, message: apiMessage } = response.data;
      if (status) {
        form.setFieldsValue(user); // Điền thông tin vào form
        message.success("✅ Hồ sơ người dùng đã được tải lên!");
      } else {
        message.error(apiMessage || "❌ Không thể tải hồ sơ!");
      }
    } catch (error) {
      message.error("❌ Có lỗi xảy ra khi tải thông tin hồ sơ.");
      console.error(error.response || error.message);
    } finally {
      setInitialLoading(false); // Kết thúc trạng thái tải
    }
  };

  // Hàm cập nhật thông tin người dùng
  const handleSave = async (values) => {
    setLoading(true); // Hiển thị trạng thái cập nhật thông tin
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("⚠ Bạn chưa đăng nhập.");
        navigate("/login");
        return;
      }

      const response = await API.put("/auth/profile", values, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { status, user, message: apiMessage } = response.data;
      if (status) {
        message.success("✅ Cập nhật hồ sơ thành công!");
        form.setFieldsValue(user); // Cập nhật lại form với dữ liệu mới
      } else {
        message.error(apiMessage || "❌ Cập nhật hồ sơ thất bại!");
      }
    } catch (error) {
      message.error("❌ Có lỗi xảy ra khi cập nhật hồ sơ.");
      console.error(error.response || error.message);
    } finally {
      setLoading(false); // Kết thúc trạng thái cập nhật
    }
  };

  useEffect(() => {
    fetchProfile(); // Lấy thông tin người dùng khi component được mount
  }, []);

  return (
    <div style={{ padding: "30px", backgroundColor: "#f5f5f5" }}>
      <Title level={2} style={{ textAlign: "center", color: "#4a4a4a" }}>
        👤 Hồ sơ của tôi
      </Title>

      {initialLoading ? (
        <Card
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#fff",
          }}
        >
          <Skeleton active /> {/* Hiển thị Skeleton khi đang tải */}
        </Card>
      ) : (
        <Card
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#fff",
          }}
        >
          <Form
            layout="vertical"
            form={form}
            onFinish={(formData) => handleSave(formData)} // Gửi dữ liệu khi nhấn "Lưu thay đổi"
          >
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Form.Item
                  label="👤 Tên đăng nhập"
                  name="name"
                  rules={[{ required: true, message: "Tên không được để trống!" }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="📧 Email" name="email">
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="🔰 Vai trò"
                  name="role"
                  rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
                >
                  {/* Dropdown cho vai trò */}
                  <Select disabled >
                    <Option value="Admin">Admin</Option>
                    <Option value="Customer">Customer</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="📞 Số điện thoại" name="phone">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="🏠 Địa chỉ" name="address">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ marginTop: "20px" }}
            >
              Lưu thay đổi
            </Button>
          </Form>
        </Card>
      )}

      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <Space>
          <Button
            type="primary"
            onClick={() => navigate("/reset-password")}
            style={{
              padding: "12px 30px",
              borderRadius: "5px",
              fontSize: "16px",
            }}
          >
            Đặt lại mật khẩu
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default Profile;

