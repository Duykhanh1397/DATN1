import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../services/api";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "", role: "Customer" });

  useEffect(() => {
    API.get(`/admin/users/${id}`).then(({ data }) => setUser(data));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.put(`/admin/users/${id}`, user);
    navigate("/admin/users");
  };

  return (
    <div>
      <h2>Chỉnh sửa User</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} required />
        <input type="email" value={user.email} disabled />
        <select value={user.role} onChange={(e) => setUser({ ...user, role: e.target.value })}>
          <option value="Customer">Customer</option>
          <option value="Admin">Admin</option>
        </select>
        <button type="submit">Cập nhật</button>
      </form>
      <button onClick={() => navigate("/admin/users")}>Hủy</button>
    </div>
  );
};

export default EditUser;
