import { Layout } from "antd";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";

const { Content } = Layout;

const Websitelayout = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />
      <Content style={{ paddingTop: "64px" }}>
        <Outlet />
      </Content>
      <Footer />
    </Layout>
  );
};

export default Websitelayout;
