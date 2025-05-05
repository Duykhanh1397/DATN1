// import React, { useEffect, useState } from "react";
// import {
//   Form,
//   Input,
//   Select,
//   Button,
//   InputNumber,
//   message,
//   Table,
//   Row,
//   Col,
// } from "antd";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import API from "../../../services/api";

// const ProductVariantEdit = ({ product, onClose }) => {
//   const [form] = Form.useForm();
//   const [variants, setVariants] = useState([]);
//   const queryClient = useQueryClient();
//   const [messageApi, contextHolder] = message.useMessage();

//   const productVariantId = product?.key;

//   // Get Product Detail
//   const { data: variantData, isLoading } = useQuery({
//     queryKey: ["PRODUCT_VARIANTS_KEY", productVariantId],
//     queryFn: async () => {
//       const { data } = await API.get(
//         `/admin/productvariants/${productVariantId}`
//       );
//       return data.data;
//     },
//   });

//   // Get Categories
//   const { data: categories } = useQuery({
//     queryKey: ["CATEGORIES_KEY"],
//     queryFn: async () => {
//       const { data } = await API.get("/admin/categories");
//       return data.data;
//     },
//   });

//   // Get Colors
//   const { data: colors } = useQuery({
//     queryKey: ["VARIANT_COLORS_KEY"],
//     queryFn: async () => {
//       const { data } = await API.get("/admin/variantcolor");
//       return data.data;
//     },
//   });

//   // Get Storages
//   const { data: storages } = useQuery({
//     queryKey: ["VARIANT_STORAGES_KEY"],
//     queryFn: async () => {
//       const { data } = await API.get("/admin/variantstorage");
//       return data.data;
//     },
//   });

//   // Update Product and Variants
//   const { mutate: updateProductVariant, isPending } = useMutation({
//     mutationFn: async (formValues) => {
//       const { variants: updatedVariants } = formValues;

//       // Update each variant
//       const promises = updatedVariants.map((variant) => {
//         return API.put(`/admin/productvariants/${variant.id}`, {
//           color_id: variant.color_id,
//           storage_id: variant.storage_id,
//           price: variant.price,
//           stock: variant.stock,
//         });
//       });

//       await Promise.all(promises);
//     },
//     onSuccess: () => {
//       messageApi.success("Cập nhật sản phẩm thành công");
//       queryClient.invalidateQueries({ queryKey: ["PRODUCT_DETAIL"] });
//       queryClient.invalidateQueries({ queryKey: ["PRODUCT_VARIANTS_KEY"] });
//     },
//     onError: (error) => {
//       messageApi.error("Có lỗi xảy ra: " + error.message);
//     },
//   });

//   useEffect(() => {
//     if (variantData) {
//       const product = variantData.product;

//       form.setFieldsValue({
//         name: product.name,
//         status: product.status,
//         description: product.description,
//         category_id: product.category_id,
//       });

//       setVariants([
//         {
//           id: variantData.id,
//           color_id: variantData.color_id,
//           storage_id: variantData.storage_id,
//           price: parseFloat(variantData.price) || 0,
//           stock: variantData.stock || 0,
//         },
//       ]);
//     }
//   }, [variantData, form]);

//   const handleSubmit = () => {
//     form.validateFields().then((values) => {
//       const formValues = {
//         ...values,
//         variants,
//       };
//       updateProductVariant(formValues);
//     });
//   };

//   const handleVariantChange = (index, field, value) => {
//     const updatedVariants = [...variants];
//     updatedVariants[index] = { ...updatedVariants[index], [field]: value };
//     setVariants(updatedVariants);
//   };

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
//   ];

//   if (isLoading) return <div>Loading...</div>;

//   return (
//     <div>
//       {contextHolder}
//       <h1 className="mb-5">Cập nhật sản phẩm</h1>
//       <Form form={form} onFinish={handleSubmit} layout="vertical">
//         <Form.Item name="name" label="Tên sản phẩm">
//           <Input disabled />
//         </Form.Item>

//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item
//               label="Tình trạng"
//               name="status"
//               rules={[{ required: true, message: "Chọn tình trạng" }]}
//             >
//               <Select disabled>
//                 <Select.Option value="Hoạt động">Hoạt động</Select.Option>
//                 <Select.Option value="Ngưng hoạt động">
//                   Ngưng hoạt động
//                 </Select.Option>
//               </Select>
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="category_id"
//               label="Danh mục"
//               rules={[{ required: true, message: "Chọn danh mục" }]}
//             >
//               <Select disabled>
//                 {categories?.map((category) => (
//                   <Select.Option key={category.id} value={category.id}>
//                     {category.name}
//                   </Select.Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           </Col>
//         </Row>

//         <Form.Item name="description" label="Mô tả">
//           <Input.TextArea disabled rows={4} />
//         </Form.Item>

//         <h3 className="mt-5 mb-2 font-medium">Biến thể</h3>
//         <Table
//           dataSource={variants}
//           rowKey={(record) => record.id}
//           pagination={false}
//           columns={columns}
//         />

//         <Form.Item>
//           <Button
//             type="primary"
//             htmlType="submit"
//             loading={isPending}
//             style={{ marginTop: 16 }}
//           >
//             Cập nhật sản phẩm
//           </Button>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };

// export default ProductVariantEdit;






















import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  InputNumber,
  message,
  Table,
  Row,
  Col,
  Upload,
} from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../../../services/api";

const ProductVariantEdit = ({ product, onClose }) => {
  const [form] = Form.useForm();
  const [variants, setVariants] = useState([]);
  const [variantErrors, setVariantErrors] = useState([]); // Lưu lỗi cho từng biến thể
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  const productVariantId = product?.key;

  // Get Product Variant Detail
  const { data: variantData, isLoading } = useQuery({
    queryKey: ["PRODUCT_VARIANTS_KEY", productVariantId],
    queryFn: async () => {
      const { data } = await API.get(
        `/admin/productvariants/${productVariantId}`
      );
      return data.data;
    },
  });

  // Get Categories
  const { data: categories } = useQuery({
    queryKey: ["CATEGORIES_KEY"],
    queryFn: async () => {
      const { data } = await API.get("/admin/categories");
      return data.data;
    },
  });

  // Get Colors
  const { data: colors } = useQuery({
    queryKey: ["VARIANT_COLORS_KEY"],
    queryFn: async () => {
      const { data } = await API.get("/admin/variantcolor");
      return data.data;
    },
  });

  // Get Storages
  const { data: storages } = useQuery({
    queryKey: ["VARIANT_STORAGES_KEY"],
    queryFn: async () => {
      const { data } = await API.get("/admin/variantstorage");
      return data.data;
    },
  });

  // Update Product Variant
  const { mutate: updateProductVariant, isPending } = useMutation({
    mutationFn: async (formValues) => {
      const { variants: updatedVariants } = formValues;

      const variant = updatedVariants[0]; // Chỉ có 1 biến thể trong trường hợp này

      const formData = new FormData();
      formData.append("color_id", variant.color_id);
      formData.append("storage_id", variant.storage_id);
      formData.append("price", variant.price);
      formData.append("stock", variant.stock);

      // Gửi các ảnh mới (nếu có)
      const newImages = variant.images.filter(
        (img) => img.originFileObj instanceof File
      );
      newImages.forEach((img) => {
        formData.append("images[]", img.originFileObj);
      });

      // Gửi danh sách ID ảnh bị xóa (nếu có)
      if (variant.deletedImageIds && variant.deletedImageIds.length > 0) {
        formData.append("deleted_images", JSON.stringify(variant.deletedImageIds));
      }

      const response = await API.post(
        `/admin/productvariants/${variant.id}?_method=PUT`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    },
    onSuccess: (response) => {
      messageApi.success("Cập nhật biến thể thành công!", 3);

      // Cập nhật state variants nếu cần
      try {
        if (response.data) {
          const updatedVariant = response.data;
          const formattedVariant = {
            id: updatedVariant.id,
            color_id: updatedVariant.color_id,
            storage_id: updatedVariant.storage_id,
            price: parseFloat(updatedVariant.price) || 0,
            stock: updatedVariant.stock || 0,
            images: updatedVariant.images?.map((img) => ({
              uid: img.id.toString(),
              name: `image-${img.id}.jpg`,
              status: "done",
              url: img.image_url.startsWith('http') ? img.image_url : `/storage/${img.image_url}`,
            })) || [],
            deletedImageIds: [],
          };
          setVariants([formattedVariant]);
          setVariantErrors([[]]);
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật state variants:", error);
        messageApi.error("Có lỗi xảy ra khi cập nhật dữ liệu giao diện!", 3);
      }

      queryClient.invalidateQueries({ queryKey: ["PRODUCT_DETAIL"] });
      queryClient.invalidateQueries({ queryKey: ["PRODUCT_VARIANTS_KEY"] });
      queryClient.invalidateQueries({ queryKey: ["PRODUCT_VARIANTS_LIST"] });

      setTimeout(() => {
        onClose();
      }, 500);
    },
    onError: (error) => {
      console.error("Lỗi khi cập nhật biến thể:", error.response?.data);

      const errorMessage = error.response?.data?.message || "Có lỗi xảy ra khi cập nhật biến thể.";
      const errors = error.response?.data?.errors || {};
      const serverError = error.response?.data?.error || null;

      const errorDetails = [];

      if (Object.keys(errors).length > 0) {
        Object.keys(errors).forEach((key) => {
          errorDetails.push(errors[key][0]);
          // Hiển thị lỗi cho biến thể
          const newVariantErrors = [...variantErrors];
          newVariantErrors[0] = [...(newVariantErrors[0] || []), errors[key][0]];
          setVariantErrors(newVariantErrors);
        });
      }

      if (serverError) {
        errorDetails.push(serverError);
      }

      if (errorMessage === "Biến thể này đã tồn tại!") {
        messageApi.warning("Biến thể với màu sắc và dung lượng này đã tồn tại!", 3);
      } else if (errorDetails.length > 0) {
        const detailedErrorMessage = (
          <div>
            <div>{errorMessage}</div>
            <ul>
              {errorDetails.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          </div>
        );

        messageApi.error({
          content: detailedErrorMessage,
          duration: 5,
        });
      }
    },
  });

  useEffect(() => {
    if (variantData) {
      const product = variantData.product;

      form.setFieldsValue({
        name: product.name,
        status: product.status,
        description: product.description,
        category_id: product.category_id,
      });

      const formattedVariant = {
        id: variantData.id,
        color_id: variantData.color_id,
        storage_id: variantData.storage_id,
        price: parseFloat(variantData.price) || 0,
        stock: variantData.stock || 0,
        images: variantData.images?.map((img) => ({
          uid: img.id.toString(),
          name: `image-${img.id}.jpg`,
          status: "done",
          url: img.image_url.startsWith('http') ? img.image_url : `/storage/${img.image_url}`,
        })) || [],
        deletedImageIds: [],
      };

      setVariants([formattedVariant]);
      setVariantErrors([[]]);
    }
  }, [variantData, form]);

  const handleSubmit = () => {
    // Validation phía client cho biến thể
    const newVariantErrors = variants.map((variant) => {
      const errors = [];
      if (!variant.color_id) errors.push("Vui lòng chọn màu sắc!");
      if (!variant.storage_id) errors.push("Vui lòng chọn dung lượng!");
      if (variant.price === null) errors.push("Vui lòng nhập giá!");
      if (variant.stock === null) errors.push("Vui lòng nhập số lượng!");
      return errors;
    });

    setVariantErrors(newVariantErrors);

    const hasErrors = newVariantErrors.some((errors) => errors.length > 0);
    if (hasErrors) {
      messageApi.error("Vui lòng hoàn thiện thông tin biến thể trước khi cập nhật!", 3);
      return;
    }

    form.validateFields().then((values) => {
      const formValues = {
        ...values,
        variants,
      };
      updateProductVariant(formValues);
    });
  };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...variants];
    updatedVariants[index] = { ...updatedVariants[index], [field]: value };
    setVariants(updatedVariants);

    const updatedErrors = [...variantErrors];
    updatedErrors[index] = [];
    setVariantErrors(updatedErrors);
  };

  const handleVariantImagesChange = (index, fileList) => {
    const newVariants = [...variants];
    const maxImages = 5;

    const filteredList = fileList.filter((file) => {
      if (file.originFileObj && !file.type.startsWith("image/")) {
        messageApi.error(`${file.name} không phải là hình ảnh!`, 3);
        return false;
      }
      if (file.originFileObj && file.size > 2048 * 1024) {
        messageApi.error(`${file.name} quá lớn, tối đa 2MB!`, 3);
        return false;
      }
      if (
        file.originFileObj &&
        !["image/jpeg", "image/png", "image/jpg", "image/gif"].includes(file.type)
      ) {
        messageApi.error(`${file.name} không đúng định dạng (chỉ hỗ trợ jpeg, png, jpg, gif)!`, 3);
        return false;
      }
      return true;
    });

    if (filteredList.length > maxImages) {
      messageApi.warning(`Mỗi biến thể chỉ được phép có tối đa ${maxImages} ảnh!`, 3);
      return;
    }

    const existingImages = newVariants[index].images.filter(
      (img) => !img.originFileObj
    );
    const newImageUids = filteredList.map((img) => img.uid);
    const deletedImageIds = existingImages
      .filter((img) => !newImageUids.includes(img.uid))
      .map((img) => parseInt(img.uid));

    newVariants[index].images = filteredList;
    newVariants[index].deletedImageIds = [
      ...(newVariants[index].deletedImageIds || []),
      ...deletedImageIds,
    ];

    setVariants(newVariants);

    const updatedErrors = [...variantErrors];
    updatedErrors[index] = [];
    setVariantErrors(updatedErrors);
  };

  const columns = [
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
      title: "Màu sắc",
      dataIndex: "color_id",
      render: (text, record, index) => (
        <Select
          value={record.color_id}
          onChange={(value) => handleVariantChange(index, "color_id", value)}
          style={{ width: "100%" }}
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
          style={{ width: "100%" }}
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
      title: "Ảnh biến thể",
      dataIndex: "images",
      render: (text, record, index) => (
        <Upload
          multiple
          listType="picture-card"
          fileList={record.images}
          beforeUpload={() => false}
          onChange={({ fileList }) => handleVariantImagesChange(index, fileList)}
        >
          {record.images.length >= 5 ? null : (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
            </div>
          )}
        </Upload>
      ),
    },
    {
      title: "Lỗi",
      dataIndex: "error",
      render: (text, record, index) =>
        variantErrors[index]?.length > 0 ? (
          <ul style={{ color: "red", margin: 0, paddingLeft: 15 }}>
            {variantErrors[index].map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        ) : null,
    },
  ];

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {contextHolder}
      <h1 className="mb-5">Cập nhật biến thể</h1>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item name="name" label="Tên sản phẩm">
          <Input disabled />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Tình trạng"
              name="status"
              rules={[{ required: true, message: "Chọn tình trạng" }]}
            >
              <Select disabled>
                <Select.Option value="Hoạt động">Hoạt động</Select.Option>
                <Select.Option value="Ngưng hoạt động">
                  Ngưng hoạt động
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="category_id"
              label="Danh mục"
              rules={[{ required: true, message: "Chọn danh mục" }]}
            >
              <Select disabled>
                {categories?.map((category) => (
                  <Select.Option key={category.id} value={category.id}>
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="description" label="Mô tả">
          <Input.TextArea disabled rows={4} />
        </Form.Item>

        <h3 className="mt-5 mb-2 font-medium">Biến thể</h3>
        <Table
          dataSource={variants}
          rowKey={(record) => record.id}
          pagination={false}
          columns={columns}
        />

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isPending}
            style={{ marginTop: 16 }}
          >
            Cập nhật biến thể
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProductVariantEdit;