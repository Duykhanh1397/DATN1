import React from "react";
import { Row, Col } from "antd";
import {
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
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
          <ul style={{ listStyle: "none", paddingLeft: 0 }}>
            <li>✅ Chính sách bảo hành</li>
            <li>🔄 Chính sách đổi trả</li>
            <li>📑 Chính sách xuất hóa đơn</li>
            <li>⚪ Chính sách chứng nhận an toàn thực phẩm</li>
          </ul>
        </Col>
        <Col xs={24} md={8}>
          <h3 style={{ marginBottom: "15px", fontWeight: "bold" }}>
            LIÊN VỚI CHÚNG TÔI
          </h3>
          <p>
            <EnvironmentOutlined /> Công ty Công Nghệ Ibee
          </p>
          <p>
            <PhoneOutlined /> 0763.272.301
          </p>
          <p>
            <MailOutlined /> ibee@gmail.com
          </p>
        </Col>
      </Row>
    </div>
  );
};

export default Footer;

