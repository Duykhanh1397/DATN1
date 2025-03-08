import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../services/api";

const ViewUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const { data } = await API.get(`/admin/users/${id}`);
      setUser(data);
    } catch (error) {
      setError("Không thể tải thông tin user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Thông tin User</h2>
      {loading ? <p>Đang tải...</p> : error ? <p style={{ color: "red" }}>{error}</p> : (
        <div>
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Tên:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Vai trò:</strong> {user.role}</p>
          <p><strong>Ngày tạo:</strong> {new Date(user.created_at).toLocaleString()}</p>
          <p><strong>Cập nhật lần cuối:</strong> {new Date(user.updated_at).toLocaleString()}</p>
          <button onClick={() => navigate("/admin/users")}>Quay lại</button>
        </div>
      )}
    </div>
  );
};

export default ViewUser;
