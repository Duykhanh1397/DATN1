// import {
//   DeleteOutlined,
//   EditOutlined,
//   PlusCircleOutlined,
// } from "@ant-design/icons";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import {
//   Button,
//   Input,
//   message,
//   Popconfirm,
//   Select,
//   Skeleton,
//   Space,
//   Table,
//   Tag,
// } from "antd";
// import React, { useState } from "react";
// import { Drawer } from "antd";
// import API from "../../../services/api";
// import VoucherEdit from "./VoucherEdit";
// import VoucherAdd from "./VoucherAdd";

// const VoucherList = () => {
//   const queryClient = useQueryClient();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState(null);
//   const [messageApi, contextHolder] = message.useMessage();
//   const [isDrawerVisible, setIsDrawerVisible] = useState(false);
//   const [currentVoucher, setCurrentVoucher] = useState(null);

//   const { data, isLoading } = useQuery({
//     queryKey: ["VOUCHERS_KEY"],
//     queryFn: async () => {
//       const { data } = await API.get("/admin/vouchers");
//       return data.data.map((item, index) => ({
//         ...item,
//         key: item.id,
//         stt: index + 1,
//       }));
//     },
//   });

//   const { mutate } = useMutation({
//     mutationFn: async (id) => {
//       await API.delete(`/admin/vouchers/${id}/soft`);
//     },
//     onSuccess: () => {
//       messageApi.success("Xóa voucher thành công");
//       queryClient.invalidateQueries({ queryKey: ["VOUCHERS_KEY"] });
//     },
//     onError: (error) => {
//       messageApi.error("Có lỗi xảy ra: " + error.message);
//     },
//   });

//   const columns = [
//     { title: "#", dataIndex: "stt", key: "stt" },
//     { title: "Mã giảm giá", dataIndex: "code", key: "code" },
//     {
//       title: "Loại giảm giá",
//       dataIndex: "discount_type",
//       key: "discount_type",
//     },
//     {
//       title: "Giá trị giảm",
//       dataIndex: "discount_value",
//       key: "discount_value",
//       render: (discount_value) => {
//         return discount_value
//           ? `${Number(discount_value).toLocaleString("vi-VN")} VNĐ`
//           : "0 VNĐ";
//       },
//     },
//     {
//       title: "Đơn tối thiểu",
//       dataIndex: "min_order_value",
//       key: "min_order_value",
//       render: (min_order_value) => {
//         return min_order_value
//           ? `${Number(min_order_value).toLocaleString("vi-VN")} VNĐ`
//           : "0 VNĐ";
//       },
//     },
//     {
//       title: "Giảm tối đa",
//       dataIndex: "max_discount",
//       key: "max_discount",
//       render: (max_discount) => {
//         return max_discount
//           ? `${Number(max_discount).toLocaleString("vi-VN")} VNĐ`
//           : "0 VNĐ";
//       },
//     },
//     {
//       title: "Lượt sử dụng tối đa",
//       dataIndex: "usage_limit",
//       key: "usage_limit",
//     },
//     { title: "Đã sử dụng", dataIndex: "used_count", key: "used_count" },
//     { title: "Ngày bắt đầu", dataIndex: "start_date", key: "start_date" },
//     { title: "Ngày kết thúc", dataIndex: "end_date", key: "end_date" },
//     {
//       title: "Tình trạng",
//       dataIndex: "status",
//       key: "status",
//       render: (status) => (
//         <Tag
//           color={
//             status?.trim() === "Hoạt động"
//               ? "#52C41A"
//               : status?.trim() === "Ngưng hoạt động"
//               ? "#BFBFBF"
//               : "#FF4D4F"
//           }
//         >
//           {status || "-"}
//         </Tag>
//       ),
//     },
//     {
//       key: "action",
//       align: "center",
//       render: (_, item) => (
//         <Space>
//           <Popconfirm
//             title="Xóa voucher"
//             description="Bạn có chắc chắn muốn xóa không?"
//             onConfirm={() => mutate(item.id)}
//             okText="Có"
//             cancelText="Không"
//           >
//             <Button danger size="small">
//               <DeleteOutlined />
//             </Button>
//           </Popconfirm>
//           <Button
//             type="primary"
//             onClick={() => {
//               setCurrentVoucher(item);
//               setIsDrawerVisible(true);
//             }}
//             size="small"
//           >
//             <EditOutlined />
//           </Button>
//         </Space>
//       ),
//     },
//   ];

//   const filteredData = data?.filter((voucher) => {
//     const matchesCode = voucher.code
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase());
//     const matchesStatus = statusFilter ? voucher.status === statusFilter : true;
//     return matchesCode && matchesStatus;
//   });

//   return (
//     <div>
//       {contextHolder}
//       <div className="mb-5">
//         <h1>Quản lý Voucher</h1>
//         <Button type="default" onClick={() => setIsDrawerVisible(true)}>
//           <PlusCircleOutlined /> Thêm Voucher
//         </Button>
//       </div>
//       <Space style={{ marginBottom: 20 }}>
//         <Input
//           placeholder="Tìm kiếm theo mã voucher"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           style={{ width: 300 }}
//         />
//         <Select
//           placeholder="Chọn tình trạng"
//           style={{ width: 200 }}
//           value={statusFilter}
//           onChange={setStatusFilter}
//         >
//           <Select.Option value={null}>Tất cả</Select.Option>
//           <Select.Option value="Hoạt động">Hoạt động</Select.Option>
//           <Select.Option value="Ngưng hoạt động">Ngưng hoạt động</Select.Option>
//           <Select.Option value="Hết hạn">Hết hạn</Select.Option>
//         </Select>
//       </Space>
//       <Skeleton loading={isLoading} active>
//         <Table
//           dataSource={filteredData}
//           columns={columns}
//           rowKey="id"
//           scroll={{ x: "max-content" }}
//         />
//       </Skeleton>
//       <Drawer
//         title={currentVoucher ? "Cập nhật Voucher" : "Thêm Voucher"}
//         width={500}
//         placement="right"
//         onClose={() => setIsDrawerVisible(false)}
//         open={isDrawerVisible}
//         style={{ padding: 0, height: "100%" }}
//         styles={{ body: { padding: 20, height: "100%" } }}
//       >
//         <div style={{ height: "100%", overflowY: "auto", padding: "20px" }}>
//           {currentVoucher ? (
//             <VoucherEdit voucher={currentVoucher} />
//           ) : (
//             <VoucherAdd />
//           )}
//         </div>
//       </Drawer>
//     </div>
//   );
// };

// export default VoucherList;











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
import API from "../../../services/api";
import VoucherEdit from "./VoucherEdit";
import VoucherAdd from "./VoucherAdd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Enable UTC and timezone plugins for dayjs
dayjs.extend(utc);
dayjs.extend(timezone);

const VoucherList = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [currentVoucher, setCurrentVoucher] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["VOUCHERS_KEY"],
    queryFn: async () => {
      const { data } = await API.get("/admin/vouchers");
      return data.data.map((item, index) => ({
        ...item,
        key: item.id,
        stt: index + 1,
      }));
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (id) => {
      await API.delete(`/admin/vouchers/${id}/soft`);
    },
    onSuccess: () => {
      messageApi.success("Xóa voucher thành công");
      queryClient.invalidateQueries({ queryKey: ["VOUCHERS_KEY"] });
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
      render: (discount_type) =>
        discount_type === "percentage" ? "Phần trăm" : "Giảm giá cố định",
    },
    {
      title: "Giá trị giảm",
      dataIndex: "discount_value",
      key: "discount_value",
      render: (discount_value, record) => {
        if (!discount_value) return "0";
        return record.discount_type === "percentage"
          ? `${Number(discount_value).toLocaleString("vi-VN")}%`
          : `${Number(discount_value).toLocaleString("vi-VN")} VNĐ`;
      },
    },
    {
      title: "Đơn tối thiểu",
      dataIndex: "min_order_value",
      key: "min_order_value",
      render: (min_order_value) => {
        return min_order_value
          ? `${Number(min_order_value).toLocaleString("vi-VN")} VNĐ`
          : "Không có";
      },
    },
    {
      title: "Giảm tối đa",
      dataIndex: "max_discount",
      key: "max_discount",
      render: (max_discount) => {
        return max_discount
          ? `${Number(max_discount).toLocaleString("vi-VN")} VNĐ`
          : "Không có";
      },
    },
    {
      title: "Lượt sử dụng tối đa",
      dataIndex: "usage_limit",
      key: "usage_limit",
    },
    { title: "Đã sử dụng", dataIndex: "used_count", key: "used_count" },
    {
      title: "Ngày bắt đầu",
      dataIndex: "start_date",
      key: "start_date",
      render: (start_date) => {
        if (!start_date) return "-";
        return dayjs(start_date)
          .tz("Asia/Ho_Chi_Minh")
          .format("DD-MM-YYYY HH:mm:ss");
      },
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "end_date",
      key: "end_date",
      render: (end_date) => {
        if (!end_date) return "-";
        return dayjs(end_date)
          .tz("Asia/Ho_Chi_Minh")
          .format("DD-MM-YYYY HH:mm:ss");
      },
    },
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
            title="Xóa voucher"
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
              setCurrentVoucher(item);
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

  const filteredData = data?.filter((voucher) => {
    const matchesCode = voucher.code
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? voucher.status === statusFilter : true;
    return matchesCode && matchesStatus;
  });

  return (
    <div>
      {contextHolder}
      <div className="mb-5">
        <h1>Quản lý Voucher</h1>
        <Button type="default" onClick={() => setIsDrawerVisible(true)}>
          <PlusCircleOutlined /> Thêm Voucher
        </Button>
      </div>
      <Space style={{ marginBottom: 20 }}>
        <Input
          placeholder="Tìm kiếm theo mã voucher"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300 }}
        />
        <Select
          placeholder="Chọn tình trạng"
          style={{ width: 200 }}
          value={statusFilter}
          onChange={setStatusFilter}
        >
          <Select.Option value={null}>Tất cả</Select.Option>
          <Select.Option value="Hoạt động">Hoạt động</Select.Option>
          <Select.Option value="Ngưng hoạt động">Ngưng hoạt động</Select.Option>
          <Select.Option value="Hết hạn">Hết hạn</Select.Option>
        </Select>
      </Space>
      <Skeleton loading={isLoading} active>
        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey="id"
          scroll={{ x: "max-content" }}
        />
      </Skeleton>
      <Drawer
        title={currentVoucher ? "Cập nhật Voucher" : "Thêm Voucher"}
        width={500}
        placement="right"
        onClose={() => setIsDrawerVisible(false)}
        open={isDrawerVisible}
        style={{ padding: 0, height: "100%" }}
        styles={{ body: { padding: 20, height: "100%" } }}
      >
        <div style={{ height: "100%", overflowY: "auto", padding: "20px" }}>
          {currentVoucher ? (
            <VoucherEdit voucher={currentVoucher} />
          ) : (
            <VoucherAdd />
          )}
        </div>
      </Drawer>
    </div>
  );
};

export default VoucherList;