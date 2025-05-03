// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//   Button,
//   Form,
//   Input,
//   message,
//   Select,
//   DatePicker,
//   Skeleton,
// } from "antd";
// import React from "react";
// import API from "../../../services/api";
// import dayjs from "dayjs";

// const VoucherEdit = ({ voucher }) => {
//   const [form] = Form.useForm();
//   const queryClient = useQueryClient();
//   const [messageApi, contextHolder] = message.useMessage();

//   if (!voucher) return <Skeleton active />;

//   const { mutate, isLoading } = useMutation({
//     mutationFn: async (formData) => {
//       await API.put(`/admin/vouchers/${voucher.id}`, formData);
//     },
//     onSuccess: () => {
//       messageApi.success("Cập nhật voucher thành công");
//       queryClient.invalidateQueries({ queryKey: ["VOUCHERS_KEY"] });
//       form.resetFields();
//     },
//     onError: (error) => {
//       messageApi.error("Có lỗi xảy ra: " + error.message);
//     },
//   });

//   return (
//     <div>
//       {contextHolder}
//       <h1 className="text-3xl font-semibold mb-5">Cập nhật voucher</h1>
//       <Form
//         key={voucher?.id} // Reset form khi voucher thay đổi
//         form={form}
//         initialValues={{
//           ...voucher,
//           start_date: voucher.start_date ? dayjs(voucher.start_date) : null,
//           end_date: voucher.end_date ? dayjs(voucher.end_date) : null,
//         }}
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
//           mutate(formattedValues);
//         }}
//       >
//         <Form.Item
//           label="Mã voucher"
//           name="code"
//           rules={[{ required: true, message: "Vui lòng nhập mã voucher" }]}
//         >
//           <Input disabled />
//         </Form.Item>
//         <Form.Item
//           label="Loại giảm giá"
//           name="discount_type"
//           rules={[{ required: true, message: "Vui lòng chọn loại" }]}
//         >
//           <Select>
//             <Select.Option value="percentage">Phần trăm</Select.Option>
//             <Select.Option value="fixed">Giảm giá cố định</Select.Option>
//           </Select>
//         </Form.Item>
//         <Form.Item
//           label="Giá trị giảm giá"
//           name="discount_value"
//           rules={[{ required: true, message: "Vui lòng nhập giá trị" }]}
//         >
//           <Input type="number" />
//         </Form.Item>
//         <Form.Item label="Giá trị đơn hàng tối thiểu" name="min_order_value">
//           <Input type="number" />
//         </Form.Item>
//         <Form.Item label="Giảm giá tối đa" name="max_discount">
//           <Input type="number" />
//         </Form.Item>
//         <Form.Item label="Giới hạn sử dụng" name="usage_limit">
//           <Input type="number" />
//         </Form.Item>
//         <Form.Item
//           label="Ngày bắt đầu"
//           name="start_date"
//           rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
//         >
//           <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
//         </Form.Item>
//         <Form.Item
//           label="Ngày kết thúc"
//           name="end_date"
//           rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
//         >
//           <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
//         </Form.Item>
//         <Form.Item
//           label="Tình trạng"
//           name="status"
//           rules={[{ required: true, message: "Vui lòng chọn tình trạng" }]}
//         >
//           <Select>
//             <Select.Option value="Hoạt động">Hoạt động</Select.Option>
//             <Select.Option value="Ngưng hoạt động">
//               Ngưng hoạt động
//             </Select.Option>
//             <Select.Option value="Hết hạn">Hết hạn</Select.Option>
//           </Select>
//         </Form.Item>
//         <Form.Item>
//           <Button type="primary" htmlType="submit" loading={isLoading}>
//             Cập nhật voucher
//           </Button>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };

// export default VoucherEdit;

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Form,
  Input,
  message,
  Select,
  DatePicker,
  Skeleton,
  InputNumber,
} from "antd";
import React from "react";
import API from "../../../services/api";
import dayjs from "dayjs";

const VoucherEdit = ({ voucher }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  if (!voucher) return <Skeleton active />;

  const { mutate, isLoading } = useMutation({
    mutationFn: async (formData) => {
      await API.put(`/admin/vouchers/${voucher.id}`, formData);
    },
    onSuccess: () => {
      messageApi.success("Cập nhật voucher thành công");
      queryClient.invalidateQueries({ queryKey: ["VOUCHERS_KEY"] });
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
        messageApi.error(res?.message || "Có lỗi xảy ra khi cập nhật voucher");
      }
    },
  });

  // Get the current discount_type value to determine validation and display
  const discountType = Form.useWatch("discount_type", form);

  return (
    <div>
      {contextHolder}
      <h1 className="text-3xl font-semibold mb-5">Cập nhật voucher</h1>
      <Form
        key={voucher?.id}
        form={form}
        initialValues={{
          ...voucher,
          start_date: voucher.start_date ? dayjs(voucher.start_date) : null,
          end_date: voucher.end_date ? dayjs(voucher.end_date) : null,
        }}
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
            max_discount: values.max_discount
              ? Number(values.max_discount)
              : null,
            usage_limit: values.usage_limit ? Number(values.usage_limit) : null,
            start_date: values.start_date
              ? values.start_date.format("YYYY-MM-DD HH:mm:ss")
              : null,
            end_date: values.end_date
              ? values.end_date.format("YYYY-MM-DD HH:mm:ss")
              : null,
          };
          mutate(formattedValues);
        }}
      >
        <Form.Item
          label="Mã voucher"
          name="code"
          rules={[{ required: true, message: "Vui lòng nhập mã voucher" }]}
        >
          <Input disabled />
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
              discountType === "percentage" ? `${value}%` : `${value} VND`
            }
            parser={(value) =>
              discountType === "percentage"
                ? value.replace("%", "")
                : value.replace(" VND", "")
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
            formatter={(value) => `${value} VND`}
            parser={(value) => value.replace(" VND", "")}
          />
        </Form.Item>
        <Form.Item
          label="Giảm giá tối đa"
          name="max_discount"
          rules={[
            { required: true, message: "Vui lòng giá giảm tối đa" },
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
            formatter={(value) => `${value} VND`}
            parser={(value) => value.replace(" VND", "")}
          />
        </Form.Item>
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
            // Removed disabledDate to allow any date to be selected
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
          rules={[{ required: true, message: "Vui lòng chọn tình trạng" }]}
        >
          <Select>
            <Select.Option value="Hoạt động">Hoạt động</Select.Option>
            <Select.Option value="Ngưng hoạt động">
              Ngưng hoạt động
            </Select.Option>
            <Select.Option value="Hết hạn">Hết hạn</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Cập nhật voucher
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default VoucherEdit;
