import axios from "axios";

// ✅ Khởi tạo axios instance
const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Thêm token vào mỗi request nếu có
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ✅ Lấy danh sách đơn hàng
export const fetchOrders = async (params) => {
  const response = await API.get("/admin/orders", { params });
  return response.data.data;
};

// ✅ Lấy chi tiết đơn hàng
export const getOrderById = async (orderId) => {
  const response = await API.get(`/orders/${orderId}`);
  return response.data.data;
};

// ✅ Cập nhật trạng thái đơn hàng
export const updateOrderStatus = (orderId, status) => {
  return API.put(`/orders/${orderId}/status`, { status });
};

// ✅ Hủy đơn hàng
export const cancelOrder = (orderId) => {
  return API.put(`/orders/${orderId}/cancel`);
};
