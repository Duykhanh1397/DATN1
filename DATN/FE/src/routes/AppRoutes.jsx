// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Home from "../pages/Home";
// import Login from "../pages/Login";
// import Register from "../pages/Register";
// import ForgotPassword from "../pages/ForgotPassword"; // Thêm ForgotPassword
// import Dashboard from "../pages/Dashboard";
// import Profile from "../pages/Profile";
// import ChangePassword from "../pages/ChangePassword";
// import { AuthProvider } from "../context/AuthContext";
// import PrivateRoute from "./PrivateRoute";

// const AppRoutes = () => {
//   return (
//     <BrowserRouter>
//       <AuthProvider>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Thêm route ForgotPassword */}
//           <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
//           <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
//           <Route path="/change-password" element={<PrivateRoute><ChangePassword /></PrivateRoute>} />
//         </Routes>
//       </AuthProvider>
//     </BrowserRouter>
//   );
// };

// export default AppRoutes;


import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
import AdminRoutes from "./routes/AdminRoutes";
import Dashboard from "./pages/website/auth/Dashboard";
import Home from "./pages/website/Home/Home";
import Login from "./pages/website/auth/Login";
import Register from "./pages/website/auth/Register";
import NotFound from "./pages/website/auth/NotFound"; // ✅ Thêm trang lỗi 404

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* 🌍 Trang chính */}
          <Route path="/" element={<Websitelayout />}>
        
        <Route path="/" element={<Home />} />
     <Route path="login" element={<Login />} />
     <Route path="register" element={<Register />} />
     <Route path="/forgot-password" element={<ForgotPassword />} />
   <Route path="/reset-password" element={<ResetPassword />} />
   </Route>

          {/* 🔐 Đăng nhập & Đăng ký */}
          {/* <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> */}

          {/* 🔒 Khu vực user đã đăng nhập */}
          <Route path="/" element={<PrivateRoute allowedRoles={["Customer", "Admin"]}><Dashboard /></PrivateRoute>} />

          {/* 👑 Khu vực Admin */}
          <Route path="/admin/*" element={<PrivateRoute allowedRoles={["Admin"]}><AdminRoutes /></PrivateRoute>} />

          {/* ❌ Route không tồn tại */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;


