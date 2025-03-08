// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import ForgotPassword from "./pages/ForgotPassword";
// import ResetPassword from "./pages/ResetPassword";
// import Dashboard from "./pages/Dashboard";
// import Profile from "./pages/Profile";
// import ChangePassword from "./pages/ChangePassword";
// import { AuthProvider } from "./context/AuthContext";
// import PrivateRoute from "./routes/PrivateRoute";

// function App() {
//   return (
//     <BrowserRouter>
//       <AuthProvider>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/forgot-password" element={<ForgotPassword />} />
//           <Route path="/reset-password" element={<ResetPassword />} />
//           <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
//           <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
//           <Route path="/change-password" element={<PrivateRoute><ChangePassword /></PrivateRoute>} />
//         </Routes>
//       </AuthProvider>
//     </BrowserRouter>
//   );
// }

// export default App;
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/website/Home/Home.jsx";
import Login from "./pages/website/auth/Login";
import Register from "./pages/website/auth/Register";
import ForgotPassword from "./pages/website/auth/ForgotPassword";
import ResetPassword from "./pages/website/auth/ResetPassword";
import Dashboard from "./pages/website/auth/Dashboard";
import Profile from "./pages/website/auth/Profile";
import ChangePassword from "./pages/website/auth/ChangePassword";
import NotFound from "./pages/website/auth/NotFound"; // ✅ Thêm trang lỗi 404
import Websitelayout from "./pages/website/layouts/websitelayout.jsx";








import AdminRoutes from "./routes/AdminRoutes"; // ✅ Tách riêng các route của Admin
import PrivateRoute from "./routes/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>


          
          {/* 🌍 Trang chính */}
        



               {/* 🌍 Layout Website */}
               <Route path="/" element={<Websitelayout />}>
        
               <Route path="/" element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          </Route>




          {/* 🔐 Đăng nhập & Đăng ký */}
          {/* <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} /> */}

          {/* 🔒 Khu vực bảo vệ dành cho user đã đăng nhập */}
          <Route path="/dashboard" element={<PrivateRoute allowedRoles={["Customer", "Admin"]}><Dashboard /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute allowedRoles={["Customer", "Admin"]}><Profile /></PrivateRoute>} />
          <Route path="/change-password" element={<PrivateRoute allowedRoles={["Customer", "Admin"]}><ChangePassword /></PrivateRoute>} />

          {/* 👑 Khu vực Admin */}
          <Route path="/admin/*" element={<PrivateRoute allowedRoles={["Admin"]}><AdminRoutes /></PrivateRoute>} />

          {/* ❌ Xử lý trang không tồn tại */}
          <Route path="*" element={<NotFound />} />





        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;












