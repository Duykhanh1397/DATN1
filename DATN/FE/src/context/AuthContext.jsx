import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useQueryClient } from "@tanstack/react-query";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Lỗi khi đọc user từ localStorage:", error);
      return null;
    }
  });

  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ✅ Hàm đăng xuất với hiệu ứng mượt mà
  const logout = async () => {
    setLoggingOut(true); // Bắt đầu hiệu ứng logout

    setTimeout(async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          await API.post("/auth/logout");
        }
      } catch (error) {
        console.error("Lỗi khi gọi API đăng xuất:", error);
      } finally {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setLoggingOut(false);
        queryClient.removeQueries(["CART_ITEM"]);
        navigate("/", { replace: true });
      }
    }, 300);
  };

  // ✅ Hàm lấy user từ localStorage khi tải lại trang
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (!storedToken || !storedUser || storedUser === "undefined") {
          setLoading(false);
          return;
        }

        let parsedUser;
        try {
          parsedUser = JSON.parse(storedUser);
          if (parsedUser?.role) {
            setUser(parsedUser);
          } else {
            throw new Error("Dữ liệu user không hợp lệ.");
          }
        } catch (error) {
          console.error("Lỗi khi parse user từ localStorage:", error);
          logout();
        }
      } catch (error) {
        console.error("Lỗi khi lấy user từ localStorage:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // ✅ Hàm đăng nhập: Lưu token, user và điều hướng
  const login = (userData, token) => {
    if (!userData || !token) {
      console.error("Dữ liệu đăng nhập không hợp lệ.");
      return;
    }

    try {
      const userToStore = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        phone: userData.phone || "Không có số điện thoại",
        address: userData.address || "Không có địa chỉ",
      };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userToStore));
      setUser(userToStore);

      if (userData.role === "Admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("Lỗi khi lưu user vào localStorage:", error);
    }
  };
  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {/* ✅ Hiển thị hiệu ứng đăng xuất */}
      {loggingOut ? (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.7)",
            color: "#fff",
            fontSize: "20px",
            zIndex: 9999,
            opacity: loggingOut ? 1 : 0,
            transition: "opacity 0.3s ease-in-out",
          }}
        >
          Đang đăng xuất...
        </div>
      ) : (
        !loading && children
      )}
    </AuthContext.Provider>
  );
};
