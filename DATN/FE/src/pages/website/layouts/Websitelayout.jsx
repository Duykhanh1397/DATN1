import { Layout } from "antd";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { Outlet } from "react-router-dom";
const { Content } = Layout;

const Websitelayout = ({}) => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />
      <Content style={{ padding: "0px" }}>
        <Outlet />
      </Content>
      <Footer />
    </Layout>
  );
};

export default Websitelayout;
