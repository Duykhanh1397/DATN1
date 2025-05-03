import { useQuery } from "@tanstack/react-query";
import { Form, Input, Select, Table, Image, Skeleton } from "antd";
import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const OrderEditPage = () => {
  const { id } = useParams();

  // Lấy dữ liệu đơn hàng
  const { data: order, isLoading } = useQuery({
    queryKey: ["ORDERS_KEY", id],
    queryFn: async () => {
      if (!id) return null;
      const { data } = await axios.get(`http://localhost:3000/orders/${id}`);
      return data;
    },
  });

  // Lấy thông tin người dùng
  const { data: user } = useQuery({
    queryKey: ["USER_DETAILS", order?.user_id],
    queryFn: async () => {
      if (!order?.user_id) return null;
      const { data } = await axios.get(
        `http://localhost:3000/users/${order.user_id}`
      );
      return data;
    },
    enabled: !!order?.user_id, // Chỉ chạy khi có user_id
  });

  // Lấy trạng thái thanh toán
  const { data: payment } = useQuery({
    queryKey: ["PAYMENT_STATUS", id],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:3000/payments?order_id=${id}`
      );
      return data.length ? data[0] : null;
    },
  });

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-5">Cập nhật đơn hàng</h1>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
      >
        <Form.Item label="Tên người nhận">
          <Input value={user?.name || order?.name || "-"} readOnly />
        </Form.Item>
        <Form.Item label="Số điện thoại">
          <Input value={order?.phone_number || user?.phone || "-"} readOnly />
        </Form.Item>
        <Form.Item label="Địa chỉ">
          <Input value={order?.address || user?.address || "-"} readOnly />
        </Form.Item>
        <Form.Item label="Trạng thái đơn hàng">
          <Select
            value={order?.status}
            disabled={["Hoàn thành", "Hủy"].includes(order?.status)}
          >
            <Select.Option value="Chờ xác nhận">Chờ xác nhận</Select.Option>
            <Select.Option value="Đang xử lý">Đã duyệt</Select.Option>
            <Select.Option value="Hoàn thành">Hoàn thành</Select.Option>
            <Select.Option value="Hủy">Hủy</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Trạng thái thanh toán">
          <Select value={payment?.payment_status} readOnly>
            <Select.Option value="Đã thanh toán">Đã thanh toán</Select.Option>
            <Select.Option value="Chưa thanh toán">
              Chưa thanh toán
            </Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </div>
  );
};

export default OrderEditPage;
