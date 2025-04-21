// ✅ PaymentReturn.jsx – ngăn lặp đơn, xử lý lỗi xoá giỏ hàng, fix payment_date
// import React, { useEffect } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import API from "../../../services/api";
// import { message } from "antd";

// const PaymentReturn = () => {
//   const [params] = useSearchParams();
//   const navigate = useNavigate();

//   useEffect(() => {
//     // ✅ Ngăn chạy lại khi React strict mode (double effect)
//     if (window._vnpay_handled) return;
//     window._vnpay_handled = true;

//     const handleVNPayResponse = async () => {
//       const responseCode = params.get("vnp_ResponseCode");
//       const amount = params.get("vnp_Amount");

//       if (responseCode === "00") {
//         const raw = localStorage.getItem("pending_order");

//         if (!raw) {
//           message.error("Không tìm thấy thông tin đơn hàng.");
//           return navigate("/cart");
//         }

//         let orderData;
//         try {
//           orderData = JSON.parse(raw);
//         } catch (e) {
//           message.error("Lỗi khi đọc dữ liệu đơn hàng.");
//           return navigate("/cart");
//         }

//         if (!orderData?.order_items?.length) {
//           message.error("Đơn hàng không hợp lệ hoặc rỗng.");
//           return navigate("/cart");
//         }

//         try {
//           const res = await API.post("/orders", orderData);
//           const orderId = res.data?.order_id;

//           if (!orderId) {
//             throw new Error("Không nhận được order_id từ backend");
//           }

//           const paymentPayload = {
//             order_id: orderId,
//             amount: parseInt(amount, 10) / 100,
//             payment_method: "VNPay",
//             payment_status: "Thanh toán thành công",
//             payment_date: new Date()
//               .toISOString()
//               .slice(0, 19)
//               .replace("T", " "),
//           };

//           console.log("📤 Gửi thanh toán:", paymentPayload);

//           await API.post("/payments", paymentPayload);

//           localStorage.removeItem("pending_order");

//           await Promise.all(
//             orderData.order_items.map((item) =>
//               item.cart_item_id
//                 ? API.delete(`/cart/items/${item.cart_item_id}`).catch(
//                     (err) => {
//                       console.warn(
//                         `❗Không xoá được cart_item ${item.cart_item_id}:`,
//                         err.message
//                       );
//                     }
//                   )
//                 : null
//             )
//           );

//           message.success("Thanh toán thành công! Đơn hàng đã được ghi nhận.");
//           navigate("/my-order");
//         } catch (error) {
//           console.error("❌ Lỗi khi tạo đơn hàng hoặc lưu thanh toán:", error);
//           const errMsg = error?.response?.data?.message || error.message;
//           message.error("Lỗi khi xử lý đơn hàng: " + errMsg);
//           navigate("/cart");
//         }
//       } else {
//         localStorage.removeItem("pending_order");
//         message.warning("Bạn đã huỷ hoặc thất bại thanh toán.");
//         navigate("/cart");
//       }
//     };

//     handleVNPayResponse();
//   }, [params, navigate]);

//   return (
//     <div style={{ textAlign: "center", marginTop: 50 }}>
//       Đang xử lý thanh toán...
//     </div>
//   );
// };

// export default PaymentReturn;

// ✅ PaymentReturn.jsx – xử lý invalidate giỏ hàng sau thanh toán
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import API from "../../../services/api";
import { message } from "antd";

const PaymentReturn = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (window._vnpay_handled) return;
    window._vnpay_handled = true;

    const handleVNPayResponse = async () => {
      const responseCode = params.get("vnp_ResponseCode");
      const amount = params.get("vnp_Amount");

      if (responseCode === "00") {
        const raw = localStorage.getItem("pending_order");

        if (!raw) {
          message.error("Không tìm thấy thông tin đơn hàng.");
          return navigate("/cart");
        }

        let orderData;
        try {
          orderData = JSON.parse(raw);
        } catch (e) {
          message.error("Lỗi khi đọc dữ liệu đơn hàng.");
          return navigate("/cart");
        }

        if (!orderData?.order_items?.length) {
          message.error("Đơn hàng không hợp lệ hoặc rỗng.");
          return navigate("/cart");
        }

        try {
          const res = await API.post("/orders", orderData);
          const orderId = res.data?.order_id;

          if (!orderId) {
            throw new Error("Không nhận được order_id từ backend");
          }

          const paymentPayload = {
            order_id: orderId,
            amount: parseInt(amount, 10) / 100,
            payment_method: "VNPay",
            payment_status: "Thanh toán thành công",
            payment_date: new Date()
              .toISOString()
              .slice(0, 19)
              .replace("T", " "),
          };

          console.log("📤 Gửi thanh toán:", paymentPayload);

          await API.post("/payments", paymentPayload);

          localStorage.removeItem("pending_order");

          await Promise.all(
            orderData.order_items.map((item) =>
              item.cart_item_id
                ? API.delete(`/cart/items/${item.cart_item_id}`).catch(
                    (err) => {
                      console.warn(
                        `❗Không xoá được cart_item ${item.cart_item_id}:`,
                        err.message
                      );
                    }
                  )
                : null
            )
          );

          // ✅ Cập nhật lại giỏ hàng cache
          queryClient.invalidateQueries(["CART_ITEM"]);

          message.success("Thanh toán thành công! Đơn hàng đã được ghi nhận.");
          navigate("/my-order");
        } catch (error) {
          console.error("❌ Lỗi khi tạo đơn hàng hoặc lưu thanh toán:", error);
          const errMsg = error?.response?.data?.message || error.message;
          message.error("Lỗi khi xử lý đơn hàng: " + errMsg);
          navigate("/cart");
        }
      } else {
        localStorage.removeItem("pending_order");
        message.warning("Bạn đã huỷ hoặc thất bại thanh toán.");
        navigate("/cart");
      }
    };

    handleVNPayResponse();
  }, [params, navigate, queryClient]);

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      Đang xử lý thanh toán...
    </div>
  );
};

export default PaymentReturn;
