import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, message, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import React from "react";
import API from "../../../services/api";

const CategoryAdd = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const { mutate } = useMutation({
    mutationFn: async (formData) => {
      await API.post(`/admin/categories`, formData);
    },
    onSuccess: () => {
      messageApi.success("Thêm danh mục mới thành công");
      queryClient.invalidateQueries({ queryKey: ["CATEGORIES_KEY"] });
      form.resetFields();
    },
    onError: (error) => {
      messageApi.error("Thêm danh mục thất bại: " + error.message);
    },
  });

  return (
    <div>
      {contextHolder}
      <h1 className="text-3xl font-semibold mb-5">Thêm mới danh mục</h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={(formData) => mutate(formData)}
      >
        <Form.Item
          label="Tên danh mục"
          name="name"
          rules={[
            { required: true, message: "Vui lòng nhập tên danh mục" },
            { min: 3, message: "Tên ít nhất 3 ký tự" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Mô tả" name="description">
          <TextArea />
        </Form.Item>
        <Form.Item
          label="Tình trạng"
          name="status"
          rules={[
            { required: true, message: "Vui lòng chọn tình trạng danh mục" },
          ]}
        >
          <Select>
            <Select.Option value="Hoạt động">Hoạt động</Select.Option>
            <Select.Option value="Ngưng hoạt động">
              Ngưng hoạt động
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CategoryAdd;
