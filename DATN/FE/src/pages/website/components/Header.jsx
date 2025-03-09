// import React from "react";
// import { Layout, Menu, Input, Space, Badge, Dropdown } from "antd";
// import {
//   SearchOutlined,
//   ShoppingCartOutlined,
//   UserOutlined,
// } from "@ant-design/icons";
// import { Link } from "react-router-dom"; // dùng để chuyển trang



// const { Header } = Layout;

// const HeaderWebsite = () => {
//   const menuItems = [
//     {
//       label: <Link to="/iphone">iPhone</Link>,
//       key: "iPhone",
//     },
//     {
//       label: <Link to="/">iPad</Link>,
//       key: "iPad",
//     },
//     {
//       label: <Link to="/">MacBook</Link>,
//       key: "MacBook",
//     },
//     {
//       label: <Link to="/">Apple Watch</Link>,
//       key: "AppleWatch",
//     },
//     {
//       label: <Link to="/">Phụ kiện</Link>,
//       key: "Phụkiện",
//     },
//     {
//       label: <Link to="/">Tin tức</Link>,
//       key: "news",
//     },
//   ];

//   const userMenu = {
//     items: [
//       {
//         label: <Link to="/login">Đăng nhập</Link>,
//         key: "login",
//       },
//       {
//         label: <Link to="/register">Đăng ký</Link>,
//         key: "register",
//       },
//     ],
//   };
//   return (
//     <Header
//       style={{
//         backgroundColor: "#000",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "space-between",
//         padding: "0 50px",
//         height: 64,
//       }}
//     >
//       <div
//         className="logo"
//         style={{ color: "#fff", fontWeight: "bold", fontSize: "22px" }}
//       >
//         Ibee
//       </div>

//       <Menu
//         theme="dark"
//         mode="horizontal"
//         style={{
//           backgroundColor: "transparent",
//           flex: 1,
//           justifyContent: "center",
//           fontSize: "16px",
//           borderBottom: "none",
//         }}
//       >
//         {menuItems.map((item) => (
//           <Menu.Item key={item.key}>{item.label}</Menu.Item>
//         ))}
//       </Menu>

//       <Space size="large">
//         <Input
//           placeholder="Tìm kiếm sản phẩm..."
//           prefix={<SearchOutlined />}
//           style={{
//             backgroundColor: "#222",
//             color: "#fff",
//             borderRadius: 20,
//             width: 200,
//             border: "none",
//             padding: "4px 12px",
//           }}
//         />
//         <Dropdown menu={userMenu} trigger={["hover"]}>
//           <div
//             style={{
//               display: "inline-block",
//               cursor: "pointer",
//               transition: "color 0.3s ease",
//               color: "#fff",
//             }}
//           >
//             <UserOutlined
//               style={{ fontSize: "24px", color: "#fff", cursor: "pointer" }}
//             />
//           </div>
//         </Dropdown>

//         <Badge count={0} size="large">
//           <ShoppingCartOutlined
//             style={{ fontSize: "20px", color: "#fff", cursor: "pointer" }}
//           />
//         </Badge>
//       </Space>
//     </Header>
//   );
// };

// export default HeaderWebsite;










import React, { useContext } from "react";
import { Layout, Menu, Input, Space, Badge, Dropdown } from "antd";
import {
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext"; // ✅ Import AuthContext

const { Header } = Layout;

const HeaderWebsite = () => {
  const { user, logout } = useContext(AuthContext); // ✅ Lấy thông tin user và hàm logout

  const menuItems = [
    { label: <Link to="/iphone">iPhone</Link>, key: "iPhone" },
    { label: <Link to="/">iPad</Link>, key: "iPad" },
    { label: <Link to="/">MacBook</Link>, key: "MacBook" },
    { label: <Link to="/">Apple Watch</Link>, key: "AppleWatch" },
    { label: <Link to="/">Phụ kiện</Link>, key: "Phụkiện" },
    { label: <Link to="/">Tin tức</Link>, key: "news" },
  ];

  // ✅ Menu người dùng (Tùy thuộc vào trạng thái đăng nhập)
  const userMenu = {
    items: user
      ? [
          { label: `👤 ${user.name}`, key: "username", disabled: true },
          { label: <Link to="/profile">Hồ sơ</Link>, key: "profile" },
          { label: <Link to="/change-password">Đổi mật khẩu</Link>, key: "change-password" },
          { label: <span onClick={logout} style={{ color: "red", cursor: "pointer" }}>Đăng xuất</span>, key: "logout" },
        ]
      : [
          { label: <Link to="/login">Đăng nhập</Link>, key: "login" },
          { label: <Link to="/register">Đăng ký</Link>, key: "register" },
        ],
  };

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
        Ibee
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
        {/* 🔍 Tìm kiếm */}
        <Input
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
        />

        {/* 🔥 Dropdown User */}
        <Dropdown menu={userMenu} trigger={["hover"]}>
          <div style={{ display: "inline-block", cursor: "pointer", color: "#fff" }}>
            <UserOutlined style={{ fontSize: "24px", color: "#fff" }} />
          </div>
        </Dropdown>

        {/* 🛒 Giỏ hàng */}
        <Badge count={0} size="large">
          <ShoppingCartOutlined style={{ fontSize: "20px", color: "#fff" }} />
        </Badge>
      </Space>
    </Header>
  );
};

export default HeaderWebsite;
