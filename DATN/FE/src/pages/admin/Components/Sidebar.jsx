import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
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
  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: <Link to="/admin">Dashboard</Link>,
    },
    {
      key: "products",
      icon: <ShoppingOutlined />,
      label: <Link to="/admin/products">Quản lý sản phẩm</Link>,
    },
    ,
    {
      key: "categories",
      icon: <TagOutlined />,
      label: <Link to="/admin/categories">Quản lý danh mục</Link>,
    },
    {
      key: "orders",
      icon: <ShoppingCartOutlined />,
      label: <Link to="/admin/orders">Quản lý đơn hàng</Link>,
    },
    {
      key: "users",
      icon: <UserOutlined />,
      label: <Link to="/admin/users">Quản lý tài khoản</Link>,
    },
    {
      key: "coupons",
      icon: <TagOutlined />,
      label: <Link to="/admin/coupons">Mã giảm giá</Link>,
    },
    {
      key: "reports",
      icon: <BarChartOutlined />,
      label: <Link to="/admin/reports">Thống kê</Link>,
    },
  ];

  return (
    <Sider collapsible>
      <Menu theme="dark" mode="inline" items={menuItems} />
    </Sider>
  );
};

export default Sidebar;
