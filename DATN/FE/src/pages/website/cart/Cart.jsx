import { useQuery } from "@tanstack/react-query";

import API from "../../../services/api";

export const useCart = () => {
  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ["CART_ITEM"],
    queryFn: async () => {
      const { data } = await API.get("/cart/items");
      return data.data.map((item, index) => ({
        ...item,
        key: item.cart_item_id,
        stt: index + 1,
      }));
    },
  });
  return {
    cartItems,
    isLoading,
  };
};
