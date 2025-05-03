// hooks/useCart.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import API from "../../../services/api";

export const useCart = () => {
  const queryClient = useQueryClient();

  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ["CART_ITEM"],
    queryFn: async () => {
      const { data } = await API.get("/cart/items");
      console.log("DlDl", data);
      return data.data.map((item, index) => ({
        ...item,
        key: item.cart_item_id,
        stt: index + 1,
      }));
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (cart_item_id) => {
      await API.delete(`/cart/items/${cart_item_id}`);
    },
    onSuccess: () => {
      message.success("Xóa sản phẩm thành công");
      queryClient.invalidateQueries(["CART_ITEM"]);
    },
    onError: () => {
      message.error("Xóa sản phẩm thất bại");
    },
  });

  return {
    cartItems,
    isLoading,
    removeItem: removeItemMutation.mutate,
  };
};
