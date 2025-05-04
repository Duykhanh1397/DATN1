import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  Tag,
  Space,
  Input,
  message,
  Popconfirm,
  Select,
  Skeleton,
  Button,
  Drawer,
  Image,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import ProductEditPage from "./ProductEditPage";
import ProductAddPage from "./ProductAddPage";
import { useState } from "react";
import API from "../../../services/api";

const ProductList = () => {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(undefined);
  const [statusFilter, setStatusFilter] = useState(undefined);
  const [priceFilter, setPriceFilter] = useState("");
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  // Lấy danh sách sản phẩm (không lấy biến thể)
  const { data: products, isLoading } = useQuery({
    queryKey: ["PRODUCTS_KEY"],
    queryFn: async () => {
      const { data } = await API.get("/admin/products");
      console.log(data);

      return data.data.map((item, index) => {
        const imageUrl = item.image
          ? item.image.startsWith("/storage/")
            ? `http://localhost:8000${item.image}`
            : `http://localhost:8000/storage/${item.image}`
          : null;

        return {
          key: item.id,
          stt: index + 1,
          name: item.name,
          image: imageUrl,
          price: parseFloat(item.price),
          description: item.description,
          category: item.category?.name || "",
          status: item.status,
        };
      });
    },
  });

  // Lấy danh sách danh mục
  const { data: categories } = useQuery({
    queryKey: ["CATEGORIES_KEY"],
    queryFn: async () => {
      const { data } = await API.get("/admin/categories");
      return data.data;
    },
  });

  // Xóa sản phẩm
  const { mutate } = useMutation({
    mutationFn: async (key) => {
      await API.delete(`/admin/products/${key}/soft`);
    },
    onSuccess: () => {
      messageApi.success("Xóa sản phẩm thành công");
      queryClient.invalidateQueries({ queryKey: ["PRODUCTS_KEY"] });
    },
    onError: (error) => {
      messageApi.error("Có lỗi xảy ra: " + error.message);
    },
  });

  // Cấu hình các cột hiển thị cho bảng
  const columns = [
    {
      title: "#",
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
      width: 300,
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
            title="Xóa sản phẩm"
            description="Bạn có chắc chắn muốn xóa không?"
            onConfirm={() => mutate(item.key)}
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

  // Lọc sản phẩm theo tên và giá
  const filteredData = products?.filter((product) => {
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

  // Xử lý đóng Drawer
  const onClose = () => {
    setCurrentProduct(null);
    setIsDrawerVisible(false);
  };

  return (
    <div>
      {contextHolder}

      {/* Header */}
      <div className="mb-5">
        <h1>Quản lý sản phẩm</h1>
        <Button
          type="default"
          onClick={() => setIsDrawerVisible(true)}
          icon={<PlusCircleOutlined />}
        >
          Thêm sản phẩm
        </Button>
      </div>

      {/* Bộ lọc tìm kiếm */}
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

      {/* Bảng danh sách sản phẩm */}
      <Skeleton loading={isLoading} active>
        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey={(record) => record.key}
          scroll={{ x: "max-content" }}
        />
      </Skeleton>

      {/* Drawer thêm/cập nhật sản phẩm */}
      <Drawer
        title={currentProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
        width={800}
        placement="right"
        onClose={onClose}
        open={isDrawerVisible}
        styles={{ body: { padding: 20, height: "100%" } }}
      >
        <div style={{ height: "100%", overflowY: "auto", padding: "20px" }}>
          {currentProduct ? (
            <ProductEditPage
              product={currentProduct}
              categories={categories}
              onClose={onClose}
            />
          ) : (
            <ProductAddPage onClose={onClose} />
          )}
        </div>
      </Drawer>
    </div>
  );
};

export default ProductList;
