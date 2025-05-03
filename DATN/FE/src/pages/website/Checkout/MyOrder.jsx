import React, { useState, useEffect } from "react";
import { Table, Tabs, Tag, Button, Image, Card } from "antd";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import API from "../../../services/api";

const MyOrder = () => {
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentTab, setCurrentTab] = useState("all");

  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["ORDERS"],
    queryFn: async () => {
      const { data } = await API.get("/orders");
      const ordersData = data.data.map((item, index) => ({
        ...item,
        key: item.id,
        stt: index + 1, // STT chỉ đơn giản là index cộng với 1
      }));

      return ordersData;
    },
  });

  // Cập nhật danh sách đơn hàng hiển thị khi dữ liệu thay đổi
  useEffect(() => {
    if (data) {
      let ordersToDisplay = data;
      if (currentTab !== "all") {
        ordersToDisplay = data.filter((order) => order.status === currentTab);
      }
      setFilteredOrders(ordersToDisplay);
    }
  }, [data, currentTab]);

  // Hàm xử lý thay đổi tab trạng thái
  const handleTabChange = (key) => {
    setCurrentTab(key);
  };

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

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: 60,
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "order_code",
      key: "order_code",
      render: (code) => <strong>{code}</strong>,
    },
    {
      title: "Sản phẩm",
      dataIndex: "order_items",
      key: "order_items",
      render: (orderItems) => {
        const firstItem = orderItems[0]; // Lấy sản phẩm đầu tiên trong order_items
        const product = firstItem.product_variant?.product;
        const productName = product ? product.name : "Không có tên";
        const variantColor =
          firstItem.product_variant?.color?.value || "Không có màu";
        const variantStorage =
          firstItem.product_variant?.storage?.value || "Không có dung lượng";
        const variantImage =
          firstItem.product_variant?.images[0]?.image_url ||
          "/images/placeholder.png";

        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Image
              width={50}
              height={50}
              src={variantImage}
              fallback="/images/placeholder.png"
              style={{ marginRight: 10 }}
            />
            <div>
              <div style={{ fontWeight: 500 }}>{productName}</div>
              <div style={{ color: "#888" }}>
                Màu: {variantColor} - Dung lượng: {variantStorage}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Tổng tiền",
      dataIndex: "total_amount",
      key: "total_amount",
      render: (amount) => `${parseInt(amount).toLocaleString()} VNĐ`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => navigate(`/my-order-detail/${record.id}`)}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className="container p-5 w-100">
      <Card>
        <h2 className="text-3xl font-semibold">Danh sách đơn hàng</h2>
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
        <Table
          loading={isLoading}
          columns={columns}
          dataSource={filteredOrders}
          rowKey="id"
          scroll={{ x: "max-content" }}
        />
      </Card>
    </div>
  );
};

export default MyOrder;
