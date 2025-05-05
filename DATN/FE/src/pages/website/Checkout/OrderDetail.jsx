import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Table, Button, Image, Space, Card, message, Input, Rate } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import API from "../../../services/api";
import { DoubleLeftOutlined } from "@ant-design/icons";

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["ORDER_DETAIL", orderId],
    queryFn: async () => {
      const response = await API.get(`/orders/${orderId}`);
      return response.data.data;
    },
    onError: (error) => {
      messageApi.error(
        error?.response?.data?.message || "Không thể tải thông tin đơn hàng"
      );
    },
  });

  const { mutate: submitReview } = useMutation({
    mutationFn: async ({ productVariantId, rating, comment }) => {
      const response = await API.post(`/reviews/variant/${productVariantId}`, {
        order_id: Number(orderId),
        rating,
        comment,
      });
      return response.data;
    },
    onSuccess: (_, { productVariantId }) => {
      messageApi.success("Đánh giá sản phẩm thành công");
      setRatings((prev) => ({ ...prev, [productVariantId]: 0 }));
      setComments((prev) => ({ ...prev, [productVariantId]: "" }));
      refetch();
    },
    onError: (error) => {
      console.log("Lỗi từ BE:", error.response?.data);
      messageApi.error(
        error?.response?.data?.message || "Đã có lỗi xảy ra khi gửi đánh giá."
      );
    },
  });

  useEffect(() => {
    if (data) {
      setOrder(data);
    }
  }, [data]);

  const { mutate: updateOrderStatus, isPending } = useMutation({
    mutationFn: async ({ orderId, status }) => {
      const res = await API.put(`/orders/${orderId}/update-status`, { status });
      return res.data;
    },
    onSuccess: () => {
      messageApi.success("Hủy đơn hàng thành công!");
      queryClient.invalidateQueries(["ORDER_DETAIL"]);
      setTimeout(() => {
        navigate("/my-order?status=Hủy đơn");
      }, 3000);
    },
  });

  if (isLoading)
    return <div className="text-center">Đang tải chi tiết đơn hàng...</div>;
  if (isError)
    return (
      <div className="text-center">Không thể tải đơn hàng: {error.message}</div>
    );

  const calculateSubtotal = () => {
    if (order?.order_items) {
      return order.order_items.reduce((sum, item) => {
        const price = item.product_variant?.price || 0;
        return sum + price * item.quantity;
      }, 0);
    }
    return 0;
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    if (order?.voucher) {
      if (order.voucher.discount_type === "percentage") {
        const discount = Math.min(
          (subtotal * order.voucher.discount_value) / 100,
          order.voucher.max_discount || Infinity
        );
        return `${discount.toLocaleString("vi-VN")} VNĐ (Giảm ${
          order.voucher.discount_value
        }% - Tối đa ${
          order.voucher.max_discount
            ? order.voucher.max_discount.toLocaleString("vi-VN")
            : "0 VNĐ"
        })`;
      } else if (order.voucher.discount_type === "fixed") {
        return `${Number(order.voucher.discount_value).toLocaleString(
          "vi-VN"
        )} VNĐ`;
      }
    }
    return "0 VNĐ";
  };

  const calculateFinalTotal = () => {
    const subtotal = calculateSubtotal();
    let discount = 0;

    if (order?.voucher) {
      if (order.voucher.discount_type === "percentage") {
        discount = Math.min(
          (subtotal * order.voucher.discount_value) / 100,
          order.voucher.max_discount || Infinity
        );
      } else if (order.voucher.discount_type === "fixed") {
        discount = order.voucher.discount_value || 0;
      }
    }

    return subtotal - discount + (order?.shipping_fee || 0);
  };

  const columns = [
    {
      title: "Ảnh",
      render: (_, item) => {
        const imageUrl = item.product_variant?.images?.[0]?.image_url || null;
        return (
          <Image
            width={50}
            height={50}
            src={imageUrl}
            fallback="/images/placeholder.png"
            loading="lazy"
          />
        );
      },
    },
    {
      title: "Sản phẩm",
      render: (_, item) => {
        const product = item.product_variant?.product;
        const productName = product ? product.name : "Không có tên";
        const variantColor =
          item.product_variant?.color?.value || "Không có màu";
        const variantStorage =
          item.product_variant?.storage?.value || "Không có dung lượng";
        return (
          <div>
            <div style={{ fontWeight: 500 }}>{productName}</div>
            <div style={{ color: "#888" }}>
              Màu: {variantColor} - Dung lượng: {variantStorage}
            </div>
          </div>
        );
      },
    },
    {
      title: "Giá",
      render: (_, item) => {
        const price = item.product_variant?.price;
        return price ? `${Number(price).toLocaleString("vi-VN")} VNĐ` : "0 VNĐ";
      },
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
    },
    {
      title: "Tổng",
      render: (_, item) => {
        const price = item.product_variant?.price || 0;
        const total = price * item.quantity;
        return `${total.toLocaleString("vi-VN")} VNĐ`;
      },
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

  const getPaymentStatusColor = (paymentStatus) => {
    switch (paymentStatus) {
      case "Thanh toán thành công":
        return "green";
      case "Chờ thanh toán":
        return "cyan";
      case "Thanh toán thất bại":
        return "red";
      default:
        return "gray";
    }
  };

  return (
    <div className="container p-5 w-100">
      {contextHolder}
      <Card>
        <h2 className="text-3xl font-semibold">
          Chi tiết đơn hàng (#{order?.order_code})
        </h2>
        <div>
          <div>
            <h4>Thông tin nhận hàng:</h4>
            <p>
              Họ và Tên: {order?.user?.name || "Khách vãng lai"} - SĐT:{" "}
              {order?.phone_number ||
                order?.user?.phone ||
                "Không có số điện thoại"}
            </p>
            <p>
              Địa chỉ:{" "}
              {order?.address || order?.user?.address || "Không có địa chỉ"}
            </p>
            <p>
              <strong>Ngày đặt hàng: </strong>
              {new Date(order?.created_at).toLocaleDateString()}
            </p>
          </div>

          <h4>Thông tin sản phẩm:</h4>
          <Table
            columns={columns}
            dataSource={order?.order_items}
            rowKey="id"
            pagination={false}
          />

          <Space
            style={{
              marginTop: 10,
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <h5 style={{ color: "#2ecc71" }}>Tổng tiền gốc:</h5>
            <h5 style={{ color: "#2ecc71" }}>
              {calculateSubtotal().toLocaleString("vi-VN")} VNĐ
            </h5>
          </Space>

          <Space
            style={{
              marginTop: 10,
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <h5 style={{ color: "#e67e22" }}>Phí vận chuyển:</h5>
            <h5 style={{ color: "#e67e22" }}>
              {order?.shipping_fee
                ? `${Number(order.shipping_fee).toLocaleString("vi-VN")} VNĐ`
                : "0 VNĐ"}
            </h5>
          </Space>

          <Space
            style={{
              marginTop: 10,
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <h5 style={{ color: "#3498db" }}>
              Voucher ({order?.voucher?.code || "Không có"}):
            </h5>
            <h5 style={{ color: "#3498db" }}>- {calculateDiscount()}</h5>
          </Space>

          <Space
            style={{
              marginTop: 10,
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <h5 style={{ color: "#e74c3c", fontWeight: "bold" }}>
              Thành tiền:
            </h5>
            <h5 style={{ color: "#e74c3c", fontWeight: "bold" }}>
              {order?.total_amount
                ? `${Number(order.total_amount).toLocaleString("vi-VN")} VNĐ`
                : "0 VNĐ"}
            </h5>
          </Space>

          <Space
            style={{
              marginTop: 10,
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <h5 style={{ color: "#3498db" }}>Loại thanh toán:</h5>
            <h5 style={{ color: "#3498db" }}>
              {order?.payment?.payment_method || "_"}
            </h5>
          </Space>
          <Space
            style={{
              marginTop: 10,
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <h5 style={{ color: "#f1c40f " }}>Trạng thái đơn hàng:</h5>
            <h5
              style={{
                color: getStatusColor(order?.status),
                fontWeight: "bold",
              }}
            >
              {order?.status || "Chưa có thông tin trạng thái"}
            </h5>
          </Space>
          <Space
            style={{
              marginTop: 10,
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <h5>Trạng thái thanh toán:</h5>
            <h5
              style={{
                color: getPaymentStatusColor(order?.payment?.payment_status),
                fontWeight: "bold",
              }}
            >
              {order?.payment?.payment_status || "Chưa có thông tin trạng thái"}
            </h5>
          </Space>

          {order?.status === "Giao hàng thành công" && (
            <div style={{ marginTop: 20 }}>
              <h4>Đánh giá sản phẩm:</h4>
              {order?.order_items?.map((item) => {
                const productVariantId = item.product_variant?.id;
                const productName =
                  item.product_variant?.product?.name || "Không có tên";
                const variantColor =
                  item.product_variant?.color?.value || "Không có màu";
                const variantStorage =
                  item.product_variant?.storage?.value || "Không có dung lượng";

                if (!productVariantId) {
                  console.log(
                    "Không tìm thấy productVariantId cho item:",
                    item
                  );
                  return null;
                }

                const review = order?.reviews?.find(
                  (r) => r.product_variant_id === productVariantId
                );

                return (
                  <div key={item.id} style={{ marginBottom: 20 }}>
                    <h5
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      {productName}
                      <span
                        style={{
                          fontSize: "14px",
                          color: "#888",
                          fontWeight: "normal",
                        }}
                      >
                        ({variantColor}, {variantStorage})
                      </span>
                    </h5>
                    {review ? (
                      <div>
                        <Rate disabled value={review.rating} />
                        <p style={{ marginTop: 10 }}>
                          {review.comment || "Không có nhận xét"}
                        </p>
                      </div>
                    ) : (
                      <>
                        <Rate
                          onChange={(value) =>
                            setRatings((prev) => ({
                              ...prev,
                              [productVariantId]: value,
                            }))
                          }
                          value={ratings[productVariantId] || 0}
                        />
                        <Input.TextArea
                          rows={4}
                          placeholder="Nhập nhận xét của bạn"
                          value={comments[productVariantId] || ""}
                          onChange={(e) =>
                            setComments((prev) => ({
                              ...prev,
                              [productVariantId]: e.target.value,
                            }))
                          }
                          style={{ marginTop: 10 }}
                        />
                        <Button
                          type="primary"
                          onClick={() => handleReviewSubmit(productVariantId)}
                          style={{ marginTop: 10 }}
                        >
                          Gửi đánh giá
                        </Button>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {order?.status === "Chờ xác nhận" && (
            <div style={{ marginTop: 20 }}>
              <Button
                danger
                loading={isPending}
                onClick={() =>
                  updateOrderStatus({ orderId: order.id, status: "Hủy đơn" })
                }
              >
                Hủy đơn hàng
              </Button>
            </div>
          )}

          <div style={{ marginTop: 30 }}>
            <Link to="/my-order">
              <Button type="dashed">
                <DoubleLeftOutlined />
                Quay lại
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OrderDetails;
