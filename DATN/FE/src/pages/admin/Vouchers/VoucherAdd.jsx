// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { Button, Form, Input, message, Select, DatePicker } from "antd";
// import React from "react";
// import API from "../../../services/api";

// const VoucherAdd = () => {
//   const [messageApi, contextHolder] = message.useMessage();
//   const queryClient = useQueryClient();
//   const [form] = Form.useForm();

//   const { mutate } = useMutation({
//     mutationFn: async (formData) => {
//       await API.post("/admin/vouchers", formData);
//     },
//     onSuccess: () => {
//       messageApi.success("Thêm voucher mới thành công");
//       queryClient.invalidateQueries({ queryKey: ["VOUCHERS_KEY"] });
//       form.resetFields();
//     },
//     onError: (error) => {
//       const res = error.response?.data;
//       if (res?.errors) {
//         // Hiển thị lỗi vào từng field của Form Ant Design
//         const fieldErrors = Object.entries(res.errors).map(
//           ([field, messages]) => ({
//             name: field,
//             errors: messages,
//           })
//         );
//         form.setFields(fieldErrors);
//       } else {
//         messageApi.error("Có lỗi xảy ra: " + error.message);
//       }
//     },
//   });

//   return (
//     <div>
//       {contextHolder}
//       <h1 className="text-3xl font-semibold mb-5">Thêm mới voucher</h1>
//       <Form
//         form={form}
//         layout="vertical"
//         onFinish={(values) => {
//           const formattedValues = {
//             ...values,
//             start_date: values.start_date
//               ? values.start_date.format("YYYY-MM-DD HH:mm:ss")
//               : null,
//             end_date: values.end_date
//               ? values.end_date.format("YYYY-MM-DD HH:mm:ss")
//               : null,
//           };
//           console.log("Dữ liệu gửi lên: ", formattedValues);
//           mutate(formattedValues);
//         }}
//       >
//         <Form.Item
//           label="Mã voucher"
//           name="code"
//           rules={[
//             { required: true, message: "Vui lòng nhập mã voucher" },
//             { min: 3, message: "Mã ít nhất 3 ký tự" },
//           ]}
//         >
//           <Input />
//         </Form.Item>
//         <Form.Item
//           label="Loại giảm giá"
//           name="discount_type"
//           rules={[{ required: true, message: "Vui lòng chọn loại giảm giá" }]}
//         >
//           <Select>
//             <Select.Option value="percentage">Phần trăm</Select.Option>
//             <Select.Option value="fixed">Giảm giá cố định</Select.Option>
//           </Select>
//         </Form.Item>
//         <Form.Item
//           label="Giá trị giảm giá"
//           name="discount_value"
//           rules={[
//             { required: true, message: "Vui lòng nhập giá trị giảm giá" },
//           ]}
//         >
//           <Input type="number" />
//         </Form.Item>
//         <Form.Item label="Giá trị đơn hàng tối thiểu" name="min_order_value">
//           <Input type="number" />
//         </Form.Item>
//         <Form.Item label="Giảm giá tối đa" name="max_discount">
//           <Input type="number" />
//         </Form.Item>
//         <Form.Item
//           label="Giới hạn sử dụng"
//           name="usage_limit"
//           rules={[
//             { required: true, message: "Vui lòng nhập số lượng sử dụng" },
//           ]}
//         >
//           <Input type="number" />
//         </Form.Item>
//         <Form.Item
//           label="Ngày bắt đầu"
//           name="start_date"
//           rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu" }]}
//         >
//           <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
//         </Form.Item>
//         <Form.Item
//           label="Ngày kết thúc"
//           name="end_date"
//           rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc" }]}
//         >
//           <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
//         </Form.Item>
//         <Form.Item
//           label="Tình trạng"
//           name="status"
//           rules={[
//             { required: true, message: "Vui lòng chọn tình trạng voucher" },
//           ]}
//         >
//           <Select>
//             <Select.Option value="Hoạt động">Hoạt động</Select.Option>
//             <Select.Option value="Ngưng hoạt động">
//               Ngưng hoạt động
//             </Select.Option>
//           </Select>
//         </Form.Item>
//         <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
//           <Button type="primary" htmlType="submit">
//             Thêm voucher
//           </Button>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };

// export default VoucherAdd;

// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//   Button,
//   Form,
//   Input,
//   message,
//   Select,
//   DatePicker,
//   InputNumber,
// } from "antd";
// import React from "react";
// import API from "../../../services/api";
// import dayjs from "dayjs";

// const VoucherAdd = () => {
//   const [messageApi, contextHolder] = message.useMessage();
//   const queryClient = useQueryClient();
//   const [form] = Form.useForm();

//   const { mutate, isLoading } = useMutation({
//     mutationFn: async (formData) => {
//       await API.post("/admin/vouchers", formData);
//     },
//     onSuccess: () => {
//       messageApi.success("Thêm voucher mới thành công");
//       queryClient.invalidateQueries({ queryKey: ["VOUCHERS_KEY"] });
//       form.resetFields();
//     },
//     onError: (error) => {
//       const res = error.response?.data;
//       if (res?.errors) {
//         const fieldErrors = Object.entries(res.errors).map(
//           ([field, messages]) => ({
//             name: field,
//             errors: messages,
//           })
//         );
//         form.setFields(fieldErrors);

//         const firstErrorMessage = Object.values(res.errors).flat().join(", ");
//         messageApi.error(firstErrorMessage);
//       } else {
//         messageApi.error(res?.message || "Có lỗi xảy ra khi thêm voucher");
//       }
//     },
//   });

//   // Get the current discount_type value to determine validation and display
//   const discountType = Form.useWatch("discount_type", form);

//   return (
//     <div>
//       {contextHolder}
//       <h1 className="text-3xl font-semibold mb-5">Thêm mới voucher</h1>
//       <Form
//         form={form}
//         layout="vertical"
//         onFinish={(values) => {
//           const formattedValues = {
//             ...values,
//             discount_value: values.discount_value
//               ? Number(values.discount_value)
//               : null,
//             min_order_value: values.min_order_value
//               ? Number(values.min_order_value)
//               : null,
//             max_discount: values.max_discount
//               ? Number(values.max_discount)
//               : null,
//             usage_limit: values.usage_limit ? Number(values.usage_limit) : null,
//             start_date: values.start_date
//               ? dayjs(values.start_date).format("YYYY-MM-DD HH:mm:ss")
//               : null,
//             end_date: values.end_date
//               ? dayjs(values.end_date).format("YYYY-MM-DD HH:mm:ss")
//               : null,
//           };
//           console.log("Dữ liệu gửi lên: ", formattedValues);
//           mutate(formattedValues);
//         }}
//       >
//         <Form.Item
//           label="Mã voucher"
//           name="code"
//           rules={[
//             { required: true, message: "Vui lòng nhập mã voucher" },
//             { min: 3, message: "Mã ít nhất 3 ký tự" },
//             { max: 50, message: "Mã không được vượt quá 50 ký tự" },
//           ]}
//         >
//           <Input />
//         </Form.Item>
//         <Form.Item
//           label="Loại giảm giá"
//           name="discount_type"
//           rules={[{ required: true, message: "Vui lòng chọn loại giảm giá" }]}
//         >
//           <Select>
//             <Select.Option value="percentage">Phần trăm</Select.Option>
//             <Select.Option value="fixed">Giảm giá cố định</Select.Option>
//           </Select>
//         </Form.Item>
//         <Form.Item
//           label="Giá trị giảm giá"
//           name="discount_value"
//           rules={[
//             { required: true, message: "Vui lòng nhập giá trị giảm giá" },
//             {
//               validator: (_, value) => {
//                 const numValue = Number(value);
//                 if (isNaN(numValue) || numValue <= 0) {
//                   return Promise.reject(
//                     new Error("Giá trị giảm giá phải lớn hơn 0")
//                   );
//                 }
//                 if (discountType === "percentage" && numValue > 100) {
//                   return Promise.reject(
//                     new Error("Giá trị giảm giá không được vượt quá 100%")
//                   );
//                 }
//                 return Promise.resolve();
//               },
//             },
//           ]}
//         >
//           <InputNumber
//             min={1}
//             step={1}
//             style={{ width: "100%" }}
//             formatter={(value) =>
//               discountType === "percentage" ? `${value}%` : `${value} VNĐ`
//             }
//             parser={(value) =>
//               discountType === "percentage"
//                 ? value.replace("%", "")
//                 : value.replace(" VNĐ", "")
//             }
//           />
//         </Form.Item>
//         <Form.Item
//           label="Giá trị đơn hàng tối thiểu"
//           name="min_order_value"
//           rules={[
//             {
//               required: true,
//               message: "Vui lòng nhập giá trị đơn hàng tối thiểu",
//             },
//             {
//               validator: (_, value) => {
//                 if (value) {
//                   const numValue = Number(value);
//                   if (isNaN(numValue) || numValue < 0) {
//                     return Promise.reject(
//                       new Error(
//                         "Giá trị đơn hàng tối thiểu không được nhỏ hơn 0"
//                       )
//                     );
//                   }
//                 }
//                 return Promise.resolve();
//               },
//             },
//           ]}
//         >
//           <InputNumber
//             min={0}
//             step={1}
//             style={{ width: "100%" }}
//             formatter={(value) => `${value} VNĐ`}
//             parser={(value) => value.replace(" VNĐ", "")}
//           />
//         </Form.Item>
//         <Form.Item
//           label="Giảm giá tối đa"
//           name="max_discount"
//           rules={[
//             { required: true, message: "Vui lòng giá giảm tối đa" },
//             {
//               validator: (_, value) => {
//                 if (value) {
//                   const numValue = Number(value);
//                   if (isNaN(numValue) || numValue < 0) {
//                     return Promise.reject(
//                       new Error("Giá trị giảm giá tối đa không được nhỏ hơn 0")
//                     );
//                   }
//                 }
//                 return Promise.resolve();
//               },
//             },
//           ]}
//         >
//           <InputNumber
//             min={0}
//             step={1}
//             style={{ width: "100%" }}
//             formatter={(value) => `${value} VNĐ`}
//             parser={(value) => value.replace(" VNĐ", "")}
//           />
//         </Form.Item>
//         <Form.Item
//           label="Giới hạn sử dụng"
//           name="usage_limit"
//           rules={[
//             { required: true, message: "Vui lòng nhập số lượng sử dụng" },
//             {
//               validator: (_, value) => {
//                 const numValue = Number(value);
//                 if (isNaN(numValue) || numValue < 1) {
//                   return Promise.reject(
//                     new Error("Giới hạn sử dụng phải lớn hơn hoặc bằng 1")
//                   );
//                 }
//                 return Promise.resolve();
//               },
//             },
//           ]}
//         >
//           <InputNumber min={1} step={1} style={{ width: "100%" }} />
//         </Form.Item>
//         <Form.Item
//           label="Ngày bắt đầu"
//           name="start_date"
//           rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu" }]}
//         >
//           <DatePicker
//             format="YYYY-MM-DD HH:mm:ss"
//             showTime
//             style={{ width: "100%" }}
//           />
//         </Form.Item>
//         <Form.Item
//           label="Ngày kết thúc"
//           name="end_date"
//           rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc" }]}
//         >
//           <DatePicker
//             format="YYYY-MM-DD HH:mm:ss"
//             showTime
//             style={{ width: "100%" }}
//             disabledDate={(current) =>
//               current && current < dayjs(form.getFieldValue("start_date"))
//             }
//           />
//         </Form.Item>
//         <Form.Item
//           label="Tình trạng"
//           name="status"
//           rules={[
//             { required: true, message: "Vui lòng chọn tình trạng voucher" },
//           ]}
//         >
//           <Select>
//             <Select.Option value="Hoạt động">Hoạt động</Select.Option>
//             <Select.Option value="Ngưng hoạt động">
//               Ngưng hoạt động
//             </Select.Option>
//           </Select>
//         </Form.Item>
//         <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
//           <Button type="primary" htmlType="submit" loading={isLoading}>
//             Thêm voucher
//           </Button>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };

// export default VoucherAdd;


















import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Form,
  Input,
  message,
  Select,
  DatePicker,
  InputNumber,
} from "antd";
import React from "react";
import API from "../../../services/api";
import dayjs from "dayjs";

const VoucherAdd = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const { mutate, isLoading } = useMutation({
    mutationFn: async (formData) => {
      await API.post("/admin/vouchers", formData);
    },
    onSuccess: () => {
      messageApi.success("Thêm voucher mới thành công");
      queryClient.invalidateQueries({ queryKey: ["VOUCHERS_KEY"] });
      form.resetFields();
    },
    onError: (error) => {
      const res = error.response?.data;
      if (res?.errors) {
        const fieldErrors = Object.entries(res.errors).map(
          ([field, messages]) => ({
            name: field,
            errors: messages,
          })
        );
        form.setFields(fieldErrors);

        const firstErrorMessage = Object.values(res.errors).flat().join(", ");
        messageApi.error(firstErrorMessage);
      } else {
        messageApi.error(res?.message || "Có lỗi xảy ra khi thêm voucher");
      }
    },
  });

  // Theo dõi giá trị discount_type
  const discountType = Form.useWatch("discount_type", form);

  return (
    <div>
      {contextHolder}
      <h1 className="text-3xl font-semibold mb-5">Thêm mới voucher</h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          const formattedValues = {
            ...values,
            discount_value: values.discount_value
              ? Number(values.discount_value)
              : null,
            min_order_value: values.min_order_value
              ? Number(values.min_order_value)
              : null,
            max_discount: discountType === "percentage" && values.max_discount
              ? Number(values.max_discount)
              : null, // Chỉ gửi max_discount nếu discount_type là percentage
            usage_limit: values.usage_limit ? Number(values.usage_limit) : null,
            start_date: values.start_date
              ? dayjs(values.start_date).format("YYYY-MM-DD HH:mm:ss")
              : null,
            end_date: values.end_date
              ? dayjs(values.end_date).format("YYYY-MM-DD HH:mm:ss")
              : null,
          };
          console.log("Dữ liệu gửi lên: ", formattedValues);
          mutate(formattedValues);
        }}
      >
        <Form.Item
          label="Mã voucher"
          name="code"
          rules={[
            { required: true, message: "Vui lòng nhập mã voucher" },
            { min: 3, message: "Mã ít nhất 3 ký tự" },
            { max: 50, message: "Mã không được vượt quá 50 ký tự" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Loại giảm giá"
          name="discount_type"
          rules={[{ required: true, message: "Vui lòng chọn loại giảm giá" }]}
        >
          <Select>
            <Select.Option value="percentage">Phần trăm</Select.Option>
            <Select.Option value="fixed">Giảm giá cố định</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Giá trị giảm giá"
          name="discount_value"
          rules={[
            { required: true, message: "Vui lòng nhập giá trị giảm giá" },
            {
              validator: (_, value) => {
                const numValue = Number(value);
                if (isNaN(numValue) || numValue <= 0) {
                  return Promise.reject(
                    new Error("Giá trị giảm giá phải lớn hơn 0")
                  );
                }
                if (discountType === "percentage" && numValue > 100) {
                  return Promise.reject(
                    new Error("Giá trị giảm giá không được vượt quá 100%")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber
            min={1}
            step={1}
            style={{ width: "100%" }}
            formatter={(value) =>
              discountType === "percentage" ? `${value}%` : `${value} VNĐ`
            }
            parser={(value) =>
              discountType === "percentage"
                ? value.replace("%", "")
                : value.replace(" VNĐ", "")
            }
          />
        </Form.Item>
        <Form.Item
          label="Giá trị đơn hàng tối thiểu"
          name="min_order_value"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập giá trị đơn hàng tối thiểu",
            },
            {
              validator: (_, value) => {
                if (value) {
                  const numValue = Number(value);
                  if (isNaN(numValue) || numValue < 0) {
                    return Promise.reject(
                      new Error(
                        "Giá trị đơn hàng tối thiểu không được nhỏ hơn 0"
                      )
                    );
                  }
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber
            min={0}
            step={1}
            style={{ width: "100%" }}
            formatter={(value) => `${value} VNĐ`}
            parser={(value) => value.replace(" VNĐ", "")}
          />
        </Form.Item>
        {discountType === "percentage" && (
          <Form.Item
            label="Giảm giá tối đa"
            name="max_discount"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập giá trị giảm giá tối đa",
              },
              {
                validator: (_, value) => {
                  if (value) {
                    const numValue = Number(value);
                    if (isNaN(numValue) || numValue < 0) {
                      return Promise.reject(
                        new Error("Giá trị giảm giá tối đa không được nhỏ hơn 0")
                      );
                    }
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber
              min={0}
              step={1}
              style={{ width: "100%" }}
              formatter={(value) => `${value} VNĐ`}
              parser={(value) => value.replace(" VNĐ", "")}
            />
          </Form.Item>
        )}
        <Form.Item
          label="Giới hạn sử dụng"
          name="usage_limit"
          rules={[
            { required: true, message: "Vui lòng nhập số lượng sử dụng" },
            {
              validator: (_, value) => {
                const numValue = Number(value);
                if (isNaN(numValue) || numValue < 1) {
                  return Promise.reject(
                    new Error("Giới hạn sử dụng phải lớn hơn hoặc bằng 1")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber min={1} step={1} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Ngày bắt đầu"
          name="start_date"
          rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu" }]}
        >
          <DatePicker
            format="YYYY-MM-DD HH:mm:ss"
            showTime
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          label="Ngày kết thúc"
          name="end_date"
          rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc" }]}
        >
          <DatePicker
            format="YYYY-MM-DD HH:mm:ss"
            showTime
            style={{ width: "100%" }}
            disabledDate={(current) =>
              current && current < dayjs(form.getFieldValue("start_date"))
            }
          />
        </Form.Item>
        <Form.Item
          label="Tình trạng"
          name="status"
          rules={[
            { required: true, message: "Vui lòng chọn tình trạng voucher" },
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
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Thêm voucher
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default VoucherAdd;