import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, message, Rate, Spin } from "antd";
import {
  CarOutlined,
  CheckCircleOutlined,
  PhoneOutlined,
  ShoppingCartOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import API from "../../../services/api";

const DetailPage = () => {
  const { id } = useParams();
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState(null); // Ảnh được chọn để hiển thị lớn

  // Lấy chi tiết sản phẩm theo product_id
  const { data: product, isLoading } = useQuery({
    queryKey: ["PRODUCT_DETAIL", id],
    queryFn: async () => {
      const res = await API.get(`/products/${id}`);
      return res.data.data;
    },
  });

  // Lấy danh sách các sản phẩm khác
  const { data: products } = useQuery({
    queryKey: ["PRODUCTS_KEY"],
    queryFn: async () => {
      const res = await API.get("/products");
      return res.data.data.map((item, index) => ({
        key: item.id,
        name: item.name,
        price: item.price,
        description: item.description,
        image: item.image
          ? `http://localhost:8000/storage/${item.image}`
          : null,
        category: item.category?.name || "Không xác định",
        status: item.status,
        stt: index + 1,
      }));
    },
  });

  // Gom các biến thể theo màu sắc
  const groupedVariants =
    product?.variants.reduce((acc, variant) => {
      const colorName = variant.color?.value || "Không xác định";
      if (!acc[colorName]) acc[colorName] = [];
      acc[colorName].push(variant);
      return acc;
    }, {}) || {};

  const colors = Object.keys(groupedVariants);

  // Danh sách toàn bộ ảnh nhỏ của product_id (hiển thị tất cả, không phụ thuộc variant)
  const allVariantImages =
    product?.variants
      ?.flatMap((variant) => variant.images || [])
      .map((img) => img.image_url) || [];

  const colorMap = {
    Xanh: "#0000FF",
    Đỏ: "#FF0000",
    Vàng: "#FFFF00",
    Đen: "#000000",
    Trắng: "#FFFFFF",
    Hồng: "#FFC0CB",
    Bạc: "#C0C0C0",
  };

  const handleColorSelect = (color) => {
    const firstVariant = groupedVariants[color]?.[0];
    setSelectedVariant(firstVariant);
    setQuantity(firstVariant?.stock > 0 ? 1 : 0);
    setSelectedImage(null); // reset ảnh nhỏ
  };

  const handleStorageSelect = (variant) => {
    setSelectedVariant(variant);
    setQuantity(variant?.stock > 0 ? 1 : 0);
    setSelectedImage(null); // reset ảnh nhỏ
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);

    if (!selectedVariant || selectedVariant.stock === 0) {
      setQuantity(0);
      messageApi.warning("Sản phẩm hiện đã hết hàng");
      return;
    }

    if (value < 1) {
      setQuantity(1);
      messageApi.warning("Số lượng phải lớn hơn 0!");
      return;
    }

    if (value > selectedVariant.stock) {
      setQuantity(selectedVariant.stock);
      messageApi.warning(`Chỉ còn ${selectedVariant.stock} sản phẩm!`);
      return;
    }

    setQuantity(value);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!selectedVariant) {
        throw new Error("Vui lòng chọn biến thể trước khi thêm vào giỏ hàng!");
      }

      const res = await API.post("/cart/items", {
        product_id: product.id,
        color_id: selectedVariant.color.id,
        storage_id: selectedVariant.storage.id,
        quantity: quantity,
      });

      return res.data;
    },
    onSuccess: () => {
      messageApi.success("Đã thêm vào giỏ hàng!");
      queryClient.invalidateQueries({ queryKey: ["CART_ITEMS"] });
    },
    onError: (error) => {
      messageApi.error("Thêm vào giỏ hàng thất bại: " + error.message);
    },
  });

  const handleAddToCart = () => {
    if (!selectedVariant) {
      messageApi.warning("Vui lòng chọn biến thể!");
      return;
    }

    if (selectedVariant.stock === 0) {
      messageApi.warning("Sản phẩm đã hết hàng");
      return;
    }

    mutate();
  };

  if (isLoading) {
    return <div className="text-center">Đang tải...</div>;
  }

  const activeVariant = selectedVariant;
  const displayPrice = activeVariant ? activeVariant.price : product.price;

  // Ảnh chính ưu tiên: ảnh được chọn > ảnh variant > ảnh product
  const mainImage =
    selectedImage ||
    (activeVariant ? activeVariant.images?.[0]?.image_url : product.image);

  return (
    <>
      {contextHolder}
      <section>
        <div style={{ backgroundColor: "#333" }}>
          <div className="container py-5 text-light">
            <div className="row mb-5">
              {/* Ảnh sản phẩm */}
              <div className="col-md-5">
                <div className="d-flex flex-column align-items-center">
                  {/* Ảnh chính */}
                  <div>
                    <img
                      src={mainImage}
                      alt="Main"
                      style={{
                        width: "100%",
                        maxHeight: "450px",
                        objectFit: "contain",
                        backgroundColor: "#fff",
                      }}
                      className="img-fluid rounded shadow"
                    />
                  </div>
                  {/* Ảnh nhỏ */}
                  <div
                    className="thumbnail-container"
                    style={{
                      display: "flex",
                      overflowX: "auto",
                      gap: "10px",
                      padding: "10px 0",
                    }}
                  >
                    {allVariantImages.length > 0 ? (
                      allVariantImages.map((imgUrl, index) => (
                        <img
                          key={index}
                          src={imgUrl}
                          alt={`thumb-${index}`}
                          onClick={() => setSelectedImage(imgUrl)}
                          style={{
                            width: 80,
                            height: 60,
                            objectFit: "contain",
                            backgroundColor: "#fff",
                            cursor: "pointer",
                            flex: "0 0 auto", // giữ cố định chiều rộng
                            border:
                              selectedImage === imgUrl
                                ? "2px solid #ffc107"
                                : "1px solid #ddd",
                          }}
                          className="img-fluid rounded shadow"
                        />
                      ))
                    ) : (
                      <img
                        src={product.image}
                        alt="thumb-default"
                        style={{
                          width: 80,
                          height: 60,
                          objectFit: "contain",
                          backgroundColor: "#fff",
                          flex: "0 0 auto",
                        }}
                        className="img-fluid rounded shadow"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Thông tin sản phẩm */}
              <div className="col-md-7">
                <h1 style={{ fontWeight: "bold" }}>{product.name}</h1>
                <h4 className="text-secondary">
                  Danh mục: {product.category?.name || "_"}
                </h4>

                <h2 style={{ color: "red" }}>
                  {displayPrice
                    ? `${Number(displayPrice).toLocaleString("vi-VN")} VNĐ`
                    : "0 VNĐ"}
                </h2>

                {/* Màu sắc */}
                {colors.length > 0 && (
                  <div className="mb-3">
                    <span>Màu sắc: </span>
                    <div className="d-flex gap-2 mt-2">
                      {colors.map((color) => (
                        <div
                          key={color}
                          onClick={() => handleColorSelect(color)}
                          style={{
                            width: 30,
                            height: 30,
                            backgroundColor: colorMap[color] || "#ccc",
                            cursor: "pointer",
                          }}
                          className={`rounded-circle border ${
                            selectedVariant?.color?.value === color
                              ? "border-warning"
                              : ""
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dung lượng */}
                {selectedVariant && (
                  <div className="mb-3">
                    <span>Dung lượng:</span>
                    <div className="d-flex gap-2 mt-2">
                      {groupedVariants[selectedVariant.color.value]?.map(
                        (variant) => (
                          <button
                            key={variant.id}
                            onClick={() => handleStorageSelect(variant)}
                            className={`btn btn-outline-light ${
                              selectedVariant.id === variant.id
                                ? "border-warning text-warning"
                                : ""
                            }`}
                          >
                            {variant.storage?.value}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Số lượng và thêm giỏ hàng */}
                <div className="d-flex align-items-center gap-3 mt-3">
                  <input
                    type="number"
                    min={0}
                    max={selectedVariant?.stock || 0}
                    value={quantity}
                    onChange={handleQuantityChange}
                    disabled={!selectedVariant || selectedVariant.stock === 0}
                  />

                  <Button
                    type="primary"
                    icon={<ShoppingCartOutlined />}
                    className="bg-warning border-0 text-dark"
                    onClick={handleAddToCart}
                    disabled={!selectedVariant || selectedVariant.stock === 0}
                    loading={isPending}
                  >
                    {selectedVariant?.stock === 0
                      ? "Hết hàng"
                      : "Thêm vào giỏ hàng"}
                  </Button>
                </div>
                <hr style={{ margin: "30px 0" }} />
                <div style={{ fontSize: "16px", lineHeight: "1.6" }}>
                  <p>
                    <CheckCircleOutlined
                      style={{ color: "#52c41a", marginRight: 8 }}
                    />
                    Bộ sản phẩm gồm: Hộp, Sách hướng dẫn, Cáp, Cây lấy sim
                  </p>
                  <p>
                    <SyncOutlined
                      style={{ color: "#1890ff", marginRight: 8 }}
                    />
                    Hư gì đổi nấy 12 tháng tại cửa hàng, chính sách bảo hành
                  </p>
                  <p>
                    <CarOutlined style={{ color: "#faad14", marginRight: 8 }} />
                    Giao hàng nhanh toàn quốc
                  </p>
                  <p>
                    <PhoneOutlined
                      style={{ color: "#f5222d", marginRight: 8 }}
                    />
                    Liên hệ: 0763.272.301 (8:00 - 21:30)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mô tả sản phẩm và đánh giá */}
      <div className="container mt-5">
        <section>
          <h4>Mô tả sản phẩm</h4>
          <p>{product.description}</p>

          <h4 className="mt-4">Đánh giá & Bình luận</h4>
          <div className="mb-4">
            <Rate defaultValue={5} className="mb-2" />
            <textarea
              rows={3}
              className="form-control"
              placeholder="Nhập bình luận của bạn..."
            />
            <button className="btn btn-warning mt-2">Gửi bình luận</button>
          </div>

          {/* Bình luận mẫu */}
          <div className="border p-3 rounded bg-light mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <strong>User1</strong>
              <Rate disabled defaultValue={5} />
            </div>
            <p className="mb-0">Sản phẩm rất tốt, đáng tiền!</p>
          </div>
        </section>

        {/* Sản phẩm khác */}
        <section>
          <div className="text-center mb-5 mt-5">
            <h2>Sản phẩm khác</h2>
          </div>
          <div className="row g-3">
            {products?.slice(0, 8).map((prod) => (
              <div key={prod.key} className="col-md-3">
                <div className="card h-100 shadow-sm product-box">
                  <Link to={`/product/${prod.key}`}>
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="card-img-top"
                      style={{ height: "250px", objectFit: "contain" }}
                    />
                  </Link>
                  <div className="card-body bg-dark text-center">
                    <Link
                      to={`/product/${prod.key}`}
                      className="text-decoration-none text-light"
                    >
                      <h5>{prod.name}</h5>
                    </Link>
                    <p className="text-secondary">{prod.category}</p>
                    <p className="text-warning fw-semibold fs-5">
                      {prod.price
                        ? `${Number(prod.price).toLocaleString("vi-VN")} VNĐ`
                        : "0 VNĐ"}
                    </p>
                    <Link
                      to={`/product/${prod.key}`}
                      className="text-decoration-none"
                    >
                      <button className="btn border border-warning text-light w-100 py-2 px-3">
                        <ShoppingCartOutlined />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default DetailPage;
