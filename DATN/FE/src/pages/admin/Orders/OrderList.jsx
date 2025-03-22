import React from "react";
import { Table, Tag, Button, Skeleton, Space } from "antd";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api";

const OrderList = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["ORDERS"],
    queryFn: async () => {
      const { data } = await API.get("/admin/orders");
      return data.data.data.map((item, index) => ({
        ...item,
        key: item.id,
        stt: index + 1,
      }));
    },
  });

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "order_code",
      key: "order_code",
    },
    {
      title: "Khách hàng",
      dataIndex: ["user", "name"],
      key: "user",
      render: (_, record) => record.user?.name || record.guest_user,
    },
    {
      title: "Tổng tiền",
      dataIndex: "total_amount",
      key: "total_amount",
      render: (total) => (total ? `${total.toLocaleString()}  VNĐ` : "0  VNĐ"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button onClick={() => navigate(`/admin/orders/${record.id}`)}>
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-3xl font-semibold">Quản lý đơn hàng</h1>
      </div>
      <Skeleton loading={isLoading} active>
        <Table rowKey="id" columns={columns} dataSource={data} />
      </Skeleton>
    </div>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case "Chưa xác nhận":
      return "orange";
    case "Đã xác nhận":
      return "blue";
    case "Đang giao hàng":
      return "cyan";
    case "Giao hàng thành công":
      return "green";
    case "Giao hàng thất bại":
      return "red";
    case "Hủy đơn":
      return "volcano";
    default:
      return "default";
  }
};

export default OrderList;
