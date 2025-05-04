import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, message, Popconfirm, Skeleton, Space, Table, Tag } from "antd";
import { UndoOutlined, DeleteOutlined } from "@ant-design/icons";
import React from "react";

import API from "../../../services/api";

const SoftDeleteColor = () => {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  const { data, isLoading } = useQuery({
    queryKey: ["TRASHED_COLOR_KEY"],
    queryFn: async () => {
      const { data } = await API.get("/admin/variantcolor/trashed");
      return data.data.map((item, index) => ({
        ...item,
        key: item.id,
        stt: index + 1,
      }));
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (id) => {
      await API.put(`/admin/variantcolor/${id}/restore`);
    },
    onSuccess: () => {
      messageApi.success("Khôi phục màu thành công");
      queryClient.invalidateQueries({ queryKey: ["TRASHED_COLOR_KEY"] });
    },
    onError: (error) => {
      messageApi.error("Có lỗi xảy ra: " + error.message);
    },
  });

  const { mutate: forceDelete } = useMutation({
    mutationFn: async (id) => {
      await API.delete(`/admin/variantcolor/${id}/force-delete`);
    },
    onSuccess: () => {
      messageApi.success("Màu đã bị xóa vĩnh viễn!");
      queryClient.invalidateQueries({ queryKey: ["TRASHED_COLOR_KEY"] });
    },
    onError: (error) => {
      messageApi.error("Có lỗi xảy ra: " + error.message);
    },
  });
  const columns = [
    { title: "#", dataIndex: "stt", key: "stt" },
    {
      title: "Màu",
      dataIndex: "value",
      key: "valuevalue",
    },
    {
      key: "action",
      align: "center",
      render: (_, item) => (
        <Space>
          <Popconfirm
            title="Khôi phục màu"
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
        <h1>Danh sách màu sắc xóa mềm</h1>
      </div>

      <Skeleton loading={isLoading} active>
        <Table dataSource={data} columns={columns} rowKey="id" />
      </Skeleton>
    </div>
  );
};

export default SoftDeleteColor;
