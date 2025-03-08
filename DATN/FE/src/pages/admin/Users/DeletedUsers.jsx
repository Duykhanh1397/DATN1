import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api";

const DeletedUsers = () => {
  const [deletedUsers, setDeletedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchDeletedUsers();
  }, []);

  const fetchDeletedUsers = async () => {
    try {
      const { data } = await API.get("/admin/users/deleted");
      setDeletedUsers(data.data);
    } catch (error) {
      setError("Không thể tải danh sách users đã bị xóa.");
    } finally {
      setLoading(false);
    }
  };

  const restoreUser = async (id) => {
    try {
      await API.post(`/admin/users/${id}/restore`);
      fetchDeletedUsers(); // Cập nhật lại danh sách sau khi khôi phục
    } catch (error) {
      console.error("Lỗi khi khôi phục user:", error);
    }
  };

  return (
    <div>
      <h2>Danh sách Users đã bị xóa</h2>
      <button onClick={() => navigate("/admin/users")}>Quay lại</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Email</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {deletedUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button onClick={() => restoreUser(user.id)}>Khôi phục</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DeletedUsers;
