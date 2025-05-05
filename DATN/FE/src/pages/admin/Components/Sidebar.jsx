import { Layout, Menu, Popconfirm } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserOutlined,
  TagOutlined,
  BarChartOutlined,
  LogoutOutlined,
  DeleteOutlined,
  AppstoreOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import { AuthContext } from "../../../context/AuthContext";
import { useContext, useState } from "react";

const { Sider } = Layout;

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const [collapsed, setCollapsed] = useState(false); // State để kiểm tra thu nhỏ

  const menuItems = [
    {
      key: "/admin",
      icon: <DashboardOutlined />,
      label: <Link to="/admin">Dashboard</Link>,
    },
    {
      key: "/admin/users",
      icon: <UserOutlined />,
      label: <Link to="/admin/users">Quản lý tài khoản</Link>,
    },
    {
      key: "/admin/products",
      icon: <ShoppingOutlined />,
      label: "Quản lý sản phẩm",
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
      key: "/admin/vouchers",
      icon: <TagOutlined />,
      label: <Link to="/admin/vouchers">Mã giảm giá</Link>,
    },
    {
      key: "/admin/variant",
      icon: <AppstoreOutlined />,
      label: "Quản lý biến thể",
      children: [
        {
          key: "/admin/variant/color",
          label: <Link to="/admin/variant/color">Màu sắc</Link>,
        },
        {
          key: "/admin/variant/storage",
          label: <Link to="/admin/variant/storage">Dung lượng</Link>,
        },
      ],
    },
    {
      key: "/admin/softdelete",
      icon: <DeleteOutlined />,
      label: "Danh sách xóa mềm",
      children: [
        {
          key: "/admin/softdelete/products",
          label: <Link to="/admin/softdelete/products">Sản phẩm</Link>,
        },
        {
          key: "/admin/softdelete/productvariants",
          label: (
            <Link to="/admin/softdelete/productvariants">
              Sản phẩm biến thể
            </Link>
          ),
        },
        {
          key: "/admin/softdelete/categories",
          label: <Link to="/admin/softdelete/categories">Danh mục</Link>,
        },
        {
          key: "/admin/softdelete/users",
          label: <Link to="/admin/softdelete/users">Tài khoản</Link>,
        },
        {
          key: "/admin/softdelete/vouchers",
          label: <Link to="/admin/softdelete/vouchers">Mã giảm giá</Link>,
        },
        // {
        //   key: "/admin/softdelete/color",
        //   label: <Link to="/admin/softdelete/color">Màu sắc</Link>,
        // },
        // {
        //   key: "/admin/softdelete/storage",
        //   label: <Link to="/admin/softdelete/storage">Dung lượng</Link>,
        // },
      ],
    },
    {
      key: "/admin/review",
      icon: <CommentOutlined />,
      label: <Link to="/admin/review">Đánh giá</Link>,
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed} // Cập nhật trạng thái collapsed
      width={250}
      style={{ minHeight: "100vh" }}
    >
      {/* Header Admin */}
      <div
        style={{
          height: 64,
          margin: 16,
          background: "rgba(255, 255, 255, 0.2)",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden", // Ẩn nội dung tràn khi thu nhỏ
          whiteSpace: "nowrap",
          transition: "width 0.3s",
        }}
      >
        <UserOutlined
          style={{
            fontSize: "24px",
            color: "#fff",
            marginRight: collapsed ? 0 : 8, // Ẩn khoảng cách khi thu nhỏ
            transition: "margin 0.3s",
          }}
        />
        {!collapsed && (
          <h4 style={{ color: "#fff", margin: 0 }}>
            {user?.name || "Admin Dashboard"}
          </h4>
        )}
      </div>

      {/* Menu */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
      />

      {/* Nút đăng xuất */}
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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s",
            }}
          >
            <LogoutOutlined
              style={{
                fontSize: "18px",
                marginRight: collapsed ? 0 : 8, // Ẩn khoảng cách khi thu nhỏ
                color: "#ff4d4f",
                transition: "margin 0.3s",
              }}
            />
            {!collapsed && "Đăng xuất"}
          </div>
        </Popconfirm>
      </div>
    </Sider>
  );
};

export default Sidebar;
