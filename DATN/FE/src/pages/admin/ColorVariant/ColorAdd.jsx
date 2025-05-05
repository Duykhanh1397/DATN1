// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { Button, Form, Input, message } from "antd";
// import React from "react";
// import API from "../../../services/api";

// const ColorAdd = () => {
//   const [messageApi, contextHolder] = message.useMessage();
//   const queryClient = useQueryClient();
//   const [form] = Form.useForm();

//   const { mutate } = useMutation({
//     mutationFn: async (formData) => {
//       await API.post(`/admin/variantcolor`, formData);
//     },
//     onSuccess: () => {
//       messageApi.success("Thêm màu sắc mới thành công");
//       queryClient.invalidateQueries({ queryKey: ["COLOR_KEY"] });
//       form.resetFields();
//     },
//     onError: (error) => {
//       messageApi.error("Có lỗi xảy ra: " + error.message);
//     },
//   });

//   return (
//     <div>
//       {contextHolder}
//       <h1 className="mb-5">Thêm mới màu sắc</h1>
//       <Form
//         form={form}
//         layout="vertical"
//         onFinish={(formData) => mutate(formData)}
//       >
//         <Form.Item
//           label="Tên màu"
//           name="value"
//           rules={[{ required: true, message: "Vui lòng nhập tên màu" }]}
//         >
//           <Input />
//         </Form.Item>
//         <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
//           <Button type="primary" htmlType="submit">
//             Thêm màu sắc
//           </Button>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };

// export default ColorAdd;






import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, message } from "antd";
import React from "react";
import API from "../../../services/api";

const ColorAdd = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const { mutate } = useMutation({
    mutationFn: async (formData) => {
      await API.post(`/admin/variantcolor`, formData);
    },
    onSuccess: () => {
      messageApi.success("Thêm màu sắc mới thành công");
      queryClient.invalidateQueries({ queryKey: ["COLOR_KEY"] });
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

  return (
    <div>
      {contextHolder}
      <h1 className="mb-5">Thêm mới màu sắc</h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={(formData) => mutate(formData)}
      >
        <Form.Item
          label="Tên màu"
          name="value"
          rules={[{ required: true, message: "Vui lòng nhập tên màu" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Thêm màu sắc
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ColorAdd;