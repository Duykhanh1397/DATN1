import { theme, Dropdown, Menu } from "antd";
import { AuthContext } from "../../../context/AuthContext";
import { useContext } from "react";
import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const Admin = () => {
  const { user, logout } = useContext(AuthContext); // Đảm bảo `logout` có sẵn trong context

  // Menu người dùng
  const userMenuItems = user
    ? [
        { label: `👤 ${user.name}`, key: "username", disabled: true },
        {
          label: <Link to="/">Trang chủ</Link>,
          key: "home",
        },
        {
          label: (
            <span onClick={logout} style={{ color: "red", cursor: "pointer" }}>
              Đăng xuất
            </span>
          ),
          key: "logout",
        },
      ]
    : [];

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
      }}
    >
      {/* Dropdown menu chỉ có một phần tử con */}
      <Dropdown overlay={<Menu items={userMenuItems} />} trigger={["hover"]}>
        <div
          style={{
            display: "inline-block",
            cursor: "pointer",
            color: "#fff",
          }}
        >
          <UserOutlined
            style={{ fontSize: "24px", color: "#fff", marginRight: "8px" }}
          />
          <span>{user?.name ? ` ${user.name}` : "Admin Dashboard"}</span>
        </div>
      </Dropdown>
    </div>
  );
};

export default Admin;
