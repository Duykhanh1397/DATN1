import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  UndoOutlined,
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
import React from "react";
import API from "../../../services/api";
const SoftDeleteVoucher = () => {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  const { data, isLoading } = useQuery({
    queryKey: ["TRASHED_VOUCHERS_KEY"],
    queryFn: async () => {
      const { data } = await API.get("/admin/vouchers/trashed");
      return data.data.map((item, index) => ({
        ...item,
        key: item.id,
        stt: index + 1,
      }));
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (id) => {
      await API.put(`/admin/vouchers/${id}/restore`);
    },
    onSuccess: () => {
      messageApi.success("Khôi phục voucher thành công");
      queryClient.invalidateQueries({ queryKey: ["TRASHED_VOUCHERS_KEY"] });
    },
    onError: (error) => {
      messageApi.error("Có lỗi xảy ra: " + error.message);
    },
  });

  const { mutate: forceDelete } = useMutation({
    mutationFn: async (id) => {
      await API.delete(`/admin/vouchers/${id}/force-delete`);
    },
    onSuccess: () => {
      messageApi.success("Voucher đã bị xóa vĩnh viễn!");
      queryClient.invalidateQueries({ queryKey: ["TRASHED_VOUCHERS_KEY"] });
    },
    onError: (error) => {
      messageApi.error("Có lỗi xảy ra: " + error.message);
    },
  });

  const columns = [
    { title: "#", dataIndex: "stt", key: "stt" },
    { title: "Mã giảm giá", dataIndex: "code", key: "code" },
    {
      title: "Loại giảm giá",
      dataIndex: "discount_type",
      key: "discount_type",
    },
    {
      title: "Giá trị giảm",
      dataIndex: "discount_value",
      key: "discount_value",
    },
    {
      title: "Đơn tối thiểu",
      dataIndex: "min_order_value",
      key: "min_order_value",
    },
    { title: "Giảm tối đa", dataIndex: "max_discount", key: "max_discount" },
    {
      title: "Lượt sử dụng tối đa",
      dataIndex: "usage_limit",
      key: "usage_limit",
    },
    { title: "Đã sử dụng", dataIndex: "used_count", key: "used_count" },
    { title: "Ngày bắt đầu", dataIndex: "start_date", key: "start_date" },
    { title: "Ngày kết thúc", dataIndex: "end_date", key: "end_date" },
    {
      title: "Tình trạng",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status?.trim() === "Hoạt động"
              ? "#52C41A"
              : status?.trim() === "Ngưng hoạt động"
              ? "#BFBFBF"
              : "#FF4D4F"
          }
        >
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
            title="Khôi phục voucher"
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
        <h1>Danh sách voucher xóa mềm</h1>
      </div>
      <Skeleton loading={isLoading} active>
        <Table
          dataSource={data}
          columns={columns}
          rowKey="id"
          scroll={{ x: "max-content" }}
        />
      </Skeleton>
    </div>
  );
};

export default SoftDeleteVoucher;
