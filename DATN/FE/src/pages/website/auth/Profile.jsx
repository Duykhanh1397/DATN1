// import { useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../../../context/AuthContext";

// const Profile = () => {
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

//   return (
//     <div>
//       <h2>Hồ sơ cá nhân</h2>
//       {user ? (
//         <div>
//           <p><strong>Tên:</strong> {user.name}</p>
//           <p><strong>Email:</strong> {user.email}</p>
//           <p><strong>Vai trò:</strong> {user.role}</p>
//         </div>
//       ) : (
//         <p>Không tìm thấy thông tin người dùng.</p>
//       )}

//       {/* ✅ Nút quay lại về trang Dashboard */}
//       <button onClick={() => navigate("/dashboard")} style={{ marginTop: "10px" }}>
//         Quay lại Dashboard
//       </button>
//     </div>
//   );
// };

// export default Profile;


import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>👤 Hồ sơ cá nhân</h2>

      {user ? (
        <div style={{ backgroundColor: "#f8f9fa", padding: "20px", borderRadius: "8px", display: "inline-block" }}>
          <p><strong>👤 Tên:</strong> {user.name}</p>
          <p><strong>📧 Email:</strong> {user.email}</p>
          <p><strong>🔰 Vai trò:</strong> {user.role}</p>
        </div>
      ) : (
        <p style={{ color: "red" }}>❌ Không tìm thấy thông tin người dùng.</p>
      )}

      {/* ✅ Nút quay lại về trang Gốc */}
      <button 
        onClick={() => navigate("/")} 
        style={{ marginTop: "20px", backgroundColor: "gray", color: "white", padding: "10px 20px", borderRadius: "5px", cursor: "pointer" }}
      >
        ⬅ Quay lại Trang Chủ
      </button>
    </div>
  );
};

export default Profile;
