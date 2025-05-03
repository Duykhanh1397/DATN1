import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Input,
  message,
  Popconfirm,
  Select,
  Skeleton,
  Space,
  Table,
  Tag,
} from "antd";
import React, { useState } from "react";
import { Drawer } from "antd";
import CategoryAddPage from "./CategoryAdd";
import CategoryEditPage from "./CategoryEdit";
import API from "../../../services/api";

const CategoryList = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [currentCategory, setCurrentCategory] = useState();
  const [categoryFilter, setCategoryFilter] = useState();

  const { data, isLoading } = useQuery({
    queryKey: ["CATEGORIES_KEY"],
    queryFn: async () => {
      const { data } = await API.get("/admin/categories");
      return data.data.map((item, index) => ({
        ...item,
        key: item.id,
        stt: index + 1,
      }));
    },
  });
  const { mutate } = useMutation({
    mutationFn: async (id) => {
      await API.delete(`/admin/categories/${id}/soft`);
    },
    onSuccess: () => {
      messageApi.success("Xóa danh mục thành công");
      queryClient.invalidateQueries({ queryKey: ["CATEGORIES_KEY"] });
    },
    onError: (error) => {
      messageApi.error("Có lỗi xảy ra: " + error.message);
    },
  });
  const columns = [
    { title: "#", dataIndex: "stt", key: "stt" },
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Tình trạng",
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
            title="Xóa danh mục"
            description="Bạn có chắc chắn muốn xóa không?"
            onConfirm={() => mutate(item.id)}
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
              setCurrentCategory(item);
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
  const filteredData = data?.filter((category) => {
    const matchesName = category.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter
      ? category.status === categoryFilter
      : true;
    return matchesName && matchesCategory;
  });

  // Mở Drawer để thêm sản phẩm mới
  const showDrawer = () => setIsDrawerVisible(true);

  // Đóng Drawer
  const onClose = () => {
    setCurrentCategory(null); // Đặt lại sản phẩm khi đóng Drawer
    setIsDrawerVisible(false);
  };
  return (
    <div>
      {contextHolder}
      <div className="mb-5">
        <h1>Quản lý danh mục</h1>
        <Button type="default" onClick={showDrawer}>
          <PlusCircleOutlined /> Thêm danh mục
        </Button>
      </div>
      <Space style={{ marginBottom: 20 }}>
        <Input
          placeholder="Tìm kiếm sản phẩm theo tên"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300 }}
        />
        <Select
          placeholder="Chọn tình trạng"
          style={{ width: 200 }}
          value={categoryFilter}
          onChange={setCategoryFilter}
        >
          <Select.Option value={null}>Tất cả</Select.Option>
          <Select.Option value="Hoạt động">Hoạt động</Select.Option>
          <Select.Option value="Ngưng hoạt động">Ngưng hoạt động</Select.Option>
        </Select>
      </Space>
      <Skeleton loading={isLoading} active>
        <Table dataSource={filteredData} columns={columns} rowKey="id" />
      </Skeleton>
      {/* Drawer cho việc thêm danh mục */}
      <Drawer
        title={currentCategory ? "Cập nhật danh mục" : "Thêm danh mục"}
        width={500}
        placement="right"
        onClose={onClose}
        open={isDrawerVisible}
        style={{ padding: 0, height: "100%" }}
        styles={{ body: { padding: 20, height: "100%" } }}
      >
        <div style={{ height: "100%", overflowY: "auto", padding: "20px" }}>
          {currentCategory ? (
            <CategoryEditPage category={currentCategory} />
          ) : (
            <CategoryAddPage />
          )}
        </div>
      </Drawer>
    </div>
  );
};

export default CategoryList;
