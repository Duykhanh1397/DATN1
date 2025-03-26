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
} from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../../../services/api";

const ProductVariantEdit = ({ product, onClose }) => {
  const [form] = Form.useForm();
  const [variants, setVariants] = useState([]);
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  const productVariantId = product?.key;

  // Get Product Detail
  const { data: variantData, isLoading } = useQuery({
    queryKey: ["PRODUCT_VARIANTS_KEY", productVariantId],
    queryFn: async () => {
      const { data } = await API.get(
        `/admin/productvariants/${productVariantId}`
      );
      console.log(data);
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

  // Update Product and Variants
  const { mutate: updateProductVariant, isPending } = useMutation({
    mutationFn: async (formValues) => {
      const {
        // name,
        // description,
        // category_id,
        // status,
        variants: updatedVariants,
      } = formValues;

      // Update main product
      // await API.put(`/admin/products/${variantData.product_id}`, {
      //   name,
      //   description,
      //   category_id,
      //   status,
      // });

      // Update each variant
      const promises = updatedVariants.map((variant) => {
        return API.put(`/admin/productvariants/${variant.id}`, {
          color_id: variant.color_id,
          storage_id: variant.storage_id,
          price: variant.price,
          stock: variant.stock,
        });
      });

      await Promise.all(promises);
    },
    onSuccess: () => {
      messageApi.success("Cập nhật sản phẩm thành công");
      queryClient.invalidateQueries({ queryKey: ["PRODUCT_DETAIL"] });
      queryClient.invalidateQueries({ queryKey: ["PRODUCT_VARIANTS_KEY"] });
    },
    onError: (error) => {
      messageApi.error("Cập nhật thất bại: " + error.message);
    },
  });

  // Set form default values after fetch
  useEffect(() => {
    if (variantData) {
      const product = variantData.product;

      form.setFieldsValue({
        name: product.name,
        status: product.status,
        description: product.description,
        category_id: product.category_id,
      });

      setVariants([
        {
          id: variantData.id,
          color_id: variantData.color_id,
          storage_id: variantData.storage_id,
          price: parseFloat(variantData.price) || 0,
          stock: variantData.stock || 0,
        },
      ]);
    }
  }, [variantData, form]);

  const handleSubmit = () => {
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
  ];

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {contextHolder}
      <h1 className="text-3xl font-semibold mb-5">Cập nhật sản phẩm</h1>
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
            Cập nhật sản phẩm
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProductVariantEdit;
