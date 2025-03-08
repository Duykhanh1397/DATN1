// import { useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../../services/api";
// import { AuthContext } from "../../context/AuthContext";

// const UserList = () => {
//   const navigate = useNavigate();
//   const { logout } = useContext(AuthContext); // Nhận hàm logout từ AuthContext
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const { data } = await API.get("/admin/users");
//       setUsers(data.data);
//     } catch (error) {
//       setError("Không thể tải danh sách users");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h2>Quản lý Users</h2>
      
//       {/* Nút Đăng xuất */}
//       <button onClick={logout} style={{ backgroundColor: "red", color: "white", marginBottom: "10px" }}>
//         Đăng xuất
//       </button>

//       {error && <p style={{ color: "red" }}>{error}</p>}

//       {/* Các nút thêm User và xem Users đã xóa */}
//       <button onClick={() => navigate("/admin/users/add")}>Thêm User</button>
//       <button onClick={() => navigate("/admin/users/deleted")}>Xem Users đã xóa</button>

//       {loading ? <p>Đang tải...</p> : (
//         <table border="1">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Tên</th>
//               <th>Email</th>
//               <th>Vai trò</th>
//               <th>Hành động</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((u) => (
//               <tr key={u.id}>
//                 <td>{u.id}</td>
//                 <td>{u.name}</td>
//                 <td>{u.email}</td>
//                 <td>{u.role}</td>
//                 <td>
//                   <button onClick={() => navigate(`/admin/users/view/${u.id}`)}>Xem</button>
//                   <button onClick={() => navigate(`/admin/users/edit/${u.id}`)}>Sửa</button>
//                   <button onClick={() => API.delete(`/admin/users/${u.id}`).then(fetchUsers)}>Xóa</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default UserList;







import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api";
import { AuthContext } from "../../../context/AuthContext";

const UserList = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext); // Lấy hàm logout từ AuthContext
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false); // Trạng thái khi xóa user

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Hàm tải danh sách users từ API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Bạn chưa đăng nhập.");
        return;
      }

      const response = await API.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Dữ liệu từ API:", response.data);
      if (response.data?.data) {
        setUsers(response.data.data);
      } else {
        setError("Dữ liệu API không đúng định dạng.");
      }
    } catch (error) {
      console.error("Lỗi tải danh sách users:", error);
      setError("Không thể tải danh sách users.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Hàm xóa user với xác nhận
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa user này?")) return;

    try {
      setIsDeleting(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Bạn chưa đăng nhập.");
        return;
      }

      await API.delete(`/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("Xóa user thành công.");
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId)); // Xóa user khỏi state
    } catch (error) {
      console.error("Lỗi khi xóa user:", error);
      setError("Không thể xóa user.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Quản lý Users</h2>

      {/* ✅ Nút Đăng xuất */}
      <button onClick={logout} style={{ backgroundColor: "red", color: "white", marginBottom: "10px" }}>
        Đăng xuất
      </button>

      {/* ✅ Hiển thị thông báo lỗi hoặc thành công */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      {/* ✅ Các nút Thêm User và Xem Users đã xóa */}
      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => navigate("/admin/users/add")} style={{ marginRight: "10px" }}>
          Thêm User
        </button>
        <button onClick={() => navigate("/admin/users/deleted")}>Xem Users đã xóa</button>
      </div>

      {/* ✅ Hiển thị danh sách Users */}
      {loading ? (
        <p>Đang tải danh sách người dùng...</p>
      ) : users.length === 0 ? (
        <p>Không có user nào.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => navigate(`/admin/users/view/${user.id}`)} style={{ marginRight: "5px" }}>
                    Xem
                  </button>
                  <button onClick={() => navigate(`/admin/users/edit/${user.id}`)} style={{ marginRight: "5px" }}>
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    style={{ backgroundColor: "red", color: "white" }}
                    disabled={isDeleting} // Vô hiệu hóa nút khi đang xóa
                  >
                    {isDeleting ? "Đang xóa..." : "Xóa"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserList;


