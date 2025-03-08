// import { Navigate } from "react-router-dom";
// import { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";

// const PrivateRoute = ({ children }) => {
//   const { user, loading } = useContext(AuthContext);

//   if (loading) return <p>Đang tải...</p>; // Nếu loading thì hiển thị text

//   return user ? children : <Navigate to="/login" />;
// };

// export default PrivateRoute;


// import { Navigate } from "react-router-dom";
// import { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";

// const PrivateRoute = ({ children, allowedRoles }) => {
//   const auth = useContext(AuthContext);

//   if (!auth) {
//     console.error("Lỗi: AuthContext bị null, kiểm tra AuthProvider!");
//     return <Navigate to="/login" />;
//   }

//   const { user } = auth;

//   if (!user) {
//     return <Navigate to="/login" />;
//   }

//   if (!allowedRoles.includes(user.role)) {
//     return <Navigate to="/dashboard" />;
//   }

//   return children;
// };

// export default PrivateRoute;





import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children, allowedRoles }) => {
  const auth = useContext(AuthContext);

  // ✅ Kiểm tra xem `AuthContext` có tồn tại không
  if (!auth || !auth.user) {
    console.error("Lỗi: AuthContext bị null hoặc user chưa đăng nhập!");
    return <Navigate to="/login" replace />;
  }

  const { user } = auth;

  // ✅ Nếu user không có quyền, chuyển hướng về trang Dashboard hoặc thông báo lỗi
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.warn(`Cảnh báo: User không có quyền truy cập! Vai trò: ${user.role}`);
    return <Navigate to="/dashboard" replace />;
  }

  // ✅ Nếu mọi thứ hợp lệ, render component con
  return children;
};

export default PrivateRoute;


