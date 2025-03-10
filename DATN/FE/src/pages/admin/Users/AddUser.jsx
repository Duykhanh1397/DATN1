// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../../../services/api";

// const AddUser = () => {
//   const navigate = useNavigate();
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("Customer");
//   const [error, setError] = useState("");
//   const [message, setMessage] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setMessage("");

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setError("Bạn chưa đăng nhập.");
//         return;
//       }

//       const { data } = await API.post(
//         "/admin/users",
//         { name, email, password, role },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (data.message) {
//         setMessage("Tạo user thành công! Đang chuyển hướng...");
//         setTimeout(() => navigate("/admin/users"), 2000);
//       }
//     } catch (error) {
//       console.error("Lỗi tạo user:", error);
//       setError(error.response?.data?.message || "Không thể tạo user.");
//     }
//   };

//   return (
//     <div>
//       <h2>Thêm User</h2>
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       {message && <p style={{ color: "green" }}>{message}</p>}

//       <form onSubmit={handleSubmit}>
//         <input type="text" placeholder="Tên" value={name} onChange={(e) => setName(e.target.value)} required />
//         <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
//         <input type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} required />
//         <select value={role} onChange={(e) => setRole(e.target.value)}>
//           <option value="Customer">Customer</option>
//           <option value="Admin">Admin</option>
//         </select>
//         <button type="submit">Thêm User</button>
//       </form>

//       <button onClick={() => navigate("/admin/users")} style={{ marginTop: "10px" }}>
//         Quay lại danh sách
//       </button>
//     </div>
//   );
// };

// export default AddUser;

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, message, Select } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api";

const AddUser = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [error, setError] = useState("");

  const { mutate } = useMutation({
    mutationFn: async (formData) => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Bạn chưa đăng nhập.");

      await API.post("/admin/users", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      messageApi.success("Thêm người dùng mới thành công!");
      queryClient.invalidateQueries({ queryKey: ["USERS_KEY"] });
      form.resetFields();
      setTimeout(() => navigate("/admin/users"), 2000);
    },
    onError: (error) => {
      setError(error.response?.data?.message || "Không thể tạo user.");
    },
  });

  return (
    <div>
      {contextHolder}
      <h1 className="text-3xl font-semibold mb-5">Thêm mới người dùng</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <Form
        form={form}
        name="user-form"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={(formData) => mutate(formData)}
      >
        <Form.Item
          label="Tên người dùng"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên người dùng" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item label="Số điện thoại" name="phone">
          <Input />
        </Form.Item>
        <Form.Item label="Địa chỉ" name="address">
          <Input />
        </Form.Item>
        <Form.Item
          label="Vai trò"
          name="role"
          initialValue="Customer"
          rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
        >
          <Select>
            <Select.Option value="Admin">Admin</Select.Option>
            <Select.Option value="Customer">Customer</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Trạng thái"
          name="status"
          initialValue="Hoạt động"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
        >
          <Select>
            <Select.Option value="Hoạt động">Hoạt động</Select.Option>
            <Select.Option value="Không hoạt động">
              Không hoạt động
            </Select.Option>
          </Select>
        </Form.Item>
        <hr style={{ borderTop: "2px dashed #444", marginTop: "20px" }} />
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Thêm người dùng
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddUser;
