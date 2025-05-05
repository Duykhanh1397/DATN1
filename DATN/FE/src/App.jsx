import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
// 🌍 Website Pages
import Websitelayout from "./pages/website/layouts/Websitelayout.jsx";
import Home from "./pages/website/Home/Home.jsx";
import Login from "./pages/website/auth/Login";
import Register from "./pages/website/auth/Register";
import ForgotPassword from "./pages/website/auth/ForgotPassword";
import ResetPassword from "./pages/website/auth/ResetPassword";
import ChangePassword from "./pages/website/auth/ChangePassword";
import Profile from "./pages/website/auth/Profile";
import NotFound from "./pages/website/auth/NotFound";
import DetailPage from "./pages/website/Detail/DetailPage.jsx";
import Iphone from "./pages/website/Categories/Iphone.jsx";
import Ipad from "./pages/website/Categories/Ipad.jsx";
import MacBook from "./pages/website/Categories/MacBook.jsx";
import AppleWatch from "./pages/website/Categories/AppleWatch.jsx";
import PhuKien from "./pages/website/Categories/PhuKien.jsx";
import CartPage from "./pages/website/cart/CartPage.jsx";
import Checkout from "./pages/website/Checkout/Checkout.jsx";
import MyOrder from "./pages/website/Checkout/MyOrder.jsx";
import OrderDetails from "./pages/website/Checkout/OrderDetail.jsx";
import PaymentReturn from "./pages/website/Checkout/PaymentReturn";
// 🌍 Admin Pages
import AdminLayout from "./pages/admin/Layouts/AdminLayouts.jsx";
import UserList from "./pages/admin/Users/UserList.jsx";
import AddUser from "./pages/admin/Users/AddUser.jsx";
import EditUser from "./pages/admin/Users/EditUser.jsx";
import ViewUser from "./pages/admin/Users/ViewUser.jsx";
import CategoryList from "./pages/admin/Categories/CategoryList.jsx";
import ProductList from "./pages/admin/Products/ProductList.jsx";
import OrderDetail from "./pages/admin/Orders/OrderDetailPage.jsx";
import ProductVariantList from "./pages/admin/Products/ProductVariantList.jsx";
import OrderList from "./pages/admin/Orders/OrderList.jsx";
import VoucherList from "./pages/admin/Vouchers/VoucherList.jsx";
import SoftDeleteProducts from "./pages/admin/Soft delete/SoftDeleteProducts.jsx";
import SoftDeleteCategories from "./pages/admin/Soft delete/SoftDeleteCategories.jsx";
import SoftDeleteUsers from "./pages/admin/Soft delete/SoftDeleteUsers.jsx";
import SoftDeleteProductVariant from "./pages/admin/Soft delete/SoftDeleteProductVariant.jsx";
import SoftDeleteVoucher from "./pages/admin/Soft delete/SoftDeleteVoucher.jsx";
import ColorList from "./pages/admin/ColorVariant/ColorList.jsx";
import StorageList from "./pages/admin/StorageVariant/StorageList.jsx";
import PrivateRoute from "./routes/PrivateRoute.jsx";
import Dashboard from "./pages/admin/Dashboard/DashboardPage.jsx";
import ReviewList from "./pages/admin/Review/ReviewList.jsx";
import NewsPage from "./pages/website/Categories/NewPage";
import SoftDeleteColor from "./pages/admin/Soft delete/SoftDeleteColor.jsx";
import SoftDeleteStorage from "./pages/admin/Soft delete/SoftDeleteStorage.jsx";

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
              <Route path="change-password" element={<ChangePassword />} />
              <Route path="profile" element={<Profile />} />
              <Route path="product/:id" element={<DetailPage />} />
              <Route path="iphone" element={<Iphone />} />
              <Route path="ipad" element={<Ipad />} />
              <Route path="macbook" element={<MacBook />} />
              <Route path="apple-watch" element={<AppleWatch />} />
              <Route path="phu-kien" element={<PhuKien />} />
              <Route path="news" element={<NewsPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="my-order" element={<MyOrder />} />
              <Route path="payment-return" element={<PaymentReturn />} />
              <Route
                path="/my-order-detail/:orderId"
                element={<OrderDetails />}
              />
            </Route>
            <Route
              path="/admin"
              element={
                <PrivateRoute allowedRoles={["Admin"]}>
                  <AdminLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="users" element={<UserList />} />
              <Route path="users/add" element={<AddUser />} />
              <Route path="users/edit/:id" element={<EditUser />} />
              <Route path="users/view/:id" element={<ViewUser />} />
              <Route path="categories" element={<CategoryList />} />
              <Route path="products/list" element={<ProductList />} />
              <Route
                path="products/variants"
                element={<ProductVariantList />}
              />
              <Route path="orders" element={<OrderList />} />
              <Route path="orders/:orderId" element={<OrderDetail />} />
              <Route path="vouchers" element={<VoucherList />} />
              <Route path="variant/color" element={<ColorList />} />
              <Route path="variant/storage" element={<StorageList />} />
              <Route path="review" element={<ReviewList />} />

              <Route
                path="softdelete/products"
                element={<SoftDeleteProducts />}
              />
              <Route
                path="softdelete/productvariants"
                element={<SoftDeleteProductVariant />}
              />
              <Route
                path="softdelete/categories"
                element={<SoftDeleteCategories />}
              />
              <Route path="softdelete/users" element={<SoftDeleteUsers />} />
              <Route
                path="softdelete/vouchers"
                element={<SoftDeleteVoucher />}
              />
              <Route path="softdelete/color" element={<SoftDeleteColor />} />
              <Route
                path="softdelete/storage"
                element={<SoftDeleteStorage />}
              />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
