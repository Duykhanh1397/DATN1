import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, message, Select, Skeleton } from "antd";
import React from "react";
import { useForm } from "antd/es/form/Form";
import API from "../../../services/api";

const EditUser = ({ user }) => {
  const [form] = useForm();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  if (!user) return <Skeleton active />;

  const { mutate, isLoading } = useMutation({
    mutationFn: async (formData) => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Bạn chưa đăng nhập.");

      await API.put(`/admin/users/${user.id}`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      messageApi.success("Cập nhật người dùng thành công");
      queryClient.invalidateQueries({ queryKey: ["USERS_KEY"] });
    },
    onError: (error) => {
      messageApi.error("Có lỗi xảy ra: " + error.message);
    },
  });

  return (
    <div>
      {contextHolder}
      <h1 className="mb-5">Cập nhật người dùng</h1>
      <Form
        form={form}
        initialValues={{ ...user }}
        layout="vertical"
        onFinish={(formData) => {
          mutate({ status: formData.status, role: formData.role });
        }}
      >
        <Form.Item label="Tên người dùng" name="name">
          <Input disabled />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input type="email" disabled />
        </Form.Item>
        <Form.Item label="Số điện thoại" name="phone">
          <Input disabled />
        </Form.Item>
        <Form.Item label="Địa chỉ" name="address">
          <Input disabled />
        </Form.Item>

        <Form.Item label="Vai trò" name="role">
          <Select>
            <Select.Option value="Admin">Admin</Select.Option>
            <Select.Option value="Customer">Customer</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Trạng thái" name="status">
          <Select>
            <Select.Option value="Hoạt động">Hoạt động</Select.Option>
            <Select.Option value="Ngưng hoạt động">
              Ngưng hoạt động
            </Select.Option>
          </Select>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            {isLoading ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditUser;
