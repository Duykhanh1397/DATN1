import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import UserList from "../pages/admin/Users/UserList.jsx";
import AddUser from "../pages/admin/Users/AddUser.jsx";  // ✅ Thêm trang thêm user
import EditUser from "../pages/admin/Users/EditUser.jsx";
import ViewUser from "../pages/admin/Users/ViewUser.jsx";
import DeletedUsers from "../pages/admin/Users/DeletedUsers.jsx";

const AdminRoutes = () => {
  return (
    <PrivateRoute allowedRoles={["Admin"]}>
      <Routes>
        <Route path="users" element={<UserList />} />
        <Route path="users/add" element={<AddUser />} />  {/* ✅ Thêm route này */}
        <Route path="users/edit/:id" element={<EditUser />} />
        <Route path="users/view/:id" element={<ViewUser />} />
        <Route path="users/deleted" element={<DeletedUsers />} />
      </Routes>
    </PrivateRoute>
  );
};

export default AdminRoutes;





