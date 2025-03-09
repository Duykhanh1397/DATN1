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
import { Link, useLocation } from "react-router-dom";
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserOutlined,
  TagOutlined,
  BarChartOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

const Sidebar = () => {
  const location = useLocation(); // ✅ Lấy đường dẫn hiện tại

  const menuItems = [
    {
      key: "/admin",
      icon: <DashboardOutlined />,
      label: <Link to="/admin">Dashboard</Link>,
    },
    {
      key: "/admin/users",
      icon: <UserOutlined />,
      label: <Link to="/admin/users">Quản lý tài khoản</Link>, // ✅ Kiểm tra đường dẫn
    },
    {
      key: "/admin/products",
      icon: <ShoppingOutlined />,
      label: <Link to="/admin/products">Quản lý sản phẩm</Link>,
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
    <Sider collapsible>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]} // ✅ Đảm bảo trạng thái active
        items={menuItems}
      />
    </Sider>
  );
};

export default Sidebar;


