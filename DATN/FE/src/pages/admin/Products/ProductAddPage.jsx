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
  Row,
  Col,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../../../services/api";

const ProductAddPage = ({ onClose }) => {
  const [form] = Form.useForm();
  const [variants, setVariants] = useState([]);
  const [variantErrors, setVariantErrors] = useState([]);
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  // Lấy dữ liệu danh mục, màu sắc, dung lượng
  const { data: categories } = useQuery({
    queryKey: ["CATEGORIES_KEY"],
    queryFn: async () => {
      const { data } = await API.get("/admin/categories");
      return data.data;
    },
    onError: (error) => {
      messageApi.error("Lỗi khi lấy danh sách danh mục: " + error.message);
    },
  });

  const { data: colors } = useQuery({
    queryKey: ["VARIANT_COLORS_KEY"],
    queryFn: async () => {
      const { data } = await API.get("/admin/variantcolor");
      return data.data;
    },
    onError: (error) => {
      messageApi.error("Lỗi khi lấy danh sách màu sắc: " + error.message);
    },
  });

  const { data: storages } = useQuery({
    queryKey: ["VARIANT_STORAGES_KEY"],
    queryFn: async () => {
      const { data } = await API.get("/admin/variantstorage");
      return data.data;
    },
    onError: (error) => {
      messageApi.error("Lỗi khi lấy danh sách dung lượng: " + error.message);
    },
  });

  // Mutation để thêm sản phẩm mới
  const { mutate: addProductMutation, isPending: isAddingProduct } =
    useMutation({
      mutationFn: (newProduct) =>
        API.post("/admin/products", newProduct, {
          headers: { "Content-Type": "multipart/form-data" },
        }),
      onSuccess: (response) => {
        const data = response.data;
        if (data.status) {
          messageApi.success("Thêm sản phẩm mới thành công!", 3);
          form.resetFields();
          setVariants([]);
          setVariantErrors([]);
          queryClient.invalidateQueries({ queryKey: ["PRODUCTS_KEY"] });
          onClose();
        } else {
          messageApi.error(data.message || "Thêm sản phẩm thất bại", 3);
        }
      },
      onError: (error) => {
        console.error("Lỗi khi thêm sản phẩm:", error.response?.data);

        const errorMessage =
          error.response?.data?.message || "Có lỗi xảy ra khi thêm sản phẩm.";
        const errors = error.response?.data?.errors || {};
        const serverError = error.response?.data?.error || null;

        const errorDetails = [];
        const newVariantErrors = Array(variants.length).fill([]);

        if (Object.keys(errors).length > 0) {
          Object.keys(errors).forEach((key) => {
            if (key.startsWith("variants")) {
              const match = key.match(/variants\.(\d+)\.(.+)/);
              if (match) {
                const index = parseInt(match[1]);
                const errorMsg = errors[key][0];
                errorDetails.push(`Biến thể thứ ${index + 1}: ${errorMsg}`);
                newVariantErrors[index] = [
                  ...(newVariantErrors[index] || []),
                  errorMsg,
                ];
              }
            } else {
              errorDetails.push(errors[key][0]);
              form.setFields([{ name: key, errors: errors[key] }]);
            }
          });
        } else if (errorMessage.includes("Tên sản phẩm đã tồn tại")) {
          form.setFields([
            {
              name: "name",
              errors: ["Tên sản phẩm đã tồn tại. Vui lòng chọn tên khác."],
            },
          ]);
          errorDetails.push(errorMessage);
        }

        setVariantErrors(newVariantErrors);

        if (serverError) {
          errorDetails.push(serverError);
        }

        let detailedErrorMessage = errorMessage;
        if (errorDetails.length > 0) {
          detailedErrorMessage = (
            <div>
              <div>{errorMessage}</div>
              <ul>
                {errorDetails.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </div>
          );
        }

        messageApi.error({
          content: detailedErrorMessage,
          duration: 5,
        });
      },
    });

  const addVariant = () => {
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
      },
    ]);
    setVariantErrors([...variantErrors, []]);
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);

    setVariantErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = [];
      return newErrors;
    });
  };

  const handleRemoveVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
    setVariantErrors(variantErrors.filter((_, i) => i !== index));
  };

  const handleVariantImagesChange = (index, fileList) => {
    const newVariants = [...variants];
    newVariants[index].images = fileList.filter((file) => {
      if (!file.type.startsWith("image/")) {
        messageApi.error(`${file.name} không phải là hình ảnh!`, 3);
        return false;
      }
      if (file.size > 2048 * 1024) {
        messageApi.error(`${file.name} quá lớn, tối đa 2MB!`, 3);
        return false;
      }
      if (
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
    setVariants(newVariants);

    setVariantErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = [];
      return newErrors;
    });
  };

  const handleMainImageChange = ({ fileList }) => {
    const filteredList = fileList.filter((file) => {
      const mimeType = file.type;
      console.log(`MIME type của ảnh sản phẩm: ${mimeType}`);
      console.log(`Tên file: ${file.name}`);

      if (!mimeType.startsWith("image/")) {
        messageApi.error(`${file.name} không phải là hình ảnh!`, 3);
        return false;
      }
      if (file.size > 2048 * 1024) {
        messageApi.error(`${file.name} quá lớn, tối đa 2MB!`, 3);
        return false;
      }
      if (
        !["image/jpeg", "image/png", "image/jpg", "image/gif"].includes(
          mimeType
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
    return filteredList;
  };

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("category_id", values.category_id);
      formData.append("description", values.description || "");
      formData.append("price", values.price);

      if (values.image && values.image.length > 0) {
        formData.append("image", values.image[0].originFileObj);
      }

      variants.forEach((variant, index) => {
        if (!variant.color_id && !variant.storage_id) {
          throw new Error(
            `Biến thể thứ ${
              index + 1
            } phải có ít nhất một màu sắc hoặc dung lượng!`
          );
        }

        formData.append(`variants[${index}][color_id]`, variant.color_id || "");
        formData.append(
          `variants[${index}][storage_id]`,
          variant.storage_id || ""
        );
        formData.append(`variants[${index}][price]`, variant.price);
        formData.append(`variants[${index}][stock]`, variant.stock);

        if (variant.images && variant.images.length > 0) {
          variant.images.forEach((file, imgIndex) => {
            formData.append(
              `variants[${index}][images][${imgIndex}]`,
              file.originFileObj
            );
          });
        }
      });

      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      await addProductMutation(formData);
    } catch (error) {
      messageApi.error(error.message, 3);
    }
  };

  const columns = [
    {
      title: "Màu sắc",
      dataIndex: "color_id",
      render: (_, record, index) => (
        <Select
          style={{ width: 120 }}
          placeholder="Chọn màu"
          onChange={(value) => handleVariantChange(index, "color_id", value)}
          value={record.color_id}
          allowClear
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
          onChange={(value) => handleVariantChange(index, "storage_id", value)}
          value={record.storage_id}
          allowClear
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
          onChange={(value) => handleVariantChange(index, "price", value)}
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
          onChange={(value) => handleVariantChange(index, "stock", value)}
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
            <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
          </div>
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
  ];

  return (
    <div>
      {contextHolder}
      <h1 className="mb-5">Thêm mới sản phẩm</h1>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          label="Ảnh sản phẩm"
          name="image"
          valuePropName="fileList"
          getValueFromEvent={handleMainImageChange}
          rules={[{ required: true, message: "Vui lòng chọn ảnh sản phẩm!" }]}
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
              <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
            </button>
          </Upload>
        </Form.Item>

        <Form.Item
          name="name"
          label="Tên sản phẩm"
          rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
        >
          <Input />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="price"
              label="Giá sản phẩm"
              rules={[
                { required: true, message: "Vui lòng nhập giá sản phẩm!" },
              ]}
            >
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="category_id"
              label="Danh mục"
              rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
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

        <h3 className="mt-5 mb-2 font-medium">
          Danh sách biến thể (Chọn ít nhất một màu sắc hoặc dung lượng)
        </h3>
        <Table
          dataSource={variants}
          rowKey={(_, index) => index}
          columns={columns}
          pagination={false}
          scroll={{ x: "max-content" }}
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
          <Button type="primary" htmlType="submit" loading={isAddingProduct}>
            Thêm sản phẩm
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProductAddPage;
