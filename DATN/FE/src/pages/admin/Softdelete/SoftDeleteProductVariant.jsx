// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import {
//   Table,
//   Image,
//   Tag,
//   Space,
//   message,
//   Popconfirm,
//   Skeleton,
//   Button,
// } from "antd";
// import { DeleteOutlined, UndoOutlined } from "@ant-design/icons";
// import API from "../../../services/api";

// const SoftDeleteProductVariant = () => {
//   const queryClient = useQueryClient();
//   const [messageApi, contextHolder] = message.useMessage();

//   const { data, isLoading } = useQuery({
//     queryKey: ["TRASHED_PRODUCT_VARIANTS_KEY"],
//     queryFn: async () => {
//       const { data } = await API.get("/admin/productvariants/trashed");

//       return data.data.map((item, index) => {
//         // const imageUrl =
//         //   item.images && item.images.length > 0
//         //     ? item.images[0].image_url
//         //     : null;
//         const imageUrl = item.image
//           ? item.image.startsWith("/storage/")
//             ? `http://localhost:8000${item.image}`
//             : `http://localhost:8000/storage/${item.image}`
//           : null;

//         return {
//           key: item.id,
//           id: item.id,
//           stt: index + 1,
//           productVariantId: item.id,
//           image: imageUrl,
//           name: item.product?.name,
//           category: item.product?.category?.name,
//           color: item.color?.value,
//           storage: item.storage?.value,
//           price: item.price,
//           stock: item.stock,
//           status: item.product?.status,
//           productId: item.product_id,
//         };
//       });
//     },
//   });

//   const { mutate } = useMutation({
//     mutationFn: async (id) => {
//       await API.put(`/admin/productvariants/${id}/restore`);
//     },
//     onSuccess: () => {
//       messageApi.success("Khôi phục sản phẩm biến thể thành công");
//       queryClient.invalidateQueries({
//         queryKey: ["TRASHED_PRODUCT_VARIANTS_KEY"],
//       });
//     },
//     onError: (error) => {
//       messageApi.error("Có lỗi xảy ra: " + error.message);
//     },
//   });

//   const { mutate: forceDelete } = useMutation({
//     mutationFn: async (id) => {
//       await API.delete(`/admin/productvariants/${id}/force-delete`);
//     },
//     onSuccess: () => {
//       messageApi.success("Xóa sản phẩm biến thể thành công");
//       queryClient.invalidateQueries({
//         queryKey: ["TRASHED_PRODUCT_VARIANTS_KEY"],
//       });
//     },
//     onError: (error) => {
//       messageApi.error("Có lỗi xảy ra: " + error.message);
//     },
//   });
//   const columns = [
//     {
//       title: "STT",
//       dataIndex: "stt",
//       key: "stt",
//     },
//     {
//       title: "Ảnh",
//       dataIndex: "image",
//       key: "image",
//       render: (image) => (
//         <Image width={50} src={image} fallback="/images/placeholder.png" />
//       ),
//     },
//     {
//       title: "Sản phẩm",
//       render: (_, item) => {
//         return (
//           <div>
//             <div style={{ fontWeight: 500 }}>{item.name}</div>
//             <div style={{ color: "#888" }}>
//               Màu: {item.color} - Dung lượng: {item.storage}
//             </div>
//           </div>
//         );
//       },
//     },
//     {
//       title: "Giá",
//       dataIndex: "price",
//       key: "price",
//       render: (price) =>
//         price ? `${Number(price).toLocaleString("vi-VN")} VNĐ` : "0 VNĐ",
//     },
//     { title: "Số lượng", dataIndex: "stock", key: "stock" },
//     {
//       title: "Danh mục",
//       dataIndex: "category",
//       key: "category",
//       render: (category) => (
//         <Tag color="blue">{category || "Không có danh mục"}</Tag>
//       ),
//     },
//     {
//       title: "Trạng thái",
//       dataIndex: "status",
//       key: "status",
//       render: (status) => (
//         <Tag color={status?.trim() === "Hoạt động" ? "#52C41A" : "#BFBFBF"}>
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
//             title="Khôi phục sản phẩm"
//             description="Bạn có chắc chắn muốn khôi phục không?"
//             onConfirm={() => mutate(item.id)}
//             okText="Có"
//             cancelText="Không"
//           >
//             <Button type="primary" size="small">
//               <UndoOutlined />
//             </Button>
//           </Popconfirm>
//           <Popconfirm
//             title="Xóa vĩnh viễn"
//             description="Bạn có chắc chắn muốn xóa vĩnh viễn không?"
//             onConfirm={() => forceDelete(item.id)}
//             okText="Có"
//             cancelText="Không"
//           >
//             <Button danger size="small">
//               <DeleteOutlined />
//             </Button>
//           </Popconfirm>
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <div>
//       {contextHolder}
//       <div className="mb-5">
//         <h1>Danh sách sản phẩm biến thể xóa mềm</h1>
//       </div>

//       <Skeleton loading={isLoading} active>
//         <Table
//           dataSource={data}
//           columns={columns}
//           rowKey={(record) => record.key}
//           locale={{ emptyText: "Không có sản phẩm nào phù hợp!" }}
//           scroll={{ x: "max-content" }}
//         />
//       </Skeleton>
//     </div>
//   );
// };

// export default SoftDeleteProductVariant;











import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  Image,
  Tag,
  Space,
  message,
  Popconfirm,
  Skeleton,
  Button,
} from "antd";
import { DeleteOutlined, UndoOutlined } from "@ant-design/icons";
import API from "../../../services/api";

const SoftDeleteProductVariant = () => {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  const { data, isLoading } = useQuery({
    queryKey: ["TRASHED_PRODUCT_VARIANTS_KEY"],
    queryFn: async () => {
      const { data } = await API.get("/admin/productvariants/trashed");

      return data.data.map((item, index) => {
        const imageUrl = item.image
          ? item.image.startsWith("/storage/")
            ? `http://localhost:8000${item.image}`
            : `http://localhost:8000/storage/${item.image}`
          : null;

        return {
          key: item.id,
          id: item.id,
          stt: index + 1,
          productVariantId: item.id,
          image: imageUrl,
          name: item.product?.name,
          category: item.product?.category?.name,
          color: item.color?.value,
          storage: item.storage?.value,
          price: item.price,
          stock: item.stock,
          status: item.product?.status,
          productId: item.product_id,
        };
      });
    },
  });

  const { mutate: restoreProductVariant } = useMutation({
    mutationFn: async (id) => {
      await API.put(`/admin/productvariants/${id}/restore`);
    },
    onSuccess: () => {
      messageApi.success("Khôi phục sản phẩm biến thể thành công");
      queryClient.invalidateQueries({
        queryKey: ["TRASHED_PRODUCT_VARIANTS_KEY"],
      });
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Có lỗi xảy ra khi khôi phục sản phẩm biến thể";
      messageApi.error(errorMessage);
    },
  });

  const { mutate: forceDelete } = useMutation({
    mutationFn: async (id) => {
      await API.delete(`/admin/productvariants/${id}/force-delete`);
    },
    onSuccess: () => {
      messageApi.success("Xóa sản phẩm biến thể thành công");
      queryClient.invalidateQueries({
        queryKey: ["TRASHED_PRODUCT_VARIANTS_KEY"],
      });
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Có lỗi xảy ra khi xóa vĩnh viễn sản phẩm biến thể";
      messageApi.error(errorMessage);
    },
  });

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
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
      title: "Sản phẩm",
      render: (_, item) => {
        return (
          <div>
            <div style={{ fontWeight: 500 }}>{item.name}</div>
            <div style={{ color: "#888" }}>
              Màu: {item.color} - Dung lượng: {item.storage}
            </div>
          </div>
        );
      },
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) =>
        price ? `${Number(price).toLocaleString("vi-VN")} VNĐ` : "0 VNĐ",
    },
    { title: "Số lượng", dataIndex: "stock", key: "stock" },
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
            title="Khôi phục sản phẩm biến thể"
            description="Bạn có chắc chắn muốn khôi phục không?"
            onConfirm={() => restoreProductVariant(item.id)}
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
        <h1>Danh sách sản phẩm biến thể xóa mềm</h1>
      </div>

      <Skeleton loading={isLoading} active>
        <Table
          dataSource={data}
          columns={columns}
          rowKey={(record) => record.key}
          locale={{ emptyText: "Không có sản phẩm nào phù hợp!" }}
          scroll={{ x: "max-content" }}
        />
      </Skeleton>
    </div>
  );
};

export default SoftDeleteProductVariant;