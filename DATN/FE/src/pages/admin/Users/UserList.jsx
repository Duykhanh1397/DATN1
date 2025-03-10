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
import React, { useState } from "react";
import { Drawer } from "antd";
import API from "../../../services/api";
import EditUser from "./EditUser";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const UserList = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userFilter, setUserFilter] = useState(null);

  // ✅ Lấy danh sách Users từ API
  const { data, isLoading } = useQuery({
    queryKey: ["USERS_KEY"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Bạn chưa đăng nhập.");

      const response = await API.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      return (
        response.data?.data?.map((user, index) => ({
          ...user,
          key: user.id,
          stt: index + 1,
        })) || []
      );
    },
  });

  // ✅ Hàm xóa user với xác nhận
  const { mutate } = useMutation({
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
        <Tag color={status?.trim() === "Hoạt động" ? "#52C41A" : "#BFBFBF"}>
          {status || "-"}
        </Tag>
      ),
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role?.trim() === "Admin" ? "#FF4D4F" : "#FAAD14 "}>
          {role || "-"}
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
            onConfirm={() => mutate(user.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger>
              <DeleteOutlined />
            </Button>
          </Popconfirm>
          <Button
            type="primary"
            onClick={() => {
              setCurrentUser(user);
              setIsDrawerVisible(true);
            }}
          >
            <EditOutlined />
          </Button>
        </Space>
      ),
    },
  ];

  // ✅ Lọc user theo tên & trạng thái
  const filteredData = data?.filter((user) => {
    const matchesName = user.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
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
          <Select.Option value="Hoạt động">Hoạt động</Select.Option>
          <Select.Option value="Ngưng hoạt động">Ngưng Hoạt động</Select.Option>
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
          {currentUser && (
            <EditUser user={currentUser} userId={currentUser?.id} />
          )}
        </div>
      </Drawer>
    </div>
  );
};

export default UserList;
