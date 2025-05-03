import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, message, Select, Skeleton } from "antd";
import TextArea from "antd/es/input/TextArea";
import React from "react";
import { useForm } from "antd/es/form/Form";
import API from "../../../services/api";

const CategoryEdit = ({ category }) => {
  const [form] = useForm();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  if (!category) return <Skeleton active />;

  const { mutate } = useMutation({
    mutationFn: async (formData) => {
      const response = await API.put(
        `/admin/categories/${category.id}`,
        formData
      );
      return response.data;
    },
    onSuccess: (responseData) => {
      const updatedCategory = responseData.data;
      console.log("Dữ liệu mới từ backend:", updatedCategory);

      form.setFieldsValue({
        name: updatedCategory.name,
        description: updatedCategory.description,
        status: updatedCategory.status,
      });

      messageApi.success("Cập nhật danh mục thành công");
      queryClient.invalidateQueries({ queryKey: ["CATEGORIES_KEY"] });
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

  return (
    <div>
      {contextHolder}
      <h1 className="mb-5">Cập nhật danh mục</h1>
      <Form
        form={form}
        initialValues={{ ...category }}
        name="basic"
        layout="vertical"
        onFinish={(formData) => {
          console.log("Dữ liệu gửi đi:", formData);
          mutate(formData);
        }}
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

export default CategoryEdit;
