import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [quote, setQuote] = useState("");

  // ✅ Nếu user chưa đăng nhập, điều hướng về trang login
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  // ✅ Lấy câu nói truyền cảm hứng ngẫu nhiên
  useEffect(() => {
    const quotes = [
      "Hôm nay là một ngày tuyệt vời để chinh phục mục tiêu!",
      "Không có giới hạn nào cho những gì bạn có thể đạt được.",
      "Thành công không phải là điểm đến, mà là hành trình.",
      "Mỗi ngày là một cơ hội mới để trở thành phiên bản tốt hơn của chính bạn.",
      "Hãy làm điều bạn yêu thích và bạn sẽ không phải làm việc một ngày nào trong đời."
    ];
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  // ✅ Hàm xử lý chuyển hướng an toàn
  const handleNavigation = (path) => {
    navigate(path, { replace: true });
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
      <h2>🎉 Chào mừng, {user ? user.name : "Người dùng"}!</h2>

      {/* ✅ Nội dung thú vị */}
      <p style={{ fontStyle: "italic", fontSize: "16px", color: "#555" }}>
        "{quote}"
      </p>

      {/* ✅ Hiển thị thông tin profile */}
      <div style={{ marginTop: "20px", padding: "10px", borderRadius: "8px", backgroundColor: "#f5f5f5" }}>
        <h3>👤 Thông tin cá nhân</h3>
        <p><strong>Email:</strong> {user?.email || "Không có dữ liệu"}</p>
        <p><strong>Vai trò:</strong> {user?.role || "Không xác định"}</p>
      </div>

      {/* ✅ Các nút chức năng */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
        <button 
          onClick={() => handleNavigation("/profile")} 
          style={buttonStyle}
        >
          📂 Xem Profile
        </button>

        <button 
          onClick={() => handleNavigation("/change-password")} 
          style={buttonStyle}
        >
          🔑 Đổi Mật Khẩu
        </button>

        <button 
          onClick={async () => {
            try {
              await API.post("/auth/logout"); // Gọi API đăng xuất
            } catch (error) {
              console.error("Lỗi khi gọi API đăng xuất:", error);
            } finally {
              logout(); // Đăng xuất ở frontend
            }
          }}
          style={{ ...buttonStyle, backgroundColor: "red", color: "white" }}
        >
          🚪 Đăng Xuất
        </button>
      </div>
    </div>
  );
};

// ✅ Style cho các nút
const buttonStyle = {
  padding: "10px",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "16px",
  border: "none",
  backgroundColor: "#007BFF",
  color: "white",
  transition: "0.3s",
  width: "100%"
};

export default Dashboard;
