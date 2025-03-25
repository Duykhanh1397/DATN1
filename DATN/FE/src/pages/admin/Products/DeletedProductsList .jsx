import React from "react";
import { Table, Button, Space } from "antd";
import {
  useRestoreProduct,
  useTrashedProducts,
} from "../../../services/product";

const DeletedProductsList = () => {
  const { data: products, isLoading } = useTrashedProducts();
  const restoreProduct = useRestoreProduct();

  const columns = [
    { title: "Tên sản phẩm", dataIndex: "name", key: "name" },
    { title: "Danh mục", dataIndex: ["category", "name"], key: "category" },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (img) => <img src={img} alt="product" width={50} />,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => restoreProduct.mutate(record.id)}
          >
            Khôi phục
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={products}
      loading={isLoading}
      rowKey="id"
    />
  );
};

export default DeletedProductsList;
