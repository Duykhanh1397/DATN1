import React from "react";
import { Row, Col } from "antd";
import {
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  SyncOutlined,
  CarOutlined,
} from "@ant-design/icons";

const Footer = () => {
  return (
    <div style={{ backgroundColor: "#000", color: "#fff", padding: "30px 0" }}>
      <Row gutter={[16, 16]} justify="center">
        <Col
          xs={24}
          md={6}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src=""
            alt="Ibee"
            style={{ width: "100px", height: "100px", objectFit: "contain" }}
          />
          <h3 style={{ marginTop: "10px" }}>Ibee</h3>
        </Col>
        <Col xs={24} md={8}>
          <h3 style={{ marginBottom: "15px", fontWeight: "bold" }}>
            CHÍNH SÁCH
          </h3>
          <div style={{ fontSize: "16px", lineHeight: "1.6" }}>
            <p>
              <SyncOutlined style={{ color: "#1890ff", marginRight: 8 }} />
              Hư gì đổi nấy 12 tháng tại cửa hàng ,chính sách bảo hành, đổi trả
            </p>
            <p>
              <CarOutlined style={{ color: "#faad14", marginRight: 8 }} />
              Giao hàng nhanh toàn quốc
            </p>
          </div>
        </Col>
        <Col xs={24} md={8}>
          <h3 style={{ marginBottom: "15px", fontWeight: "bold" }}>
            LIÊN VỚI CHÚNG TÔI
          </h3>
          <div style={{ fontSize: "16px", lineHeight: "1.6" }}>
            <p>
              <EnvironmentOutlined
                style={{ color: "#FFA500", marginRight: 8 }}
              />
              Công ty Công Nghệ Ibee
            </p>
            <p>
              <PhoneOutlined style={{ color: "#f5222d", marginRight: 8 }} />
              0763.272.301
            </p>
            <p>
              <MailOutlined style={{ color: "#1E90FF", marginRight: 8 }} />
              ibee@gmail.com
            </p>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Footer;
