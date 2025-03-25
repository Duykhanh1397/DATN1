import { Layout } from "antd";
import Sidebar from "../Components/Sidebar";
import { Outlet } from "react-router-dom";
import HeaderAdmin from "../Components/Header";

const { Content } = Layout;

const AdminLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout>
        <Content
          style={{ margin: "20px", background: "#fff", padding: "20px" }}
        >
          <Outlet /> {/* ✅ Load nội dung route con ở đây */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
