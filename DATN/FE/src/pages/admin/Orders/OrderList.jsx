import React, { useEffect, useState } from "react";
import { Table, Tag, Button, Skeleton, Space, Tabs } from "antd";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api";

const OrderList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);

  const { data, isLoading } = useQuery({
    queryKey: ["ORDERS"],
    queryFn: async () => {
      const { data } = await API.get("/admin/orders");
      return data.data.map((item, index) => ({
        ...item,
        key: item.id,
        stt: index + 1,
      }));
    },
  });

  useEffect(() => {
    if (data) {
      setOrders(data);
      setFilteredOrders(data);
    }
  }, [data]);

  const handleTabChange = (key) => {
    if (key === "all") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((order) => order.status === key));
    }
  };

  const columns = [
    {
      title: "#",
      dataIndex: "stt",
      key: "stt",
    },
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
      render: (total, record) => {
        return total ? `${Number(total).toLocaleString("vi-VN")} VNĐ` : "0 VNĐ";
      },
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

  const getStatusColor = (status) => {
    switch (status) {
      case "Chờ xác nhận":
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
  return (
    <div>
      <div className="mb-5">
        <h1>Quản lý đơn hàng</h1>
      </div>
      <Tabs
        defaultActiveKey="all"
        onChange={handleTabChange}
        items={[
          "all",
          "Chờ xác nhận",
          "Đã xác nhận",
          "Đang giao hàng",
          "Giao hàng thành công",
          "Giao hàng thất bại",
          "Hủy đơn",
        ].map((status) => ({
          key: status,
          label: status === "all" ? "Tất cả" : status,
        }))}
      />
      <Skeleton loading={isLoading} active>
        <Table rowKey="id" columns={columns} dataSource={filteredOrders} />
      </Skeleton>
    </div>
  );
};

export default OrderList;
