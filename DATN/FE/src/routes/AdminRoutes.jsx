// import { Routes, Route } from "react-router-dom";
// import PrivateRoute from "./PrivateRoute";
// import UserList from "../pages/admin/Users/UserList.jsx";
// import AddUser from "../pages/admin/Users/AddUser.jsx";  // ✅ Thêm trang thêm user
// import EditUser from "../pages/admin/Users/EditUser.jsx";
// import ViewUser from "../pages/admin/Users/ViewUser.jsx";
// import DeletedUsers from "../pages/admin/Users/DeletedUsers.jsx";
// import AdminLayouts from "../pages/admin/Layouts/AdminLayouts.jsx";
// import DashboardPage from "../pages/admin/Dashboard/DashboardPage.jsx";


//   const AdminRoutes = () => {
//     return (
//       <PrivateRoute allowedRoles={["Admin"]}>
//         <Routes>


          
//             <Route path="users" element={<UserList />} />
//             <Route path="users/add" element={<AddUser />} />  {/* ✅ Thêm route này */}
//             <Route path="users/edit/:id" element={<EditUser />} />
//             <Route path="users/view/:id" element={<ViewUser />} />
//             <Route path="users/deleted" element={<DeletedUsers />} />
//         </Routes>
//       </PrivateRoute> 
//     );
//   };

// export default AdminRoutes;





// import { Routes, Route } from "react-router-dom";
// import PrivateRoute from "./PrivateRoute";
// import AdminLayouts from "../pages/admin/Layouts/AdminLayouts.jsx";
// import DashboardPage from "../pages/admin/Dashboard/DashboardPage.jsx";

// // 📌 User Management Pages
// import UserList from "../pages/admin/Users/UserList.jsx";
// import AddUser from "../pages/admin/Users/AddUser.jsx";
// import EditUser from "../pages/admin/Users/EditUser.jsx";
// import ViewUser from "../pages/admin/Users/ViewUser.jsx";
// import DeletedUsers from "../pages/admin/Users/DeletedUsers.jsx";

// const AdminRoutes = () => {
//   return (
//     <PrivateRoute allowedRoles={["Admin"]}>
//       {/* ✅ AdminLayouts sẽ là khung chính, chứa Sidebar + Header */}
//       <AdminLayouts>
//         <Routes>
//           {/* 📌 Dashboard Trang chính của Admin */}
//           <Route index element={<DashboardPage />} />

//           {/* 👥 Quản lý Users */}
//           <Route path="users" element={<UserList />} />
//           <Route path="users/add" element={<AddUser />} />
//           <Route path="users/edit/:id" element={<EditUser />} />
//           <Route path="users/view/:id" element={<ViewUser />} />
//           <Route path="users/deleted" element={<DeletedUsers />} />
//         </Routes>
//       </AdminLayouts>
//     </PrivateRoute>
//   );
// };

// export default AdminRoutes;



import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import AdminLayout from "../pages/admin/Layouts/AdminLayouts.jsx";
import DashboardPage from "../pages/admin/Dashboard/DashboardPage.jsx";

// 📌 User Management Pages
import UserList from "../pages/admin/Users/UserList.jsx";
import AddUser from "../pages/admin/Users/AddUser.jsx";
import EditUser from "../pages/admin/Users/EditUser.jsx";
import ViewUser from "../pages/admin/Users/ViewUser.jsx";
import DeletedUsers from "../pages/admin/Users/DeletedUsers.jsx";

const AdminRoutes = () => {
  return (
    <PrivateRoute allowedRoles={["Admin"]}>
      {/* ✅ Đảm bảo AdminLayout hiển thị nội dung route con */}
      <AdminLayout>
        <Routes>
          <Route index element={<DashboardPage />} />
          <Route path="users" element={<UserList />} />
          <Route path="users/add" element={<AddUser />} />
          <Route path="users/edit/:id" element={<EditUser />} />
          <Route path="users/view/:id" element={<ViewUser />} />
          <Route path="users/deleted" element={<DeletedUsers />} />
        </Routes>
      </AdminLayout>
    </PrivateRoute>
  );
};

export default AdminRoutes;

