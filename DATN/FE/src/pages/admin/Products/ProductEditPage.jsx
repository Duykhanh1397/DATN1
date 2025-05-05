import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  InputNumber,
  Upload,
  message,
  Table,
  Popconfirm,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../../../services/api";

const ProductEditPage = ({ product, onClose }) => {
  const [form] = Form.useForm();
  const [variants, setVariants] = useState([]);
  const [variantErrors, setVariantErrors] = useState([]);
  const [fileList, setFileList] = useState([]);
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

  const { mutate: deleteVariant } = useMutation({
    mutationFn: async (variantId) => {
      await API.delete(`/admin/productvariants/${variantId}/soft`);
    },
    onSuccess: () => {
      messageApi.success("Đã xoá biến thể thành công!", 3);
      queryClient.invalidateQueries(["PRODUCT_VARIANTS_LIST"]);
    },
    onError: (error) => {
      messageApi.error("Có lỗi xảy ra khi xoá biến thể: " + error.message, 3);
    },
  });

  const handleDeleteVariant = (variant, index) => {
    if (variant.id) {
      deleteVariant(variant.id);
    }
    const updatedVariants = [...variants];
    updatedVariants.splice(index, 1);
    setVariants(updatedVariants);

    const updatedErrors = [...variantErrors];
    updatedErrors.splice(index, 1);
    setVariantErrors(updatedErrors);
  };

  const { mutate: updateProduct, isPending: updatingProduct } = useMutation({
    mutationFn: async (formValues) => {
      const formData = new FormData();
      formData.append("name", formValues.name);
      formData.append("description", formValues.description || "");
      formData.append("status", formValues.status);
      formData.append("category_id", formValues.category_id);
      formData.append("price", formValues.price ?? 0);

      const imageFile = fileList[0];
      if (imageFile && imageFile.originFileObj instanceof File) {
        formData.append("image", imageFile.originFileObj);
      }

      const response = await API.post(
        `/admin/products/${productId}?_method=PUT`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Cập nhật sản phẩm thất bại (status != 200)");
      }

      const existingVariants = variants.filter((v) => v.id);
      const newVariants = variants.filter((v) => !v.id);

      await Promise.all([
        ...existingVariants.map(async (variant) => {
          const variantFormData = new FormData();
          variantFormData.append("color_id", variant.color_id || "");
          variantFormData.append("storage_id", variant.storage_id || "");
          variantFormData.append("price", variant.price);
          variantFormData.append("stock", variant.stock);

          const newImages = variant.images.filter(
            (img) => img.originFileObj instanceof File
          );
          newImages.forEach((img) => {
            variantFormData.append("images[]", img.originFileObj);
          });

          if (variant.deletedImageIds && variant.deletedImageIds.length > 0) {
            variantFormData.append(
              "deleted_images",
              JSON.stringify(variant.deletedImageIds)
            );
          }

          await API.post(
            `/admin/productvariants/${variant.id}?_method=PUT`,
            variantFormData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
        }),
        ...newVariants.map(async (variant) => {
          const variantFormData = new FormData();
          variantFormData.append("color_id", variant.color_id || "");
          variantFormData.append("storage_id", variant.storage_id || "");
          variantFormData.append("price", variant.price);
          variantFormData.append("stock", variant.stock);

          const newImages = variant.images.filter(
            (img) => img.originFileObj instanceof File
          );
          newImages.forEach((img) => {
            variantFormData.append("images[]", img.originFileObj);
          });

          await API.post(
            `/admin/products/${productId}/productvariants`,
            variantFormData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
        }),
      ]);

      return response.data;
    },
    onSuccess: (response) => {
      console.log("onSuccess called with response:", response);

      messageApi.success("Cập nhật sản phẩm thành công!", 3);

      try {
        if (response.data && response.data.variants) {
          const formattedVariants = response.data.variants.map((v) => ({
            id: v.id,
            color_id: v.color_id,
            storage_id: v.storage_id,
            price: parseFloat(v.price),
            stock: v.stock,
            images:
              v.images?.map((img) => ({
                uid: img.id.toString(),
                name: `image-${img.id}.jpg`,
                status: "done",
                url: img.image_url.startsWith("http")
                  ? img.image_url
                  : `/storage/${img.image_url}`,
              })) || [],
            deletedImageIds: [],
          }));
          setVariants(formattedVariants);
          setVariantErrors(formattedVariants.map(() => []));
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật state variants:", error);
        messageApi.error("Có lỗi xảy ra khi cập nhật dữ liệu giao diện!", 3);
      }

      queryClient.invalidateQueries(["PRODUCT_DETAIL"]);
      queryClient.invalidateQueries(["PRODUCTS_KEY"]);
      queryClient.invalidateQueries(["PRODUCT_VARIANTS_LIST"]);
      setTimeout(() => {
        onClose();
      }, 500);
    },
    onError: (error) => {
      console.error("Lỗi khi cập nhật sản phẩm:", error.response?.data);

      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra khi cập nhật sản phẩm.";
      const errors = error.response?.data?.errors || {};
      const serverError = error.response?.data?.error || null;

      const errorDetails = [];
      let hasNameUniqueError = false;

      if (Object.keys(errors).length > 0) {
        Object.keys(errors).forEach((key) => {
          errorDetails.push(errors[key][0]);
          form.setFields([{ name: key, errors: errors[key] }]);
          if (key === "name" && errors[key][0].includes("đã tồn tại")) {
            hasNameUniqueError = true;
            messageApi.warning(
              "Tên sản phẩm đã tồn tại, vui lòng chọn tên khác!",
              3
            );
          }
        });
      }

      if (serverError) {
        errorDetails.push(serverError);
      }

      if (!hasNameUniqueError && errorDetails.length > 0) {
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
    if (productData) {
      form.setFieldsValue({
        name: productData.name,
        description: productData.description,
        status: productData.status,
        category_id: productData.category_id,
        price: parseFloat(productData.price) || 0,
      });

      if (productData.image) {
        setFileList([
          {
            uid: "-1",
            name: "image.jpg",
            status: "done",
            url: productData.image.startsWith("http")
              ? productData.image
              : `${import.meta.env.VITE_API_BASE_URL}/storage/${
                  productData.image
                }`,
          },
        ]);
      }
    }

    if (variantList) {
      const formattedVariants = variantList.map((v) => ({
        id: v.id,
        color_id: v.color_id,
        storage_id: v.storage_id,
        price: parseFloat(v.price),
        stock: v.stock,
        images:
          v.images?.map((img) => ({
            uid: img.id.toString(),
            name: `image-${img.id}.jpg`,
            status: "done",
            url: img.image_url.startsWith("http")
              ? img.image_url
              : `/storage/${img.image_url}`,
          })) || [],
        deletedImageIds: [],
      }));
      setVariants(formattedVariants);
      setVariantErrors(formattedVariants.map(() => []));
    }
  }, [productData, variantList, form]);

  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);

    const updatedErrors = [...variantErrors];
    updatedErrors[index] = [];
    setVariantErrors(updatedErrors);
  };

  const handleAddVariant = () => {
    const invalid = variants.some(
      (v) =>
        (!v.color_id && !v.storage_id) || v.price === null || v.stock === null
    );
    if (invalid) {
      messageApi.warning("Vui lòng hoàn thiện biến thể trước khi thêm mới!", 3);
      return;
    }

    const lastVariant = variants[variants.length - 1];
    if (lastVariant) {
      const duplicate = variants.some(
        (v, i) =>
          i !== variants.length - 1 &&
          v.color_id === lastVariant.color_id &&
          v.storage_id === lastVariant.storage_id
      );
      if (duplicate) {
        messageApi.warning(
          "Biến thể với màu sắc và dung lượng này đã tồn tại!",
          3
        );
        return;
      }
    }

    setVariants([
      ...variants,
      {
        color_id: null,
        storage_id: null,
        price: 0,
        stock: 0,
        images: [],
        deletedImageIds: [],
      },
    ]);
    setVariantErrors([...variantErrors, []]);
  };

  const handleImageChange = ({ fileList }) => {
    const filteredList = fileList.filter((file) => {
      if (file.originFileObj && !file.type.startsWith("image/")) {
        messageApi.error(`${file.name} không phải là hình ảnh!`, 3);
        return false;
      }
      if (file.originFileObj && file.size > 4096 * 1024) {
        messageApi.error(`${file.name} quá lớn, tối đa 4MB!`, 3);
        return false;
      }
      if (
        file.originFileObj &&
        !["image/jpeg", "image/png", "image/jpg", "image/gif"].includes(
          file.type
        )
      ) {
        messageApi.error(
          `${file.name} không đúng định dạng (chỉ hỗ trợ jpeg, png, jpg, gif)!`,
          3
        );
        return false;
      }
      return true;
    });
    setFileList(filteredList);
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
        !["image/jpeg", "image/png", "image/jpg", "image/gif"].includes(
          file.type
        )
      ) {
        messageApi.error(
          `${file.name} không đúng định dạng (chỉ hỗ trợ jpeg, png, jpg, gif)!`,
          3
        );
        return false;
      }
      return true;
    });

    if (filteredList.length > maxImages) {
      messageApi.warning(
        `Mỗi biến thể chỉ được phép có tối đa ${maxImages} ảnh!`,
        3
      );
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

  const handleSubmit = () => {
    const newVariantErrors = variants.map((variant, index) => {
      const errors = [];
      if (!variant.color_id && !variant.storage_id)
        errors.push("Vui lòng chọn ít nhất một màu sắc hoặc dung lượng!");
      if (variant.price === null) errors.push("Vui lòng nhập giá!");
      if (variant.stock === null) errors.push("Vui lòng nhập số lượng!");
      return errors;
    });

    setVariantErrors(newVariantErrors);

    const hasErrors = newVariantErrors.some((errors) => errors.length > 0);
    if (hasErrors) {
      messageApi.error(
        "Vui lòng hoàn thiện thông tin biến thể trước khi cập nhật!",
        3
      );
      return;
    }

    form.validateFields().then((values) => {
      updateProduct(values);
    });
  };

  const columns = [
    {
      title: "Màu sắc",
      dataIndex: "color_id",
      render: (_, record, index) => (
        <Select
          value={record.color_id}
          onChange={(val) => handleVariantChange(index, "color_id", val)}
          style={{ width: 120 }}
          allowClear
        >
          {colors?.map((c) => (
            <Select.Option key={c.id} value={c.id}>
              {c.value}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Dung lượng",
      dataIndex: "storage_id",
      render: (_, record, index) => (
        <Select
          value={record.storage_id}
          onChange={(val) => handleVariantChange(index, "storage_id", val)}
          style={{ width: 120 }}
          allowClear
        >
          {storages?.map((s) => (
            <Select.Option key={s.id} value={s.id}>
              {s.value}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      render: (_, record, index) => (
        <InputNumber
          value={record.price}
          min={0}
          onChange={(val) => handleVariantChange(index, "price", val)}
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "stock",
      render: (_, record, index) => (
        <InputNumber
          value={record.stock}
          min={0}
          onChange={(val) => handleVariantChange(index, "stock", val)}
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "Ảnh biến thể",
      dataIndex: "images",
      render: (_, record, index) => (
        <Upload
          multiple
          listType="picture-card"
          fileList={record.images}
          beforeUpload={() => false}
          onChange={({ fileList }) =>
            handleVariantImagesChange(index, fileList)
          }
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
      render: (_, __, index) =>
        variantErrors[index]?.length > 0 ? (
          <ul style={{ color: "red", margin: 0, paddingLeft: 15 }}>
            {variantErrors[index].map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        ) : null,
    },
    {
      title: "Thao tác",
      render: (_, record, index) => (
        <Popconfirm
          title="Xác nhận xoá?"
          onConfirm={() => handleDeleteVariant(record, index)}
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
      <h1 className="mb-5">Cập nhật sản phẩm</h1>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Ảnh sản phẩm">
          <Upload
            listType="picture-card"
            fileList={fileList}
            beforeUpload={() => false}
            maxCount={1}
            onChange={handleImageChange}
          >
            {fileList.length >= 1 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
              </div>
            )}
          </Upload>
          {fileList.length >= 1 && (
            <Button
              icon={<UploadOutlined />}
              onClick={() => setFileList([])}
              style={{ marginTop: 10 }}
            >
              Thay ảnh
            </Button>
          )}
        </Form.Item>

        <Form.Item
          label="Tên sản phẩm"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Giá sản phẩm (chính)"
          name="price"
          rules={[{ required: true, message: "Vui lòng nhập giá sản phẩm" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Danh mục"
              name="category_id"
              rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
            >
              <Select>
                {categories?.map((cat) => (
                  <Select.Option key={cat.id} value={cat.id}>
                    {cat.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Tình trạng"
              name="status"
              rules={[{ required: true, message: "Vui lòng chọn tình trạng" }]}
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

        <h3 className="mt-5 mb-2 font-medium">
          Biến thể (Chọn ít nhất một màu sắc hoặc dung lượng)
        </h3>
        <Table
          dataSource={variants}
          rowKey={(record, index) => record.id || `new-${index}`}
          columns={columns}
          pagination={false}
        />

        <Button
          icon={<PlusOutlined />}
          type="dashed"
          style={{ marginTop: 10, marginBottom: 10 }}
          onClick={handleAddVariant}
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
