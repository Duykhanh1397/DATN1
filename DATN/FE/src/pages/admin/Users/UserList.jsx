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
import API from "../../../services/api";
import EditUser from "./EditUser";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const UserList = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userFilter, setUserFilter] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["USERS_KEY"],
    queryFn: async () => {
      const response = await API.get("/admin/users");
      return (
        response.data?.data?.map((user, index) => ({
          ...user,
          key: user.id,
          stt: index + 1,
        })) || []
      );
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (id) => {
      await API.delete(`/admin/users/${id}/force-delete`);
    },
    onSuccess: () => {
      messageApi.success("Xóa người dùng thành công!");
      queryClient.invalidateQueries({ queryKey: ["USERS_KEY"] });
    },
    onError: () => {
      messageApi.error("Không thể xóa người dùng.");
    },
  });

  const columns = [
    { title: "#", dataIndex: "stt", key: "stt" },
    { title: "Tên", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    { title: "Địa chỉ", dataIndex: "address", key: "address" },
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
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role?.trim() === "Admin" ? "#FF4D4F" : "#FAAD14 "}>
          {role || "-"}
        </Tag>
      ),
    },
    {
      key: "action",
      align: "center",
      render: (_, user) => (
        <Space>
          <Popconfirm
            title="Xóa người dùng"
            description="Bạn có chắc chắn muốn xóa không?"
            onConfirm={() => mutate(user.id)}
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
              setCurrentUser(user);
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

  const filteredData = data?.filter((user) => {
    const matchesName = user.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = userFilter ? user.status === userFilter : true;
    return matchesName && matchesStatus;
  });

  const showDrawer = () => setIsDrawerVisible(true);
  const onClose = () => {
    setCurrentUser(null);
    setIsDrawerVisible(false);
  };

  return (
    <div>
      {contextHolder}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-3xl font-semibold">Quản lý người dùng</h1>
      </div>

      <Space style={{ marginBottom: 20 }}>
        <Input
          placeholder="Tìm kiếm người dùng theo tên"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300 }}
        />
        <Select
          placeholder="Chọn tình trạng"
          style={{ width: 200 }}
          value={userFilter}
          onChange={setUserFilter}
        >
          <Select.Option value={null}>Tất cả</Select.Option>
          <Select.Option value="Hoạt động">Hoạt động</Select.Option>
          <Select.Option value="Ngưng hoạt động">Ngưng Hoạt động</Select.Option>
        </Select>
      </Space>

      <Skeleton loading={isLoading} active>
        <Table dataSource={filteredData} columns={columns} rowKey="id" />
      </Skeleton>

      <Drawer
        title={currentUser ? "Cập nhật người dùng" : "Thêm người dùng"}
        width={500}
        placement="right"
        onClose={onClose}
        open={isDrawerVisible}
        style={{ padding: 0, height: "100%" }}
        styles={{ body: { padding: 20, height: "100%" } }}
      >
        <div style={{ height: "100%", overflowY: "auto", padding: "20px" }}>
          {currentUser && (
            <EditUser user={currentUser} userId={currentUser?.id} />
          )}
        </div>
      </Drawer>
    </div>
  );
};

export default UserList;
