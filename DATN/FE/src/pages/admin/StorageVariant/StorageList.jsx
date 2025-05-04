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
  Space,
  Table,
  Skeleton,
} from "antd";
import React, { useState } from "react";
import { Drawer } from "antd";
import API from "../../../services/api";
import StorageEdit from "./StorageEdit";
import StorageAdd from "./StorageAdd";

const StorageList = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [currentStorage, setCurrentStorage] = useState();

  const { data, isLoading } = useQuery({
    queryKey: ["STORAGE_KEY"],
    queryFn: async () => {
      const { data } = await API.get("/admin/variantstorage");
      return data.data.map((item, index) => ({
        ...item,
        key: item.id,
        stt: index + 1,
      }));
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (id) => {
      await API.delete(`/admin/variantstorage/${id}/soft`);
    },
    onSuccess: () => {
      messageApi.success("Xóa dung lượng thành công");
      queryClient.invalidateQueries({ queryKey: ["STORAGE_KEY"] });
    },
    onError: (error) => {
      messageApi.error("Có lỗi xảy ra: " + error.message);
    },
  });

  // Các cột trong bảng
  const columns = [
    { title: "#", dataIndex: "stt", key: "stt" },
    {
      title: "Tên dung lượng",
      dataIndex: "value",
      key: "value",
    },
    {
      key: "action",
      align: "center",
      render: (_, item) => (
        <Space>
          <Popconfirm
            title="Xóa dung lượng"
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
              setCurrentStorage(item);
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

  // Lọc dữ liệu theo tên
  const filteredData = data?.filter((storage) => {
    const matchesName = storage.value
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesName;
  });

  // Mở Drawer để thêm dung lượng mới
  const showDrawer = () => setIsDrawerVisible(true);

  // Đóng Drawer
  const onClose = () => {
    setCurrentStorage(null); // Đặt lại khi đóng Drawer
    setIsDrawerVisible(false);
  };

  return (
    <div>
      {contextHolder}
      <div className="mb-5">
        <h1>Quản lý dung lượng</h1>
        <Button type="default" onClick={showDrawer}>
          <PlusCircleOutlined /> Thêm dung lượng
        </Button>
      </div>
      <Space style={{ marginBottom: 20 }}>
        <Input
          placeholder="Tìm kiếm dung lượng theo tên"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300 }}
        />
      </Space>
      <Skeleton loading={isLoading} active>
        <Table dataSource={filteredData} columns={columns} rowKey="id" />
      </Skeleton>
      {/* Drawer cho việc thêm dung lượng */}
      <Drawer
        title={currentStorage ? "Cập nhật dung lượng" : "Thêm dung lượng"}
        width={500}
        placement="right"
        onClose={onClose}
        open={isDrawerVisible}
        style={{ padding: 0, height: "100%" }}
        styles={{ body: { padding: 20, height: "100%" } }}
      >
        <div style={{ height: "100%", overflowY: "auto", padding: "20px" }}>
          {currentStorage ? (
            <StorageEdit storage={currentStorage} />
          ) : (
            <StorageAdd />
          )}
        </div>
      </Drawer>
    </div>
  );
};

export default StorageList;
