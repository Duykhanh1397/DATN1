import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import {
  Table,
  Form,
  Input,
  Select,
  Image,
  Skeleton,
  Button,
  message,
  Row,
  Col,
  Tag,
} from "antd";
import API from "../../../services/api";
import { DoubleLeftOutlined } from "@ant-design/icons";

const OrderDetail = () => {
  const { orderId } = useParams();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  // Format tiền
  const formatCurrency = (value) =>
    `${Number(value).toLocaleString("vi-VN")} VNĐ`;

  // Hàm đổi màu trạng thái thanh toán
  const getPaymentTagColor = (status) => {
    switch (status) {
      case "Thanh toán thành công":
        return "green";
      case "Thanh toán thất bại":
        return "red";
      case "Chờ thanh toán":
      default:
        return "orange";
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["ORDER_ITEM", orderId],
    queryFn: async () => {
      const { data } = await API.get(`/orders/${orderId}`);
      return data.data;
    },
    enabled: !!orderId,
  });

  const { mutate, isLoading: isUpdating } = useMutation({
    mutationFn: async (status) => {
      try {
        const response = await API.put(
          `/admin/orders/${orderId}/update-status`,
          { status }
        );
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
    onSuccess: (data) => {
      messageApi.success(data.message || "Cập nhật trạng thái thành công!");
      queryClient.invalidateQueries(["ORDER_ITEM", orderId]);
    },
    onError: (error) => {
      messageApi.error(
        error?.message || "Có lỗi xảy ra trong quá trình cập nhật trạng thái."
      );
    },
  });

  const user = data?.user;
  const paymentStatus = data?.payment?.payment_status ?? "Chờ thanh toán";

  const columns = [
    {
      title: "Ảnh",
      render: (_, item) => {
        const image = item.product_variant?.images?.[0]?.image_url || null;
        return (
          <Image
            width={50}
            height={50}
            src={image}
            fallback="/images/placeholder.png"
          />
        );
      },
    },
    {
      title: "Sản phẩm",
      render: (_, item) => {
        const productName = item.product_variant?.product?.name || "-";
        const variantColor = item.product_variant?.color?.value || "-";
        const variantStorage = item.product_variant?.storage?.value || "-";
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
      render: (_, item) => formatCurrency(item.product_variant?.price || 0),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
    },
    {
      title: "Tổng",
      render: (_, item) =>
        formatCurrency((item.product_variant?.price || 0) * item.quantity),
    },
  ];

  if (isLoading) return <div>Đang tải ...</div>;

  const handleFinish = (values) => {
    const { status } = values;

    if (["Giao hàng thành công", "Hủy đơn"].includes(data?.status)) {
      messageApi.warning(
        "Đơn hàng đã hoàn tất hoặc đã hủy, không thể cập nhật!"
      );
      return;
    }

    mutate(status);
  };

  return (
    <div>
      {contextHolder}
      <h1 className="mb-5">Chi tiết đơn hàng - {data.order_code}</h1>

      <Row gutter={24}>
        <Col span={10}>
          <Form
            form={form}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            colon={false}
            style={{ width: "100%" }}
            initialValues={{
              status: data?.status,
            }}
            onFinish={handleFinish}
          >
            <Form.Item label="Tên người nhận">
              <span>{user?.name || "Khách"}</span>
            </Form.Item>
            <Form.Item label="Số điện thoại">
              <span>
                {data?.phone_number || user?.phone || "Chưa cập nhật"}
              </span>
            </Form.Item>
            <Form.Item label="Địa chỉ">
              <span>{data?.address || user?.address || "Chưa cập nhật"}</span>
            </Form.Item>

            <Form.Item
              label="Trạng thái đơn hàng"
              name="status"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
            >
              <Select>
                <Select.Option value="Chờ xác nhận">Chờ xác nhận</Select.Option>
                <Select.Option value="Đã xác nhận">Đã xác nhận</Select.Option>
                <Select.Option value="Đang giao hàng">
                  Đang giao hàng
                </Select.Option>
                <Select.Option value="Giao hàng thành công">
                  Giao hàng thành công
                </Select.Option>
                <Select.Option value="Giao hàng thất bại">
                  Giao hàng thất bại
                </Select.Option>
                <Select.Option value="Hủy đơn">Hủy đơn</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Trạng thái thanh toán">
              <Tag color={getPaymentTagColor(paymentStatus)}>
                {paymentStatus}
              </Tag>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit" loading={isUpdating}>
                Cập nhật trạng thái
              </Button>
            </Form.Item>
          </Form>
        </Col>

        <Col span={14}>
          <Skeleton loading={isLoading} active style={{ marginBottom: 50 }}>
            <Table
              dataSource={data?.order_items || []}
              columns={columns}
              rowKey="id"
              pagination={false}
            />
          </Skeleton>
        </Col>
      </Row>

      <div style={{ marginTop: 30 }}>
        <Link to="/admin/orders">
          <Button type="dashed">
            <DoubleLeftOutlined />
            Quay lại
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderDetail;
