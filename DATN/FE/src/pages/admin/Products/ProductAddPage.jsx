import { useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Upload,
  InputNumber,
  message,
  Table,
  Space,
  Row,
  Col,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../../../services/api";

const ProductAddPage = () => {
  const [form] = Form.useForm();
  const [variants, setVariants] = useState([]);
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  // Query data
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

  // Mutation thêm sản phẩm chính
  const addProductMutation = useMutation({
    mutationFn: (newProduct) =>
      API.post("/admin/products", newProduct, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      messageApi.success("Thêm sản phẩm mới thành công");
      form.resetFields();
      setVariants([]);
      queryClient.invalidateQueries({ queryKey: ["PRODUCTS_KEY"] });
    },
    onError: (error) => {
      messageApi.error("Thêm sản phẩm thất bại: " + error.message);
    },
  });

  const addVariant = () => {
    const invalid = variants.some(
      (v) => v.color_id === null || v.storage_id === null
    );
    if (invalid) {
      messageApi.warning("Vui lòng hoàn thiện biến thể trước khi thêm mới!");
      return;
    }

    setVariants([
      ...variants,
      {
        color_id: null,
        storage_id: null,
        price: 0,
        stock: 0,
        images: [],
      },
    ]);
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const handleRemoveVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantImagesChange = (index, fileList) => {
    const newVariants = [...variants];
    newVariants[index].images = fileList;
    setVariants(newVariants);
  };

  // Submit form
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();

      // ✅ Thông tin chính
      formData.append("name", values.name);
      formData.append("category_id", values.category_id);
      formData.append("description", values.description || "");
      formData.append("price", values.price);

      // ✅ Ảnh sản phẩm chính
      if (values.image && values.image.length > 0) {
        formData.append("image", values.image[0].originFileObj);
      }

      // ✅ Duyệt và append biến thể + ảnh biến thể
      variants.forEach((variant, index) => {
        if (!variant.color_id || !variant.storage_id) {
          throw new Error(`Biến thể thứ ${index + 1} thiếu thông tin bắt buộc`);
        }

        formData.append(`variants[${index}][color_id]`, variant.color_id);
        formData.append(`variants[${index}][storage_id]`, variant.storage_id);
        formData.append(`variants[${index}][price]`, variant.price);
        formData.append(`variants[${index}][stock]`, variant.stock);

        // ✅ Xử lý ảnh từng biến thể
        if (variant.images && variant.images.length > 0) {
          variant.images.forEach((file, imgIndex) => {
            formData.append(
              `variants[${index}][images][${imgIndex}]`,
              file.originFileObj
            );
          });
        }
      });

      // ✅ Gọi API thêm sản phẩm
      await addProductMutation.mutateAsync(formData);
    } catch (error) {
      console.error("Submit error: ", error);
      messageApi.error(`Đã xảy ra lỗi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {contextHolder}
      <h1 className="text-3xl font-semibold mb-5">Thêm mới sản phẩm</h1>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        {/* Ảnh sản phẩm chính */}
        <Form.Item
          label="Ảnh sản phẩm"
          name="image"
          valuePropName="fileList"
          getValueFromEvent={(e) => e && e.fileList}
          rules={[{ required: true, message: "Vui lòng chọn ảnh" }]}
        >
          <Upload
            beforeUpload={() => false}
            maxCount={1}
            listType="picture-card"
          >
            <button
              style={{
                color: "inherit",
                cursor: "inherit",
                border: 0,
                background: "none",
              }}
              type="button"
            >
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </button>
          </Upload>
        </Form.Item>

        {/* Tên sản phẩm */}
        <Form.Item
          name="name"
          label="Tên sản phẩm"
          rules={[{ required: true, message: "Vui lòng nhập tên" }]}
        >
          <Input />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="price"
              label="Giá sản phẩm"
              rules={[{ required: true, message: "Vui lòng nhập giá" }]}
            >
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="category_id"
              label="Danh mục"
              rules={[{ required: true, message: "Chọn danh mục" }]}
            >
              <Select placeholder="Chọn danh mục">
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
          <Input.TextArea />
        </Form.Item>

        {/* Biến thể */}
        <h3 className="mt-5 mb-2 font-medium">Danh sách Biến Thể</h3>
        <Table
          dataSource={variants}
          rowKey={(_, index) => index}
          pagination={false}
          columns={[
            {
              title: "Màu sắc",
              dataIndex: "color_id",
              render: (_, record, index) => (
                <Select
                  style={{ width: 120 }}
                  placeholder="Chọn màu"
                  onChange={(value) =>
                    handleVariantChange(index, "color_id", value)
                  }
                  value={record.color_id}
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
              render: (_, record, index) => (
                <Select
                  style={{ width: 120 }}
                  placeholder="Chọn dung lượng"
                  onChange={(value) =>
                    handleVariantChange(index, "storage_id", value)
                  }
                  value={record.storage_id}
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
              render: (_, record, index) => (
                <InputNumber
                  min={0}
                  onChange={(value) =>
                    handleVariantChange(index, "price", value)
                  }
                  value={record.price}
                />
              ),
            },
            {
              title: "Số lượng",
              dataIndex: "stock",
              render: (_, record, index) => (
                <InputNumber
                  min={0}
                  onChange={(value) =>
                    handleVariantChange(index, "stock", value)
                  }
                  value={record.stock}
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
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              ),
            },
            {
              title: "Thao tác",
              render: (_, __, index) => (
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemoveVariant(index)}
                >
                  Xóa
                </Button>
              ),
            },
          ]}
        />

        <Button
          type="dashed"
          onClick={addVariant}
          style={{ marginTop: 10, marginBottom: 10 }}
          icon={<PlusOutlined />}
        >
          Thêm biến thể
        </Button>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Thêm sản phẩm
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProductAddPage;
