import React, { useContext, useState } from "react";
import {
  Layout,
  Menu,
  Input,
  Space,
  Badge,
  Dropdown,
  Popover,
  Button,
  Divider,
  List,
  Image,
  Spin,
} from "antd";
import {
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { useCart } from "../cart/Cart";

const { Header } = Layout;

const HeaderWebsite = () => {
  const { user, logout } = useContext(AuthContext);

  const { cartItems, isLoading } = useCart();
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.product_variant.price * item.quantity,
    0
  );

  const menuItems = [
    { label: <Link to="/iphone">iPhone</Link>, key: "iPhone" },
    { label: <Link to="/ipad">iPad</Link>, key: "iPad" },
    { label: <Link to="/macbook">MacBook</Link>, key: "MacBook" },
    { label: <Link to="/applewatch">Apple Watch</Link>, key: "AppleWatch" },
    { label: <Link to="/phukien">Phụ kiện</Link>, key: "Phụkiện" },
    { label: <Link to="/">Tin tức</Link>, key: "news" },
  ];

  // ✅ Menu người dùng (Tùy thuộc vào trạng thái đăng nhập)
  const userMenu = {
    items: user
      ? [
          { label: `👤 ${user.name}`, key: "username", disabled: true },
          { label: <Link to="/profile">Hồ sơ</Link>, key: "profile" },
          {
            label: <Link to="/change-password">Đổi mật khẩu</Link>,
            key: "change-password",
          },
          {
            label: (
              <span
                onClick={logout}
                style={{ color: "red", cursor: "pointer" }}
              >
                Đăng xuất
              </span>
            ),
            key: "logout",
          },
        ]
      : [
          { label: <Link to="/login">Đăng nhập</Link>, key: "login" },
          { label: <Link to="/register">Đăng ký</Link>, key: "register" },
        ],
  };

  const cartContent = (
    <div style={{ width: 320 }}>
      {isLoading ? (
        <Spin />
      ) : (
        <>
          <div style={{ maxHeight: 300, overflowY: "auto" }}>
            <List
              itemLayout="horizontal"
              dataSource={cartItems}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Image width={50} src={item.product_variant.image} />
                    }
                    title={
                      <div style={{ fontWeight: 500 }}>
                        {item.product_variant.name}
                      </div>
                    }
                    description={`Số lượng: ${item.quantity}`}
                  />
                  <div style={{ whiteSpace: "nowrap" }}>
                    {Number(item.product_variant.price).toLocaleString("vi-VN")}{" "}
                    VNĐ
                  </div>
                </List.Item>
              )}
            />
          </div>

          <Divider />
          <div style={{ textAlign: "right", marginBottom: 10 }}>
            <strong>{Number(totalPrice).toLocaleString("vi-VN")} VNĐ ₫</strong>
          </div>
          <Space style={{ width: "100%", justifyContent: "center" }}>
            <Link to="/cart">
              <Button style={{ width: 120 }}>GIỎ HÀNG</Button>
            </Link>
            <Link to="/checkout">
              <Button type="primary" style={{ width: 120 }}>
                THANH TOÁN
              </Button>
            </Link>
          </Space>
        </>
      )}
    </div>
  );

  return (
    <Header
      style={{
        backgroundColor: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 50px",
        height: 64,
      }}
    >
      {/* ✅ Logo */}
      <div
        className="logo"
        style={{ color: "#fff", fontWeight: "bold", fontSize: "22px" }}
      >
        <Link to={"/"}>Ibee</Link>
      </div>

      {/* ✅ Menu chính */}
      <Menu
        theme="dark"
        mode="horizontal"
        style={{
          backgroundColor: "transparent",
          flex: 1,
          justifyContent: "center",
          fontSize: "16px",
          borderBottom: "none",
        }}
      >
        {menuItems.map((item) => (
          <Menu.Item key={item.key}>{item.label}</Menu.Item>
        ))}
      </Menu>

      {/* ✅ Khu vực phải */}
      <Space size="large">
        {/* <Input
          placeholder="Tìm kiếm sản phẩm..."
          prefix={<SearchOutlined />}
          style={{
            backgroundColor: "#222",
            color: "#fff",
            borderRadius: 20,
            width: 200,
            border: "none",
            padding: "4px 12px",
          }}
        /> */}

        <Dropdown menu={userMenu} trigger={["hover"]}>
          <div
            style={{
              display: "inline-block",
              cursor: "pointer",
              color: "#fff",
            }}
          >
            <UserOutlined style={{ fontSize: "24px", color: "#fff" }} />
          </div>
        </Dropdown>

        <Popover placement="bottomRight" content={cartContent} trigger="click">
          <Badge count={cartItems.length} size="large">
            <div style={{ cursor: "pointer" }}>
              <ShoppingCartOutlined
                style={{ fontSize: "20px", color: "#fff" }}
              />
            </div>
          </Badge>
        </Popover>
      </Space>
    </Header>
  );
};

export default HeaderWebsite;
