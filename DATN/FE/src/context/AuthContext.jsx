// import { createContext, useState, useEffect } from "react";
// import API from "../services/api";

// export const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const storedToken = localStorage.getItem("token");
//         const storedUser = localStorage.getItem("user");

//         if (storedToken && storedUser && storedUser !== "undefined") {
//           try {
//             const parsedUser = JSON.parse(storedUser);
//             if (parsedUser) {
//               setUser(parsedUser);
//             } else {
//               throw new Error("Dữ liệu user không hợp lệ.");
//             }
//           } catch (error) {
//             console.error("Lỗi khi parse user từ localStorage:", error);
//             localStorage.removeItem("token");
//             localStorage.removeItem("user");
//             setUser(null);
//           }
//         } else {
//           setUser(null);
//           localStorage.removeItem("token");
//           localStorage.removeItem("user");
//         }
//       } catch (error) {
//         console.error("Lỗi khi lấy user từ localStorage:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, setUser, loading }}>
//       {!loading && children} {/* Chỉ hiển thị khi load xong */}
//     </AuthContext.Provider>
//   );
// };




// import { createContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../services/api";

// export const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   // Định nghĩa logout trước khi sử dụng trong fetchUser
//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser(null);
//     navigate("/login", { replace: true });
//   };

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const storedToken = localStorage.getItem("token");
//         const storedUser = localStorage.getItem("user");

//         if (storedToken && storedUser !== "undefined") {
//           try {
//             const parsedUser = JSON.parse(storedUser);
//             if (parsedUser?.role) {
//               setUser(parsedUser);
//             } else {
//               throw new Error("Dữ liệu user không hợp lệ.");
//             }
//           } catch (error) {
//             console.error("Lỗi khi parse user từ localStorage:", error);
//             logout(); // Gọi logout() khi có lỗi
//           }
//         } else {
//           logout();
//         }
//       } catch (error) {
//         console.error("Lỗi khi lấy user từ localStorage:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, []);

//   // Hàm login cập nhật trạng thái user và điều hướng
//   const login = (userData, token) => {
//     localStorage.setItem("token", token);
//     localStorage.setItem("user", JSON.stringify(userData));
//     setUser(userData);

//     if (userData.role === "Admin") {
//       navigate("/admin/users", { replace: true });
//     } else {
//       navigate("/dashboard", { replace: true });
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, loading }}>
//       {!loading && children} {/* Chỉ hiển thị khi load xong */}
//     </AuthContext.Provider>
//   );
// };







import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Hàm đăng xuất
  const logout = async () => {
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
      navigate("/login", { replace: true });
    }
  };

  // ✅ Hàm lấy user từ localStorage khi tải lại trang
  useEffect(() => {
    const fetchUser = async () => {
        try {
          const storedToken = localStorage.getItem("token");
          const storedUser = localStorage.getItem("user");
      
          if (!storedToken || !storedUser || storedUser === "undefined") {
            console.warn("Không tìm thấy token hoặc user, nhưng không logout ngay.");
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

  // ✅ Hàm đăng nhập: Lưu token, user và điều hướng thông minh
  const login = (userData, token) => {
    if (!userData || !token) {
      console.error("Dữ liệu đăng nhập không hợp lệ.");
      return;
    }

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);

    // ✅ Điều hướng thông minh: Nếu user đã ở trang đúng, không điều hướng lại
    if (userData.role === "Admin") {
      if (window.location.pathname !== "/admin/users") {
        navigate("/admin/users", { replace: true });
      }
    } else {
      if (window.location.pathname !== "/dashboard") {
        navigate("/dashboard", { replace: true });
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children} {/* Chỉ hiển thị khi load xong */}
    </AuthContext.Provider>
  );
};






// import { createContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../services/api";

// export const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const storedToken = localStorage.getItem("token");
//         const storedUser = localStorage.getItem("user");

//         if (!storedToken || !storedUser || storedUser === "undefined") {
//           return;
//         }

//         let parsedUser;
//         try {
//           parsedUser = JSON.parse(storedUser);
//           if (parsedUser?.role) {
//             setUser(parsedUser);
//           } else {
//             throw new Error("Dữ liệu user không hợp lệ.");
//           }
//         } catch (error) {
//           console.error("Lỗi khi parse user từ localStorage:", error);
//         }
//       } catch (error) {
//         console.error("Lỗi khi lấy user từ localStorage:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, []);

//   const login = (userData, token) => {
//     localStorage.setItem("token", token);
//     localStorage.setItem("user", JSON.stringify(userData));
//     setUser(userData);
//   };

//   const logout = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (token) {
//         await API.post("/auth/logout");
//       }
//     } catch (error) {
//       console.error("Lỗi khi gọi API đăng xuất:", error);
//     } finally {
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       setUser(null);
//       navigate("/login", { replace: true });
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, loading }}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };
