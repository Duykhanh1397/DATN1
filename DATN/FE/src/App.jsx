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

{
  /* 🔐 Đăng nhập & Đăng ký */
}
{
  /* <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} /> */
}

// export default App;
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Home from "./pages/website/Home/Home.jsx";
// import Login from "./pages/website/auth/Login";
// import Register from "./pages/website/auth/Register";
// import ForgotPassword from "./pages/website/auth/ForgotPassword";
// import ResetPassword from "./pages/website/auth/ResetPassword";
// import Dashboard from "./pages/website/auth/Dashboard";
// import Profile from "./pages/website/auth/Profile";
// import ChangePassword from "./pages/website/auth/ChangePassword";
// import NotFound from "./pages/website/auth/NotFound"; // ✅ Thêm trang lỗi 404
// import Websitelayout from "./pages/website/layouts/websitelayout.jsx";

// import AdminRoutes from "./routes/AdminRoutes"; // ✅ Tách riêng các route của Admin
// import PrivateRoute from "./routes/PrivateRoute";
// import { AuthProvider } from "./context/AuthContext";

// function App() {
//   return (
//     <BrowserRouter>
//       <AuthProvider>
//         <Routes>

//           {/* 🌍 Trang chính */}

//           {/* 🌍 Layout Website */}
//           <Route path="/" element={<Websitelayout />}>
//             <Route path="/" element={<Home />} />
//             <Route path="login" element={<Login />} />
//             <Route path="register" element={<Register />} />
//             <Route path="/forgot-password" element={<ForgotPassword />} />
//             <Route path="/reset-password" element={<ResetPassword />} />
//           </Route>

//           {/* 🔒 Khu vực bảo vệ dành cho user đã đăng nhập */}
//           <Route path="/dashboard" element={<PrivateRoute allowedRoles={["Customer", "Admin"]}><Dashboard /></PrivateRoute>} />
//           <Route path="/profile" element={<PrivateRoute allowedRoles={["Customer", "Admin"]}><Profile /></PrivateRoute>} />
//           <Route path="/change-password" element={<PrivateRoute allowedRoles={["Customer", "Admin"]}><ChangePassword /></PrivateRoute>} />

//           {/* 👑 Khu vực Admin */}
//           <Route path="/admin/*" element={<PrivateRoute allowedRoles={["Admin"]}><AdminRoutes /></PrivateRoute>} />

//           {/* ❌ Xử lý trang không tồn tại */}
//           <Route path="*" element={<NotFound />} />

//         </Routes>
//       </AuthProvider>
//     </BrowserRouter>
//   );
// }

// export default App;

// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Home from "./pages/website/Home/Home.jsx";
// import Login from "./pages/website/auth/Login";
// import Register from "./pages/website/auth/Register";
// import ForgotPassword from "./pages/website/auth/ForgotPassword";
// import ResetPassword from "./pages/website/auth/ResetPassword";
// import Dashboard from "./pages/website/auth/Dashboard";
// import Profile from "./pages/website/auth/Profile";
// import ChangePassword from "./pages/website/auth/ChangePassword";
// import NotFound from "./pages/website/auth/NotFound";
// import Websitelayout from "./pages/website/layouts/websitelayout.jsx";
// import AdminRoutes from "./routes/AdminRoutes";
// import PrivateRoute from "./routes/PrivateRoute";
// import { AuthProvider } from "./context/AuthContext";

// // ✅ Tạo một QueryClient mới
// const queryClient = new QueryClient();

// function App() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <BrowserRouter>
//         <AuthProvider>
//           <Routes>
//             {/* 🌍 Layout Website */}
//             <Route path="/" element={<Websitelayout />}>
//               <Route path="/" element={<Home />} />
//               <Route path="login" element={<Login />} />
//               <Route path="register" element={<Register />} />
//               <Route path="/forgot-password" element={<ForgotPassword />} />
//               <Route path="/reset-password" element={<ResetPassword />} />
//             </Route>

//             {/* 🔒 Khu vực bảo vệ dành cho user đã đăng nhập */}
//             <Route path="/dashboard" element={<PrivateRoute allowedRoles={["Customer", "Admin"]}><Dashboard /></PrivateRoute>} />
//             <Route path="/profile" element={<PrivateRoute allowedRoles={["Customer", "Admin"]}><Profile /></PrivateRoute>} />
//             <Route path="/change-password" element={<PrivateRoute allowedRoles={["Customer", "Admin"]}><ChangePassword /></PrivateRoute>} />

//             {/* 👑 Khu vực Admin */}
//             <Route path="/admin/*" element={<PrivateRoute allowedRoles={["Admin"]}><AdminRoutes /></PrivateRoute>} />

//             {/* ❌ Xử lý trang không tồn tại */}
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </AuthProvider>
//       </BrowserRouter>
//     </QueryClientProvider>
//   );
// }

// export default App;

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // ✅ Đảm bảo AuthProvider load trước
// import PrivateRoute from "./routes/PrivateRoute";
// import AdminRoutes from "./routes/AdminRoutes";

// 🌍 Website Pages
import Websitelayout from "./pages/website/layouts/Websitelayout.jsx";
import Home from "./pages/website/Home/Home.jsx";
import Login from "./pages/website/auth/Login";
import Register from "./pages/website/auth/Register";
import ForgotPassword from "./pages/website/auth/ForgotPassword";
import ResetPassword from "./pages/website/auth/ResetPassword";

// 🔒 User Pages (Chỉ user đăng nhập mới thấy)
// import Dashboard from "./pages/website/auth/Dashboard";
// import Profile from "./pages/website/auth/Profile";
// import ChangePassword from "./pages/website/auth/ChangePassword";

// ❌ Page Not Found
import NotFound from "./pages/website/auth/NotFound";
import AdminLayout from "./pages/admin/Layouts/AdminLayouts.jsx";
import UserList from "./pages/admin/Users/UserList.jsx";
import DashboardPage from "./pages/admin/Dashboard/DashboardPage.jsx";
import AddUser from "./pages/admin/Users/AddUser.jsx";
import EditUser from "./pages/admin/Users/EditUser.jsx";
import ViewUser from "./pages/admin/Users/ViewUser.jsx";
import DeletedUsers from "./pages/admin/Users/DeletedUsers.jsx";
import CategoryList from "./pages/admin/Categories/CategoryList.jsx";
import CartPage from "./pages/website/cart/CartPage.jsx";
import ProductList from "./pages/admin/Products/ProductList.jsx";
import DeletedProductsList from "./pages/admin/Products/DeletedProductsList .jsx";
import OrderDetail from "./pages/admin/Orders/OrderDetailPage.jsx";
import ProductVariantList from "./pages/admin/Products/ProductVariantList.jsx";
import DetailPage from "./pages/website/Detail/DetailPage.jsx";
import Iphone from "./pages/website/Categories/Iphone.jsx";
import Ipad from "./pages/website/Categories/Ipad.jsx";
import MacBook from "./pages/website/Categories/MacBook.jsx";
import AppleWatch from "./pages/website/Categories/AppleWatch.jsx";
import PhuKien from "./pages/website/Categories/PhuKien.jsx";
import Checkout from "./pages/website/Checkout/Checkout.jsx";
import OrderList from "./pages/admin/Orders/OrderList.jsx";

// ✅ Tạo một QueryClient mới
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* 🌍 Layout Website */}
            <Route path="/" element={<Websitelayout />}>
              <Route index element={<Home />} />{" "}
              {/* ✅ Fix lỗi đường dẫn `/` */}
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="reset-password" element={<ResetPassword />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="order/:orderId" element={<Checkout />} />
              <Route path="product/:id" element={<DetailPage />} />
              <Route path="iphone" element={<Iphone />} />
              <Route path="ipad" element={<Ipad />} />
              <Route path="macbook" element={<MacBook />} />
              <Route path="applewatch" element={<AppleWatch />} />
              <Route path="phukien" element={<PhuKien />} />
              {/* <Route path="/product" element={<DetailPage />} /> */}
            </Route>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="users" element={<UserList />} />
              <Route path="users/add" element={<AddUser />} />
              <Route path="users/edit/:id" element={<EditUser />} />
              <Route path="users/view/:id" element={<ViewUser />} />
              <Route path="users/deleted" element={<DeletedUsers />} />
              <Route path="categories" element={<CategoryList />} />
              <Route path="products/list" element={<ProductList />} />
              <Route
                path="products/variants"
                element={<ProductVariantList />}
              />
              <Route path="products/delete" element={<DeletedProductsList />} />
              <Route path="orders" element={<OrderList />} />
              <Route path="orders/:orderId" element={<OrderDetail />} />
            </Route>

            {/* 🔒 User Protected Routes */}
            {/* <Route path="/dashboard" element={
              <PrivateRoute allowedRoles={["Customer", "Admin"]}>
                <Dashboard />
              </PrivateRoute>
            } /> */}

            {/* <Route path="/profile" element={
              <PrivateRoute allowedRoles={["Customer", "Admin"]}>
                <Profile />
              </PrivateRoute>
            } /> */}

            {/* <Route path="/change-password" element={
              <PrivateRoute allowedRoles={["Customer", "Admin"]}>
                <ChangePassword />
              </PrivateRoute>
            } /> */}

            {/* 👑 Admin Routes */}
            {/* <Route path="/admin/*" element={
              <PrivateRoute allowedRoles={["Admin"]}>
                <AdminRoutes />
              </PrivateRoute>
            } /> */}

            {/* ❌ 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
