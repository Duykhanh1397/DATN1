import React, { useState } from "react";
import {
  Table,
  Input,
  Select,
  Tag,
  Space,
  Button,
  message,
  Popconfirm,
  Skeleton,
} from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../../../services/api";

const ReviewList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["REVIEWS_KEY"],
    queryFn: async () => {
      const { data } = await API.get("/admin/reviews");
      return data.data.map((item, index) => ({
        ...item,
        key: item.id,
        stt: index + 1,
      }));
    },
  });

  const { mutate: toggleStatus } = useMutation({
    mutationFn: async (id) => {
      await API.put(`/admin/reviews/${id}/toggle-status`);
    },
    onSuccess: () => {
      messageApi.success("Cập nhật trạng thái thành công");
      queryClient.invalidateQueries({ queryKey: ["REVIEWS_KEY"] });
    },
    onError: () => {
      messageApi.error("Có lỗi xảy ra khi thay đổi trạng thái");
    },
  });

  const columns = [
    { title: "#", dataIndex: "stt", key: "stt" },
    {
      title: "Sản phẩm",
      render: (_, item) => {
        return (
          <div>
            <div style={{ fontWeight: 500 }}>{item.product?.name}</div>
            <div style={{ color: "#888" }}>
              Màu: {item.product_variant?.color?.value || "Không có"} - Dung
              lượng: {item.product_variant?.storage?.value || "Không có"}
            </div>
          </div>
        );
      },
    },
    { title: "Người dùng", render: (_, item) => <div>{item.user?.name}</div> },
    {
      title: "Đơn hàng",
      render: (_, item) => <div>{item.order?.order_code}</div>,
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      key: "rating",
      render: (rating) => `${rating} ⭐`,
    },
    {
      title: "Bình luận",
      dataIndex: "comment",
      key: "comment",
      render: (text) => <span>{text?.slice(0, 50) || "-"}</span>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Hiển thị" ? "green" : "default"}>{status}</Tag>
      ),
    },
    {
      key: "action",
      align: "center",
      render: (_, item) => (
        <Popconfirm
          title="Đổi trạng thái"
          description={`Bạn có chắc muốn ${
            item.status === "Hiển thị" ? "ẩn" : "hiển thị"
          } đánh giá này không?`}
          onConfirm={() => toggleStatus(item.id)}
          okText="Có"
          cancelText="Không"
        >
          <Button
            icon={
              item.status === "Hiển thị" ? (
                <EyeInvisibleOutlined />
              ) : (
                <EyeOutlined />
              )
            }
          />
        </Popconfirm>
      ),
    },
  ];

  const filteredData = reviews?.filter((review) => {
    const matchesSearch = review.comment
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? review.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      {contextHolder}
      <h1>Quản lý đánh giá</h1>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm theo bình luận"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300 }}
        />
        <Select
          placeholder="Chọn trạng thái"
          style={{ width: 200 }}
          value={statusFilter}
          onChange={setStatusFilter}
          allowClear
        >
          <Select.Option value="Hiển thị">Hiển thị</Select.Option>
          <Select.Option value="Ẩn">Ẩn</Select.Option>
        </Select>
      </Space>
      <Skeleton loading={isLoading} active>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Skeleton>
    </div>
  );
};

export default ReviewList;
