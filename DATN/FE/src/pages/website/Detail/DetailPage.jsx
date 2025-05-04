// import React, { useState, useEffect } from "react";
// import { useParams, Link } from "react-router-dom";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { Button, message, Rate, Tabs, Select, Input, Pagination } from "antd";
// import {
//   CarOutlined,
//   CheckCircleOutlined,
//   PhoneOutlined,
//   ShoppingCartOutlined,
//   SyncOutlined,
//   UserOutlined,
// } from "@ant-design/icons";
// import API from "../../../services/api";
// import TabPane from "antd/es/tabs/TabPane";

// const { Option } = Select;

// const DetailPage = () => {
//   const { id } = useParams();
//   const [selectedVariant, setSelectedVariant] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [messageApi, contextHolder] = message.useMessage();
//   const queryClient = useQueryClient();
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState("");
//   const [selectedOrder, setSelectedOrder] = useState(null);

//   // Lấy chi tiết sản phẩm theo product_id
//   const { data: product, isLoading } = useQuery({
//     queryKey: ["PRODUCT_DETAIL", id],
//     queryFn: async () => {
//       const { data } = await API.get(`/products/${id}`);
//       return data.data;
//     },
//   });

//   // Lấy danh sách các sản phẩm khác
//   const { data: products } = useQuery({
//     queryKey: ["PRODUCTS_KEY"],
//     queryFn: async () => {
//       const { data } = await API.get("/products");
//       return data.data.map((item, index) => ({
//         key: item.id,
//         name: item.name,
//         price: item.price,
//         description: item.description,
//         image: item.image
//           ? `http://localhost:8000/storage/${item.image}`
//           : null,
//         category: item.category?.name || "_",
//         status: item.status,
//         stt: index + 1,
//       }));
//     },
//   });

//   // Lấy danh sách đánh giá
//   const { data: comments, refetch: refetchComments } = useQuery({
//     queryKey: ["PRODUCT_COMMENTS", id, currentPage],
//     queryFn: async () => {
//       const { data } = await API.get(`/reviews/product/${id}?page=${currentPage}`);
//       return data.data;
//     },
//   });

//   // Lấy danh sách đơn hàng có thể đánh giá
//   const { data: reviewableOrders } = useQuery({
//     queryKey: ["REVIEWABLE_ORDERS", id],
//     queryFn: async () => {
//       const { data } = await API.get(`/reviews/product/${id}/reviewable-orders`);
//       return data.data;
//     },
//     enabled: !!id, // Chỉ chạy khi id tồn tại
//   });

//   // Gửi đánh giá
//   const { mutate: submitReview, isPending: isSubmittingReview } = useMutation({
//     mutationFn: async () => {
//       const response = await API.post(`/reviews/product/${id}`, {
//         order_id: selectedOrder,
//         rating,
//         comment,
//       });
//       return response.data;
//     },
//     onSuccess: () => {
//       messageApi.success("Đánh giá đã được gửi thành công!");
//       setRating(0);
//       setComment("");
//       setSelectedOrder(null);
//       refetchComments(); // Tải lại danh sách đánh giá
//       queryClient.invalidateQueries(["REVIEWABLE_ORDERS"]); // Cập nhật danh sách đơn hàng có thể đánh giá
//     },
//     onError: (error) => {
//       messageApi.error(
//         error?.response?.data?.message || "Có lỗi xảy ra khi gửi đánh giá."
//       );
//     },
//   });

//   // Gom các biến thể theo màu sắc
//   const groupedVariants =
//     product?.variants.reduce((acc, variant) => {
//       const colorName = variant.color?.value || "_";
//       if (!acc[colorName]) acc[colorName] = [];
//       acc[colorName].push(variant);
//       return acc;
//     }, {}) || {};

//   const colors = Object.keys(groupedVariants);

//   const colorMap = {
//     Xanh: "#0000FF",
//     Đỏ: "#FF0000",
//     Vàng: "#FFFF00",
//     Đen: "#000000",
//     Trắng: "#FFFFFF",
//     Hồng: "#FFC0CB",
//     Bạc: "#C0C0C0",
//   };

//   // Tự động chọn biến thể đầu tiên sau khi tải dữ liệu sản phẩm
//   useEffect(() => {
//     if (product?.variants && product.variants.length > 0) {
//       const firstVariant = product.variants[0];
//       setSelectedVariant(firstVariant);
//       setQuantity(firstVariant?.stock > 0 ? 1 : 0);
//       setSelectedImage(firstVariant?.images?.[0]?.image_url || null);
//     }
//   }, [product]);

//   const handleColorSelect = (color) => {
//     const firstVariant = groupedVariants[color]?.[0];
//     setSelectedVariant(firstVariant);
//     setQuantity(firstVariant?.stock > 0 ? 1 : 0);
//     setSelectedImage(null);
//   };

//   const handleStorageSelect = (variant) => {
//     setSelectedVariant(variant);
//     setQuantity(variant?.stock > 0 ? 1 : 0);
//     setSelectedImage(null);
//   };

//   const handleQuantityChange = (e) => {
//     const value = parseInt(e.target.value, 10);

//     if (!selectedVariant || selectedVariant.stock === 0) {
//       messageApi.warning("Sản phẩm hiện đã hết hàng");
//       return setQuantity(0);
//     }

//     if (value < 1) {
//       messageApi.warning("Số lượng phải lớn hơn 0!");
//       return setQuantity(1);
//     }

//     if (value > selectedVariant.stock) {
//       messageApi.warning(`Chỉ còn ${selectedVariant.stock} sản phẩm!`);
//       return setQuantity(selectedVariant.stock);
//     }

//     setQuantity(value);
//   };

//   const { mutate, isPending } = useMutation({
//     mutationFn: async () => {
//       const res = await API.post("/cart/items", {
//         product_id: product.id,
//         color_id: selectedVariant.color.id,
//         storage_id: selectedVariant.storage.id,
//         quantity: quantity,
//       });

//       return res.data;
//     },
//     onSuccess: () => {
//       messageApi.success("Đã thêm vào giỏ hàng!");
//       queryClient.invalidateQueries(["CART_ITEM"]);
//     },
//     onError: (error) => {
//       messageApi.error("Thêm vào giỏ hàng thất bại: " + error.message);
//     },
//   });

//   const handleAddToCart = () => {
//     if (!selectedVariant) {
//       messageApi.warning("Vui lòng chọn biến thể!");
//       return;
//     }

//     if (selectedVariant.stock === 0) {
//       messageApi.warning("Sản phẩm đã hết hàng");
//       return;
//     }

//     mutate();
//   };

//   const handleSubmitReview = () => {
//     if (!selectedOrder) {
//       messageApi.error("Vui lòng chọn đơn hàng để đánh giá!");
//       return;
//     }
//     if (rating === 0) {
//       messageApi.error("Vui lòng chọn số sao!");
//       return;
//     }
//     submitReview();
//   };

//   if (isLoading) {
//     return <div className="text-center">Đang tải...</div>;
//   }

//   const activeVariant = selectedVariant;
//   const displayPrice = activeVariant ? activeVariant.price : product.price;
//   const selectedVariantImages = selectedVariant?.images || [];
//   const mainImage =
//     selectedImage ||
//     (activeVariant ? activeVariant.images?.[0]?.image_url : product.image);

//   return (
//     <>
//       {contextHolder}
//       <section>
//         <div style={{ backgroundColor: "#333" }}>
//           <div className="container py-5 text-light">
//             <div className="row mb-5">
//               {/* Ảnh sản phẩm */}
//               <div className="col-md-5">
//                 <div className="d-flex flex-column align-items-center">
//                   {/* Ảnh chính */}
//                   <div>
//                     <img
//                       src={mainImage}
//                       alt="Main"
//                       style={{
//                         width: "100%",
//                         maxHeight: "650px",
//                       }}
//                     />
//                   </div>
//                   {/* Ảnh nhỏ */}
//                   <div
//                     style={{
//                       width: 400,
//                       display: "flex",
//                       overflowX: "auto",
//                       scrollbarWidth: "thin",
//                       gap: "10px",
//                       padding: "10px 0",
//                     }}
//                   >
//                     {selectedVariantImages.length > 0 ? (
//                       selectedVariantImages.map((img, index) => (
//                         <img
//                           key={index}
//                           src={img.image_url}
//                           alt={`thumb-${index}`}
//                           onClick={() => setSelectedImage(img.image_url)}
//                           style={{
//                             width: 90,
//                             height: 100,
//                             padding: "5px",
//                             objectFit: "contain",
//                             backgroundColor: "#fff",
//                             cursor: "pointer",
//                             border:
//                               selectedImage === img.image_url
//                                 ? "2px solid #ffc107"
//                                 : "1px solid #ddd",
//                             borderRadius: "8px",
//                           }}
//                           className="rounded shadow"
//                         />
//                       ))
//                     ) : (
//                       <img
//                         src={product.image}
//                         alt="thumb-default"
//                         style={{
//                           width: 100,
//                           height: 100,
//                           padding: "5px",
//                           objectFit: "contain",
//                           backgroundColor: "#fff",
//                           flex: "0 0 auto",
//                         }}
//                         className="rounded shadow"
//                       />
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Thông tin sản phẩm */}
//               <div className="col-md-7">
//                 <h1 style={{ fontWeight: "bold" }}>{product.name}</h1>
//                 <h4 className="text-secondary">
//                   Danh mục: {product.category?.name || "_"}
//                 </h4>

//                 <h2 style={{ color: "red" }}>
//                   {displayPrice
//                     ? `${Number(displayPrice).toLocaleString("vi-VN")} VNĐ`
//                     : "0 VNĐ"}
//                 </h2>

//                 {/* Màu sắc */}
//                 {colors.length > 0 && (
//                   <div className="mb-3">
//                     <p>Màu sắc: </p>
//                     <div className="d-flex gap-2 mt-2">
//                       {colors.map((color) => (
//                         <div
//                           key={color}
//                           onClick={() => handleColorSelect(color)}
//                           style={{
//                             width: 30,
//                             height: 30,
//                             backgroundColor: colorMap[color] || "#ccc",
//                             cursor: "pointer",
//                           }}
//                           className={`rounded-circle border ${
//                             selectedVariant?.color?.value === color
//                               ? "border-warning"
//                               : ""
//                           }`}
//                         ></div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Dung lượng */}
//                 {selectedVariant && (
//                   <div className="mb-3">
//                     <p>Dung lượng:</p>
//                     <div className="d-flex gap-2 mt-2">
//                       {groupedVariants[selectedVariant.color.value]?.map(
//                         (variant) => (
//                           <button
//                             key={variant.id}
//                             onClick={() => handleStorageSelect(variant)}
//                             className={`btn btn-outline-light ${
//                               selectedVariant.id === variant.id
//                                 ? "border-warning text-warning"
//                                 : ""
//                             }`}
//                           >
//                             {variant.storage?.value}
//                           </button>
//                         )
//                       )}
//                     </div>
//                   </div>
//                 )}
//                 <p className="text-light">
//                   Số lượng trong kho: {selectedVariant?.stock || 0}
//                 </p>

//                 {/* Chọn số lượng */}
//                 <div className="mb-3">
//                   <input
//                     type="number"
//                     value={quantity}
//                     onChange={handleQuantityChange}
//                     className="form-control"
//                     style={{
//                       width: "100px",
//                     }}
//                   />
//                 </div>

//                 {/* Thêm vào giỏ hàng */}
//                 <div className="mb-3">
//                   <Button
//                     icon={<ShoppingCartOutlined />}
//                     onClick={handleAddToCart}
//                     size="large"
//                     type="primary"
//                     disabled={isPending}
//                   >
//                     {isPending ? "Đang thêm..." : "Thêm vào giỏ hàng"}
//                   </Button>
//                 </div>
//                 <hr style={{ margin: "30px 0" }} />
//                 <div style={{ fontSize: "16px", lineHeight: "1.6" }}>
//                   <p>
//                     <CheckCircleOutlined
//                       style={{ color: "#52c41a", marginRight: 8 }}
//                     />
//                     Bộ sản phẩm gồm: Hộp, Sách hướng dẫn, Cáp, Cây lấy sim
//                   </p>
//                   <p>
//                     <SyncOutlined
//                       style={{ color: "#1890ff", marginRight: 8 }}
//                     />
//                     Hư gì đổi nấy 12 tháng tại cửa hàng, chính sách bảo hành
//                   </p>
//                   <p>
//                     <CarOutlined style={{ color: "#faad14", marginRight: 8 }} />
//                     Giao hàng nhanh toàn quốc
//                   </p>
//                   <p>
//                     <PhoneOutlined
//                       style={{ color: "#f5222d", marginRight: 8 }}
//                     />
//                     Liên hệ: 0763.272.301 (8:00 - 21:30)
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//       <div className="container mt-5">
//         <section>
//           <Tabs defaultActiveKey="1">
//             {/* Tab Mô tả */}
//             <TabPane tab="Mô tả " key="1">
//               <h4>Mô tả sản phẩm</h4>
//               <p>{product.description}</p>
//             </TabPane>

//             {/* Tab Đánh giá */}
//             <TabPane tab="Đánh giá" key="2">
//               <h4>Đánh giá sản phẩm</h4>
//               <div className="row">
//                 <div className="col-md-12">
//                   {/* Form gửi đánh giá */}
//                   <div className="border p-3 rounded bg-light mb-3">
//                     <h5>Gửi đánh giá của bạn</h5>
//                     {reviewableOrders?.length > 0 ? (
//                       <>
//                         <Select
//                           placeholder="Chọn đơn hàng để đánh giá"
//                           style={{ width: 300, marginBottom: 10 }}
//                           onChange={(value) => setSelectedOrder(value)}
//                           value={selectedOrder}
//                         >
//                           {reviewableOrders.map((order) => (
//                             <Option key={order.id} value={order.id}>
//                               {order.order_code} (Đặt ngày: {new Date(order.created_at).toLocaleString()})
//                             </Option>
//                           ))}
//                         </Select>
//                         <Rate
//                           value={rating}
//                           onChange={(value) => setRating(value)}
//                           style={{ marginBottom: 10 }}
//                         />
//                         <Input.TextArea
//                           rows={4}
//                           placeholder="Nhập nhận xét của bạn"
//                           value={comment}
//                           onChange={(e) => setComment(e.target.value)}
//                           style={{ marginBottom: 10 }}
//                         />
//                         <Button
//                           type="primary"
//                           onClick={handleSubmitReview}
//                           loading={isSubmittingReview}
//                         >
//                           Gửi đánh giá
//                         </Button>
//                       </>
//                     ) : (
//                       <p>Bạn chưa có đơn hàng nào đủ điều kiện để đánh giá sản phẩm này.</p>
//                     )}
//                   </div>

//                   {/* Danh sách đánh giá */}
//                   <div className="border p-3 rounded bg-light mb-3">
//                     {comments?.data?.length > 0 ? (
//                       comments.data.map((comment, index) => (
//                         <div
//                           key={comment.id}
//                           style={{
//                             marginBottom: "30px", // Tăng khoảng cách giữa các đánh giá
//                             paddingBottom: "20px",
//                             borderBottom:
//                               index < comments.data.length - 1
//                                 ? "1px solid #e8e8e8" // Thêm đường phân cách giữa các đánh giá
//                                 : "none",
//                           }}
//                         >
//                           <div>
//                             <h5 className="d-flex align-items-center mb-2">
//                               <UserOutlined className="me-2" />
//                               {comment.user.name}
//                             </h5>
//                             <Rate
//                               value={comment.rating}
//                               disabled
//                               className="mb-2"
//                             />
//                           </div>
//                           <p>{comment.comment}</p>
//                           <p>
//                             Đơn hàng:{" "}
//                             <Link to={`/order/${comment.order?.id}`}>
//                               {comment.order?.order_code || "Không có mã đơn hàng"}
//                             </Link>
//                           </p>
//                           <p>
//                             Time: {new Date(comment.created_at).toLocaleString()}
//                           </p>
//                         </div>
//                       ))
//                     ) : (
//                       <p>Chưa có bình luận nào.</p>
//                     )}
//                     {comments?.total > 0 && (
//                       <Pagination
//                         current={currentPage}
//                         total={comments.total}
//                         pageSize={10}
//                         onChange={(page) => {
//                           setCurrentPage(page);
//                           refetchComments();
//                         }}
//                         style={{ marginTop: 20, textAlign: "center" }}
//                       />
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </TabPane>
//           </Tabs>
//         </section>

//         {/* Sản phẩm khác */}
//         <section className="font-poppins container mb-4">
//           <div className="text-center mb-5 mt-5">
//             <h2>Sản phẩm khác</h2>
//           </div>
//           <div className="row g-3">
//             {products?.slice(0, 8).map((prod) => (
//               <div key={prod.key} className="col-md-3">
//                 <div className="card h-100 shadow-sm product-box">
//                   <Link to={`/product/${prod.key}`}>
//                     <img
//                       src={prod.image}
//                       alt={prod.name}
//                       className="card-img-top"
//                       style={{ height: "250px", objectFit: "contain" }}
//                     />
//                   </Link>
//                   <div className="card-body bg-dark text-center">
//                     <Link
//                       to={`/product/${prod.key}`}
//                       className="text-decoration-none text-light"
//                     >
//                       <h5>{prod.name}</h5>
//                     </Link>
//                     <p className="text-secondary">{prod.category}</p>
//                     <p className="text-warning fw-semibold fs-5">
//                       {prod.price
//                         ? `${Number(prod.price).toLocaleString("vi-VN")} VNĐ`
//                         : "0 VNĐ"}
//                     </p>
//                     <Link
//                       to={`/product/${prod.key}`}
//                       className="text-decoration-none"
//                     >
//                       <button className="btn border border-warning text-light w-100 py-2 px-3">
//                         <ShoppingCartOutlined />
//                       </button>
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>
//       </div>
//     </>
//   );
// };

// export default DetailPage;

// import React, { useState, useEffect } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { Button, message, Rate, Tabs, Select, Input, Pagination } from "antd";
// import {
//   CarOutlined,
//   CheckCircleOutlined,
//   PhoneOutlined,
//   ShoppingCartOutlined,
//   SyncOutlined,
//   UserOutlined,
// } from "@ant-design/icons";
// import API from "../../../services/api";
// import TabPane from "antd/es/tabs/TabPane";

// const { Option } = Select;

// const DetailPage = () => {
//   const { id } = useParams(); // Lấy product_id từ URL
//   const navigate = useNavigate();
//   const [selectedVariant, setSelectedVariant] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [messageApi, contextHolder] = message.useMessage();
//   const queryClient = useQueryClient();
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState("");
//   const [selectedOrder, setSelectedOrder] = useState(null);

//   // Kiểm tra nếu id không hợp lệ
//   useEffect(() => {
//     if (!id) {
//       messageApi.error("Không tìm thấy sản phẩm!");
//       navigate("/");
//     }
//   }, [id, navigate, messageApi]);

//   // Lấy chi tiết sản phẩm theo product_id
//   const { data: product, isLoading } = useQuery({
//     queryKey: ["PRODUCT_DETAIL", id],
//     queryFn: async () => {
//       const { data } = await API.get(`/products/${id}`);
//       return data.data;
//     },
//     enabled: !!id,
//   });

//   // Lấy danh sách các sản phẩm khác
//   const { data: products } = useQuery({
//     queryKey: ["PRODUCTS_KEY"],
//     queryFn: async () => {
//       const { data } = await API.get("/products");
//       return data.data.map((item, index) => ({
//         key: item.id,
//         name: item.name,
//         price: item.price,
//         description: item.description,
//         image: item.image
//           ? `http://localhost:8000/storage/${item.image}`
//           : null,
//         category: item.category?.name || "_",
//         status: item.status,
//         stt: index + 1,
//       }));
//     },
//   });

//   // Lấy tất cả đánh giá của sản phẩm (bao gồm tất cả các biến thể)
//   const { data: allComments, refetch: refetchAllComments } = useQuery({
//     queryKey: ["PRODUCT_ALL_COMMENTS", id, currentPage],
//     queryFn: async () => {
//       // Giả sử có API lấy tất cả đánh giá của sản phẩm
//       // Nếu không có API này, chúng ta sẽ gọi API cho từng biến thể
//       const variantIds = product?.variants?.map((variant) => variant.id) || [];
//       const commentPromises = variantIds.map(async (variantId) => {
//         const { data } = await API.get(`/reviews/variant/${variantId}?page=${currentPage}`);
//         return data.data.data.map((comment) => ({
//           ...comment,
//           product_variant_id: variantId, // Thêm product_variant_id để biết đánh giá thuộc biến thể nào
//         }));
//       });

//       const commentsByVariant = await Promise.all(commentPromises);
//       const flattenedComments = commentsByVariant.flat();

//       return {
//         data: flattenedComments,
//         total: flattenedComments.length, // Cần điều chỉnh nếu API trả về tổng số
//         current_page: currentPage,
//       };
//     },
//     enabled: !!product?.variants?.length, // Chỉ chạy khi product và variants tồn tại
//   });

//   // Lấy danh sách đơn hàng có thể đánh giá của biến thể đã chọn
//   const { data: reviewableOrders } = useQuery({
//     queryKey: ["REVIEWABLE_ORDERS", selectedVariant?.id],
//     queryFn: async () => {
//       const { data } = await API.get(`/reviews/variant/${selectedVariant.id}/reviewable-orders`);
//       return data.data;
//     },
//     enabled: !!selectedVariant?.id, // Chỉ chạy khi selectedVariant tồn tại
//   });

//   // Gửi đánh giá cho biến thể đã chọn
//   const { mutate: submitReview, isPending: isSubmittingReview } = useMutation({
//     mutationFn: async () => {
//       const response = await API.post(`/reviews/variant/${selectedVariant.id}`, {
//         order_id: selectedOrder,
//         rating,
//         comment,
//       });
//       return response.data;
//     },
//     onSuccess: () => {
//       messageApi.success("Đánh giá đã được gửi thành công!");
//       setRating(0);
//       setComment("");
//       setSelectedOrder(null);
//       refetchAllComments(); // Tải lại danh sách tất cả đánh giá
//       queryClient.invalidateQueries(["REVIEWABLE_ORDERS"]); // Cập nhật danh sách đơn hàng có thể đánh giá
//     },
//     onError: (error) => {
//       messageApi.error(
//         error?.response?.data?.message || "Có lỗi xảy ra khi gửi đánh giá."
//       );
//     },
//   });

//   // Gom các biến thể theo màu sắc
//   const groupedVariants =
//     product?.variants?.reduce((acc, variant) => {
//       const colorName = variant.color?.value || "_";
//       if (!acc[colorName]) acc[colorName] = [];
//       acc[colorName].push(variant);
//       return acc;
//     }, {}) || {};

//   const colors = Object.keys(groupedVariants);

//   const colorMap = {
//     Xanh: "#0000FF",
//     Đỏ: "#FF0000",
//     Vàng: "#FFFF00",
//     Đen: "#000000",
//     Trắng: "#FFFFFF",
//     Hồng: "#FFC0CB",
//     Bạc: "#C0C0C0",
//   };

//   // Tự động chọn biến thể đầu tiên sau khi tải dữ liệu sản phẩm
//   useEffect(() => {
//     if (product?.variants && product.variants.length > 0) {
//       const firstVariant = product.variants[0];
//       setSelectedVariant(firstVariant);
//       setQuantity(firstVariant?.stock > 0 ? 1 : 0);
//       setSelectedImage(firstVariant?.images?.[0]?.image_url || null);
//     }
//   }, [product]);

//   const handleColorSelect = (color) => {
//     const firstVariant = groupedVariants[color]?.[0];
//     setSelectedVariant(firstVariant);
//     setQuantity(firstVariant?.stock > 0 ? 1 : 0);
//     setSelectedImage(null);
//   };

//   const handleStorageSelect = (variant) => {
//     setSelectedVariant(variant);
//     setQuantity(variant?.stock > 0 ? 1 : 0);
//     setSelectedImage(null);
//   };

//   const handleQuantityChange = (e) => {
//     const value = parseInt(e.target.value, 10);

//     if (!selectedVariant || selectedVariant.stock === 0) {
//       messageApi.warning("Sản phẩm hiện đã hết hàng");
//       return setQuantity(0);
//     }

//     if (value < 1) {
//       messageApi.warning("Số lượng phải lớn hơn 0!");
//       return setQuantity(1);
//     }

//     if (value > selectedVariant.stock) {
//       messageApi.warning(`Chỉ còn ${selectedVariant.stock} sản phẩm!`);
//       return setQuantity(selectedVariant.stock);
//     }

//     setQuantity(value);
//   };

//   const { mutate, isPending } = useMutation({
//     mutationFn: async () => {
//       const res = await API.post("/cart/items", {
//         product_variant_id: selectedVariant.id, // Sử dụng product_variant_id
//         quantity: quantity,
//       });
//       return res.data;
//     },
//     onSuccess: () => {
//       messageApi.success("Đã thêm vào giỏ hàng!");
//       queryClient.invalidateQueries(["CART_ITEM"]);
//     },
//     onError: (error) => {
//       messageApi.error("Thêm vào giỏ hàng thất bại: " + error.message);
//     },
//   });

//   const handleAddToCart = () => {
//     if (!selectedVariant) {
//       messageApi.warning("Vui lòng chọn biến thể!");
//       return;
//     }

//     if (selectedVariant.stock === 0) {
//       messageApi.warning("Sản phẩm đã hết hàng");
//       return;
//     }

//     mutate();
//   };

//   const handleSubmitReview = () => {
//     if (!selectedOrder) {
//       messageApi.error("Vui lòng chọn đơn hàng để đánh giá!");
//       return;
//     }
//     if (rating === 0) {
//       messageApi.error("Vui lòng chọn số sao!");
//       return;
//     }
//     submitReview();
//   };

//   // Hàm lấy thông tin biến thể từ product_variant_id
//   const getVariantInfo = (productVariantId) => {
//     const variant = product?.variants?.find((v) => v.id === productVariantId);
//     if (!variant) return "Không xác định";
//     return `${product.name} - ${variant.color?.value || "N/A"} - ${variant.storage?.value || "N/A"}`;
//   };

//   if (isLoading) {
//     return <div className="text-center">Đang tải...</div>;
//   }

//   if (!product) {
//     return <div className="text-center">Không tìm thấy sản phẩm!</div>;
//   }

//   const activeVariant = selectedVariant;
//   const displayPrice = activeVariant ? activeVariant.price : product.price;
//   const selectedVariantImages = selectedVariant?.images || [];
//   const mainImage =
//     selectedImage ||
//     (activeVariant ? activeVariant.images?.[0]?.image_url : product.image);

//   return (
//     <>
//       {contextHolder}
//       <section>
//         <div style={{ backgroundColor: "#333" }}>
//           <div className="container py-5 text-light">
//             <div className="row mb-5">
//               {/* Ảnh sản phẩm */}
//               <div className="col-md-5">
//                 <div className="d-flex flex-column align-items-center">
//                   {/* Ảnh chính */}
//                   <div>
//                     <img
//                       src={mainImage}
//                       alt="Main"
//                       style={{
//                         width: "100%",
//                         maxHeight: "650px",
//                       }}
//                     />
//                   </div>
//                   {/* Ảnh nhỏ */}
//                   <div
//                     style={{
//                       width: 400,
//                       display: "flex",
//                       overflowX: "auto",
//                       scrollbarWidth: "thin",
//                       gap: "10px",
//                       padding: "10px 0",
//                     }}
//                   >
//                     {selectedVariantImages.length > 0 ? (
//                       selectedVariantImages.map((img, index) => (
//                         <img
//                           key={index}
//                           src={img.image_url}
//                           alt={`thumb-${index}`}
//                           onClick={() => setSelectedImage(img.image_url)}
//                           style={{
//                             width: 90,
//                             height: 100,
//                             padding: "5px",
//                             objectFit: "contain",
//                             backgroundColor: "#fff",
//                             cursor: "pointer",
//                             border:
//                               selectedImage === img.image_url
//                                 ? "2px solid #ffc107"
//                                 : "1px solid #ddd",
//                             borderRadius: "8px",
//                           }}
//                           className="rounded shadow"
//                         />
//                       ))
//                     ) : (
//                       <img
//                         src={product.image}
//                         alt="thumb-default"
//                         style={{
//                           width: 100,
//                           height: 100,
//                           padding: "5px",
//                           objectFit: "contain",
//                           backgroundColor: "#fff",
//                           flex: "0 0 auto",
//                         }}
//                         className="rounded shadow"
//                       />
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Thông tin sản phẩm */}
//               <div className="col-md-7">
//                 <h1 style={{ fontWeight: "bold" }}>{product.name}</h1>
//                 <h4 className="text-secondary">
//                   Danh mục: {product.category?.name || "_"}
//                 </h4>

//                 <h2 style={{ color: "red" }}>
//                   {displayPrice
//                     ? `${Number(displayPrice).toLocaleString("vi-VN")} VNĐ`
//                     : "0 VNĐ"}
//                 </h2>

//                 {/* Màu sắc */}
//                 {colors.length > 0 && (
//                   <div className="mb-3">
//                     <p>Màu sắc: </p>
//                     <div className="d-flex gap-2 mt-2">
//                       {colors.map((color) => (
//                         <div
//                           key={color}
//                           onClick={() => handleColorSelect(color)}
//                           style={{
//                             width: 30,
//                             height: 30,
//                             backgroundColor: colorMap[color] || "#ccc",
//                             cursor: "pointer",
//                           }}
//                           className={`rounded-circle border ${
//                             selectedVariant?.color?.value === color
//                               ? "border-warning"
//                               : ""
//                           }`}
//                         ></div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Dung lượng */}
//                 {selectedVariant && (
//                   <div className="mb-3">
//                     <p>Dung lượng:</p>
//                     <div className="d-flex gap-2 mt-2">
//                       {groupedVariants[selectedVariant.color.value]?.map(
//                         (variant) => (
//                           <button
//                             key={variant.id}
//                             onClick={() => handleStorageSelect(variant)}
//                             className={`btn btn-outline-light ${
//                               selectedVariant.id === variant.id
//                                 ? "border-warning text-warning"
//                                 : ""
//                             }`}
//                           >
//                             {variant.storage?.value}
//                           </button>
//                         )
//                       )}
//                     </div>
//                   </div>
//                 )}
//                 <p className="text-light">
//                   Số lượng trong kho: {selectedVariant?.stock || 0}
//                 </p>

//                 {/* Chọn số lượng */}
//                 <div className="mb-3">
//                   <input
//                     type="number"
//                     value={quantity}
//                     onChange={handleQuantityChange}
//                     className="form-control"
//                     style={{
//                       width: "100px",
//                     }}
//                   />
//                 </div>

//                 {/* Thêm vào giỏ hàng */}
//                 <div className="mb-3">
//                   <Button
//                     icon={<ShoppingCartOutlined />}
//                     onClick={handleAddToCart}
//                     size="large"
//                     type="primary"
//                     disabled={isPending}
//                   >
//                     {isPending ? "Đang thêm..." : "Thêm vào giỏ hàng"}
//                   </Button>
//                 </div>
//                 <hr style={{ margin: "30px 0" }} />
//                 <div style={{ fontSize: "16px", lineHeight: "1.6" }}>
//                   <p>
//                     <CheckCircleOutlined
//                       style={{ color: "#52c41a", marginRight: 8 }}
//                     />
//                     Bộ sản phẩm gồm: Hộp, Sách hướng dẫn, Cáp, Cây lấy sim
//                   </p>
//                   <p>
//                     <SyncOutlined
//                       style={{ color: "#1890ff", marginRight: 8 }}
//                     />
//                     Hư gì đổi nấy 12 tháng tại cửa hàng, chính sách bảo hành
//                   </p>
//                   <p>
//                     <CarOutlined style={{ color: "#faad14", marginRight: 8 }} />
//                     Giao hàng nhanh toàn quốc
//                   </p>
//                   <p>
//                     <PhoneOutlined
//                       style={{ color: "#f5222d", marginRight: 8 }}
//                     />
//                     Liên hệ: 0763.272.301 (8:00 - 21:30)
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//       <div className="container mt-5">
//         <section>
//           <Tabs defaultActiveKey="1">
//             {/* Tab Mô tả */}
//             <TabPane tab="Mô tả" key="1">
//               <h4>Mô tả sản phẩm</h4>
//               <p>{product.description}</p>
//             </TabPane>

//             {/* Tab Đánh giá */}
//             <TabPane tab="Đánh giá" key="2">
//               <h4>Đánh giá sản phẩm</h4>
//               <div className="row">
//                 <div className="col-md-12">
//                   {/* Form gửi đánh giá */}
//                   <div className="border p-3 rounded bg-light mb-3">
//                     <h5>Gửi đánh giá của bạn</h5>
//                     {reviewableOrders?.length > 0 ? (
//                       <>
//                         <Select
//                           placeholder="Chọn đơn hàng để đánh giá"
//                           style={{ width: 300, marginBottom: 10 }}
//                           onChange={(value) => setSelectedOrder(value)}
//                           value={selectedOrder}
//                         >
//                           {reviewableOrders.map((order) => (
//                             <Option key={order.id} value={order.id}>
//                               {order.order_code} (Đặt ngày: {new Date(order.created_at).toLocaleString()})
//                             </Option>
//                           ))}
//                         </Select>
//                         <Rate
//                           value={rating}
//                           onChange={(value) => setRating(value)}
//                           style={{ marginBottom: 10 }}
//                         />
//                         <Input.TextArea
//                           rows={4}
//                           placeholder="Nhập nhận xét của bạn"
//                           value={comment}
//                           onChange={(e) => setComment(e.target.value)}
//                           style={{ marginBottom: 10 }}
//                         />
//                         <Button
//                           type="primary"
//                           onClick={handleSubmitReview}
//                           loading={isSubmittingReview}
//                         >
//                           Gửi đánh giá
//                         </Button>
//                       </>
//                     ) : (
//                       <p>Bạn chưa có đơn hàng nào đủ điều kiện để đánh giá biến thể này.</p>
//                     )}
//                   </div>

//                   {/* Danh sách đánh giá */}
//                   <div className="border p-3 rounded bg-light mb-3">
//                     {allComments?.data?.length > 0 ? (
//                       allComments.data.map((comment, index) => (
//                         <div
//                           key={comment.id}
//                           style={{
//                             marginBottom: "30px",
//                             paddingBottom: "20px",
//                             borderBottom:
//                               index < allComments.data.length - 1
//                                 ? "1px solid #e8e8e8"
//                                 : "none",
//                           }}
//                         >
//                           <div>
//                             <h5 className="d-flex align-items-center mb-2">
//                               <UserOutlined className="me-2" />
//                               {comment.user.name}
//                             </h5>
//                             <p className="text-muted">
//                               Đánh giá cho biến thể: {getVariantInfo(comment.product_variant_id)}
//                             </p>
//                             <Rate
//                               value={comment.rating}
//                               disabled
//                               className="mb-2"
//                             />
//                           </div>
//                           <p>{comment.comment}</p>
//                           <p>
//                             Đơn hàng:{" "}
//                             <Link to={`/order/${comment.order?.id}`}>
//                               {comment.order?.order_code || "Không có mã đơn hàng"}
//                             </Link>
//                           </p>
//                           <p>
//                             Time: {new Date(comment.created_at).toLocaleString()}
//                           </p>
//                         </div>
//                       ))
//                     ) : (
//                       <p>Chưa có bình luận nào cho sản phẩm này.</p>
//                     )}
//                     {allComments?.total > 0 && (
//                       <Pagination
//                         current={currentPage}
//                         total={allComments.total}
//                         pageSize={10}
//                         onChange={(page) => {
//                           setCurrentPage(page);
//                           refetchAllComments();
//                         }}
//                         style={{ marginTop: 20, textAlign: "center" }}
//                       />
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </TabPane>
//           </Tabs>
//         </section>

//         {/* Sản phẩm khác */}
//         <section className="font-poppins container mb-4">
//           <div className="text-center mb-5 mt-5">
//             <h2>Sản phẩm khác</h2>
//           </div>
//           <div className="row g-3">
//             {products?.slice(0, 8).map((prod) => (
//               <div key={prod.key} className="col-md-3">
//                 <div className="card h-100 shadow-sm product-box">
//                   <Link to={`/product/${prod.key}`}>
//                     <img
//                       src={prod.image}
//                       alt={prod.name}
//                       className="card-img-top"
//                       style={{ height: "250px", objectFit: "contain" }}
//                     />
//                   </Link>
//                   <div className="card-body bg-dark text-center">
//                     <Link
//                       to={`/product/${prod.key}`}
//                       className="text-decoration-none text-light"
//                     >
//                       <h5>{prod.name}</h5>
//                     </Link>
//                     <p className="text-secondary">{prod.category}</p>
//                     <p className="text-warning fw-semibold fs-5">
//                       {prod.price
//                         ? `${Number(prod.price).toLocaleString("vi-VN")} VNĐ`
//                         : "0 VNĐ"}
//                     </p>
//                     <Link
//                       to={`/product/${prod.key}`}
//                       className="text-decoration-none"
//                     >
//                       <button className="btn border border-warning text-light w-100 py-2 px-3">
//                         <ShoppingCartOutlined />
//                       </button>
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>
//       </div>
//     </>
//   );
// };

// export default DetailPage;

// import React, { useState, useEffect } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { Button, message, Rate, Tabs, Select, Input, Pagination } from "antd";
// import {
//   CarOutlined,
//   CheckCircleOutlined,
//   PhoneOutlined,
//   ShoppingCartOutlined,
//   SyncOutlined,
//   UserOutlined,
// } from "@ant-design/icons";
// import API from "../../../services/api";
// import TabPane from "antd/es/tabs/TabPane";

// const { Option } = Select;

// const DetailPage = () => {
//   const { id } = useParams(); // Lấy product_id từ URL
//   const navigate = useNavigate();
//   const [selectedVariant, setSelectedVariant] = useState(null);
//   const [selectedVariantFilter, setSelectedVariantFilter] = useState("all"); // Trạng thái để lọc đánh giá
//   const [quantity, setQuantity] = useState(1);
//   const [messageApi, contextHolder] = message.useMessage();
//   const queryClient = useQueryClient();
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState("");
//   const [selectedOrder, setSelectedOrder] = useState(null);

//   // Kiểm tra nếu id không hợp lệ
//   useEffect(() => {
//     if (!id) {
//       messageApi.error("Không tìm thấy sản phẩm!");
//       navigate("/");
//     }
//   }, [id, navigate, messageApi]);

//   // Lấy chi tiết sản phẩm theo product_id
//   const { data: product, isLoading } = useQuery({
//     queryKey: ["PRODUCT_DETAIL", id],
//     queryFn: async () => {
//       const { data } = await API.get(`/products/${id}`);
//       return data.data;
//     },
//     enabled: !!id,
//   });

//   // Lấy danh sách các sản phẩm khác
//   const { data: products } = useQuery({
//     queryKey: ["PRODUCTS_KEY"],
//     queryFn: async () => {
//       const { data } = await API.get("/products");
//       return data.data.map((item, index) => ({
//         key: item.id,
//         name: item.name,
//         price: item.price,
//         description: item.description,
//         image: item.image
//           ? `http://localhost:8000/storage/${item.image}`
//           : null,
//         category: item.category?.name || "_",
//         status: item.status,
//         stt: index + 1,
//       }));
//     },
//   });

//   // Lấy tất cả đánh giá của sản phẩm (bao gồm tất cả các biến thể)
//   const { data: allComments, refetch: refetchAllComments } = useQuery({
//     queryKey: ["PRODUCT_ALL_COMMENTS", id, currentPage],
//     queryFn: async () => {
//       const variantIds = product?.variants?.map((variant) => variant.id) || [];
//       const commentPromises = variantIds.map(async (variantId) => {
//         const { data } = await API.get(`/reviews/variant/${variantId}?page=${currentPage}`);
//         return data.data.data.map((comment) => ({
//           ...comment,
//           product_variant_id: variantId, // Thêm product_variant_id để biết đánh giá thuộc biến thể nào
//         }));
//       });

//       const commentsByVariant = await Promise.all(commentPromises);
//       const flattenedComments = commentsByVariant.flat();

//       return {
//         data: flattenedComments,
//         total: flattenedComments.length, // Cần điều chỉnh nếu API trả về tổng số
//         current_page: currentPage,
//       };
//     },
//     enabled: !!product?.variants?.length, // Chỉ chạy khi product và variants tồn tại
//   });

//   // Lọc đánh giá dựa trên selectedVariantFilter
//   const filteredComments = allComments?.data?.filter((comment) => {
//     if (selectedVariantFilter === "all") return true;
//     return comment.product_variant_id === parseInt(selectedVariantFilter);
//   });

//   // Lấy danh sách đơn hàng có thể đánh giá của biến thể đã chọn
//   const { data: reviewableOrders } = useQuery({
//     queryKey: ["REVIEWABLE_ORDERS", selectedVariant?.id],
//     queryFn: async () => {
//       const { data } = await API.get(`/reviews/variant/${selectedVariant.id}/reviewable-orders`);
//       return data.data;
//     },
//     enabled: !!selectedVariant?.id, // Chỉ chạy khi selectedVariant tồn tại
//   });

//   // Gửi đánh giá cho biến thể đã chọn
//   const { mutate: submitReview, isPending: isSubmittingReview } = useMutation({
//     mutationFn: async () => {
//       const response = await API.post(`/reviews/variant/${selectedVariant.id}`, {
//         order_id: selectedOrder,
//         rating,
//         comment,
//       });
//       return response.data;
//     },
//     onSuccess: () => {
//       messageApi.success("Đánh giá đã được gửi thành công!");
//       setRating(0);
//       setComment("");
//       setSelectedOrder(null);
//       refetchAllComments(); // Tải lại danh sách tất cả đánh giá
//       queryClient.invalidateQueries(["REVIEWABLE_ORDERS"]); // Cập nhật danh sách đơn hàng có thể đánh giá
//     },
//     onError: (error) => {
//       messageApi.error(
//         error?.response?.data?.message || "Có lỗi xảy ra khi gửi đánh giá."
//       );
//     },
//   });

//   // Gom các biến thể theo màu sắc
//   const groupedVariants =
//     product?.variants?.reduce((acc, variant) => {
//       const colorName = variant.color?.value || "_";
//       if (!acc[colorName]) acc[colorName] = [];
//       acc[colorName].push(variant);
//       return acc;
//     }, {}) || {};

//   const colors = Object.keys(groupedVariants);

//   const colorMap = {
//     Xanh: "#0000FF",
//     Đỏ: "#FF0000",
//     Vàng: "#FFFF00",
//     Đen: "#000000",
//     Trắng: "#FFFFFF",
//     Hồng: "#FFC0CB",
//     Bạc: "#C0C0C0",
//   };

//   // Tự động chọn biến thể đầu tiên sau khi tải dữ liệu sản phẩm
//   useEffect(() => {
//     if (product?.variants && product.variants.length > 0) {
//       const firstVariant = product.variants[0];
//       setSelectedVariant(firstVariant);
//       setQuantity(firstVariant?.stock > 0 ? 1 : 0);
//       setSelectedImage(firstVariant?.images?.[0]?.image_url || null);
//     }
//   }, [product]);

//   const handleColorSelect = (color) => {
//     const firstVariant = groupedVariants[color]?.[0];
//     setSelectedVariant(firstVariant);
//     setQuantity(firstVariant?.stock > 0 ? 1 : 0);
//     setSelectedImage(null);
//   };

//   const handleStorageSelect = (variant) => {
//     setSelectedVariant(variant);
//     setQuantity(variant?.stock > 0 ? 1 : 0);
//     setSelectedImage(null);
//   };

//   const handleQuantityChange = (e) => {
//     const value = parseInt(e.target.value, 10);

//     if (!selectedVariant || selectedVariant.stock === 0) {
//       messageApi.warning("Sản phẩm hiện đã hết hàng");
//       return setQuantity(0);
//     }

//     if (value < 1) {
//       messageApi.warning("Số lượng phải lớn hơn 0!");
//       return setQuantity(1);
//     }

//     if (value > selectedVariant.stock) {
//       messageApi.warning(`Chỉ còn ${selectedVariant.stock} sản phẩm!`);
//       return setQuantity(selectedVariant.stock);
//     }

//     setQuantity(value);
//   };

//   const { mutate, isPending } = useMutation({
//     mutationFn: async () => {
//       const res = await API.post("/cart/items", {
//         product_variant_id: selectedVariant.id, // Sử dụng product_variant_id
//         quantity: quantity,
//       });
//       return res.data;
//     },
//     onSuccess: () => {
//       messageApi.success("Đã thêm vào giỏ hàng!");
//       queryClient.invalidateQueries(["CART_ITEM"]);
//     },
//     onError: (error) => {
//       messageApi.error("Thêm vào giỏ hàng thất bại: " + error.message);
//     },
//   });

//   const handleAddToCart = () => {
//     if (!selectedVariant) {
//       messageApi.warning("Vui lòng chọn biến thể!");
//       return;
//     }

//     if (selectedVariant.stock === 0) {
//       messageApi.warning("Sản phẩm đã hết hàng");
//       return;
//     }

//     mutate();
//   };

//   const handleSubmitReview = () => {
//     if (!selectedOrder) {
//       messageApi.error("Vui lòng chọn đơn hàng để đánh giá!");
//       return;
//     }
//     if (rating === 0) {
//       messageApi.error("Vui lòng chọn số sao!");
//       return;
//     }
//     submitReview();
//   };

//   // Hàm lấy thông tin biến thể từ product_variant_id
//   const getVariantInfo = (productVariantId) => {
//     const variant = product?.variants?.find((v) => v.id === productVariantId);
//     if (!variant) return "Không xác định";
//     return `${product.name} - ${variant.color?.value || "N/A"} - ${variant.storage?.value || "N/A"}`;
//   };

//   if (isLoading) {
//     return <div className="text-center">Đang tải...</div>;
//   }

//   if (!product) {
//     return <div className="text-center">Không tìm thấy sản phẩm!</div>;
//   }

//   const activeVariant = selectedVariant;
//   const displayPrice = activeVariant ? activeVariant.price : product.price;
//   const selectedVariantImages = selectedVariant?.images || [];
//   const mainImage =
//     selectedImage ||
//     (activeVariant ? activeVariant.images?.[0]?.image_url : product.image);

//   return (
//     <>
//       {contextHolder}
//       <section>
//         <div style={{ backgroundColor: "#333" }}>
//           <div className="container py-5 text-light">
//             <div className="row mb-5">
//               {/* Ảnh sản phẩm */}
//               <div className="col-md-5">
//                 <div className="d-flex flex-column align-items-center">
//                   {/* Ảnh chính */}
//                   <div>
//                     <img
//                       src={mainImage}
//                       alt="Main"
//                       style={{
//                         width: "100%",
//                         maxHeight: "650px",
//                       }}
//                     />
//                   </div>
//                   {/* Ảnh nhỏ */}
//                   <div
//                     style={{
//                       width: 400,
//                       display: "flex",
//                       overflowX: "auto",
//                       scrollbarWidth: "thin",
//                       gap: "10px",
//                       padding: "10px 0",
//                     }}
//                   >
//                     {selectedVariantImages.length > 0 ? (
//                       selectedVariantImages.map((img, index) => (
//                         <img
//                           key={index}
//                           src={img.image_url}
//                           alt={`thumb-${index}`}
//                           onClick={() => setSelectedImage(img.image_url)}
//                           style={{
//                             width: 90,
//                             height: 100,
//                             padding: "5px",
//                             objectFit: "contain",
//                             backgroundColor: "#fff",
//                             cursor: "pointer",
//                             border:
//                               selectedImage === img.image_url
//                                 ? "2px solid #ffc107"
//                                 : "1px solid #ddd",
//                             borderRadius: "8px",
//                           }}
//                           className="rounded shadow"
//                         />
//                       ))
//                     ) : (
//                       <img
//                         src={product.image}
//                         alt="thumb-default"
//                         style={{
//                           width: 100,
//                           height: 100,
//                           padding: "5px",
//                           objectFit: "contain",
//                           backgroundColor: "#fff",
//                           flex: "0 0 auto",
//                         }}
//                         className="rounded shadow"
//                       />
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Thông tin sản phẩm */}
//               <div className="col-md-7">
//                 <h1 style={{ fontWeight: "bold" }}>{product.name}</h1>
//                 <h4 className="text-secondary">
//                   Danh mục: {product.category?.name || "_"}
//                 </h4>

//                 <h2 style={{ color: "red" }}>
//                   {displayPrice
//                     ? `${Number(displayPrice).toLocaleString("vi-VN")} VNĐ`
//                     : "0 VNĐ"}
//                 </h2>

//                 {/* Màu sắc */}
//                 {colors.length > 0 && (
//                   <div className="mb-3">
//                     <p>Màu sắc: </p>
//                     <div className="d-flex gap-2 mt-2">
//                       {colors.map((color) => (
//                         <div
//                           key={color}
//                           onClick={() => handleColorSelect(color)}
//                           style={{
//                             width: 30,
//                             height: 30,
//                             backgroundColor: colorMap[color] || "#ccc",
//                             cursor: "pointer",
//                           }}
//                           className={`rounded-circle border ${
//                             selectedVariant?.color?.value === color
//                               ? "border-warning"
//                               : ""
//                           }`}
//                         ></div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Dung lượng */}
//                 {selectedVariant && (
//                   <div className="mb-3">
//                     <p>Dung lượng:</p>
//                     <div className="d-flex gap-2 mt-2">
//                       {groupedVariants[selectedVariant.color.value]?.map(
//                         (variant) => (
//                           <button
//                             key={variant.id}
//                             onClick={() => handleStorageSelect(variant)}
//                             className={`btn btn-outline-light ${
//                               selectedVariant.id === variant.id
//                                 ? "border-warning text-warning"
//                                 : ""
//                             }`}
//                           >
//                             {variant.storage?.value}
//                           </button>
//                         )
//                       )}
//                     </div>
//                   </div>
//                 )}
//                 <p className="text-light">
//                   Số lượng trong kho: {selectedVariant?.stock || 0}
//                 </p>

//                 {/* Chọn số lượng */}
//                 <div className="mb-3">
//                   <input
//                     type="number"
//                     value={quantity}
//                     onChange={handleQuantityChange}
//                     className="form-control"
//                     style={{
//                       width: "100px",
//                     }}
//                   />
//                 </div>

//                 {/* Thêm vào giỏ hàng */}
//                 <div className="mb-3">
//                   <Button
//                     icon={<ShoppingCartOutlined />}
//                     onClick={handleAddToCart}
//                     size="large"
//                     type="primary"
//                     disabled={isPending}
//                   >
//                     {isPending ? "Đang thêm..." : "Thêm vào giỏ hàng"}
//                   </Button>
//                 </div>
//                 <hr style={{ margin: "30px 0" }} />
//                 <div style={{ fontSize: "16px", lineHeight: "1.6" }}>
//                   <p>
//                     <CheckCircleOutlined
//                       style={{ color: "#52c41a", marginRight: 8 }}
//                     />
//                     Bộ sản phẩm gồm: Hộp, Sách hướng dẫn, Cáp, Cây lấy sim
//                   </p>
//                   <p>
//                     <SyncOutlined
//                       style={{ color: "#1890ff", marginRight: 8 }}
//                     />
//                     Hư gì đổi nấy 12 tháng tại cửa hàng, chính sách bảo hành
//                   </p>
//                   <p>
//                     <CarOutlined style={{ color: "#faad14", marginRight: 8 }} />
//                     Giao hàng nhanh toàn quốc
//                   </p>
//                   <p>
//                     <PhoneOutlined
//                       style={{ color: "#f5222d", marginRight: 8 }}
//                     />
//                     Liên hệ: 0763.272.301 (8:00 - 21:30)
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//       <div className="container mt-5">
//         <section>
//           <Tabs defaultActiveKey="1">
//             {/* Tab Mô tả */}
//             <TabPane tab="Mô tả" key="1">
//               <h4>Mô tả sản phẩm</h4>
//               <p>{product.description}</p>
//             </TabPane>

//             {/* Tab Đánh giá */}
//             <TabPane tab="Đánh giá" key="2">
//               <h4>Đánh giá sản phẩm</h4>
//               <div className="row">
//                 <div className="col-md-12">
//                   {/* Form gửi đánh giá */}
//                   <div className="border p-3 rounded bg-light mb-3">
//                     <h5>Gửi đánh giá của bạn</h5>
//                     {reviewableOrders?.length > 0 ? (
//                       <>
//                         <Select
//                           placeholder="Chọn đơn hàng để đánh giá"
//                           style={{ width: 300, marginBottom: 10 }}
//                           onChange={(value) => setSelectedOrder(value)}
//                           value={selectedOrder}
//                         >
//                           {reviewableOrders.map((order) => (
//                             <Option key={order.id} value={order.id}>
//                               {order.order_code} (Đặt ngày: {new Date(order.created_at).toLocaleString()})
//                             </Option>
//                           ))}
//                         </Select>
//                         <Rate
//                           value={rating}
//                           onChange={(value) => setRating(value)}
//                           style={{ marginBottom: 10 }}
//                         />
//                         <Input.TextArea
//                           rows={4}
//                           placeholder="Nhập nhận xét của bạn"
//                           value={comment}
//                           onChange={(e) => setComment(e.target.value)}
//                           style={{ marginBottom: 10 }}
//                         />
//                         <Button
//                           type="primary"
//                           onClick={handleSubmitReview}
//                           loading={isSubmittingReview}
//                         >
//                           Gửi đánh giá
//                         </Button>
//                       </>
//                     ) : (
//                       <p>Bạn chưa có đơn hàng nào đủ điều kiện để đánh giá biến thể này.</p>
//                     )}
//                   </div>

//                   {/* Bộ lọc đánh giá theo biến thể */}
//                   <div className="mb-3">
//                     <h5>Lọc đánh giá theo biến thể:</h5>
//                     <Select
//                       style={{ width: 300 }}
//                       value={selectedVariantFilter}
//                       onChange={(value) => setSelectedVariantFilter(value)}
//                     >
//                       <Option value="all">Tất cả biến thể</Option>
//                       {product?.variants?.map((variant) => (
//                         <Option key={variant.id} value={variant.id.toString()}>
//                           {getVariantInfo(variant.id)}
//                         </Option>
//                       ))}
//                     </Select>
//                   </div>

//                   {/* Danh sách đánh giá */}
//                   <div className="border p-3 rounded bg-light mb-3">
//                     {filteredComments?.length > 0 ? (
//                       filteredComments.map((comment, index) => (
//                         <div
//                           key={comment.id}
//                           style={{
//                             marginBottom: "30px",
//                             paddingBottom: "20px",
//                             borderBottom:
//                               index < filteredComments.length - 1
//                                 ? "1px solid #e8e8e8"
//                                 : "none",
//                           }}
//                         >
//                           <div>
//                             <h5 className="d-flex align-items-center mb-2">
//                               <UserOutlined className="me-2" />
//                               {comment.user.name}
//                             </h5>
//                             <p className="text-muted">
//                               Đánh giá cho biến thể: {getVariantInfo(comment.product_variant_id)}
//                             </p>
//                             <Rate
//                               value={comment.rating}
//                               disabled
//                               className="mb-2"
//                             />
//                           </div>
//                           <p>{comment.comment}</p>
//                           <p>
//                             Đơn hàng:{" "}
//                             <Link to={`/order-detail/${comment.order?.id}`}>
//                               {comment.order?.order_code || "Không có mã đơn hàng"}
//                             </Link>
//                           </p>
//                           <p>
//                             Time: {new Date(comment.created_at).toLocaleString()}
//                           </p>
//                         </div>
//                       ))
//                     ) : (
//                       <p>Chưa có bình luận nào cho lựa chọn này.</p>
//                     )}
//                     {filteredComments?.length > 0 && (
//                       <Pagination
//                         current={currentPage}
//                         total={allComments.total}
//                         pageSize={10}
//                         onChange={(page) => {
//                           setCurrentPage(page);
//                           refetchAllComments();
//                         }}
//                         style={{ marginTop: 20, textAlign: "center" }}
//                       />
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </TabPane>
//           </Tabs>
//         </section>

//         {/* Sản phẩm khác */}
//         <section className="font-poppins container mb-4">
//           <div className="text-center mb-5 mt-5">
//             <h2>Sản phẩm khác</h2>
//           </div>
//           <div className="row g-3">
//             {products?.slice(0, 8).map((prod) => (
//               <div key={prod.key} className="col-md-3">
//                 <div className="card h-100 shadow-sm product-box">
//                   <Link to={`/product/${prod.key}`}>
//                     <img
//                       src={prod.image}
//                       alt={prod.name}
//                       className="card-img-top"
//                       style={{ height: "250px", objectFit: "contain" }}
//                     />
//                   </Link>
//                   <div className="card-body bg-dark text-center">
//                     <Link
//                       to={`/product/${prod.key}`}
//                       className="text-decoration-none text-light"
//                     >
//                       <h5>{prod.name}</h5>
//                     </Link>
//                     <p className="text-secondary">{prod.category}</p>
//                     <p className="text-warning fw-semibold fs-5">
//                       {prod.price
//                         ? `${Number(prod.price).toLocaleString("vi-VN")} VNĐ`
//                         : "0 VNĐ"}
//                     </p>
//                     <Link
//                       to={`/product/${prod.key}`}
//                       className="text-decoration-none"
//                     >
//                       <button className="btn border border-warning text-light w-100 py-2 px-3">
//                         <ShoppingCartOutlined />
//                       </button>
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>
//       </div>
//     </>
//   );
// };

// export default DetailPage;

// import React, { useState, useEffect } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { Button, message, Rate, Tabs, Select, Input, Pagination } from "antd";
// import {
//   CarOutlined,
//   CheckCircleOutlined,
//   PhoneOutlined,
//   ShoppingCartOutlined,
//   SyncOutlined,
//   UserOutlined,
// } from "@ant-design/icons";
// import API from "../../../services/api";
// import TabPane from "antd/es/tabs/TabPane";

// const { Option } = Select;

// const DetailPage = () => {
//   const { id } = useParams(); // Lấy product_id từ URL
//   const navigate = useNavigate();
//   const [selectedVariant, setSelectedVariant] = useState(null);
//   const [selectedVariantFilter, setSelectedVariantFilter] = useState("all"); // Trạng thái để lọc đánh giá
//   const [quantity, setQuantity] = useState(1);
//   const [messageApi, contextHolder] = message.useMessage();
//   const queryClient = useQueryClient();
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState("");
//   const [selectedOrder, setSelectedOrder] = useState(null);

//   // Kiểm tra nếu id không hợp lệ
//   useEffect(() => {
//     if (!id) {
//       messageApi.error("Không tìm thấy sản phẩm!");
//       navigate("/");
//     }
//   }, [id, navigate, messageApi]);

//   // Lấy chi tiết sản phẩm theo product_id
//   const { data: product, isLoading } = useQuery({
//     queryKey: ["PRODUCT_DETAIL", id],
//     queryFn: async () => {
//       const { data } = await API.get(`/products/${id}`);
//       return data.data;
//     },
//     enabled: !!id,
//   });

//   // Lấy danh sách các sản phẩm khác
//   const { data: products } = useQuery({
//     queryKey: ["PRODUCTS_KEY"],
//     queryFn: async () => {
//       const { data } = await API.get("/products");
//       return data.data.map((item, index) => ({
//         key: item.id,
//         name: item.name,
//         price: item.price,
//         description: item.description,
//         image: item.image
//           ? `http://localhost:8000/storage/${item.image}`
//           : null,
//         category: item.category?.name || "_",
//         status: item.status,
//         stt: index + 1,
//       }));
//     },
//   });

//   // Lấy tất cả đánh giá của sản phẩm (bao gồm tất cả các biến thể)
//   const { data: allComments, refetch: refetchAllComments } = useQuery({
//     queryKey: ["PRODUCT_ALL_COMMENTS", id, currentPage],
//     queryFn: async () => {
//       const variantIds = product?.variants?.map((variant) => variant.id) || [];
//       const commentPromises = variantIds.map(async (variantId) => {
//         const { data } = await API.get(`/reviews/variant/${variantId}?page=${currentPage}`);
//         return data.data.data.map((comment) => ({
//           ...comment,
//           product_variant_id: variantId, // Thêm product_variant_id để biết đánh giá thuộc biến thể nào
//         }));
//       });

//       const commentsByVariant = await Promise.all(commentPromises);
//       const flattenedComments = commentsByVariant.flat();

//       return {
//         data: flattenedComments,
//         total: flattenedComments.length, // Cần điều chỉnh nếu API trả về tổng số
//         current_page: currentPage,
//       };
//     },
//     enabled: !!product?.variants?.length, // Chỉ chạy khi product và variants tồn tại
//   });

//   // Lọc đánh giá dựa trên selectedVariantFilter
//   const filteredComments = allComments?.data?.filter((comment) => {
//     if (selectedVariantFilter === "all") return true;
//     return comment.product_variant_id === parseInt(selectedVariantFilter);
//   });

//   // Lấy danh sách đơn hàng có thể đánh giá của biến thể đã chọn
//   const { data: reviewableOrders } = useQuery({
//     queryKey: ["REVIEWABLE_ORDERS", selectedVariant?.id],
//     queryFn: async () => {
//       const { data } = await API.get(`/reviews/variant/${selectedVariant.id}/reviewable-orders`);
//       return data.data;
//     },
//     enabled: !!selectedVariant?.id, // Chỉ chạy khi selectedVariant tồn tại
//   });

//   // Gửi đánh giá cho biến thể đã chọn
//   const { mutate: submitReview, isPending: isSubmittingReview } = useMutation({
//     mutationFn: async () => {
//       const response = await API.post(`/reviews/variant/${selectedVariant.id}`, {
//         order_id: selectedOrder,
//         rating,
//         comment,
//       });
//       return response.data;
//     },
//     onSuccess: () => {
//       messageApi.success("Đánh giá đã được gửi thành công!");
//       setRating(0);
//       setComment("");
//       setSelectedOrder(null);
//       refetchAllComments(); // Tải lại danh sách tất cả đánh giá
//       queryClient.invalidateQueries(["REVIEWABLE_ORDERS"]); // Cập nhật danh sách đơn hàng có thể đánh giá
//     },
//     onError: (error) => {
//       messageApi.error(
//         error?.response?.data?.message || "Có lỗi xảy ra khi gửi đánh giá."
//       );
//     },
//   });

//   // Gom các biến thể theo màu sắc
//   const groupedVariants =
//     product?.variants?.reduce((acc, variant) => {
//       const colorName = variant.color?.value || "_";
//       if (!acc[colorName]) acc[colorName] = [];
//       acc[colorName].push(variant);
//       return acc;
//     }, {}) || {};

//   const colors = Object.keys(groupedVariants);

//   const colorMap = {
//     Xanh: "#0000FF",
//     Đỏ: "#FF0000",
//     Vàng: "#FFFF00",
//     Đen: "#000000",
//     Trắng: "#FFFFFF",
//     Hồng: "#FFC0CB",
//     Bạc: "#C0C0C0",
//   };

//   // Tự động chọn biến thể đầu tiên sau khi tải dữ liệu sản phẩm
//   useEffect(() => {
//     if (product?.variants && product.variants.length > 0) {
//       const firstVariant = product.variants[0];
//       setSelectedVariant(firstVariant);
//       setQuantity(firstVariant?.stock > 0 ? 1 : 0);
//       setSelectedImage(firstVariant?.images?.[0]?.image_url || null);
//     }
//   }, [product]);

//   const handleColorSelect = (color) => {
//     const firstVariant = groupedVariants[color]?.[0];
//     setSelectedVariant(firstVariant);
//     setQuantity(firstVariant?.stock > 0 ? 1 : 0);
//     setSelectedImage(null);
//   };

//   const handleStorageSelect = (variant) => {
//     setSelectedVariant(variant);
//     setQuantity(variant?.stock > 0 ? 1 : 0);
//     setSelectedImage(null);
//   };

//   const handleQuantityChange = (e) => {
//     const value = parseInt(e.target.value, 10);

//     if (!selectedVariant || selectedVariant.stock === 0) {
//       messageApi.warning("Sản phẩm hiện đã hết hàng");
//       return setQuantity(0);
//     }

//     if (value < 1) {
//       messageApi.warning("Số lượng phải lớn hơn 0!");
//       return setQuantity(1);
//     }

//     if (value > selectedVariant.stock) {
//       messageApi.warning(`Chỉ còn ${selectedVariant.stock} sản phẩm!`);
//       return setQuantity(selectedVariant.stock);
//     }

//     setQuantity(value);
//   };

//   const { mutate, isPending } = useMutation({
//     mutationFn: async () => {
//       const res = await API.post("/cart/items", {
//         product_variant_id: selectedVariant.id, // Sử dụng product_variant_id
//         quantity: quantity,
//       });
//       return res.data;
//     },
//     onSuccess: () => {
//       messageApi.success("Đã thêm vào giỏ hàng!");
//       queryClient.invalidateQueries(["CART_ITEM"]);
//     },
//     onError: (error) => {
//       messageApi.error("Thêm vào giỏ hàng thất bại: " + error.message);
//     },
//   });

//   const handleAddToCart = () => {
//     if (!selectedVariant) {
//       messageApi.warning("Vui lòng chọn biến thể!");
//       return;
//     }

//     if (selectedVariant.stock === 0) {
//       messageApi.warning("Sản phẩm đã hết hàng");
//       return;
//     }

//     mutate();
//   };

//   const handleSubmitReview = () => {
//     if (!selectedOrder) {
//       messageApi.error("Vui lòng chọn đơn hàng để đánh giá!");
//       return;
//     }
//     if (rating === 0) {
//       messageApi.error("Vui lòng chọn số sao!");
//       return;
//     }
//     submitReview();
//   };

//   // Hàm lấy thông tin biến thể từ product_variant_id
//   const getVariantInfo = (productVariantId) => {
//     const variant = product?.variants?.find((v) => v.id === productVariantId);
//     if (!variant) return "Không xác định";
//     return `${product.name} - ${variant.color?.value || "N/A"} - ${variant.storage?.value || "N/A"}`;
//   };

//   if (isLoading) {
//     return <div className="text-center">Đang tải...</div>;
//   }

//   if (!product) {
//     return <div className="text-center">Không tìm thấy sản phẩm!</div>;
//   }

//   const activeVariant = selectedVariant;
//   const displayPrice = activeVariant ? activeVariant.price : product.price;
//   const selectedVariantImages = selectedVariant?.images || [];
//   const mainImage =
//     selectedImage ||
//     (activeVariant ? activeVariant.images?.[0]?.image_url : product.image);

//   return (
//     <>
//       {contextHolder}
//       <section>
//         <div style={{ backgroundColor: "#333" }}>
//           <div className="container py-5 text-light">
//             <div className="row mb-5">
//               {/* Ảnh sản phẩm */}
//               <div className="col-md-5">
//                 <div className="d-flex flex-column align-items-center">
//                   {/* Ảnh chính */}
//                   <div>
//                     <img
//                       src={mainImage}
//                       alt="Main"
//                       style={{
//                         width: "100%",
//                         maxHeight: "650px",
//                       }}
//                     />
//                   </div>
//                   {/* Ảnh nhỏ */}
//                   <div
//                     style={{
//                       width: 400,
//                       display: "flex",
//                       overflowX: "auto",
//                       scrollbarWidth: "thin",
//                       gap: "10px",
//                       padding: "10px 0",
//                     }}
//                   >
//                     {selectedVariantImages.length > 0 ? (
//                       selectedVariantImages.map((img, index) => (
//                         <img
//                           key={index}
//                           src={img.image_url}
//                           alt={`thumb-${index}`}
//                           onClick={() => setSelectedImage(img.image_url)}
//                           style={{
//                             width: 90,
//                             height: 100,
//                             padding: "5px",
//                             objectFit: "contain",
//                             backgroundColor: "#fff",
//                             cursor: "pointer",
//                             border:
//                               selectedImage === img.image_url
//                                 ? "2px solid #ffc107"
//                                 : "1px solid #ddd",
//                             borderRadius: "8px",
//                           }}
//                           className="rounded shadow"
//                         />
//                       ))
//                     ) : (
//                       <img
//                         src={product.image}
//                         alt="thumb-default"
//                         style={{
//                           width: 100,
//                           height: 100,
//                           padding: "5px",
//                           objectFit: "contain",
//                           backgroundColor: "#fff",
//                           flex: "0 0 auto",
//                         }}
//                         className="rounded shadow"
//                       />
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Thông tin sản phẩm */}
//               <div className="col-md-7">
//                 <h1 style={{ fontWeight: "bold" }}>{product.name}</h1>
//                 <h4 className="text-secondary">
//                   Danh mục: {product.category?.name || "_"}
//                 </h4>

//                 <h2 style={{ color: "red" }}>
//                   {displayPrice
//                     ? `${Number(displayPrice).toLocaleString("vi-VN")} VNĐ`
//                     : "0 VNĐ"}
//                 </h2>

//                 {/* Màu sắc */}
//                 {colors.length > 0 && (
//                   <div className="mb-3">
//                     <p>Màu sắc: </p>
//                     <div className="d-flex gap-2 mt-2">
//                       {colors.map((color) => (
//                         <div
//                           key={color}
//                           onClick={() => handleColorSelect(color)}
//                           style={{
//                             width: 30,
//                             height: 30,
//                             backgroundColor: colorMap[color] || "#ccc",
//                             cursor: "pointer",
//                           }}
//                           className={`rounded-circle border ${
//                             selectedVariant?.color?.value === color
//                               ? "border-warning"
//                               : ""
//                           }`}
//                         ></div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Dung lượng */}
//                 {selectedVariant && (
//                   <div className="mb-3">
//                     <p>Dung lượng:</p>
//                     <div className="d-flex gap-2 mt-2">
//                       {groupedVariants[selectedVariant.color.value]?.map(
//                         (variant) => (
//                           <button
//                             key={variant.id}
//                             onClick={() => handleStorageSelect(variant)}
//                             className={`btn btn-outline-light ${
//                               selectedVariant.id === variant.id
//                                 ? "border-warning text-warning"
//                                 : ""
//                             }`}
//                           >
//                             {variant.storage?.value}
//                           </button>
//                         )
//                       )}
//                     </div>
//                   </div>
//                 )}
//                 <p className="text-light">
//                   Số lượng trong kho: {selectedVariant?.stock || 0}
//                 </p>

//                 {/* Chọn số lượng */}
//                 <div className="mb-3">
//                   <input
//                     type="number"
//                     value={quantity}
//                     onChange={handleQuantityChange}
//                     className="form-control"
//                     style={{
//                       width: "100px",
//                     }}
//                   />
//                 </div>

//                 {/* Thêm vào giỏ hàng */}
//                 <div className="mb-3">
//                   <Button
//                     icon={<ShoppingCartOutlined />}
//                     onClick={handleAddToCart}
//                     size="large"
//                     type="primary"
//                     disabled={isPending}
//                   >
//                     {isPending ? "Đang thêm..." : "Thêm vào giỏ hàng"}
//                   </Button>
//                 </div>
//                 <hr style={{ margin: "30px 0" }} />
//                 <div style={{ fontSize: "16px", lineHeight: "1.6" }}>
//                   <p>
//                     <CheckCircleOutlined
//                       style={{ color: "#52c41a", marginRight: 8 }}
//                     />
//                     Bộ sản phẩm gồm: Hộp, Sách hướng dẫn, Cáp, Cây lấy sim
//                   </p>
//                   <p>
//                     <SyncOutlined
//                       style={{ color: "#1890ff", marginRight: 8 }}
//                     />
//                     Hư gì đổi nấy 12 tháng tại cửa hàng, chính sách bảo hành
//                   </p>
//                   <p>
//                     <CarOutlined style={{ color: "#faad14", marginRight: 8 }} />
//                     Giao hàng nhanh toàn quốc
//                   </p>
//                   <p>
//                     <PhoneOutlined
//                       style={{ color: "#f5222d", marginRight: 8 }}
//                     />
//                     Liên hệ: 0763.272.301 (8:00 - 21:30)
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//       <div className="container mt-5">
//         <section>
//           <Tabs defaultActiveKey="1">
//             {/* Tab Mô tả */}
//             <TabPane tab="Mô tả" key="1">
//               <h4>Mô tả sản phẩm</h4>
//               <p>{product.description}</p>
//             </TabPane>

//             {/* Tab Đánh giá */}
//             <TabPane tab="Đánh giá" key="2">
//               <h4>Đánh giá sản phẩm</h4>
//               <div className="row">
//                 <div className="col-md-12">
//                   {/* Form gửi đánh giá */}
//                   <div className="border p-3 rounded bg-light mb-3">
//                     <h5>Gửi đánh giá của bạn</h5>
//                     {reviewableOrders?.length > 0 ? (
//                       <>
//                         <Select
//                           placeholder="Chọn đơn hàng để đánh giá"
//                           style={{ width: 300, marginBottom: 10 }}
//                           onChange={(value) => setSelectedOrder(value)}
//                           value={selectedOrder}
//                         >
//                           {reviewableOrders.map((order) => (
//                             <Option key={order.id} value={order.id}>
//                               {order.order_code} (Đặt ngày: {new Date(order.created_at).toLocaleString()})
//                             </Option>
//                           ))}
//                         </Select>
//                         <Rate
//                           value={rating}
//                           onChange={(value) => setRating(value)}
//                           style={{ marginBottom: 10 }}
//                         />
//                         <Input.TextArea
//                           rows={4}
//                           placeholder="Nhập nhận xét của bạn"
//                           value={comment}
//                           onChange={(e) => setComment(e.target.value)}
//                           style={{ marginBottom: 10 }}
//                         />
//                         <Button
//                           type="primary"
//                           onClick={handleSubmitReview}
//                           loading={isSubmittingReview}
//                         >
//                           Gửi đánh giá
//                         </Button>
//                       </>
//                     ) : (
//                       <p>Bạn chưa có đơn hàng nào đủ điều kiện để đánh giá biến thể này.</p>
//                     )}
//                   </div>

//                   {/* Bộ lọc đánh giá theo biến thể */}
//                   <div className="mb-3">
//                     <h5>Lọc đánh giá theo biến thể:</h5>
//                     <Select
//                       style={{ width: 300 }}
//                       value={selectedVariantFilter}
//                       onChange={(value) => setSelectedVariantFilter(value)}
//                     >
//                       <Option value="all">Tất cả biến thể</Option>
//                       {product?.variants?.map((variant) => (
//                         <Option key={variant.id} value={variant.id.toString()}>
//                           {getVariantInfo(variant.id)}
//                         </Option>
//                       ))}
//                     </Select>
//                   </div>

//                   {/* Danh sách đánh giá */}
//                   <div className="border p-3 rounded bg-light mb-3">
//                     {filteredComments?.length > 0 ? (
//                       filteredComments.map((comment, index) => (
//                         <div
//                           key={comment.id}
//                           style={{
//                             marginBottom: "30px",
//                             paddingBottom: "20px",
//                             borderBottom:
//                               index < filteredComments.length - 1
//                                 ? "1px solid #e8e8e8"
//                                 : "none",
//                           }}
//                         >
//                           <div>
//                             <h5 className="d-flex align-items-center mb-2">
//                               <UserOutlined className="me-2" />
//                               {comment.user.name}
//                             </h5>
//                             <p className="text-muted">
//                               Đánh giá cho biến thể: {getVariantInfo(comment.product_variant_id)}
//                             </p>
//                             <Rate
//                               value={comment.rating}
//                               disabled
//                               className="mb-2"
//                             />
//                           </div>
//                           <p>{comment.comment}</p>
//                           <p>
//                             Đơn hàng:{" "}
//                             {comment.order?.id ? (
//                               <Link to={`/my-order-detail/${comment.order.id}`}>
//                                 {comment.order.order_code || "Không có mã đơn hàng"}
//                               </Link>
//                             ) : (
//                               <span>{comment.order?.order_code || "Không có mã đơn hàng"}</span>
//                             )}
//                           </p>
//                           <p>
//                             Time: {new Date(comment.created_at).toLocaleString()}
//                           </p>
//                         </div>
//                       ))
//                     ) : (
//                       <p>Chưa có bình luận nào cho lựa chọn này.</p>
//                     )}
//                     {filteredComments?.length > 0 && (
//                       <Pagination
//                         current={currentPage}
//                         total={allComments.total}
//                         pageSize={10}
//                         onChange={(page) => {
//                           setCurrentPage(page);
//                           refetchAllComments();
//                         }}
//                         style={{ marginTop: 20, textAlign: "center" }}
//                       />
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </TabPane>
//           </Tabs>
//         </section>

//         {/* Sản phẩm khác */}
//         <section className="font-poppins container mb-4">
//           <div className="text-center mb-5 mt-5">
//             <h2>Sản phẩm khác</h2>
//           </div>
//           <div className="row g-3">
//             {products?.slice(0, 8).map((prod) => (
//               <div key={prod.key} className="col-md-3">
//                 <div className="card h-100 shadow-sm product-box">
//                   <Link to={`/product/${prod.key}`}>
//                     <img
//                       src={prod.image}
//                       alt={prod.name}
//                       className="card-img-top"
//                       style={{ height: "250px", objectFit: "contain" }}
//                     />
//                   </Link>
//                   <div className="card-body bg-dark text-center">
//                     <Link
//                       to={`/product/${prod.key}`}
//                       className="text-decoration-none text-light"
//                     >
//                       <h5>{prod.name}</h5>
//                     </Link>
//                     <p className="text-secondary">{prod.category}</p>
//                     <p className="text-warning fw-semibold fs-5">
//                       {prod.price
//                         ? `${Number(prod.price).toLocaleString("vi-VN")} VNĐ`
//                         : "0 VNĐ"}
//                     </p>
//                     <Link
//                       to={`/product/${prod.key}`}
//                       className="text-decoration-none"
//                     >
//                       <button className="btn border border-warning text-light w-100 py-2 px-3">
//                         <ShoppingCartOutlined />
//                       </button>
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>
//       </div>
//     </>
//   );
// };

// export default DetailPage;

// import React, { useState, useEffect, useContext } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { Button, message, Rate, Tabs, Select, Input, Pagination } from "antd";
// import {
//   CarOutlined,
//   CheckCircleOutlined,
//   PhoneOutlined,
//   ShoppingCartOutlined,
//   SyncOutlined,
//   UserOutlined,
// } from "@ant-design/icons";
// import API from "../../../services/api";
// import TabPane from "antd/es/tabs/TabPane";
// import { AuthContext } from "../../../context/AuthContext"; // Import AuthContext

// const { Option } = Select;

// const DetailPage = () => {
//   const { id } = useParams(); // Lấy product_id từ URL
//   const navigate = useNavigate();
//   const { user } = useContext(AuthContext); // Lấy thông tin user từ AuthContext
//   const [selectedVariant, setSelectedVariant] = useState(null);
//   const [selectedVariantFilter, setSelectedVariantFilter] = useState("all"); // Trạng thái để lọc đánh giá
//   const [quantity, setQuantity] = useState(1);
//   const [messageApi, contextHolder] = message.useMessage();
//   const queryClient = useQueryClient();
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState("");
//   const [selectedOrder, setSelectedOrder] = useState(null);

//   // Kiểm tra nếu id không hợp lệ
//   useEffect(() => {
//     if (!id) {
//       messageApi.error("Không tìm thấy sản phẩm!");
//       navigate("/");
//     }
//   }, [id, navigate, messageApi]);

//   // Lấy chi tiết sản phẩm theo product_id
//   const { data: product, isLoading } = useQuery({
//     queryKey: ["PRODUCT_DETAIL", id],
//     queryFn: async () => {
//       const { data } = await API.get(`/products/${id}`);
//       return data.data;
//     },
//     enabled: !!id,
//   });

//   // Lấy danh sách các sản phẩm khác
//   const { data: products } = useQuery({
//     queryKey: ["PRODUCTS_KEY"],
//     queryFn: async () => {
//       const { data } = await API.get("/products");
//       return data.data.map((item, index) => ({
//         key: item.id,
//         name: item.name,
//         price: item.price,
//         description: item.description,
//         image: item.image
//           ? `http://localhost:8000/storage/${item.image}`
//           : null,
//         category: item.category?.name || "_",
//         status: item.status,
//         stt: index + 1,
//       }));
//     },
//   });

//   // Lấy tất cả đánh giá của sản phẩm (bao gồm tất cả các biến thể)
//   const { data: allComments, refetch: refetchAllComments } = useQuery({
//     queryKey: ["PRODUCT_ALL_COMMENTS", id, currentPage],
//     queryFn: async () => {
//       const variantIds = product?.variants?.map((variant) => variant.id) || [];
//       const commentPromises = variantIds.map(async (variantId) => {
//         const { data } = await API.get(`/reviews/variant/${variantId}?page=${currentPage}`);
//         return data.data.data.map((comment) => ({
//           ...comment,
//           product_variant_id: variantId, // Thêm product_variant_id để biết đánh giá thuộc biến thể nào
//         }));
//       });

//       const commentsByVariant = await Promise.all(commentPromises);
//       const flattenedComments = commentsByVariant.flat();

//       return {
//         data: flattenedComments,
//         total: flattenedComments.length, // Cần điều chỉnh nếu API trả về tổng số
//         current_page: currentPage,
//       };
//     },
//     enabled: !!product?.variants?.length, // Chỉ chạy khi product và variants tồn tại
//   });

//   // Lọc đánh giá dựa trên selectedVariantFilter
//   const filteredComments = allComments?.data?.filter((comment) => {
//     if (selectedVariantFilter === "all") return true;
//     return comment.product_variant_id === parseInt(selectedVariantFilter);
//   });

//   // Lấy danh sách đơn hàng có thể đánh giá của biến thể đã chọn
//   const { data: reviewableOrders } = useQuery({
//     queryKey: ["REVIEWABLE_ORDERS", selectedVariant?.id],
//     queryFn: async () => {
//       const { data } = await API.get(`/reviews/variant/${selectedVariant.id}/reviewable-orders`);
//       return data.data;
//     },
//     enabled: !!selectedVariant?.id, // Chỉ chạy khi selectedVariant tồn tại
//   });

//   // Gửi đánh giá cho biến thể đã chọn
//   const { mutate: submitReview, isPending: isSubmittingReview } = useMutation({
//     mutationFn: async () => {
//       const response = await API.post(`/reviews/variant/${selectedVariant.id}`, {
//         order_id: selectedOrder,
//         rating,
//         comment,
//       });
//       return response.data;
//     },
//     onSuccess: () => {
//       messageApi.success("Đánh giá đã được gửi thành công!");
//       setRating(0);
//       setComment("");
//       setSelectedOrder(null);
//       refetchAllComments(); // Tải lại danh sách tất cả đánh giá
//       queryClient.invalidateQueries(["REVIEWABLE_ORDERS"]); // Cập nhật danh sách đơn hàng có thể đánh giá
//     },
//     onError: (error) => {
//       messageApi.error(
//         error?.response?.data?.message || "Có lỗi xảy ra khi gửi đánh giá."
//       );
//     },
//   });

//   // Gom các biến thể theo màu sắc
//   const groupedVariants =
//     product?.variants?.reduce((acc, variant) => {
//       const colorName = variant.color?.value || "_";
//       if (!acc[colorName]) acc[colorName] = [];
//       acc[colorName].push(variant);
//       return acc;
//     }, {}) || {};

//   const colors = Object.keys(groupedVariants);

//   const colorMap = {
//     Xanh: "#0000FF",
//     Đỏ: "#FF0000",
//     Vàng: "#FFFF00",
//     Đen: "#000000",
//     Trắng: "#FFFFFF",
//     Hồng: "#FFC0CB",
//     Bạc: "#C0C0C0",
//   };

//   // Tự động chọn biến thể đầu tiên sau khi tải dữ liệu sản phẩm
//   useEffect(() => {
//     if (product?.variants && product.variants.length > 0) {
//       const firstVariant = product.variants[0];
//       setSelectedVariant(firstVariant);
//       setQuantity(firstVariant?.stock > 0 ? 1 : 0);
//       setSelectedImage(firstVariant?.images?.[0]?.image_url || null);
//     }
//   }, [product]);

//   const handleColorSelect = (color) => {
//     const firstVariant = groupedVariants[color]?.[0];
//     setSelectedVariant(firstVariant);
//     setQuantity(firstVariant?.stock > 0 ? 1 : 0);
//     setSelectedImage(null);
//   };

//   const handleStorageSelect = (variant) => {
//     setSelectedVariant(variant);
//     setQuantity(variant?.stock > 0 ? 1 : 0);
//     setSelectedImage(null);
//   };

//   const handleQuantityChange = (e) => {
//     const value = parseInt(e.target.value, 10);

//     if (!selectedVariant || selectedVariant.stock === 0) {
//       messageApi.warning("Sản phẩm hiện đã hết hàng");
//       return setQuantity(0);
//     }

//     if (isNaN(value) || value < 1) {
//       messageApi.warning("Số lượng phải lớn hơn 0!");
//       return setQuantity(1);
//     }

//     if (value > selectedVariant.stock) {
//       messageApi.warning(`Chỉ còn ${selectedVariant.stock} sản phẩm!`);
//       return setQuantity(selectedVariant.stock);
//     }

//     setQuantity(value);
//   };

//   const { mutate, isPending } = useMutation({
//     mutationFn: async () => {
//       // Debug dữ liệu gửi lên
//       console.log("Dữ liệu gửi lên:", {
//         product_id: product?.id,
//         color_id: selectedVariant?.color?.id,
//         storage_id: selectedVariant?.storage?.id,
//         quantity: quantity,
//         user_id: user?.id, // Thêm user_id
//       });

//       // Kiểm tra dữ liệu trước khi gửi
//       if (!product?.id || !Number.isInteger(product.id)) {
//         throw new Error("product_id không hợp lệ hoặc không tồn tại.");
//       }
//       if (!selectedVariant?.color?.id || !Number.isInteger(selectedVariant.color.id)) {
//         throw new Error("color_id không hợp lệ hoặc không tồn tại.");
//       }
//       if (!selectedVariant?.storage?.id || !Number.isInteger(selectedVariant.storage.id)) {
//         throw new Error("storage_id không hợp lệ hoặc không tồn tại.");
//       }
//       if (!quantity || !Number.isInteger(quantity) || quantity < 1) {
//         throw new Error("quantity không hợp lệ, phải là số nguyên dương.");
//       }
//       if (!user?.id || !Number.isInteger(user.id)) {
//         throw new Error("Vui lòng đăng nhập để thêm vào giỏ hàng.");
//       }

//       const res = await API.post("/cart/items", {
//         product_id: product.id,
//         color_id: selectedVariant.color.id, // Sử dụng color_id thay vì product_variant_id
//         storage_id: selectedVariant.storage.id, // Sử dụng storage_id thay vì product_variant_id
//         quantity: quantity,
//         user_id: user.id, // Thêm user_id
//       });
//       return res.data;
//     },
//     onSuccess: () => {
//       messageApi.success("Đã thêm vào giỏ hàng!");
//       queryClient.invalidateQueries(["CART_ITEM"]);
//     },
//     onError: (error) => {
//       // Hiển thị chi tiết lỗi từ backend
//       let errorMessage = "Có lỗi xảy ra khi thêm vào giỏ hàng.";
//       if (error?.response?.data?.message) {
//         errorMessage = error.response.data.message;
//       }
//       if (error?.response?.data?.errors) {
//         const errorDetails = error.response.data.errors
//           .map((err) => err.msg)
//           .join(", ");
//         errorMessage += errorDetails ? `: ${errorDetails}` : "";
//       } else {
//         errorMessage += `: ${error.message}`;
//       }
//       messageApi.error("Thêm vào giỏ hàng thất bại: " + errorMessage);
//     },
//   });

//   const handleAddToCart = () => {
//     if (!user) {
//       messageApi.warning("Vui lòng đăng nhập để thêm vào giỏ hàng!");
//       navigate("/login");
//       return;
//     }

//     if (!product) {
//       messageApi.warning("Không tìm thấy sản phẩm!");
//       return;
//     }

//     if (!selectedVariant) {
//       messageApi.warning("Vui lòng chọn biến thể!");
//       return;
//     }

//     if (selectedVariant.stock === 0) {
//       messageApi.warning("Sản phẩm đã hết hàng");
//       return;
//     }

//     if (
//       !selectedVariant.color?.id ||
//       !selectedVariant.storage?.id ||
//       isNaN(quantity) ||
//       quantity < 1
//     ) {
//       messageApi.error("Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.");
//       return;
//     }

//     mutate();
//   };

//   const handleSubmitReview = () => {
//     if (!selectedOrder) {
//       messageApi.error("Vui lòng chọn đơn hàng để đánh giá!");
//       return;
//     }
//     if (rating === 0) {
//       messageApi.error("Vui lòng chọn số sao!");
//       return;
//     }
//     submitReview();
//   };

//   // Hàm lấy thông tin biến thể từ product_variant_id
//   const getVariantInfo = (productVariantId) => {
//     const variant = product?.variants?.find((v) => v.id === productVariantId);
//     if (!variant) return "Không xác định";
//     return `${product.name} - ${variant.color?.value || "N/A"} - ${variant.storage?.value || "N/A"}`;
//   };

//   if (isLoading) {
//     return <div className="text-center">Đang tải...</div>;
//   }

//   if (!product) {
//     return <div className="text-center">Không tìm thấy sản phẩm!</div>;
//   }

//   const activeVariant = selectedVariant;
//   const displayPrice = activeVariant ? activeVariant.price : product.price;
//   const selectedVariantImages = selectedVariant?.images || [];
//   const mainImage =
//     selectedImage ||
//     (activeVariant ? activeVariant.images?.[0]?.image_url : product.image);

//   return (
//     <>
//       {contextHolder}
//       <section>
//         <div style={{ backgroundColor: "#333" }}>
//           <div className="container py-5 text-light">
//             <div className="row mb-5">
//               {/* Ảnh sản phẩm */}
//               <div className="col-md-5">
//                 <div className="d-flex flex-column align-items-center">
//                   {/* Ảnh chính */}
//                   <div>
//                     <img
//                       src={mainImage}
//                       alt="Main"
//                       style={{
//                         width: "100%",
//                         maxHeight: "650px",
//                       }}
//                     />
//                   </div>
//                   {/* Ảnh nhỏ */}
//                   <div
//                     style={{
//                       width: 400,
//                       display: "flex",
//                       overflowX: "auto",
//                       scrollbarWidth: "thin",
//                       gap: "10px",
//                       padding: "10px 0",
//                     }}
//                   >
//                     {selectedVariantImages.length > 0 ? (
//                       selectedVariantImages.map((img, index) => (
//                         <img
//                           key={index}
//                           src={img.image_url}
//                           alt={`thumb-${index}`}
//                           onClick={() => setSelectedImage(img.image_url)}
//                           style={{
//                             width: 90,
//                             height: 100,
//                             padding: "5px",
//                             objectFit: "contain",
//                             backgroundColor: "#fff",
//                             cursor: "pointer",
//                             border:
//                               selectedImage === img.image_url
//                                 ? "2px solid #ffc107"
//                                 : "1px solid #ddd",
//                             borderRadius: "8px",
//                           }}
//                           className="rounded shadow"
//                         />
//                       ))
//                     ) : (
//                       <img
//                         src={product.image}
//                         alt="thumb-default"
//                         style={{
//                           width: 100,
//                           height: 100,
//                           padding: "5px",
//                           objectFit: "contain",
//                           backgroundColor: "#fff",
//                           flex: "0 0 auto",
//                         }}
//                         className="rounded shadow"
//                       />
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Thông tin sản phẩm */}
//               <div className="col-md-7">
//                 <h1 style={{ fontWeight: "bold" }}>{product.name}</h1>
//                 <h4 className="text-secondary">
//                   Danh mục: {product.category?.name || "_"}
//                 </h4>

//                 <h2 style={{ color: "red" }}>
//                   {displayPrice
//                     ? `${Number(displayPrice).toLocaleString("vi-VN")} VNĐ`
//                     : "0 VNĐ"}
//                 </h2>

//                 {/* Màu sắc */}
//                 {colors.length > 0 && (
//                   <div className="mb-3">
//                     <p>Màu sắc: </p>
//                     <div className="d-flex gap-2 mt-2">
//                       {colors.map((color) => (
//                         <div
//                           key={color}
//                           onClick={() => handleColorSelect(color)}
//                           style={{
//                             width: 30,
//                             height: 30,
//                             backgroundColor: colorMap[color] || "#ccc",
//                             cursor: "pointer",
//                           }}
//                           className={`rounded-circle border ${
//                             selectedVariant?.color?.value === color
//                               ? "border-warning"
//                               : ""
//                           }`}
//                         ></div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Dung lượng */}
//                 {selectedVariant && (
//                   <div className="mb-3">
//                     <p>Dung lượng:</p>
//                     <div className="d-flex gap-2 mt-2">
//                       {groupedVariants[selectedVariant.color.value]?.map(
//                         (variant) => (
//                           <button
//                             key={variant.id}
//                             onClick={() => handleStorageSelect(variant)}
//                             className={`btn btn-outline-light ${
//                               selectedVariant.id === variant.id
//                                 ? "border-warning text-warning"
//                                 : ""
//                             }`}
//                           >
//                             {variant.storage?.value}
//                           </button>
//                         )
//                       )}
//                     </div>
//                   </div>
//                 )}
//                 <p className="text-light">
//                   Số lượng trong kho: {selectedVariant?.stock || 0}
//                 </p>

//                 {/* Chọn số lượng */}
//                 <div className="mb-3">
//                   <input
//                     type="number"
//                     value={quantity}
//                     onChange={handleQuantityChange}
//                     className="form-control"
//                     style={{
//                       width: "100px",
//                     }}
//                   />
//                 </div>

//                 {/* Thêm vào giỏ hàng */}
//                 <div className="mb-3">
//                   <Button
//                     icon={<ShoppingCartOutlined />}
//                     onClick={handleAddToCart}
//                     size="large"
//                     type="primary"
//                     disabled={isPending}
//                   >
//                     {isPending ? "Đang thêm..." : "Thêm vào giỏ hàng"}
//                   </Button>
//                 </div>
//                 <hr style={{ margin: "30px 0" }} />
//                 <div style={{ fontSize: "16px", lineHeight: "1.6" }}>
//                   <p>
//                     <CheckCircleOutlined
//                       style={{ color: "#52c41a", marginRight: 8 }}
//                     />
//                     Bộ sản phẩm gồm: Hộp, Sách hướng dẫn, Cáp, Cây lấy sim
//                   </p>
//                   <p>
//                     <SyncOutlined
//                       style={{ color: "#1890ff", marginRight: 8 }}
//                     />
//                     Hư gì đổi nấy 12 tháng tại cửa hàng, chính sách bảo hành
//                   </p>
//                   <p>
//                     <CarOutlined style={{ color: "#faad14", marginRight: 8 }} />
//                     Giao hàng nhanh toàn quốc
//                   </p>
//                   <p>
//                     <PhoneOutlined
//                       style={{ color: "#f5222d", marginRight: 8 }}
//                     />
//                     Liên hệ: 0763.272.301 (8:00 - 21:30)
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//       <div className="container mt-5">
//         <section>
//           <Tabs defaultActiveKey="1">
//             {/* Tab Mô tả */}
//             <TabPane tab="Mô tả" key="1">
//               <h4>Mô tả sản phẩm</h4>
//               <p>{product.description}</p>
//             </TabPane>

//             {/* Tab Đánh giá */}
//             <TabPane tab="Đánh giá" key="2">
//               <h4>Đánh giá sản phẩm</h4>
//               <div className="row">
//                 <div className="col-md-12">
//                   {/* Form gửi đánh giá */}
//                   <div className="border p-3 rounded bg-light mb-3">
//                     <h5>Gửi đánh giá của bạn</h5>
//                     {reviewableOrders?.length > 0 ? (
//                       <>
//                         <Select
//                           placeholder="Chọn đơn hàng để đánh giá"
//                           style={{ width: 300, marginBottom: 10 }}
//                           onChange={(value) => setSelectedOrder(value)}
//                           value={selectedOrder}
//                         >
//                           {reviewableOrders.map((order) => (
//                             <Option key={order.id} value={order.id}>
//                               {order.order_code} (Đặt ngày: {new Date(order.created_at).toLocaleString()})
//                             </Option>
//                           ))}
//                         </Select>
//                         <Rate
//                           value={rating}
//                           onChange={(value) => setRating(value)}
//                           style={{ marginBottom: 10 }}
//                         />
//                         <Input.TextArea
//                           rows={4}
//                           placeholder="Nhập nhận xét của bạn"
//                           value={comment}
//                           onChange={(e) => setComment(e.target.value)}
//                           style={{ marginBottom: 10 }}
//                         />
//                         <Button
//                           type="primary"
//                           onClick={handleSubmitReview}
//                           loading={isSubmittingReview}
//                         >
//                           Gửi đánh giá
//                         </Button>
//                       </>
//                     ) : (
//                       <p>Bạn chưa có đơn hàng nào đủ điều kiện để đánh giá biến thể này.</p>
//                     )}
//                   </div>

//                   {/* Bộ lọc đánh giá theo biến thể */}
//                   <div className="mb-3">
//                     <h5>Lọc đánh giá theo biến thể:</h5>
//                     <Select
//                       style={{ width: 300 }}
//                       value={selectedVariantFilter}
//                       onChange={(value) => setSelectedVariantFilter(value)}
//                     >
//                       <Option value="all">Tất cả biến thể</Option>
//                       {product?.variants?.map((variant) => (
//                         <Option key={variant.id} value={variant.id.toString()}>
//                           {getVariantInfo(variant.id)}
//                         </Option>
//                       ))}
//                     </Select>
//                   </div>

//                   {/* Danh sách đánh giá */}
//                   <div className="border p-3 rounded bg-light mb-3">
//                     {filteredComments?.length > 0 ? (
//                       filteredComments.map((comment, index) => (
//                         <div
//                           key={comment.id}
//                           style={{
//                             marginBottom: "30px",
//                             paddingBottom: "20px",
//                             borderBottom:
//                               index < filteredComments.length - 1
//                                 ? "1px solid #e8e8e8"
//                                 : "none",
//                           }}
//                         >
//                           <div>
//                             <h5 className="d-flex align-items-center mb-2">
//                               <UserOutlined className="me-2" />
//                               {comment.user.name}
//                             </h5>
//                             <p className="text-muted">
//                               Đánh giá cho biến thể: {getVariantInfo(comment.product_variant_id)}
//                             </p>
//                             <Rate
//                               value={comment.rating}
//                               disabled
//                               className="mb-2"
//                             />
//                           </div>
//                           <p>{comment.comment}</p>
//                           <p>
//                             Đơn hàng:{" "}
//                             {comment.order?.id ? (
//                               <Link to={`/my-order-detail/${comment.order.id}`}>
//                                 {comment.order.order_code || "Không có mã đơn hàng"}
//                               </Link>
//                             ) : (
//                               <span>{comment.order?.order_code || "Không có mã đơn hàng"}</span>
//                             )}
//                           </p>
//                           <p>
//                             Time: {new Date(comment.created_at).toLocaleString()}
//                           </p>
//                         </div>
//                       ))
//                     ) : (
//                       <p>Chưa có bình luận nào cho lựa chọn này.</p>
//                     )}
//                     {filteredComments?.length > 0 && (
//                       <Pagination
//                         current={currentPage}
//                         total={allComments.total}
//                         pageSize={10}
//                         onChange={(page) => {
//                           setCurrentPage(page);
//                           refetchAllComments();
//                         }}
//                         style={{ marginTop: 20, textAlign: "center" }}
//                       />
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </TabPane>
//           </Tabs>
//         </section>

//         {/* Sản phẩm khác */}
//         <section className="font-poppins container mb-4">
//           <div className="text-center mb-5 mt-5">
//             <h2>Sản phẩm khác</h2>
//           </div>
//           <div className="row g-3">
//             {products?.slice(0, 8).map((prod) => (
//               <div key={prod.key} className="col-md-3">
//                 <div className="card h-100 shadow-sm product-box">
//                   <Link to={`/product/${prod.key}`}>
//                     <img
//                       src={prod.image}
//                       alt={prod.name}
//                       className="card-img-top"
//                       style={{ height: "250px", objectFit: "contain" }}
//                     />
//                   </Link>
//                   <div className="card-body bg-dark text-center">
//                     <Link
//                       to={`/product/${prod.key}`}
//                       className="text-decoration-none text-light"
//                     >
//                       <h5>{prod.name}</h5>
//                     </Link>
//                     <p className="text-secondary">{prod.category}</p>
//                     <p className="text-warning fw-semibold fs-5">
//                       {prod.price
//                         ? `${Number(prod.price).toLocaleString("vi-VN")} VNĐ`
//                         : "0 VNĐ"}
//                     </p>
//                     <Link
//                       to={`/product/${prod.key}`}
//                       className="text-decoration-none"
//                     >
//                       <button className="btn border border-warning text-light w-100 py-2 px-3">
//                         <ShoppingCartOutlined />
//                       </button>
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>
//       </div>
//     </>
//   );
// };

// export default DetailPage;
















// import React, { useState, useEffect, useContext } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { Button, message, Rate, Tabs, Select, Input, Pagination } from "antd";
// import {
//   CarOutlined,
//   CheckCircleOutlined,
//   PhoneOutlined,
//   ShoppingCartOutlined,
//   SyncOutlined,
//   UserOutlined,
// } from "@ant-design/icons";
// import API from "../../../services/api";
// import TabPane from "antd/es/tabs/TabPane";
// import { AuthContext } from "../../../context/AuthContext";

// const { Option } = Select;

// const DetailPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useContext(AuthContext);
//   const [selectedVariant, setSelectedVariant] = useState(null);
//   const [selectedVariantFilter, setSelectedVariantFilter] = useState("all");
//   const [quantity, setQuantity] = useState(1);
//   const [messageApi, contextHolder] = message.useMessage();
//   const queryClient = useQueryClient();
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState("");
//   const [selectedOrder, setSelectedOrder] = useState(null);

//   useEffect(() => {
//     if (!id) {
//       messageApi.error("Không tìm thấy sản phẩm!");
//       navigate("/");
//     }
//   }, [id, navigate, messageApi]);

//   const { data: product, isLoading } = useQuery({
//     queryKey: ["PRODUCT_DETAIL", id],
//     queryFn: async () => {
//       const { data } = await API.get(`/products/${id}`);
//       return data.data;
//     },
//     enabled: !!id,
//   });

//   const { data: products } = useQuery({
//     queryKey: ["PRODUCTS_KEY"],
//     queryFn: async () => {
//       const { data } = await API.get("/products");
//       console.log(data);
//       return data.data.map((item, index) => ({
//         key: item.id,
//         name: item.name,
//         price: item.price,
//         description: item.description,
//         image: item.image
//           ? item.image.startsWith("/storage/")
//             ? `http://localhost:8000${item.image}`
//             : `http://localhost:8000/storage/${item.image}`
//           : null,
//         category: item.category?.name || "_",
//         status: item.status,
//         stt: index + 1,
//       }));
//     },
//   });

//   const { data: allComments, refetch: refetchAllComments } = useQuery({
//     queryKey: ["PRODUCT_ALL_COMMENTS", id, currentPage],
//     queryFn: async () => {
//       const variantIds = product?.variants?.map((variant) => variant.id) || [];
//       const commentPromises = variantIds.map(async (variantId) => {
//         const { data } = await API.get(
//           `/reviews/variant/${variantId}?page=${currentPage}`
//         );
//         return data.data.data.map((comment) => ({
//           ...comment,
//           product_variant_id: variantId,
//         }));
//       });

//       const commentsByVariant = await Promise.all(commentPromises);
//       const flattenedComments = commentsByVariant.flat();

//       return {
//         data: flattenedComments,
//         total: flattenedComments.length,
//         current_page: currentPage,
//       };
//     },
//     enabled: !!product?.variants?.length,
//   });

//   // Lọc và sắp xếp đánh giá
//   const filteredComments = allComments?.data
//     ?.filter((comment) => {
//       if (selectedVariantFilter === "all") return true;
//       return comment.product_variant_id === parseInt(selectedVariantFilter);
//     })
//     ?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Sắp xếp theo thời gian giảm dần (mới nhất trước)

//   const { data: reviewableOrders } = useQuery({
//     queryKey: ["REVIEWABLE_ORDERS", selectedVariant?.id],
//     queryFn: async () => {
//       const { data } = await API.get(
//         `/reviews/variant/${selectedVariant.id}/reviewable-orders`
//       );
//       return data.data;
//     },
//     enabled: !!selectedVariant?.id,
//   });

//   const { mutate: submitReview, isPending: isSubmittingReview } = useMutation({
//     mutationFn: async () => {
//       const response = await API.post(
//         `/reviews/variant/${selectedVariant.id}`,
//         {
//           order_id: selectedOrder,
//           rating,
//           comment,
//         }
//       );
//       return response.data;
//     },
//     onSuccess: () => {
//       messageApi.success("Đánh giá đã được gửi thành công!");
//       setRating(0);
//       setComment("");
//       setSelectedOrder(null);
//       refetchAllComments();
//       queryClient.invalidateQueries(["REVIEWABLE_ORDERS"]);
//     },
//     onError: (error) => {
//       messageApi.error(
//         error?.response?.data?.message || "Có lỗi xảy ra khi gửi đánh giá."
//       );
//     },
//   });

//   const groupedVariants =
//     product?.variants?.reduce((acc, variant) => {
//       const colorName = variant.color?.value || "_";
//       if (!acc[colorName]) acc[colorName] = [];
//       acc[colorName].push(variant);
//       return acc;
//     }, {}) || {};

//   const colors = Object.keys(groupedVariants);

//   const colorMap = {
//     Trắng: "#FFFFFF",
//     Đen: "#000000",
//     Hồng: "#FFC0CB",
//     "Titan xanh": "#6A7BA2",
//     "Titan tự nhiên": "#D4D4D4",
//     "Titan trắng": "#EDEDED",
//     "Titan đen": "#2F2F2F",
//     "Xanh dương": "#0000FF",
//     "Xanh lá": "#008000",
//     Vàng: "#FFFF00",
//     Tím: "#800080",
//     Xám: "#808080",
//   };

//   useEffect(() => {
//     if (product?.variants && product.variants.length > 0) {
//       const firstVariant = product.variants[0];
//       setSelectedVariant(firstVariant);
//       setQuantity(firstVariant?.stock > 0 ? 1 : 0);
//       setSelectedImage(firstVariant?.images?.[0]?.image_url || null);
//     }
//   }, [product]);

//   const handleColorSelect = (color) => {
//     const firstVariant = groupedVariants[color]?.[0];
//     setSelectedVariant(firstVariant);
//     setQuantity(firstVariant?.stock > 0 ? 1 : 0);
//     setSelectedImage(null);
//   };

//   const handleStorageSelect = (variant) => {
//     setSelectedVariant(variant);
//     setQuantity(variant?.stock > 0 ? 1 : 0);
//     setSelectedImage(null);
//   };

//   const handleQuantityChange = (e) => {
//     const value = parseInt(e.target.value, 10);

//     if (!selectedVariant || selectedVariant.stock === 0) {
//       messageApi.warning("Sản phẩm hiện đã hết hàng");
//       return setQuantity(0);
//     }

//     if (isNaN(value) || value < 1) {
//       messageApi.warning("Số lượng phải lớn hơn 0!");
//       return setQuantity(1);
//     }

//     if (value > selectedVariant.stock) {
//       messageApi.warning(`Chỉ còn ${selectedVariant.stock} sản phẩm!`);
//       return setQuantity(selectedVariant.stock);
//     }

//     setQuantity(value);
//   };

//   const { mutate, isPending } = useMutation({
//     mutationFn: async () => {
//       if (!product?.id || !Number.isInteger(product.id)) {
//         throw new Error("product_id không hợp lệ hoặc không tồn tại.");
//       }
//       if (
//         !selectedVariant?.color?.id ||
//         !Number.isInteger(selectedVariant.color.id)
//       ) {
//         throw new Error("color_id không hợp lệ hoặc không tồn tại.");
//       }
//       if (
//         !selectedVariant?.storage?.id ||
//         !Number.isInteger(selectedVariant.storage.id)
//       ) {
//         throw new Error("storage_id không hợp lệ hoặc không tồn tại.");
//       }
//       if (!quantity || !Number.isInteger(quantity) || quantity < 1) {
//         throw new Error("quantity không hợp lệ, phải là số nguyên dương.");
//       }
//       if (!user?.id || !Number.isInteger(user.id)) {
//         throw new Error("Vui lòng đăng nhập để thêm vào giỏ hàng.");
//       }

//       const res = await API.post("/cart/items", {
//         product_id: product.id,
//         color_id: selectedVariant.color.id,
//         storage_id: selectedVariant.storage.id,
//         quantity: quantity,
//         user_id: user.id,
//       });
//       return res.data;
//     },
//     onSuccess: () => {
//       messageApi.success("Đã thêm vào giỏ hàng!");
//       queryClient.invalidateQueries(["CART_ITEM"]);
//     },
//     onError: (error) => {
//       let errorMessage = "Có lỗi xảy ra khi thêm vào giỏ hàng.";
//       if (error?.response?.data?.message) {
//         errorMessage = error.response.data.message;
//       }
//       if (error?.response?.data?.errors) {
//         const errorDetails = error.response.data.errors
//           .map((err) => err.msg)
//           .join(", ");
//         errorMessage += errorDetails ? `: ${errorDetails}` : "";
//       } else {
//         errorMessage += `: ${error.message}`;
//       }
//       messageApi.error("Thêm vào giỏ hàng thất bại: " + errorMessage);
//     },
//   });

//   const handleAddToCart = () => {
//     if (!user) {
//       messageApi.warning("Vui lòng đăng nhập để thêm vào giỏ hàng!");
//       navigate("/login");
//       return;
//     }

//     if (!product) {
//       messageApi.warning("Không tìm thấy sản phẩm!");
//       return;
//     }

//     if (!selectedVariant) {
//       messageApi.warning("Vui lòng chọn biến thể!");
//       return;
//     }

//     if (selectedVariant.stock === 0) {
//       messageApi.warning("Sản phẩm đã hết hàng");
//       return;
//     }

//     if (
//       !selectedVariant.color?.id ||
//       !selectedVariant.storage?.id ||
//       isNaN(quantity) ||
//       quantity < 1
//     ) {
//       messageApi.error("Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.");
//       return;
//     }

//     mutate();
//   };

//   const handleSubmitReview = () => {
//     if (!selectedOrder) {
//       messageApi.error("Vui lòng chọn đơn hàng để đánh giá!");
//       return;
//     }
//     if (rating === 0) {
//       messageApi.error("Vui lòng chọn số sao!");
//       return;
//     }
//     submitReview();
//   };

//   const getVariantInfo = (productVariantId) => {
//     const variant = product?.variants?.find((v) => v.id === productVariantId);
//     if (!variant) return "Không xác định";
//     return `${product.name} - ${variant.color?.value || "N/A"} - ${
//       variant.storage?.value || "N/A"
//     }`;
//   };

//   if (isLoading) {
//     return <div className="text-center">Đang tải...</div>;
//   }

//   if (!product) {
//     return <div className="text-center">Không tìm thấy sản phẩm!</div>;
//   }

//   const activeVariant = selectedVariant;
//   const displayPrice = activeVariant ? activeVariant.price : product.price;
//   const selectedVariantImages = selectedVariant?.images || [];
//   const mainImage =
//     selectedImage ||
//     (activeVariant ? activeVariant.images?.[0]?.image_url : product.image);

//   return (
//     <>
//       {contextHolder}
//       <section>
//         <div style={{ backgroundColor: "#333" }}>
//           <div className="container py-5 text-light">
//             <div className="row mb-5">
//               <div className="col-md-5">
//                 <div className="d-flex flex-column align-items-center">
//                   <div>
//                     <img
//                       src={mainImage}
//                       alt="Main"
//                       style={{
//                         width: "100%",
//                         maxHeight: "650px",
//                       }}
//                     />
//                   </div>
//                   <div
//                     style={{
//                       width: 400,
//                       display: "flex",
//                       overflowX: "auto",
//                       scrollbarWidth: "thin",
//                       gap: "10px",
//                       padding: "10px 0",
//                     }}
//                   >
//                     {selectedVariantImages.length > 0 ? (
//                       selectedVariantImages.map((img, index) => (
//                         <img
//                           key={index}
//                           src={img.image_url}
//                           alt={`thumb-${index}`}
//                           onClick={() => setSelectedImage(img.image_url)}
//                           style={{
//                             width: 90,
//                             height: 100,
//                             padding: "5px",
//                             objectFit: "contain",
//                             backgroundColor: "#fff",
//                             cursor: "pointer",
//                             border:
//                               selectedImage === img.image_url
//                                 ? "2px solid #ffc107"
//                                 : "1px solid #ddd",
//                             borderRadius: "8px",
//                           }}
//                           className="rounded shadow"
//                         />
//                       ))
//                     ) : (
//                       <img
//                         src={product.image}
//                         alt="thumb-default"
//                         style={{
//                           width: 100,
//                           height: 100,
//                           padding: "5px",
//                           objectFit: "contain",
//                           backgroundColor: "#fff",
//                           flex: "0 0 auto",
//                         }}
//                         className="rounded shadow"
//                       />
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <div className="col-md-7">
//                 <h1 style={{ fontWeight: "bold" }}>{product.name}</h1>
//                 <h4 className="text-secondary">
//                   Danh mục: {product.category?.name || "_"}
//                 </h4>

//                 <h2 style={{ color: "red" }}>
//                   {displayPrice
//                     ? `${Number(displayPrice).toLocaleString("vi-VN")} VNĐ`
//                     : "0 VNĐ"}
//                 </h2>

//                 {colors.length > 0 && (
//                   <div className="mb-3">
//                     <p>Màu sắc: </p>
//                     <div className="d-flex gap-2 mt-2">
//                       {colors.map((color) => (
//                         <div
//                           key={color}
//                           onClick={() => handleColorSelect(color)}
//                           style={{
//                             width: 30,
//                             height: 30,
//                             backgroundColor: colorMap[color] || "#ccc",
//                             cursor: "pointer",
//                           }}
//                           className={`rounded-circle border ${
//                             selectedVariant?.color?.value === color
//                               ? "border-warning"
//                               : ""
//                           }`}
//                         ></div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {selectedVariant && (
//                   <div className="mb-3">
//                     <p>Dung lượng:</p>
//                     <div className="d-flex gap-2 mt-2">
//                       {groupedVariants[selectedVariant.color.value]?.map(
//                         (variant) => (
//                           <button
//                             key={variant.id}
//                             onClick={() => handleStorageSelect(variant)}
//                             className={`btn btn-outline-light ${
//                               selectedVariant.id === variant.id
//                                 ? "border-warning text-warning"
//                                 : ""
//                             }`}
//                           >
//                             {variant.storage?.value}
//                           </button>
//                         )
//                       )}
//                     </div>
//                   </div>
//                 )}
//                 <p className="text-light">
//                   Số lượng trong kho: {selectedVariant?.stock || 0}
//                 </p>

//                 <div className="mb-3">
//                   <input
//                     type="number"
//                     value={quantity}
//                     onChange={handleQuantityChange}
//                     className="form-control"
//                     style={{
//                       width: "100px",
//                     }}
//                   />
//                 </div>

//                 <div className="mb-3">
//                   <Button
//                     icon={<ShoppingCartOutlined />}
//                     onClick={handleAddToCart}
//                     size="large"
//                     type="primary"
//                     disabled={isPending}
//                   >
//                     {isPending ? "Đang thêm..." : "Thêm vào giỏ hàng"}
//                   </Button>
//                 </div>
//                 <hr style={{ margin: "30px 0" }} />
//                 <div style={{ fontSize: "16px", lineHeight: "1.6" }}>
//                   <p>
//                     <CheckCircleOutlined
//                       style={{ color: "#52c41a", marginRight: 8 }}
//                     />
//                     Bộ sản phẩm gồm: Hộp, Sách hướng dẫn, Cáp, Cây lấy sim
//                   </p>
//                   <p>
//                     <SyncOutlined
//                       style={{ color: "#1890ff", marginRight: 8 }}
//                     />
//                     Hư gì đổi nấy 12 tháng tại cửa hàng, chính sách bảo hành
//                   </p>
//                   <p>
//                     <CarOutlined style={{ color: "#faad14", marginRight: 8 }} />
//                     Giao hàng nhanh toàn quốc
//                   </p>
//                   <p>
//                     <PhoneOutlined
//                       style={{ color: "#f5222d", marginRight: 8 }}
//                     />
//                     Liên hệ: 0763.272.301 (8:00 - 21:30)
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//       <div className="container mt-5">
//         <section>
//           <Tabs defaultActiveKey="1">
//             <TabPane tab="Mô tả" key="1">
//               <h4>Mô tả sản phẩm</h4>
//               <p>{product.description}</p>
//             </TabPane>

//             <TabPane tab="Đánh giá" key="2">
//               <h4>Đánh giá sản phẩm</h4>
//               <div className="row">
//                 <div className="col-md-12">
//                   <div className="border p-3 rounded bg-light mb-3">
//                     <h5>Gửi đánh giá của bạn</h5>
//                     {reviewableOrders?.length > 0 ? (
//                       <>
//                         <Select
//                           placeholder="Chọn đơn hàng để đánh giá"
//                           style={{ width: 300, marginBottom: 10 }}
//                           onChange={(value) => setSelectedOrder(value)}
//                           value={selectedOrder}
//                         >
//                           {reviewableOrders.map((order) => (
//                             <Option key={order.id} value={order.id}>
//                               {order.order_code} (Đặt ngày:{" "}
//                               {new Date(order.created_at).toLocaleString()})
//                             </Option>
//                           ))}
//                         </Select>
//                         <Rate
//                           value={rating}
//                           onChange={(value) => setRating(value)}
//                           style={{ marginBottom: 10 }}
//                         />
//                         <Input.TextArea
//                           rows={4}
//                           placeholder="Nhập nhận xét của bạn"
//                           value={comment}
//                           onChange={(e) => setComment(e.target.value)}
//                           style={{ marginBottom: 10 }}
//                         />
//                         <Button
//                           type="primary"
//                           onClick={handleSubmitReview}
//                           loading={isSubmittingReview}
//                         >
//                           Gửi đánh giá
//                         </Button>
//                       </>
//                     ) : (
//                       <p>
//                         Bạn chưa có đơn hàng nào đủ điều kiện để đánh giá biến
//                         thể này.
//                       </p>
//                     )}
//                   </div>

//                   <div className="mb-3">
//                     <h5>Lọc đánh giá theo biến thể:</h5>
//                     <Select
//                       style={{ width: 300 }}
//                       value={selectedVariantFilter}
//                       onChange={(value) => setSelectedVariantFilter(value)}
//                     >
//                       <Option value="all">Tất cả biến thể</Option>
//                       {product?.variants?.map((variant) => (
//                         <Option key={variant.id} value={variant.id.toString()}>
//                           {getVariantInfo(variant.id)}
//                         </Option>
//                       ))}
//                     </Select>
//                   </div>

//                   <div className="border p-3 rounded bg-light mb-3">
//                     {filteredComments?.length > 0 ? (
//                       filteredComments.map((comment, index) => (
//                         <div
//                           key={comment.id}
//                           style={{
//                             marginBottom: "30px",
//                             paddingBottom: "20px",
//                             borderBottom:
//                               index < filteredComments.length - 1
//                                 ? "1px solid #e8e8e8"
//                                 : "none",
//                           }}
//                         >
//                           <div>
//                             <h5 className="d-flex align-items-center mb-2">
//                               <UserOutlined className="me-2" />
//                               {comment.user.name}
//                             </h5>
//                             <p className="text-muted">
//                               Đánh giá cho biến thể:{" "}
//                               {getVariantInfo(comment.product_variant_id)}
//                             </p>
//                             <Rate
//                               value={comment.rating}
//                               disabled
//                               className="mb-2"
//                             />
//                           </div>
//                           <p>{comment.comment}</p>
//                           <p>
//                             Đơn hàng:{" "}
//                             {comment.order?.id ? (
//                               <Link to={`/my-order-detail/${comment.order.id}`}>
//                                 {comment.order.order_code ||
//                                   "Không có mã đơn hàng"}
//                               </Link>
//                             ) : (
//                               <span>
//                                 {comment.order?.order_code ||
//                                   "Không có mã đơn hàng"}
//                               </span>
//                             )}
//                           </p>
//                           <p>
//                             Time:{" "}
//                             {new Date(comment.created_at).toLocaleString()}
//                           </p>
//                         </div>
//                       ))
//                     ) : (
//                       <p>Chưa có bình luận nào cho lựa chọn này.</p>
//                     )}
//                     {filteredComments?.length > 0 && (
//                       <Pagination
//                         current={currentPage}
//                         total={allComments.total}
//                         pageSize={10}
//                         onChange={(page) => {
//                           setCurrentPage(page);
//                           refetchAllComments();
//                         }}
//                         style={{ marginTop: 20, textAlign: "center" }}
//                       />
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </TabPane>
//           </Tabs>
//         </section>

//         <section className="font-poppins container mb-4">
//           <div className="text-center mb-5 mt-5">
//             <h2>Sản phẩm khác</h2>
//           </div>
//           <div className="row g-3">
//             {products?.slice(0, 8).map((prod) => (
//               <div key={prod.key} className="col-md-3">
//                 <div className="card h-100 shadow-sm product-box">
//                   <Link to={`/product/${prod.key}`}>
//                     <img
//                       src={prod.image}
//                       alt={prod.name}
//                       className="card-img-top"
//                       style={{ height: "250px", objectFit: "contain" }}
//                     />
//                   </Link>
//                   <div className="card-body bg-dark text-center">
//                     <Link
//                       to={`/product/${prod.key}`}
//                       className="text-decoration-none text-light"
//                     >
//                       <h5>{prod.name}</h5>
//                     </Link>
//                     <p className="text-secondary">{prod.category}</p>
//                     <p className="text-warning fw-semibold fs-5">
//                       {prod.price
//                         ? `${Number(prod.price).toLocaleString("vi-VN")} VNĐ`
//                         : "0 VNĐ"}
//                     </p>
//                     <Link
//                       to={`/product/${prod.key}`}
//                       className="text-decoration-none"
//                     >
//                       <button className="btn border border-warning text-light w-100 py-2 px-3">
//                         <ShoppingCartOutlined />
//                       </button>
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>
//       </div>
//     </>
//   );
// };

// export default DetailPage;





















import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, message, Rate, Tabs, Select, Input, Pagination } from "antd";
import {
  CarOutlined,
  CheckCircleOutlined,
  PhoneOutlined,
  ShoppingCartOutlined,
  SyncOutlined,
  UserOutlined,
} from "@ant-design/icons";
import API from "../../../services/api";
import TabPane from "antd/es/tabs/TabPane";
import { AuthContext } from "../../../context/AuthContext";

const { Option } = Select;

const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedVariantFilter, setSelectedVariantFilter] = useState("all");
  const [quantity, setQuantity] = useState(1);
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!id) {
      messageApi.error("Không tìm thấy sản phẩm!");
      navigate("/");
    }
  }, [id, navigate, messageApi]);

  const { data: product, isLoading } = useQuery({
    queryKey: ["PRODUCT_DETAIL", id],
    queryFn: async () => {
      const { data } = await API.get(`/products/${id}`);
      return data.data;
    },
    enabled: !!id,
  });

  const { data: products } = useQuery({
    queryKey: ["PRODUCTS_KEY"],
    queryFn: async () => {
      const { data } = await API.get("/products");
      return data.data.map((item, index) => ({
        key: item.id,
        name: item.name,
        price: item.price,
        description: item.description,
        image: item.image
          ? item.image.startsWith("/storage/")
            ? `http://localhost:8000${item.image}`
            : `http://localhost:8000/storage/${item.image}`
          : null,
        category: item.category?.name || "_",
        status: item.status,
        stt: index + 1,
      }));
    },
  });

  const { data: allComments, refetch: refetchAllComments } = useQuery({
    queryKey: ["PRODUCT_ALL_COMMENTS", id, currentPage],
    queryFn: async () => {
      const variantIds = product?.variants?.map((variant) => variant.id) || [];
      const commentPromises = variantIds.map(async (variantId) => {
        const { data } = await API.get(
          `/reviews/variant/${variantId}?page=${currentPage}`
        );
        return data.data.data.map((comment) => ({
          ...comment,
          product_variant_id: variantId,
        }));
      });

      const commentsByVariant = await Promise.all(commentPromises);
      const flattenedComments = commentsByVariant.flat();

      return {
        data: flattenedComments,
        total: flattenedComments.length,
        current_page: currentPage,
      };
    },
    enabled: !!product?.variants?.length,
  });

  // Lọc và sắp xếp đánh giá
  const filteredComments = allComments?.data
    ?.filter((comment) => {
      if (selectedVariantFilter === "all") return true;
      return comment.product_variant_id === parseInt(selectedVariantFilter);
    })
    ?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const { data: reviewableOrders } = useQuery({
    queryKey: ["REVIEWABLE_ORDERS", selectedVariant?.id],
    queryFn: async () => {
      const { data } = await API.get(
        `/reviews/variant/${selectedVariant.id}/reviewable-orders`
      );
      return data.data;
    },
    enabled: !!selectedVariant?.id,
  });

  const { mutate: submitReview, isPending: isSubmittingReview } = useMutation({
    mutationFn: async () => {
      const response = await API.post(
        `/reviews/variant/${selectedVariant.id}`,
        {
          order_id: selectedOrder,
          rating,
          comment,
        }
      );
      return response.data;
    },
    onSuccess: () => {
      messageApi.success("Đánh giá đã được gửi thành công!");
      setRating(0);
      setComment("");
      setSelectedOrder(null);
      refetchAllComments();
      queryClient.invalidateQueries(["REVIEWABLE_ORDERS"]);
    },
    onError: (error) => {
      messageApi.error(
        error?.response?.data?.message || "Có lỗi xảy ra khi gửi đánh giá."
      );
    },
  });

  const groupedVariants =
    product?.variants?.reduce((acc, variant) => {
      const colorName = variant.color?.value || "_";
      if (!acc[colorName]) acc[colorName] = [];
      acc[colorName].push(variant);
      return acc;
    }, {}) || {};

  const colors = Object.keys(groupedVariants).filter(color => color !== "_");

  const colorMap = {
    Trắng: "#FFFFFF",
    Đen: "#000000",
    Hồng: "#FFC0CB",
    "Titan xanh": "#6A7BA2",
    "Titan tự nhiên": "#D4D4D4",
    "Titan trắng": "#EDEDED",
    "Titan đen": "#2F2F2F",
    "Xanh dương": "#0000FF",
    "Xanh lá": "#008000",
    Vàng: "#FFFF00",
    Tím: "#800080",
    Xám: "#808080",
  };

  // Kiểm tra xem có biến thể nào có color_id hay không
  const hasColors = product?.variants?.some(variant => variant.color?.id);

  // Kiểm tra xem có biến thể nào có storage_id cho màu sắc được chọn hay không
  const hasStorageForSelectedColor = selectedVariant
    ? groupedVariants[selectedVariant.color?.value || "_"]?.some(variant => variant.storage?.id)
    : false;

  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      const firstVariant = product.variants[0];
      setSelectedVariant(firstVariant);
      setQuantity(firstVariant?.stock > 0 ? 1 : 0);
      setSelectedImage(firstVariant?.images?.[0]?.image_url || null);
    }
  }, [product]);

  const handleColorSelect = (color) => {
    const firstVariant = groupedVariants[color]?.[0];
    setSelectedVariant(firstVariant);
    setQuantity(firstVariant?.stock > 0 ? 1 : 0);
    setSelectedImage(null);
  };

  const handleStorageSelect = (variant) => {
    setSelectedVariant(variant);
    setQuantity(variant?.stock > 0 ? 1 : 0);
    setSelectedImage(null);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);

    if (!selectedVariant || selectedVariant.stock === 0) {
      messageApi.warning("Sản phẩm hiện đã hết hàng");
      return setQuantity(0);
    }

    if (isNaN(value) || value < 1) {
      messageApi.warning("Số lượng phải lớn hơn 0!");
      return setQuantity(1);
    }

    if (value > selectedVariant.stock) {
      messageApi.warning(`Chỉ còn ${selectedVariant.stock} sản phẩm!`);
      return setQuantity(selectedVariant.stock);
    }

    setQuantity(value);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!product?.id || !Number.isInteger(product.id)) {
        throw new Error("product_id không hợp lệ hoặc không tồn tại.");
      }
      if (!quantity || !Number.isInteger(quantity) || quantity < 1) {
        throw new Error("quantity không hợp lệ, phải là số nguyên dương.");
      }
      if (!user?.id || !Number.isInteger(user.id)) {
        throw new Error("Vui lòng đăng nhập để thêm vào giỏ hàng.");
      }
      if (!selectedVariant?.id) {
        throw new Error("Vui lòng chọn một biến thể hợp lệ.");
      }

      const res = await API.post("/cart/items", {
        product_id: product.id,
        color_id: selectedVariant.color?.id || null,
        storage_id: selectedVariant.storage?.id || null,
        quantity: quantity,
        user_id: user.id,
      });
      return res.data;
    },
    onSuccess: () => {
      messageApi.success("Đã thêm vào giỏ hàng!");
      queryClient.invalidateQueries(["CART_ITEM"]);
    },
    onError: (error) => {
      let errorMessage = "Có lỗi xảy ra khi thêm vào giỏ hàng.";
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      if (error?.response?.data?.errors) {
        const errorDetails = error.response.data.errors
          .map((err) => err.msg)
          .join(", ");
        errorMessage += errorDetails ? `: ${errorDetails}` : "";
      } else {
        errorMessage += `: ${error.message}`;
      }
      messageApi.error("Thêm vào giỏ hàng thất bại: " + errorMessage);
    },
  });

  const handleAddToCart = () => {
    if (!user) {
      messageApi.warning("Vui lòng đăng nhập để thêm vào giỏ hàng!");
      navigate("/login");
      return;
    }

    if (!product) {
      messageApi.warning("Không tìm thấy sản phẩm!");
      return;
    }

    if (!selectedVariant) {
      messageApi.warning("Vui lòng chọn biến thể!");
      return;
    }

    if (selectedVariant.stock === 0) {
      messageApi.warning("Sản phẩm đã hết hàng!");
      return;
    }

    if (!selectedVariant.color?.id && !selectedVariant.storage?.id) {
      messageApi.error("Vui lòng chọn ít nhất một màu sắc hoặc dung lượng!");
      return;
    }

    mutate();
  };

  const handleSubmitReview = () => {
    if (!selectedOrder) {
      messageApi.error("Vui lòng chọn đơn hàng để đánh giá!");
      return;
    }
    if (rating === 0) {
      messageApi.error("Vui lòng chọn số sao!");
      return;
    }
    submitReview();
  };

  const getVariantInfo = (productVariantId) => {
    const variant = product?.variants?.find((v) => v.id === productVariantId);
    if (!variant) return "Không xác định";
    return `${product.name} - ${variant.color?.value || "Không có màu"} - ${
      variant.storage?.value || "Không có dung lượng"
    }`;
  };

  if (isLoading) {
    return <div className="text-center">Đang tải...</div>;
  }

  if (!product) {
    return <div className="text-center">Không tìm thấy sản phẩm!</div>;
  }

  const activeVariant = selectedVariant;
  const displayPrice = activeVariant ? activeVariant.price : product.price;
  const selectedVariantImages = selectedVariant?.images || [];
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
              <div className="col-md-5">
                <div className="d-flex flex-column align-items-center">
                  <div>
                    <img
                      src={mainImage}
                      alt="Main"
                      style={{
                        width: "100%",
                        maxHeight: "650px",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      width: 400,
                      display: "flex",
                      overflowX: "auto",
                      scrollbarWidth: "thin",
                      gap: "10px",
                      padding: "10px 0",
                    }}
                  >
                    {selectedVariantImages.length > 0 ? (
                      selectedVariantImages.map((img, index) => (
                        <img
                          key={index}
                          src={img.image_url}
                          alt={`thumb-${index}`}
                          onClick={() => setSelectedImage(img.image_url)}
                          style={{
                            width: 90,
                            height: 100,
                            padding: "5px",
                            objectFit: "contain",
                            backgroundColor: "#fff",
                            cursor: "pointer",
                            border:
                              selectedImage === img.image_url
                                ? "2px solid #ffc107"
                                : "1px solid #ddd",
                            borderRadius: "8px",
                          }}
                          className="rounded shadow"
                        />
                      ))
                    ) : (
                      <img
                        src={product.image}
                        alt="thumb-default"
                        style={{
                          width: 100,
                          height: 100,
                          padding: "5px",
                          objectFit: "contain",
                          backgroundColor: "#fff",
                          flex: "0 0 auto",
                        }}
                        className="rounded shadow"
                      />
                    )}
                  </div>
                </div>
              </div>

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

                {hasColors && colors.length > 0 && (
                  <div className="mb-3">
                    <p>Màu sắc: (Chọn ít nhất một màu sắc hoặc dung lượng)</p>
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

                {selectedVariant && hasStorageForSelectedColor && (
                  <div className="mb-3">
                    <p>Dung lượng:</p>
                    <div className="d-flex gap-2 mt-2">
                      {groupedVariants[selectedVariant.color?.value || "_"]?.map(
                        (variant) => (
                          variant.storage?.id && (
                            <button
                              key={variant.id}
                              onClick={() => handleStorageSelect(variant)}
                              className={`btn btn-outline-light ${
                                selectedVariant.id === variant.id
                                  ? "border-warning text-warning"
                                  : ""
                              }`}
                            >
                              {variant.storage.value}
                            </button>
                          )
                        )
                      )}
                    </div>
                  </div>
                )}

                <p className="text-light">
                  Số lượng trong kho: {selectedVariant?.stock || 0}
                </p>

                <div className="mb-3">
                  <input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="form-control"
                    style={{
                      width: "100px",
                    }}
                  />
                </div>

                <div className="mb-3">
                  <Button
                    icon={<ShoppingCartOutlined />}
                    onClick={handleAddToCart}
                    size="large"
                    type="primary"
                    disabled={isPending}
                  >
                    {isPending ? "Đang thêm..." : "Thêm vào giỏ hàng"}
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
      <div className="container mt-5">
        <section>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Mô tả" key="1">
              <h4>Mô tả sản phẩm</h4>
              <p>{product.description}</p>
            </TabPane>

            <TabPane tab="Đánh giá" key="2">
              <h4>Đánh giá sản phẩm</h4>
              <div className="row">
                <div className="col-md-12">
                  <div className="border p-3 rounded bg-light mb-3">
                    <h5>Gửi đánh giá của bạn</h5>
                    {reviewableOrders?.length > 0 ? (
                      <>
                        <Select
                          placeholder="Chọn đơn hàng để đánh giá"
                          style={{ width: 300, marginBottom: 10 }}
                          onChange={(value) => setSelectedOrder(value)}
                          value={selectedOrder}
                        >
                          {reviewableOrders.map((order) => (
                            <Option key={order.id} value={order.id}>
                              {order.order_code} (Đặt ngày:{" "}
                              {new Date(order.created_at).toLocaleString()})
                            </Option>
                          ))}
                        </Select>
                        <Rate
                          value={rating}
                          onChange={(value) => setRating(value)}
                          style={{ marginBottom: 10 }}
                        />
                        <Input.TextArea
                          rows={4}
                          placeholder="Nhập nhận xét của bạn"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          style={{ marginBottom: 10 }}
                        />
                        <Button
                          type="primary"
                          onClick={handleSubmitReview}
                          loading={isSubmittingReview}
                        >
                          Gửi đánh giá
                        </Button>
                      </>
                    ) : (
                      <p>
                        Bạn chưa có đơn hàng nào đủ điều kiện để đánh giá biến
                        thể này.
                      </p>
                    )}
                  </div>

                  <div className="mb-3">
                    <h5>Lọc đánh giá theo biến thể:</h5>
                    <Select
                      style={{ width: 300 }}
                      value={selectedVariantFilter}
                      onChange={(value) => setSelectedVariantFilter(value)}
                    >
                      <Option value="all">Tất cả biến thể</Option>
                      {product?.variants?.map((variant) => (
                        <Option key={variant.id} value={variant.id.toString()}>
                          {getVariantInfo(variant.id)}
                        </Option>
                      ))}
                    </Select>
                  </div>

                  <div className="border p-3 rounded bg-light mb-3">
                    {filteredComments?.length > 0 ? (
                      filteredComments.map((comment, index) => (
                        <div
                          key={comment.id}
                          style={{
                            marginBottom: "30px",
                            paddingBottom: "20px",
                            borderBottom:
                              index < filteredComments.length - 1
                                ? "1px solid #e8e8e8"
                                : "none",
                          }}
                        >
                          <div>
                            <h5 className="d-flex align-items-center mb-2">
                              <UserOutlined className="me-2" />
                              {comment.user.name}
                            </h5>
                            <p className="text-muted">
                              Đánh giá cho biến thể:{" "}
                              {getVariantInfo(comment.product_variant_id)}
                            </p>
                            <Rate
                              value={comment.rating}
                              disabled
                              className="mb-2"
                            />
                          </div>
                          <p>{comment.comment}</p>
                          <p>
                            Đơn hàng:{" "}
                            {comment.order?.id ? (
                              <Link to={`/my-order-detail/${comment.order.id}`}>
                                {comment.order.order_code ||
                                  "Không có mã đơn hàng"}
                              </Link>
                            ) : (
                              <span>
                                {comment.order?.order_code ||
                                  "Không có mã đơn hàng"}
                              </span>
                            )}
                          </p>
                          <p>
                            Time:{" "}
                            {new Date(comment.created_at).toLocaleString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p>Chưa có bình luận nào cho lựa chọn này.</p>
                    )}
                    {filteredComments?.length > 0 && (
                      <Pagination
                        current={currentPage}
                        total={allComments.total}
                        pageSize={10}
                        onChange={(page) => {
                          setCurrentPage(page);
                          refetchAllComments();
                        }}
                        style={{ marginTop: 20, textAlign: "center" }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </TabPane>
          </Tabs>
        </section>

        <section className="font-poppins container mb-4">
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