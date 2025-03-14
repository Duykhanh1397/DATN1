// import { useState, useEffect, useContext } from "react";
// import API from "../../services/api";
// import { AuthContext } from "../../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// const UserManagement = () => {
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [users, setUsers] = useState([]);
//   const [deletedUsers, setDeletedUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "Customer" });
//   const [editingUser, setEditingUser] = useState(null);
//   const [viewingUser, setViewingUser] = useState(null);

//   useEffect(() => {
//     if (!user || user.role !== "Admin") {
//       navigate("/dashboard"); // Chặn truy cập nếu không phải Admin
//     } else {
//       fetchUsers();
//       fetchDeletedUsers();
//     }
//   }, [user, navigate]);

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

//   const fetchDeletedUsers = async () => {
//     try {
//       const { data } = await API.get("/admin/users/deleted");
//       setDeletedUsers(data.data);
//     } catch (error) {
//       console.error("Không thể tải danh sách users đã xóa");
//     }
//   };

//   const handleAddUser = async (e) => {
//     e.preventDefault();
//     try {
//       await API.post("/admin/users", newUser);
//       fetchUsers();
//       setNewUser({ name: "", email: "", password: "", role: "Customer" });
//     } catch (error) {
//       setError("Không thể thêm user");
//     }
//   };

//   const handleUpdateUser = async (e) => {
//     e.preventDefault();
//     try {
//       await API.put(`/admin/users/${editingUser.id}`, editingUser);
//       fetchUsers();
//       setEditingUser(null);
//     } catch (error) {
//       setError("Không thể cập nhật user");
//     }
//   };

//   const handleDeleteUser = async (userId) => {
//     if (window.confirm("Bạn có chắc chắn muốn xóa user này?")) {
//       try {
//         await API.delete(`/admin/users/${userId}`);
//         fetchUsers();
//         fetchDeletedUsers();
//       } catch (error) {
//         setError("Không thể xóa user");
//       }
//     }
//   };

//   const handleRestoreUser = async (userId) => {
//     try {
//       await API.post(`/admin/users/${userId}/restore`);
//       fetchUsers();
//       fetchDeletedUsers();
//     } catch (error) {
//       setError("Không thể khôi phục user");
//     }
//   };

//   const handleForceDeleteUser = async (userId) => {
//     if (window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn user này?")) {
//       try {
//         await API.delete(`/admin/users/${userId}/force-delete`);
//         fetchDeletedUsers();
//       } catch (error) {
//         setError("Không thể xóa vĩnh viễn user");
//       }
//     }
//   };

//   return (
//     <div>
//       <h2>Quản lý Users</h2>
//       {error && <p style={{ color: "red" }}>{error}</p>}

//       {/* Danh sách Users */}
//       <h3>Danh sách Users</h3>
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
//                   <button onClick={() => setViewingUser(u)}>Xem</button>
//                   <button onClick={() => setEditingUser(u)}>Sửa</button>
//                   <button onClick={() => handleDeleteUser(u.id)}>Xóa</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {/* Danh sách Users đã bị xóa */}
//       <h3>Users đã bị xóa</h3>
//       <table border="1">
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Tên</th>
//             <th>Email</th>
//             <th>Hành động</th>
//           </tr>
//         </thead>
//         <tbody>
//           {deletedUsers.map((u) => (
//             <tr key={u.id}>
//               <td>{u.id}</td>
//               <td>{u.name}</td>
//               <td>{u.email}</td>
//               <td>
//                 <button onClick={() => handleRestoreUser(u.id)}>Khôi phục</button>
//                 <button onClick={() => handleForceDeleteUser(u.id)}>Xóa vĩnh viễn</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Modal Thêm User */}
//       <h3>Thêm User</h3>
//       <form onSubmit={handleAddUser}>
//         <input type="text" placeholder="Tên" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} required />
//         <input type="email" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} required />
//         <input type="password" placeholder="Mật khẩu" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required />
//         <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
//           <option value="Customer">Customer</option>
//           <option value="Admin">Admin</option>
//         </select>
//         <button type="submit">Thêm</button>
//       </form>

//       {/* Modal Sửa User */}
//       {editingUser && (
//         <div>
//           <h3>Sửa User</h3>
//           <form onSubmit={handleUpdateUser}>
//             <input type="text" placeholder="Tên" value={editingUser.name} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} required />
//             <input type="email" placeholder="Email" value={editingUser.email} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} required />
//             <select value={editingUser.role} onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}>
//               <option value="Customer">Customer</option>
//               <option value="Admin">Admin</option>
//             </select>
//             <button type="submit">Cập nhật</button>
//           </form>
//           <button onClick={() => setEditingUser(null)}>Hủy</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserManagement;

