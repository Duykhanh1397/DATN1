import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  Tag,
  Space,
  message,
  Popconfirm,
  Skeleton,
  Button,
  Image,
} from "antd";
import { DeleteOutlined, UndoOutlined } from "@ant-design/icons";

import API from "../../../services/api";

const SoftDeleteProducts = () => {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  const { data, isLoading } = useQuery({
    queryKey: ["TRASHED_PRODUCTS_KEY"],
    queryFn: async () => {
      const { data } = await API.get("/admin/products/trashed");
      console.log("Dữ liệu API:", data);
      return data.data.map((item, index) => {
        const imageUrl = item.image
          ? item.image.startsWith("/storage/")
            ? `http://localhost:8000${item.image}`
            : `http://localhost:8000/storage/${item.image}`
          : null;

        return {
          key: item.id,
          id: item.id,
          stt: index + 1,
          name: item.name,
          image: imageUrl,
          price: item.price,
          description: item.description,
          category: item.category?.name || "",
          status: item.status,
        };
      });
    },
  });

  const { mutate: restoreProduct } = useMutation({
    mutationFn: async (id) => {
      await API.put(`/admin/products/${id}/restore`);
    },
    onSuccess: () => {
      messageApi.success("Khôi phục sản phẩm thành công");
      queryClient.invalidateQueries({ queryKey: ["TRASHED_PRODUCTS_KEY"] });
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Có lỗi xảy ra khi khôi phục sản phẩm";
      messageApi.error(errorMessage);
    },
  });

  const { mutate: forceDelete } = useMutation({
    mutationFn: async (id) => {
      await API.delete(`/admin/products/${id}/force-delete`);
    },
    onSuccess: () => {
      messageApi.success("Xóa sản phẩm thành công");
      queryClient.invalidateQueries({ queryKey: ["TRASHED_PRODUCTS_KEY"] });
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Có lỗi xảy ra khi xóa vĩnh viễn sản phẩm";
      messageApi.error(errorMessage);
    },
  });

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: 60,
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <Image width={50} src={image} fallback="/images/placeholder.png" />
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => (price ? `${price.toLocaleString()}  VNĐ` : "0  VNĐ"),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (description) => description || "-",
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      render: (category) => (
        <Tag color="blue">{category || "Không có danh mục"}</Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status?.trim() === "Hoạt động" ? "#52C41A" : "#BFBFBF"}>
          {status || "-"}
        </Tag>
      ),
    },
    {
      key: "action",
      align: "center",
      render: (_, item) => (
        <Space>
          <Popconfirm
            title="Khôi phục sản phẩm"
            description="Bạn có chắc chắn muốn khôi phục không?"
            onConfirm={() => restoreProduct(item.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="primary" size="small">
              <UndoOutlined />
            </Button>
          </Popconfirm>
          <Popconfirm
            title="Xóa vĩnh viễn"
            description="Bạn có chắc chắn muốn xóa vĩnh viễn không?"
            onConfirm={() => forceDelete(item.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger size="small">
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {contextHolder}
      <div className="mb-5">
        <h1>Danh sách sản phẩm xóa mềm</h1>
      </div>

      <Skeleton loading={isLoading} active>
        <Table
          dataSource={data}
          columns={columns}
          rowKey={(record) => record.key}
          scroll={{ x: "max-content" }}
        />
      </Skeleton>
    </div>
  );
};

export default SoftDeleteProducts;
