import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, message, Popconfirm, Skeleton, Space, Table, Tag } from "antd";
import React from "react";
import API from "../../../services/api";
import { DeleteOutlined, UndoOutlined } from "@ant-design/icons";

const SoftDeleteUsers = () => {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  const { data, isLoading } = useQuery({
    queryKey: ["TRASHED_USERS_KEY"],
    queryFn: async () => {
      const { data } = await API.get("/admin/users/trashed");
      return data?.data?.map((user, index) => ({
        ...user,
        key: user.id,
        stt: index + 1,
      }));
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (id) => {
      await API.put(`/admin/users/${id}/restore`);
    },
    onSuccess: () => {
      messageApi.success("Khôi phục tài khoản thành công");
      queryClient.invalidateQueries({ queryKey: ["TRASHED_USERS_KEY"] });
    },
    onError: (error) => {
      messageApi.error("Có lỗi xảy ra: " + error.message);
    },
  });

  const { mutate: forceDelete } = useMutation({
    mutationFn: async (id) => {
      await API.delete(`/admin/users/${id}/force-delete`);
    },
    onSuccess: () => {
      messageApi.success("Xóa tài khoản thành công!");
      queryClient.invalidateQueries({ queryKey: ["TRASHED_USERS_KEY"] });
    },
    onError: (error) => {
      messageApi.error("Có lỗi xảy ra: " + error.message);
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
      render: (_, item) => (
        <Space>
          <Popconfirm
            title="Khôi phục tài khoản"
            description="Bạn có chắc chắn muốn khôi phục không?"
            onConfirm={() => mutate(item.id)}
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
        <h1>Danh sách tài khoản xóa mềm</h1>
      </div>

      <Skeleton loading={isLoading} active>
        <Table dataSource={data} columns={columns} rowKey="id" />
      </Skeleton>
    </div>
  );
};

export default SoftDeleteUsers;
