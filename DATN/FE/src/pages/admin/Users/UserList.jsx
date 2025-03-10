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







  // import { useState, useEffect, useContext } from "react";
  // import { useNavigate } from "react-router-dom";
  // import API from "../../../services/api";
  // import { AuthContext } from "../../../context/AuthContext";

  // const UserList = () => {
  //   const navigate = useNavigate();
  //   const { logout } = useContext(AuthContext); // Lấy hàm logout từ AuthContext
  //   const [users, setUsers] = useState([]);
  //   const [loading, setLoading] = useState(true);
  //   const [error, setError] = useState("");
  //   const [message, setMessage] = useState("");
  //   const [isDeleting, setIsDeleting] = useState(false); // Trạng thái khi xóa user

  //   useEffect(() => {
  //     fetchUsers();
  //   }, []);

  //   // ✅ Hàm tải danh sách users từ API
  //   const fetchUsers = async () => {
  //     try {
  //       const token = localStorage.getItem("token");
    
  //       if (!token) {
  //         setError("Bạn chưa đăng nhập.");
  //         return;
  //       }
    
  //       const response = await API.get("/admin/users", {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
    
  //       console.log("Dữ liệu từ API:", response.data); // ✅ Kiểm tra dữ liệu từ API
  //       if (response.data?.data) {
  //         setUsers(response.data.data);
  //       } else {
  //         setError("Dữ liệu API không đúng định dạng.");
  //       }
  //     } catch (error) {
  //       console.error("Lỗi tải danh sách users:", error);
  //       setError("Không thể tải danh sách users.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
    

  //   // ✅ Hàm xóa user với xác nhận
  //   const handleDeleteUser = async (userId) => {
  //     if (!window.confirm("Bạn có chắc chắn muốn xóa user này?")) return;

  //     try {
  //       setIsDeleting(true);
  //       const token = localStorage.getItem("token");

  //       if (!token) {
  //         setError("Bạn chưa đăng nhập.");
  //         return;
  //       }

  //       await API.delete(`/admin/users/${userId}`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });

  //       setMessage("Xóa user thành công.");
  //       setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId)); // Xóa user khỏi state
  //     } catch (error) {
  //       console.error("Lỗi khi xóa user:", error);
  //       setError("Không thể xóa user.");
  //     } finally {
  //       setIsDeleting(false);
  //     }
  //   };

  //   return (
  //     <div style={{ padding: "20px" }}>
  //       <h2>Quản lý Users</h2>

  //       {/* ✅ Nút Đăng xuất */}
  //       <button onClick={logout} style={{ backgroundColor: "red", color: "white", marginBottom: "10px" }}>
  //         Đăng xuất
  //       </button>

  //       {/* ✅ Hiển thị thông báo lỗi hoặc thành công */}
  //       {error && <p style={{ color: "red" }}>{error}</p>}
  //       {message && <p style={{ color: "green" }}>{message}</p>}

  //       {/* ✅ Các nút Thêm User và Xem Users đã xóa */}
  //       <div style={{ marginBottom: "10px" }}>
  //         <button onClick={() => navigate("/admin/users/add")} style={{ marginRight: "10px" }}>
  //           Thêm User
  //         </button>
  //         <button onClick={() => navigate("/admin/users/deleted")}>Xem Users đã xóa</button>
  //       </div>

  //       {/* ✅ Hiển thị danh sách Users */}
  //       {loading ? (
  //         <p>Đang tải danh sách người dùng...</p>
  //       ) : users.length === 0 ? (
  //         <p>Không có user nào.</p>
  //       ) : (
  //         <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
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
  //             {users.map((user) => (
  //               <tr key={user.id}>
  //                 <td>{user.id}</td>
  //                 <td>{user.name}</td>
  //                 <td>{user.email}</td>
  //                 <td>{user.role}</td>
  //                 <td>
  //                   <button onClick={() => navigate(`/admin/users/view/${user.id}`)} style={{ marginRight: "5px" }}>
  //                     Xem
  //                   </button>
  //                   <button onClick={() => navigate(`/admin/users/edit/${user.id}`)} style={{ marginRight: "5px" }}>
  //                     Sửa
  //                   </button>
  //                   <button
  //                     onClick={() => handleDeleteUser(user.id)}
  //                     style={{ backgroundColor: "red", color: "white" }}
  //                     disabled={isDeleting} // Vô hiệu hóa nút khi đang xóa
  //                   >
  //                     {isDeleting ? "Đang xóa..." : "Xóa"}
  //                   </button>
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









  import { PlusCircleOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Input,
  message,
  Popconfirm,
  Select,
  Skeleton,
  Space,
  Table,
  Tag,
} from "antd";
import React, { useState, useEffect, useContext } from "react";
import { Drawer } from "antd";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api";
import { AuthContext } from "../../../context/AuthContext";
// import UserEditPage from "./UserEditPage";
// import UserAddPage from "./UserAddPage";

const UserList = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext); // Lấy hàm logout từ AuthContext
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userFilter, setUserFilter] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ✅ Lấy danh sách Users từ API
  const { data, isLoading } = useQuery({
    queryKey: ["USERS_KEY"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Bạn chưa đăng nhập.");

      const response = await API.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data?.data?.map((user, index) => ({
        ...user,
        key: user.id,
        stt: index + 1,
      })) || [];
    },
  });

  // ✅ Hàm xóa user với xác nhận
  const deleteUserMutation = useMutation({
    mutationFn: async (id) => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Bạn chưa đăng nhập.");

      await API.delete(`/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      messageApi.success("Xóa người dùng thành công!");
      queryClient.invalidateQueries({ queryKey: ["USERS_KEY"] });
    },
    onError: () => {
      messageApi.error("Không thể xóa người dùng.");
    },
  });

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa user này?")) return;
    setIsDeleting(true);
    try {
      await deleteUserMutation.mutateAsync(id);
    } finally {
      setIsDeleting(false);
    }
  };

  // ✅ Cấu hình cột của bảng
  const columns = [
    { title: "#", dataIndex: "stt", key: "stt" },
    { title: "Tên", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    { title: "Địa chỉ", dataIndex: "address", key: "address" },
    {
      title: "Tình trạng",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status?.trim() === "Active" ? "green" : "red"}>
          {status || "-"}
        </Tag>
      ),
    },
    {
      key: "action",
      width: 200,
      render: (_, user) => (
        <Space>
          <Popconfirm
            title="Xóa người dùng"
            description="Bạn có chắc chắn muốn xóa không?"
            onConfirm={() => handleDeleteUser(user.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger disabled={isDeleting}>
              {isDeleting ? "Đang xóa..." : "Xóa"}
            </Button>
          </Popconfirm>
          <Button
            type="primary"
            onClick={() => {
              setCurrentUser(user);
              setIsDrawerVisible(true);
            }}
          >
            Cập nhật
          </Button>
        </Space>
      ),
    },
  ];

  // ✅ Lọc user theo tên & trạng thái
  const filteredData = data?.filter((user) => {
    const matchesName = user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = userFilter ? user.status === userFilter : true;
    return matchesName && matchesStatus;
  });

  // ✅ Quản lý Drawer (Thêm/Sửa user)
  const showDrawer = () => setIsDrawerVisible(true);
  const onClose = () => {
    setCurrentUser(null);
    setIsDrawerVisible(false);
  };

  return (
    <div>
      {contextHolder}
      {/* ✅ Thanh tiêu đề và nút thêm user */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-3xl font-semibold">Quản lý người dùng</h1>
        <Button type="default" onClick={showDrawer}>
          <PlusCircleOutlined /> Thêm người dùng
        </Button>
      </div>

      {/* ✅ Tìm kiếm và bộ lọc */}
      <Space style={{ marginBottom: 20 }}>
        <Input
          placeholder="Tìm kiếm người dùng theo tên"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300 }}
        />
        <Select
          placeholder="Chọn tình trạng"
          style={{ width: 200 }}
          value={userFilter}
          onChange={setUserFilter}
        >
          <Select.Option value={null}>Tất cả</Select.Option>
          <Select.Option value="Active">Active</Select.Option>
          <Select.Option value="Deactive">Deactive</Select.Option>
        </Select>
      </Space>

      {/* ✅ Hiển thị danh sách Users */}
      <Skeleton loading={isLoading} active>
        <Table dataSource={filteredData} columns={columns} rowKey="id" />
      </Skeleton>

      {/* ✅ Drawer (Form Thêm/Sửa user) */}
      <Drawer
        title={currentUser ? "Cập nhật người dùng" : "Thêm người dùng"}
        width={500}
        placement="right"
        onClose={onClose}
        open={isDrawerVisible}
        style={{ padding: 0, height: "100%" }}
        styles={{ body: { padding: 20, height: "100%" } }}
      >
        <div style={{ height: "100%", overflowY: "auto", padding: "20px" }}>
          {currentUser ? <UserEditPage user={currentUser} /> : <UserAddPage />}
        </div>
      </Drawer>
    </div>
  );
};

export default UserList;

