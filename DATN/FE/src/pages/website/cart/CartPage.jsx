import { DeleteOutlined } from "@ant-design/icons";
import {
  Button,
  Popconfirm,
  Table,
  Tag,
  Image,
  message,
  InputNumber,
} from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../../../services/api";

const CartPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // Lấy danh sách giỏ hàng
  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ["CART_ITEM"],
    queryFn: async () => {
      const { data } = await API.get("/cart/items");
      console.log("Fetched cart:", data);
      return data.data.map((item, index) => ({
        ...item,
        key: item.cart_item_id, // Khóa chính trong bảng
        stt: index + 1,
      }));
    },
  });

  // Cập nhật số lượng
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ cart_item_id, quantity }) => {
      // API update quantity
      const res = await API.put(`/cart/items/${cart_item_id}`, { quantity });
      return res.data;
    },
    onSuccess: () => {
      messageApi.success("Cập nhật số lượng thành công");
      queryClient.invalidateQueries(["CART_ITEM"]);
    },
    onError: () => {
      messageApi.error("Cập nhật số lượng thất bại");
    },
  });

  // Tăng số lượng
  const increaseQuantityMutation = useMutation({
    mutationFn: async (cart_item_id) => {
      const res = await API.put(`/cart/items/${cart_item_id}/increase`);
      return res.data;
    },
    onSuccess: () => {
      messageApi.success("Tăng số lượng thành công");
      queryClient.invalidateQueries(["CART_ITEM"]);
    },
    onError: () => {
      messageApi.error("Tăng số lượng thất bại");
    },
  });

  // Giảm số lượng
  const decreaseQuantityMutation = useMutation({
    mutationFn: async (cart_item_id) => {
      const res = await API.put(`/cart/items/${cart_item_id}/decrease`);
      return res.data;
    },
    onSuccess: () => {
      messageApi.success("Giảm số lượng thành công");
      queryClient.invalidateQueries(["CART_ITEM"]);
    },
    onError: () => {
      messageApi.error("Giảm số lượng thất bại");
    },
  });

  // Xóa sản phẩm
  const removeItemMutation = useMutation({
    mutationFn: async (cart_item_id) => {
      await API.delete(`/cart/items/${cart_item_id}`);
    },
    onSuccess: () => {
      messageApi.success("Xóa sản phẩm thành công");
      queryClient.invalidateQueries(["CART_ITEM"]);
    },
    onError: () => {
      messageApi.error("Xóa sản phẩm thất bại");
    },
  });

  // Xóa tất cả sản phẩm
  const removeAllMutation = useMutation({
    mutationFn: async () => {
      await Promise.all(
        cartItems.map((item) => API.delete(`/cart/items/${item.cart_item_id}`))
      );
    },
    onSuccess: () => {
      messageApi.success("Xóa toàn bộ giỏ hàng thành công");
      queryClient.invalidateQueries(["CART_ITEM"]);
    },
    onError: () => {
      messageApi.error("Xóa toàn bộ thất bại");
    },
  });

  //Tạo đơn hàng
  const order_items = cartItems
    .filter((item) => selectedRowKeys.includes(item.cart_item_id))
    .map((item) => ({
      product_variant_id: item.product_variant?.id,
      quantity: item.quantity,
    }));
  console.log(order_items);
  const createOrderMutation = useMutation({
    mutationFn: async (orderData) => {
      const res = await API.post("/orders", orderData);
      return res.data;
    },
    onSuccess: (data) => {
      messageApi.success("Đặt hàng thành công!");
      queryClient.invalidateQueries(["CART_ITEM"]);
      navigate(`/order/${data.order_id}`);
    },
    onError: () => {
      messageApi.error("Đặt hàng thất bại. Vui lòng thử lại!");
    },
  });

  // Tính tổng tiền các sản phẩm được chọn
  const selectedTotalPrice = cartItems
    .filter((item) => selectedRowKeys.includes(item.cart_item_id))
    .reduce((acc, item) => acc + item.total_price, 0);

  // Xử lý chọn từng item
  const handleSelect = (id) => {
    setSelectedRowKeys((prev) =>
      prev.includes(id) ? prev.filter((key) => key !== id) : [...prev, id]
    );
  };

  // Xử lý chọn tất cả
  const handleSelectAll = () => {
    if (selectedRowKeys.length === cartItems.length) {
      setSelectedRowKeys([]);
    } else {
      setSelectedRowKeys(cartItems.map((item) => item.cart_item_id));
    }
  };

  // Cột bảng
  const columns = [
    {
      title: "",
      dataIndex: "checkbox",
      render: (_, item) => (
        <input
          type="checkbox"
          checked={selectedRowKeys.includes(item.cart_item_id)}
          onChange={() => handleSelect(item.cart_item_id)}
        />
      ),
    },
    {
      title: "HÌNH ẢNH",
      dataIndex: "product_variant.image",
      key: "image",
      render: (_, item) => (
        <Image width={80} src={item.product_variant.image} />
      ),
    },
    {
      title: "TÊN SẢN PHẨM",
      dataIndex: "product_variant.name",
      key: "name",
      render: (_, item) => (
        <>
          <div className="fw-semibold">{item.product_variant.name}</div>
          <div className="text-muted">
            Màu: {item.product_variant.color} | Dung lượng:
            {item.product_variant.storage}
          </div>
        </>
      ),
    },
    {
      title: "GIÁ SẢN PHẨM",
      dataIndex: "product_variant.price",
      key: "price",
      render: (_, item) => (
        <Tag color="green">
          {Number(item.product_variant.price).toLocaleString("vi-VN")} VNĐ
        </Tag>
      ),
    },
    {
      title: "SỐ LƯỢNG",
      dataIndex: "quantity",
      key: "quantity",
      render: (_, item) => {
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
            {item.quantity === 1 ? (
              <Popconfirm
                title="Xóa sản phẩm"
                onConfirm={() =>
                  decreaseQuantityMutation.mutate(item.cart_item_id)
                }
              >
                <Button
                  danger
                  size="small"
                  style={{ width: "28px", height: "28px" }}
                >
                  -
                </Button>
              </Popconfirm>
            ) : (
              <Button
                onClick={() =>
                  decreaseQuantityMutation.mutate(item.cart_item_id)
                }
                size="small"
                style={{ width: "28px", height: "28px" }}
              >
                -
              </Button>
            )}

            <InputNumber
              controls={false}
              min={1}
              max={item.product_variant.stock}
              value={item.quantity}
              onChange={(value) => {
                if (value !== item.quantity && value !== null) {
                  updateQuantityMutation.mutate({
                    cart_item_id: item.cart_item_id,
                    quantity: value,
                  });
                }
              }}
              style={{ width: "50px", height: "28px" }}
            />

            <Button
              onClick={() => increaseQuantityMutation.mutate(item.cart_item_id)}
              disabled={item.quantity >= item.product_variant.stock}
              size="small"
              style={{
                width: "28px",
                height: "28px",
                cursor:
                  item.quantity >= item.product_variant.stock
                    ? "not-allowed"
                    : "pointer",
                opacity: item.quantity >= item.product_variant.stock ? 0.5 : 1,
              }}
            >
              +
            </Button>
          </div>
        );
      },
    },
    {
      title: "TỔNG GIÁ",
      key: "total_price",
      render: (_, item) => (
        <Tag color="blue">
          {Number(item.total_price).toLocaleString("vi-VN")} VNĐ
        </Tag>
      ),
    },
    {
      title: "THAO TÁC",
      key: "action",
      render: (_, item) => (
        <Popconfirm
          title="Xóa sản phẩm"
          description="Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?"
          onConfirm={() => removeItemMutation.mutate(item.cart_item_id)}
          okText="Có"
          cancelText="Không"
        >
          <Button danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];
  if (isLoading) {
    return <div className="text-center">Đang tải...</div>;
  }
  return (
    <div className="container p-5 w-100">
      {contextHolder}
      <h1 className="fs-3 fw-semibold mb-4">Giỏ hàng của bạn</h1>

      <Table
        dataSource={cartItems}
        columns={columns}
        rowKey="cart_item_id"
        pagination={false}
        footer={() => (
          <div className="d-flex justify-content-between align-items-center">
            <label className="d-flex align-items-center">
              <input
                type="checkbox"
                checked={selectedRowKeys.length === cartItems.length}
                onChange={handleSelectAll}
                className="form-check-input me-2"
              />
              <span className="fs-5">Chọn tất cả</span>
            </label>

            <Popconfirm
              title="Xóa toàn bộ giỏ hàng?"
              onConfirm={() => removeAllMutation.mutate()}
              okText="Có"
              cancelText="Không"
            >
              <Button type="primary" danger size="large">
                Xóa toàn bộ
              </Button>
            </Popconfirm>
          </div>
        )}
      />

      <div className="d-flex justify-content-end mt-4">
        <div
          className="border p-4 rounded shadow-sm"
          style={{ backgroundColor: "#fff", width: "35%" }}
        >
          <div className="d-flex justify-content-between border-bottom pb-3">
            <h3 className="fs-5">Tổng tiền: </h3>
            <h3 className="fs-4 fw-bold text-muted">
              {selectedTotalPrice.toLocaleString("vi-VN")} đ
            </h3>
          </div>

          <div className="mt-3 d-flex justify-content-between gap-2 ">
            <Button
              onClick={() => navigate("/")}
              type="default"
              style={{ width: "40%" }}
              size="large"
            >
              Tiếp tục mua sắm
            </Button>
            <Button
              type="primary"
              disabled={selectedRowKeys.length === 0}
              danger
              size="large"
              onClick={() => {
                console.log("order_items gửi đi", order_items);
                createOrderMutation.mutate({
                  order_items: order_items,
                });
              }}
              style={{ width: "40%" }}
            >
              Thanh toán
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
