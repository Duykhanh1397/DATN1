import { Layout } from "antd";
import Sidebar from "../Components/Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";

const { Content } = Layout;

const AdminLayout = () => {
  const location = useLocation();

  // Cuộn trang lên đầu khi location (URL) thay đổi
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]); // Mỗi khi location thay đổi (chuyển trang), sẽ cuộn lên đầu

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* ✅ Sidebar luôn cố định */}
      <Sidebar />

      <Layout style={{ overflow: "hidden", flex: 1 }}>
        <Content
          style={{
            margin: "20px",
            background: "#fff",
            padding: "20px",
            overflowY: "auto",
            height: "100vh",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
