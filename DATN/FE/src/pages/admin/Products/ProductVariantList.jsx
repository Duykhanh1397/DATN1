import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  Image,
  Tag,
  Space,
  Input,
  message,
  Popconfirm,
  Select,
  Skeleton,
  Button,
  Drawer,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useState } from "react";
import API from "../../../services/api";
import ProductVariantEdit from "./ProductVariantEdit";

const ProductVariantList = () => {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(undefined);
  const [statusFilter, setStatusFilter] = useState(undefined);
  const [priceFilter, setPriceFilter] = useState("");
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  // Lấy danh sách product variants
  const { data, isLoading } = useQuery({
    queryKey: ["PRODUCT_VARIANTS_KEY"],
    queryFn: async () => {
      const { data } = await API.get("/admin/productvariants");
      return data.data.map((item, index) => {
        const imageUrl =
          item.images && item.images.length > 0
            ? item.images[0].image_url
            : null;

        return {
          key: item.id,
          stt: index + 1,
          productVariantId: item.id,
          image: imageUrl,
          name: item.product?.name,
          category: item.product?.category?.name,
          color: item.color?.value,
          storage: item.storage?.value,
          price: parseFloat(item.price),
          stock: item.stock,
          status: item.product?.status,
          productId: item.product_id,
        };
      });
    },
  });

  // Lấy danh sách categories
  const { data: categories } = useQuery({
    queryKey: ["CATEGORIES_KEY"],
    queryFn: async () => {
      const { data } = await API.get("/admin/categories");
      return data.data;
    },
  });

  // Xóa sản phẩm
  const { mutate } = useMutation({
    mutationFn: async (productVariantId) => {
      await API.delete(`/admin/productvariants/${productVariantId}/soft`);
    },
    onSuccess: () => {
      messageApi.success("Xóa sản phẩm thành công");
      queryClient.invalidateQueries({ queryKey: ["PRODUCT_VARIANTS_KEY"] });
    },
    onError: () => {
      messageApi.error("Không thể xóa sản phẩm!");
    },
  });

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
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
      title: "Sản phẩm",
      render: (_, item) => {
        return (
          <div>
            <div style={{ fontWeight: 500 }}>{item.name}</div>
            <div style={{ color: "#888" }}>
              Màu: {item.color} | Dung lượng: {item.storage}
            </div>
          </div>
        );
      },
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => {
        price ? `${Number(price).toLocaleString("vi-VN")} VNĐ` : "0 VNĐ";
      },
    },
    { title: "Số lượng", dataIndex: "stock", key: "stock" },
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
            title="Xóa sản phẩm"
            description="Bạn có chắc chắn muốn xóa không?"
            onConfirm={() => mutate(item.productId)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger size="small">
              <DeleteOutlined />
            </Button>
          </Popconfirm>
          <Button
            type="primary"
            onClick={() => {
              setCurrentProduct(item);
              setIsDrawerVisible(true);
            }}
            size="small"
          >
            <EditOutlined />
          </Button>
        </Space>
      ),
    },
  ];

  const filteredData = data?.filter((product) => {
    const matchesName = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter
      ? product.category === categoryFilter
      : true;
    const matchesStatus = statusFilter ? product.status === statusFilter : true;

    const price = Number(product.price);
    let matchesPrice = true;
    switch (priceFilter) {
      case "<1tr":
        matchesPrice = price < 1000000;
        break;
      case "1tr-10tr":
        matchesPrice = price >= 1000000 && price <= 10000000;
        break;
      case "10tr-20tr":
        matchesPrice = price > 10000000 && price <= 20000000;
        break;
      case "20tr-30tr":
        matchesPrice = price > 20000000 && price <= 30000000;
        break;
      case ">30tr":
        matchesPrice = price > 30000000;
        break;
      default:
        matchesPrice = true;
    }
    return matchesName && matchesCategory && matchesStatus && matchesPrice;
  });

  const onClose = () => {
    setCurrentProduct(null);
    setIsDrawerVisible(false);
    queryClient.invalidateQueries({ queryKey: ["PRODUCT_VARIANTS_KEY"] });
  };

  return (
    <div>
      {contextHolder}

      <div className="flex items-center justify-between mb-5">
        <h1 className="text-3xl font-semibold">Danh sách sản phẩm biến thể</h1>
      </div>

      <Space style={{ marginBottom: 20 }}>
        <Input
          placeholder="Tìm kiếm sản phẩm theo tên"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300 }}
        />

        <Select
          placeholder="Lọc theo giá"
          style={{ width: 200 }}
          value={priceFilter}
          onChange={setPriceFilter}
          allowClear
        >
          <Select.Option value="">Tất cả</Select.Option>
          <Select.Option value="<1tr">Dưới 1 triệu</Select.Option>
          <Select.Option value="1tr-10tr">1 triệu - 10 triệu</Select.Option>
          <Select.Option value="10tr-20tr">10 triệu - 20 triệu</Select.Option>
          <Select.Option value="20tr-30tr">20 triệu - 30 triệu</Select.Option>
          <Select.Option value=">30tr">Trên 30 triệu</Select.Option>
        </Select>

        <Select
          placeholder="Chọn danh mục"
          style={{ width: 200 }}
          value={categoryFilter}
          onChange={setCategoryFilter}
          allowClear
        >
          <Select.Option value={undefined}>Tất cả</Select.Option>
          {categories?.map((category) => (
            <Select.Option
              key={`category-${category.id}`}
              value={category.name}
            >
              {category.name}
            </Select.Option>
          ))}
        </Select>

        <Select
          placeholder="Chọn tình trạng"
          style={{ width: 200 }}
          value={statusFilter}
          onChange={setStatusFilter}
          allowClear
        >
          <Select.Option value={undefined}>Tất cả</Select.Option>
          <Select.Option value="Hoạt động">Hoạt động</Select.Option>
          <Select.Option value="Ngưng hoạt động">Ngưng hoạt động</Select.Option>
        </Select>
      </Space>

      <Skeleton loading={isLoading} active>
        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey={(record) => record.key}
          locale={{ emptyText: "Không có sản phẩm nào phù hợp!" }}
          scroll={{ x: "max-content" }}
        />
      </Skeleton>

      <Drawer
        title="Cập nhật sản phẩm"
        width={800}
        placement="right"
        onClose={onClose}
        open={isDrawerVisible}
        style={{ padding: 0, height: "100%" }}
        styles={{ body: { padding: 20, height: "100%" } }}
      >
        <div style={{ height: "100%", overflowY: "auto", padding: "20px" }}>
          {currentProduct && (
            <ProductVariantEdit
              product={currentProduct}
              categories={categories}
              onClose={onClose}
            />
          )}
        </div>
      </Drawer>
    </div>
  );
};

export default ProductVariantList;
