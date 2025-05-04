import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children, allowedRoles }) => {
  const auth = useContext(AuthContext);

  // ✅ Kiểm tra xem `AuthContext` có tồn tại không
  if (!auth || !auth.user) {
    alert("Lỗi: AuthContext bị null hoặc user chưa đăng nhập!");

    return <Navigate to="/login" replace />;
  }

  const { user } = auth;

  // ✅ Nếu user không có quyền, chuyển hướng về trang Dashboard hoặc thông báo lỗi
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    alert(`Cảnh báo: User không có quyền truy cập! Vai trò: ${user.role}`);

    return <Navigate to="/" replace />;
  }

  // ✅ Nếu mọi thứ hợp lệ, render component con
  return children;
};

export default PrivateRoute;
