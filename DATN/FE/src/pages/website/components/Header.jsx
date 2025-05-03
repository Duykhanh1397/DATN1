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
import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { useCart } from "../cart/Cart";
import logo from "../../image/logo.png";
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
    { label: <Link to="/apple-watch">Apple Watch</Link>, key: "AppleWatch" },
    { label: <Link to="/phu-kien">Phụ kiện</Link>, key: "Phụkiện" },
    { label: <Link to="/news">Tin tức</Link>, key: "news" },
  ];

  const userMenu = {
    items: user
      ? [
          { label: `👤 ${user.name}`, key: "username", disabled: true },
          user.role === "Admin" && {
            label: <Link to="/admin">Quản trị</Link>,
            key: "Admin",
          },
          { label: <Link to="/profile">Hồ sơ</Link>, key: "profile" },
          { label: <Link to="/my-order">Đơn hàng</Link>, key: "myorder" },
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
        ].filter(Boolean)
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
          <Space style={{ width: "100%", justifyContent: "right" }}>
            <Link to="/cart">
              <Button style={{ width: 120 }}>GIỎ HÀNG</Button>
            </Link>
          </Space>
        </>
      )}
    </div>
  );

  return (
    <Header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "80px",
        zIndex: 1000,
        backgroundColor: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 50px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        className="logo"
        style={{
          width: "200px",
        }}
      >
        <Link to={"/"}>
          <img
            src={logo}
            alt="Ibee"
            style={{
              objectFit: "contain",
              height: "80px",
              width: "150px",
            }}
          />
        </Link>
      </div>

      <Menu
        theme="dark"
        mode="horizontal"
        style={{
          // backgroundColor: "transparent",
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

      <Space size="large">
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

        <Popover
          placement="bottomRight"
          content={cartContent}
          trigger={["hover"]}
        >
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
