import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const fetchProducts = async () => {
  try {
    const { data: productData } = await API.get("/admin/products");
    const { data: categoryData } = await API.get("/admin/categories");

    // Tạo object map category_id -> category_name
    const categoryMap = categoryData.reduce((acc, cat) => {
      acc[cat.id] = cat.name;
      return acc;
    }, {});

    // Duyệt qua danh sách sản phẩm, tách từng biến thể thành một hàng riêng
    const formattedProducts = productData.data.flatMap((product) => {
      if (!product.variants || product.variants.length === 0) {
        // Nếu không có biến thể, tạo một hàng riêng cho sản phẩm
        return [
          {
            id: product.id,
            name: product.name,
            category: categoryMap[product.category_id] || "Không có danh mục",
            image: product.images?.[0] || "",
            variantName: "Không có biến thể",
            price: product.price || 0, // Giá gốc nếu không có biến thể
            stock: product.stock || 0, // Số lượng tồn kho chung
            status: product.status,
          },
        ];
      }

      // Nếu có biến thể, mỗi biến thể là một hàng riêng
      return product.variants.map((variant) => {
        // Chuyển đổi variant_value_ids từ string sang array nếu cần
        let variantIds = variant.variant_value_ids;
        if (typeof variantIds === "string") {
          try {
            variantIds = JSON.parse(variantIds);
          } catch (error) {
            console.error("Lỗi chuyển đổi variant_value_ids:", error);
            variantIds = [];
          }
        }

        if (!Array.isArray(variantIds)) {
          variantIds = [];
        }

        // Lấy tên biến thể từ variant_values
        const variantValues = variantIds.map((id) => {
          const variantValue = product.variant_values?.find(
            (value) => value.id === parseInt(id)
          );
          return variantValue ? variantValue.value : `Không tìm thấy ${id}`;
        });

        return {
          id: `${product.id}-${variant.id}`,
          name: product.name,
          category: categoryMap[product.category_id] || "Không có danh mục",
          image: variant.image || product.images?.[0] || "",
          variantName: variantValues.join(", ") || "Không có biến thể",
          price: variant.price || product.price || 0,
          stock: variant.stock || 0,
          status: product.status,
        };
      });
    });

    return formattedProducts;
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm:", error.response?.data || error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await API.delete(`/admin/products/${productId}/soft`);
    console.log("Sản phẩm đã được xóa mềm:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error.response?.data || error);
    throw error;
  }
};

export const useTrashedProducts = () => {
  return useQuery({
    queryKey: ["trashedProducts"],
    queryFn: async () => {
      const { data } = await API.get("/admin/products/trashed");
      return data?.data || []; // Trả về mảng rỗng nếu `data.data` bị undefined
    },
  });
};

// Khôi phục sản phẩm đã xóa mềm
export const useRestoreProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId) => {
      await API.post(`/admin/products/${productId}/restore`);
    },
    onSuccess: () => {
      message.success("Sản phẩm đã được khôi phục!");
      queryClient.invalidateQueries(["trashedProducts"]);
    },
    onError: () => {
      message.error("Không thể khôi phục sản phẩm!");
    },
  });
};
