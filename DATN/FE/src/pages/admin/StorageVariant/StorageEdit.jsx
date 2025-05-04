// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { Button, Form, Input, message, Skeleton } from "antd";
// import React from "react";
// import { useForm } from "antd/es/form/Form";
// import API from "../../../services/api";

// const StorageEdit = ({ storage }) => {
//   const [form] = useForm();
//   const queryClient = useQueryClient();
//   const [messageApi, contextHolder] = message.useMessage();

//   // Hiển thị Skeleton nếu storage chưa được tải
//   if (!storage) return <Skeleton active />;

//   const { mutate } = useMutation({
//     mutationFn: async (formData) => {
//       await API.put(`/admin/variantstorage/${storage.id}`, formData);
//     },
//     onSuccess: () => {
//       messageApi.success("Cập nhật dung lượng thành công");
//       queryClient.invalidateQueries({ queryKey: ["STORAGE_KEY"] });
//       form.resetFields();
//     },
//     onError: (error) => {
//       messageApi.error("Có lỗi xảy ra: " + error.message);
//     },
//   });

//   return (
//     <div>
//       {contextHolder}
//       <h1 className="mb-5">Cập nhật dung lượng</h1>
//       <Form
//         form={form}
//         initialValues={{ ...storage }}
//         name="basic"
//         layout="vertical"
//         onFinish={(formData) => {
//           mutate(formData);
//         }}
//       >
//         <Form.Item
//           label="Dung lượng"
//           name="value"
//           rules={[{ required: true, message: "Vui lòng nhập dung lượng" }]}
//         >
//           <Input />
//         </Form.Item>
//         <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
//           <Button type="primary" htmlType="submit">
//             Cập nhật
//           </Button>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };

// export default StorageEdit;















import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, message, Skeleton } from "antd";
import React from "react";
import { useForm } from "antd/es/form/Form";
import API from "../../../services/api";

const StorageEdit = ({ storage }) => {
  const [form] = useForm();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  if (!storage) return <Skeleton active />;

  const { mutate } = useMutation({
    mutationFn: async (formData) => {
      const response = await API.put(`/admin/variantstorage/${storage.id}`, formData);
      return response.data;
    },
    onSuccess: (responseData) => {
      const updatedStorage = responseData.data;
      console.log("Dữ liệu mới từ backend:", updatedStorage);

      form.setFieldsValue({
        value: updatedStorage.value,
      });

      messageApi.success("Cập nhật dung lượng thành công");
      queryClient.invalidateQueries({ queryKey: ["STORAGE_KEY"] });
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
      <h1 className="mb-5">Cập nhật dung lượng</h1>
      <Form
        form={form}
        initialValues={{ ...storage }}
        name="basic"
        layout="vertical"
        onFinish={(formData) => {
          console.log("Dữ liệu gửi đi:", formData);
          mutate(formData);
        }}
      >
        <Form.Item
          label="Dung lượng"
          name="value"
          rules={[{ required: true, message: "Vui lòng nhập dung lượng" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default StorageEdit;