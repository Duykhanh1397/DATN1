<<<<<<< Updated upstream
// import { Layout, Menu } from "antd";
// import { Link } from "react-router-dom";
// import {
//   DashboardOutlined,
//   ShoppingCartOutlined,
//   ShoppingOutlined,
//   UserOutlined,
//   TagOutlined,
//   BarChartOutlined,
// } from "@ant-design/icons";

// const { Sider } = Layout;

// const Sidebar = () => {
//   const menuItems = [
//     {
//       key: "dashboard",
//       icon: <DashboardOutlined />,
//       label: <Link to="/admin">Dashboard</Link>,
//     },
//     {
//       key: "products",
//       icon: <ShoppingOutlined />,
//       label: <Link to="/admin/products">Quản lý sản phẩm</Link>,
//     },
//     ,
//     {
//       key: "categories",
//       icon: <TagOutlined />,
//       label: <Link to="/admin/categories">Quản lý danh mục</Link>,
//     },
//     {
//       key: "orders",
//       icon: <ShoppingCartOutlined />,
//       label: <Link to="/admin/orders">Quản lý đơn hàng</Link>,
//     },
//     {
//       key: "users",
//       icon: <UserOutlined />,
//       label: <Link to="/admin/users">Quản lý tài khoản</Link>,
//     },
//     {
//       key: "coupons",
//       icon: <TagOutlined />,
//       label: <Link to="/admin/coupons">Mã giảm giá</Link>,
//     },
//     {
//       key: "reports",
//       icon: <BarChartOutlined />,
//       label: <Link to="/admin/reports">Thống kê</Link>,
//     },
//   ];

//   return (
//     <Sider collapsible>
//       <Menu theme="dark" mode="inline" items={menuItems} />
//     </Sider>
//   );
// };

// export default Sidebar;


import { Layout, Menu } from "antd";
=======
import { Layout, Menu, Popconfirm } from "antd";
>>>>>>> Stashed changes
import { Link, useLocation } from "react-router-dom";
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserOutlined,
  TagOutlined,
  BarChartOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import Admin from "./Admin";
import { AuthContext } from "../../../context/AuthContext";
import { useContext } from "react";

const { Sider } = Layout;

const Sidebar = () => {
<<<<<<< Updated upstream
  const location = useLocation(); // ✅ Lấy đường dẫn hiện tại

=======
  const location = useLocation(); // Lấy URL hiện tại để active menu
  const { user, logout } = useContext(AuthContext);

  // Cấu hình các item cho menu
>>>>>>> Stashed changes
  const menuItems = [
    {
      key: "/admin",
      icon: <DashboardOutlined />,
      label: <Link to="/admin">Dashboard</Link>,
    },
    {
      key: "/admin/users",
      icon: <UserOutlined />,
<<<<<<< Updated upstream
      label: <Link to="/admin/users">Quản lý tài khoản</Link>, // ✅ Kiểm tra đường dẫn
=======
      label: <Link to="/admin/users">Quản lý tài khoản</Link>,
>>>>>>> Stashed changes
    },
    {
      key: "/admin/products",
      icon: <ShoppingOutlined />,
<<<<<<< Updated upstream
      label: <Link to="/admin/products">Quản lý sản phẩm</Link>,
=======
      label: "Quản lý sản phẩm", // Tạo tiêu đề cho nhóm menu con
      children: [
        {
          key: "/admin/products/list",
          label: <Link to="/admin/products/list">Sản phẩm</Link>,
        },
        {
          key: "/admin/products/variants",
          label: <Link to="/admin/products/variants">Sản phẩm biến thể</Link>,
        },
      ],
>>>>>>> Stashed changes
    },
    {
      key: "/admin/categories",
      icon: <TagOutlined />,
      label: <Link to="/admin/categories">Quản lý danh mục</Link>,
    },
    {
      key: "/admin/orders",
      icon: <ShoppingCartOutlined />,
      label: <Link to="/admin/orders">Quản lý đơn hàng</Link>,
    },
    {
      key: "/admin/coupons",
      icon: <TagOutlined />,
      label: <Link to="/admin/coupons">Mã giảm giá</Link>,
    },
    {
      key: "/admin/reports",
      icon: <BarChartOutlined />,
      label: <Link to="/admin/reports">Thống kê</Link>,
    },
  ];

  return (
<<<<<<< Updated upstream
    <Sider collapsible>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]} // ✅ Đảm bảo trạng thái active
        items={menuItems}
      />
=======
    <Sider collapsible width={300} style={{ minHeight: "100vh" }}>
      <div
        style={{
          height: 64,
          margin: 16,
          background: "rgba(255, 255, 255, 0.2)",
          borderRadius: 8,
          textAlign: "center",
          lineHeight: "64px",
          color: "#fff",
          fontWeight: "bold",
          display: "flex", // Flex để xếp ngang
          alignItems: "center",
          justifyContent: "center", // căn giữa
        }}
      >
        <UserOutlined
          style={{ fontSize: "24px", color: "#fff", marginRight: "8px" }}
        />
        <h4 style={{ color: "#fff", margin: 0 }}>
          {user?.name ? user.name : "Admin Dashboard"}
        </h4>
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]} // Active item theo URL
        defaultOpenKeys={["/admin/products"]} // Mở menu con nếu cần
        items={menuItems}
      />

      <div
        style={{
          padding: "16px",
          borderTop: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <Popconfirm
          title="Bạn muốn đăng xuất?"
          okText="Đăng xuất"
          cancelText="Hủy"
          onConfirm={logout}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: 8,
              color: "#fff",
              textAlign: "center",
              padding: "12px 0",
              cursor: "pointer",
            }}
          >
            <LogoutOutlined
              style={{
                fontSize: "18px",
                marginRight: "8px",
                color: "#ff4d4f",
              }}
            />
            Đăng xuất
          </div>
        </Popconfirm>
      </div>
>>>>>>> Stashed changes
    </Sider>
  );
};

export default Sidebar;


