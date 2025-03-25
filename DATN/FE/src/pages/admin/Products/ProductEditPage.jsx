import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  InputNumber,
  message,
  Table,
  Popconfirm,
  Row,
  Col,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../../../services/api";

const ProductEditPage = ({ product, onClose }) => {
  const [form] = Form.useForm();
  const [variants, setVariants] = useState([]);
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  const productId = product?.key;

  const { data: productData, isLoading } = useQuery({
    queryKey: ["PRODUCT_DETAIL", productId],
    queryFn: async () => {
      const { data } = await API.get(`/admin/products/${productId}`);
      return data.data;
    },
  });

  const { data: variantList } = useQuery({
    queryKey: ["PRODUCT_VARIANTS_LIST", productId],
    queryFn: async () => {
      const { data } = await API.get(
        `/admin/products/${productId}/productvariants`
      );
      return data.data;
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["CATEGORIES_KEY"],
    queryFn: async () => {
      const { data } = await API.get("/admin/categories");
      return data.data;
    },
  });

  const { data: colors } = useQuery({
    queryKey: ["VARIANT_COLORS_KEY"],
    queryFn: async () => {
      const { data } = await API.get("/admin/variantcolor");
      return data.data;
    },
  });

  const { data: storages } = useQuery({
    queryKey: ["VARIANT_STORAGES_KEY"],
    queryFn: async () => {
      const { data } = await API.get("/admin/variantstorage");
      return data.data;
    },
  });

  // Xử lý xoá biến thể trên server
  const { mutate: deleteVariant } = useMutation({
    mutationFn: async (variantId) => {
      await API.delete(`/admin/productvariants/${variantId}/soft`);
    },
    onSuccess: () => {
      messageApi.success("Đã xoá biến thể thành công!");
      queryClient.invalidateQueries(["PRODUCT_VARIANTS_LIST"]);
    },
    onError: (error) => {
      messageApi.error("Xoá biến thể thất bại: " + error.message);
    },
  });

  const handleDeleteVariant = (variant, index) => {
    if (variant.id) {
      // Nếu có id thì gọi API xoá trên server
      deleteVariant(variant.id);
    }
    // Xoá luôn khỏi state (dù là có id hay chưa)
    const updated = [...variants];
    updated.splice(index, 1);
    setVariants(updated);
  };

  const { mutate: updateProduct, isPending: updatingProduct } = useMutation({
    mutationFn: async (formValues) => {
      await API.put(`/admin/products/${productId}`, {
        name: formValues.name,
        description: formValues.description,
        status: formValues.status,
        category_id: formValues.category_id,
      });

      const existingVariants = variants.filter((variant) => variant.id);
      const newVariants = variants.filter((variant) => !variant.id);

      const updatePromises = existingVariants.map((variant) =>
        API.put(`/admin/productvariants/${variant.id}`, {
          color_id: variant.color_id,
          storage_id: variant.storage_id,
          price: variant.price,
          stock: variant.stock,
        })
      );

      const createPromises = newVariants.map((variant) =>
        API.post(`/admin/products/${productId}/productvariants`, {
          color_id: variant.color_id,
          storage_id: variant.storage_id,
          price: variant.price,
          stock: variant.stock,
        })
      );

      await Promise.all([...updatePromises, ...createPromises]);
    },
    onSuccess: () => {
      messageApi.success("Cập nhật sản phẩm thành công");
      queryClient.invalidateQueries(["PRODUCT_DETAIL"]);
      queryClient.invalidateQueries(["PRODUCTS_KEY"]);
    },
    onError: (error) => {
      messageApi.error("Cập nhật thất bại: " + error.message);
    },
  });

  useEffect(() => {
    if (productData) {
      form.setFieldsValue({
        name: productData.name,
        description: productData.description,
        status: productData.status,
        category_id: productData.category_id,
      });
    }

    if (variantList) {
      const formattedVariants = variantList.map((variant) => ({
        id: variant.id,
        color_id: variant.color_id,
        storage_id: variant.storage_id,
        price: parseFloat(variant.price) || 0,
        stock: variant.stock || 0,
      }));
      setVariants(formattedVariants);
    }
  }, [productData, variantList, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      updateProduct(values);
    });
  };

  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  const handleAddVariant = () => {
    const newVariant = {
      color_id: null,
      storage_id: null,
      price: 0,
      stock: 0,
    };
    setVariants([...variants, newVariant]);
  };

  const columns = [
    {
      title: "Màu sắc",
      dataIndex: "color_id",
      render: (text, record, index) => (
        <Select
          value={record.color_id}
          onChange={(value) => handleVariantChange(index, "color_id", value)}
          style={{ width: 120 }}
        >
          {colors?.map((color) => (
            <Select.Option key={color.id} value={color.id}>
              {color.value}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Dung lượng",
      dataIndex: "storage_id",
      render: (text, record, index) => (
        <Select
          value={record.storage_id}
          onChange={(value) => handleVariantChange(index, "storage_id", value)}
          style={{ width: 120 }}
        >
          {storages?.map((storage) => (
            <Select.Option key={storage.id} value={storage.id}>
              {storage.value}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      render: (text, record, index) => (
        <InputNumber
          min={0}
          value={record.price}
          onChange={(value) => handleVariantChange(index, "price", value)}
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "stock",
      render: (text, record, index) => (
        <InputNumber
          min={0}
          value={record.stock}
          onChange={(value) => handleVariantChange(index, "stock", value)}
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      render: (_, record, index) => (
        <Popconfirm
          title="Xác nhận xoá?"
          onConfirm={() => handleDeleteVariant(record, index)}
          okText="Xoá"
          cancelText="Huỷ"
        >
          <Button danger icon={<DeleteOutlined />} size="small" type="text" />
        </Popconfirm>
      ),
    },
  ];

  if (isLoading) return <div>Đang tải dữ liệu...</div>;

  return (
    <div>
      {contextHolder}
      <h1 className="text-2xl font-semibold mb-4">Cập nhật sản phẩm</h1>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Tên sản phẩm"
          name="name"
          rules={[{ required: true, message: "Nhập tên sản phẩm" }]}
        >
          <Input />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Danh mục"
              name="category_id"
              rules={[{ required: true, message: "Chọn danh mục" }]}
            >
              <Select>
                {categories?.map((cate) => (
                  <Select.Option key={cate.id} value={cate.id}>
                    {cate.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Tình trạng"
              name="status"
              rules={[{ required: true, message: "Chọn tình trạng" }]}
            >
              <Select>
                <Select.Option value="Hoạt động">Hoạt động</Select.Option>
                <Select.Option value="Ngưng hoạt động">
                  Ngưng hoạt động
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={4} />
        </Form.Item>

        <h3 className="mt-5 mb-2 font-medium">Biến thể</h3>

        <Table
          dataSource={variants}
          rowKey={(record, index) => record.id || `new-${index}`}
          pagination={false}
          columns={columns}
        />
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={handleAddVariant}
          style={{ marginTop: 10, marginBottom: 10 }}
        >
          Thêm biến thể
        </Button>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={updatingProduct}
            style={{ marginTop: 16 }}
          >
            Cập nhật sản phẩm
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProductEditPage;

// import React, { useEffect, useState } from "react";
// import {
//   Form,
//   Input,
//   Select,
//   Button,
//   InputNumber,
//   Upload,
//   message,
//   Table,
//   Row,
//   Col,
// } from "antd";
// import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import API from "../../../services/api";

// const ProductEditPage = ({ product, onClose }) => {
//   const [form] = Form.useForm();
//   const [variants, setVariants] = useState([]);
//   const [fileList, setFileList] = useState([]);
//   const queryClient = useQueryClient();
//   const [messageApi, contextHolder] = message.useMessage();

//   const productId = product?.key;

//   // Fetch product info by productId
//   const { data: productData, isLoading } = useQuery({
//     queryKey: ["PRODUCT_DETAIL", productId],
//     queryFn: async () => {
//       const { data } = await API.get(`/admin/products/${productId}`);
//       console.log("Du lieu san pham", data);
//       return data.data;
//     },
//   });

//   // Fetch variants by productId
//   const { data: variantList } = useQuery({
//     queryKey: ["PRODUCT_VARIANTS_LIST", productId],
//     queryFn: async () => {
//       const { data } = await API.get(
//         `/admin/products/${productId}/productvariants`
//       );
//       return data.data;
//     },
//   });

//   // Fetch categories, colors, storages
//   const { data: categories } = useQuery({
//     queryKey: ["CATEGORIES_KEY"],
//     queryFn: async () => {
//       const { data } = await API.get("/admin/categories");
//       return data.data;
//     },
//   });

//   const { data: colors } = useQuery({
//     queryKey: ["VARIANT_COLORS_KEY"],
//     queryFn: async () => {
//       const { data } = await API.get("/admin/variantcolor");
//       return data.data;
//     },
//   });

//   const { data: storages } = useQuery({
//     queryKey: ["VARIANT_STORAGES_KEY"],
//     queryFn: async () => {
//       const { data } = await API.get("/admin/variantstorage");
//       return data.data;
//     },
//   });

//   // Update product info
//   const { mutate: updateProduct, isPending: updatingProduct } = useMutation({
//     mutationFn: async (formValues) => {
//       const formData = new FormData();
//       formData.append("name", formValues.name);
//       formData.append("description", formValues.description);
//       formData.append("status", formValues.status);
//       formData.append("category_id", formValues.category_id);

//       if (fileList.length > 0) {
//         formData.append("image", fileList[0].originFileObj);
//       }

//       // Update product
//       await API.post(`/admin/products/${productId}?_method=PUT`, formData);

//       // Update variants
//       const variantPromises = variants.map((variant) => {
//         return API.put(`/admin/productvariants/${variant.id}`, {
//           color_id: variant.color_id,
//           storage_id: variant.storage_id,
//           price: variant.price,
//           stock: variant.stock,
//         });
//       });

//       await Promise.all(variantPromises);
//     },
//     onSuccess: () => {
//       messageApi.success("Cập nhật sản phẩm thành công");
//       queryClient.invalidateQueries(["PRODUCT_DETAIL"]);
//       queryClient.invalidateQueries(["PRODUCT_VARIANTS_LIST"]);
//       onClose?.();
//     },
//     onError: (error) => {
//       messageApi.error("Cập nhật thất bại: " + error.message);
//     },
//   });

//   // Init form values
//   useEffect(() => {
//     if (productData) {
//       form.setFieldsValue({
//         name: productData.name,
//         description: productData.description,
//         status: productData.status,
//         price: productData.price,
//         category_id: productData.category_id,
//       });

//       if (productData.image) {
//         setFileList([
//           {
//             uid: "-1",
//             name: "image.png",
//             status: "done",
//             url: productData.image,
//           },
//         ]);
//       }
//     }

//     if (variantList) {
//       const formattedVariants = variantList.map((variant) => ({
//         id: variant.id,
//         color_id: variant.color_id,
//         storage_id: variant.storage_id,
//         price: parseFloat(variant.price) || 0,
//         stock: variant.stock || 0,
//       }));

//       setVariants(formattedVariants);
//     }
//   }, [productData, variantList, form]);

//   const handleSubmit = () => {
//     form.validateFields().then((values) => {
//       updateProduct(values);
//     });
//   };

//   const addVariant = () => {
//     setVariants((prev) => [
//       ...prev,
//       {
//         id: `new_${Date.now()}`,
//         color_id: null,
//         storage_id: null,
//         price: 0,
//         stock: 0,
//       },
//     ]);
//   };

//   const handleVariantChange = (index, field, value) => {
//     const updated = [...variants];
//     updated[index] = { ...updated[index], [field]: value };
//     setVariants(updated);
//   };
// const handleRemoveVariant = (index) => {
//   const updatedVariants = [...variants];
//   updatedVariants.splice(index, 1);
//   setVariants(updatedVariants);
// };
//   const columns = [
//     {
//       title: "Giá",
//       dataIndex: "price",
//       render: (text, record, index) => (
//         <InputNumber
//           min={0}
//           value={record.price}
//           onChange={(value) => handleVariantChange(index, "price", value)}
//           style={{ width: "100%" }}
//         />
//       ),
//     },
//     {
//       title: "Số lượng",
//       dataIndex: "stock",
//       render: (text, record, index) => (
//         <InputNumber
//           min={0}
//           value={record.stock}
//           onChange={(value) => handleVariantChange(index, "stock", value)}
//           style={{ width: "100%" }}
//         />
//       ),
//     },
//     {
//       title: "Màu sắc",
//       dataIndex: "color_id",
//       render: (text, record, index) => (
//         <Select
//           value={record.color_id}
//           onChange={(value) => handleVariantChange(index, "color_id", value)}
//           style={{ width: "100%" }}
//         >
//           {colors?.map((color) => (
//             <Select.Option key={color.id} value={color.id}>
//               {color.value}
//             </Select.Option>
//           ))}
//         </Select>
//       ),
//     },
//     {
//       title: "Dung lượng",
//       dataIndex: "storage_id",
//       render: (text, record, index) => (
//         <Select
//           value={record.storage_id}
//           onChange={(value) => handleVariantChange(index, "storage_id", value)}
//           style={{ width: "100%" }}
//         >
//           {storages?.map((storage) => (
//             <Select.Option key={storage.id} value={storage.id}>
//               {storage.value}
//             </Select.Option>
//           ))}
//         </Select>
//       ),
//     },
//     ,
//     {
//       title: "Thao tác",
//       render: (_, __, index) => (
//         <Button
//           danger
//           icon={<DeleteOutlined />}
//           onClick={() => handleRemoveVariant(index)}
//         />
//       ),
//     },
//   ];

//   if (isLoading) return <div>Đang tải dữ liệu...</div>;

//   return (
//     <div>
//       {contextHolder}
//       <h1 className="text-2xl font-semibold mb-4">Cập nhật sản phẩm</h1>

//       <Form form={form} layout="vertical" onFinish={handleSubmit}>
//         <Form.Item label="Ảnh sản phẩm">
//           <Upload
//             fileList={fileList}
//             beforeUpload={() => false}
//             listType="picture-card"
//             onChange={({ fileList }) => setFileList(fileList)}
//             maxCount={1}
//           >
//             <button
//               style={{
//                 color: "inherit",
//                 cursor: "inherit",
//                 border: 0,
//                 background: "none",
//               }}
//               type="button"
//             >
//               <PlusOutlined />
//               <div style={{ marginTop: 8 }}>Upload</div>
//             </button>
//           </Upload>
//         </Form.Item>
//         <Form.Item
//           label="Tên sản phẩm"
//           name="name"
//           rules={[{ required: true, message: "Nhập tên sản phẩm" }]}
//         >
//           <Input />
//         </Form.Item>
//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item
//               name="price"
//               label="Giá sản phẩm"
//               rules={[{ required: true, message: "Vui lòng nhập giá" }]}
//             >
//               <InputNumber style={{ width: "100%" }} min={0} />
//             </Form.Item>
//           </Col>
//         </Row>

//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item
//               label="Danh mục"
//               name="category_id"
//               rules={[{ required: true, message: "Chọn danh mục" }]}
//             >
//               <Select>
//                 {categories?.map((cate) => (
//                   <Select.Option key={cate.id} value={cate.id}>
//                     {cate.name}
//                   </Select.Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               label="Tình trạng"
//               name="status"
//               rules={[{ required: true, message: "Chọn tình trạng" }]}
//             >
//               <Select>
//                 <Select.Option value="Hoạt động">Hoạt động</Select.Option>
//                 <Select.Option value="Ngưng hoạt động">
//                   Ngưng hoạt động
//                 </Select.Option>
//               </Select>
//             </Form.Item>
//           </Col>
//         </Row>

//         <Form.Item label="Mô tả" name="description">
//           <Input.TextArea rows={4} />
//         </Form.Item>

//         <h3 className="mt-5 mb-2 font-medium">Biến thể</h3>
//         <Table
//           dataSource={variants}
//           rowKey={(record) => record.id}
//           pagination={false}
//           columns={columns}
//         />
//         <Button
//           type="dashed"
//           onClick={addVariant}
//           icon={<PlusOutlined />}
//           style={{ marginTop: 16 }}
//         >
//           Thêm biến thể
//         </Button>

//         <Form.Item>
//           <Button
//             type="primary"
//             htmlType="submit"
//             loading={updatingProduct}
//             style={{ marginTop: 16 }}
//           >
//             Cập nhật sản phẩm
//           </Button>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };

// export default ProductEditPage;
