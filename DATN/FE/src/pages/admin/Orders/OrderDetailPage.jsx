import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import {
  Table,
  Card,
  Spin,
  Form,
  Input,
  Select,
  Image,
  Skeleton,
  Button,
  message,
  Row,
  Col,
} from "antd";
import API from "../../../services/api";
import { DoubleLeftOutlined } from "@ant-design/icons";

const OrderDetail = () => {
  const { orderId } = useParams();
  const queryClient = useQueryClient();
  const [form] = Form.useForm(); // lấy instance form
  const [messageApi, contextHolder] = message.useMessage();

  const { data, isLoading } = useQuery({
    queryKey: ["ORDER_ITEM", orderId],
    queryFn: async () => {
      const { data } = await API.get(`/orders/${orderId}`);
      console.log(data);
      return data.data;
    },
    enabled: !!orderId,
  });

  const { mutate, isLoading: isUpdating } = useMutation({
    mutationFn: async (status) => {
      return API.put(`/admin/orders/${orderId}/update-status`, { status });
    },

    onSuccess: () => {
      messageApi.success("Cập nhật trạng thái thành công!");
      queryClient.invalidateQueries(["ORDER_ITEM", orderId]);
    },
    onError: () => {
      messageApi.error("Cập nhật trạng thái thất bại:" + error.message);
    },
  });

  const paymentStatus = data?.payment_status;
  const user = data?.user;

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
        const productName =
          item.product_variant?.product?.name || "Không rõ sản phẩm";
        const variantColor =
          item.product_variant?.color?.value || "Không rõ màu";
        const variantStorage =
          item.product_variant?.storage?.value || "Không rõ dung lượng";

        return (
          <>
            <div className="fw-semibold">{productName}</div>
            <div className="text-muted">
              Màu: {variantColor} - Dung lượng: {variantStorage}
            </div>
          </>
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
      dataIndex: "total_price",
      render: (_, item) => {
        const price = item.product_variant?.price || 0;
        return `${(price * item.quantity).toLocaleString()} VNĐ` || "0 VNĐ";
      },
    },
  ];

  console.log("Trạng thái hiện tại:", data?.status);

  if (isLoading) return <div>Đang tải dữ liệu...</div>;

  const handleFinish = (values) => {
    console.log("Giá trị form:", values);
    const { status } = values;

    if (["Giao hàng thành công", "Hủy đơn"].includes(data?.status)) {
      message.warning("Đơn hàng đã hoàn tất hoặc đã hủy, không thể cập nhật!");
      return;
    }

    mutate(status);
  };

  return (
    <div>
      {contextHolder}
      <h1 className="text-3xl font-semibold mb-5">
        Chi tiết đơn hàng #{data.id}
      </h1>

      <Row gutter={24}>
        <Col span={8}>
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
              <Input
                value={user?.name || data?.name || "Chưa cập nhật"}
                readOnly
              />
            </Form.Item>
            <Form.Item label="Số điện thoại">
              <Input
                value={data?.phone_number || user?.phone || "Chưa cập nhật"}
                readOnly
              />
            </Form.Item>
            <Form.Item label="Địa chỉ">
              <Input
                value={data?.address || user?.address || "Chưa cập nhật"}
                readOnly
              />
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
              <Select value={paymentStatus} disabled>
                <Select.Option value="Đã thanh toán">
                  Đã thanh toán
                </Select.Option>
                <Select.Option value="Chưa thanh toán">
                  Chưa thanh toán
                </Select.Option>
              </Select>
            </Form.Item>

            {/* Nút submit để lưu */}
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit" loading={isUpdating}>
                Cập nhật trạng thái
              </Button>
            </Form.Item>
          </Form>
        </Col>

        <Col span={16}>
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
