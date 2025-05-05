import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, message, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useState } from "react";
import API from "../../../services/api";

const CategoryAdd = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

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
      const errorMessage = error.response?.data?.message || "Có lỗi xảy ra";
      const errorDetails = error.response?.data?.errors;
      messageApi.error(errorMessage);

      if (errorDetails) {
        Object.values(errorDetails).forEach((errorArray) => {
          errorArray.forEach((errorMsg) => {
            messageApi.error(errorMsg);
          });
        });
      }
    },
  });

  const checkCategoryName = async (name) => {
    try {
      const { data } = await API.get(
        `/admin/categories/check-name?name=${name}`
      );
      if (data.exists) {
        messageApi.warning("Tên danh mục đã tồn tại, vui lòng chọn tên khác!");
        return Promise.reject("Tên danh mục đã tồn tại.");
      }
      return Promise.resolve();
    } catch (error) {
      messageApi.error("Có lỗi xảy ra khi kiểm tra tên danh mục.");
      return Promise.reject("Có lỗi xảy ra khi kiểm tra tên danh mục.");
    }
  };

  const handleSubmit = (formData) => {
    setLoading(true);
    mutate(formData);
    setLoading(false);
  };

  return (
    <div>
      {contextHolder}
      <h1 className="mb-5">Thêm mới danh mục</h1>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Tên danh mục"
          name="name"
          rules={[
            { required: true, message: "Vui lòng nhập tên danh mục" },
            { min: 3, message: "Tên ít nhất 3 ký tự" },
            { validator: (_, value) => checkCategoryName(value) },
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
          <Button type="primary" htmlType="submit" loading={loading}>
            Thêm danh mục
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CategoryAdd;
