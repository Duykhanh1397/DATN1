// import React, { useState } from "react";
// import { Card, Table, Row, Col, Divider, List, Select, DatePicker } from "antd";
// import {
//   AppstoreOutlined,
//   ShoppingCartOutlined,
//   ShoppingOutlined,
//   DollarOutlined,
// } from "@ant-design/icons";
// import {
//   Chart as ChartJS,
//   ArcElement,
//   Tooltip,
//   Legend,
//   CategoryScale,
//   LinearScale,
//   BarElement,
// } from "chart.js";
// import { Doughnut, Bar } from "react-chartjs-2";
// import { useQuery } from "@tanstack/react-query";
// import API from "../../../services/api";
// import dayjs from "dayjs";

// ChartJS.register(
//   ArcElement,
//   Tooltip,
//   Legend,
//   CategoryScale,
//   LinearScale,
//   BarElement
// );

// const { RangePicker } = DatePicker;

// const Dashboard = () => {
//   const [revenueType, setRevenueType] = useState("month");
//   const [customRange, setCustomRange] = useState([]);

//   // Query doanh thu theo thời gian
//   const { data: revenueData, isLoading: loadingRevenue } = useQuery({
//     queryKey: ["revenue", revenueType, customRange],
//     queryFn: async () => {
//       if (revenueType === "custom" && customRange.length === 2) {
//         const start = customRange[0].format("YYYY-MM-DD");
//         const end = customRange[1].format("YYYY-MM-DD");
//         const { data } = await API.get(
//           `/admin/reports/revenue/custom-period?start_date=${start}&end_date=${end}`
//         );
//         return data;
//       } else {
//         const { data } = await API.get(`/admin/reports/revenue/${revenueType}`);
//         return data;
//       }
//     },
//     enabled: revenueType !== "custom" || customRange.length === 2,
//   });

//   const generateFullDateRange = (start, end) => {
//     const startDate = dayjs(start);
//     const endDate = dayjs(end);
//     const dates = [];
//     for (
//       let date = startDate;
//       date.isBefore(endDate) || date.isSame(endDate);
//       date = date.add(1, "day")
//     ) {
//       dates.push(date.format("DD/MM"));
//     }
//     return dates;
//   };

//   const fullDates = revenueData
//     ? generateFullDateRange(revenueData.start_date, revenueData.end_date)
//     : [];

//   const revenueMap = (revenueData?.chart || []).reduce((acc, item) => {
//     acc[item.label] = item.value;
//     return acc;
//   }, {});

//   const filledChart = fullDates.map((label) => ({
//     label,
//     value: revenueMap[label] || 0,
//   }));

//   const { data: orderStatusData } = useQuery({
//     queryKey: ["order-status"],
//     queryFn: async () => {
//       const { data } = await API.get("/admin/reports/orders/status-report");
//       return data;
//     },
//   });

//   const { data: overviewReport } = useQuery({
//     queryKey: ["overview"],
//     queryFn: async () => {
//       const { data } = await API.get("/admin/reports/overview");
//       return data;
//     },
//   });

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Chờ xác nhận":
//         return "orange";
//       case "Đã xác nhận":
//         return "blue";
//       case "Đang giao hàng":
//         return "cyan";
//       case "Giao hàng thành công":
//         return "green";
//       case "Giao hàng thất bại":
//         return "red";
//       case "Hủy đơn":
//         return "volcano";
//       default:
//         return "default";
//     }
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <Row gutter={16}>
//         <Col span={6}>
//           <Card style={{ backgroundColor: "#FFA500", color: "#fff" }}>
//             <AppstoreOutlined /> Tổng Số Sản Phẩm
//             <div style={{ fontSize: 24, fontWeight: "bold" }}>
//               {overviewReport?.total_products || 0}
//             </div>
//           </Card>
//         </Col>
//         <Col span={6}>
//           <Card style={{ backgroundColor: "#17a2b8", color: "#fff" }}>
//             <ShoppingCartOutlined /> Đã Bán
//             <div style={{ fontSize: 24, fontWeight: "bold" }}>
//               {overviewReport?.total_sold_products || 0}
//             </div>
//           </Card>
//         </Col>
//         <Col span={6}>
//           <Card style={{ backgroundColor: "#28a745", color: "#fff" }}>
//             <ShoppingOutlined /> Tổng Số Đơn Hàng
//             <div style={{ fontSize: 24, fontWeight: "bold" }}>
//               {overviewReport?.total_orders || 0}
//             </div>
//           </Card>
//         </Col>
//         <Col span={6}>
//           <Card style={{ backgroundColor: "#FF5733", color: "#fff" }}>
//             <DollarOutlined /> Tổng Doanh Thu
//             <div style={{ fontSize: 24, fontWeight: "bold" }}>
//               {overviewReport?.total_revenue
//                 ? `${Number(overviewReport?.total_revenue).toLocaleString(
//                     "vi-VN"
//                   )} VNĐ`
//                 : "0 VNĐ"}
//             </div>
//           </Card>
//         </Col>
//       </Row>

//       <div style={{ marginTop: 24 }}>
//         <div style={{ marginBottom: 8 }}>
//           <h3>Thống Kê Doanh Thu</h3>
//           <Select
//             value={revenueType}
//             style={{ width: 150, marginRight: 16 }}
//             onChange={(value) => {
//               setRevenueType(value);
//               if (value !== "custom") {
//                 setCustomRange([]);
//               }
//             }}
//           >
//             <Select.Option value="day">Theo Ngày</Select.Option>
//             <Select.Option value="week">Theo Tuần</Select.Option>
//             <Select.Option value="month">Theo Tháng</Select.Option>
//             <Select.Option value="custom">Tùy Chỉnh</Select.Option>
//           </Select>

//           {revenueType === "custom" && (
//             <RangePicker
//               value={customRange}
//               format="YYYY-MM-DD"
//               onChange={(dates) => setCustomRange(dates)}
//             />
//           )}
//         </div>

//         <Row gutter={16}>
//           <Col span={12}>
//             <Card>
//               <h3>Tình Trạng Đơn Hàng</h3>
//               <div
//                 style={{ width: "400px", height: "400px", margin: "0 auto" }}
//               >
//                 <Doughnut
//                   data={{
//                     labels: orderStatusData?.map((item) => item.status),
//                     datasets: [
//                       {
//                         data: orderStatusData?.map((item) => item.count),
//                         backgroundColor: orderStatusData?.map((item) =>
//                           getStatusColor(item.status)
//                         ),
//                       },
//                     ],
//                   }}
//                   options={{
//                     plugins: {
//                       legend: {
//                         position: "right",
//                         labels: {
//                           boxWidth: 12,
//                         },
//                       },
//                     },
//                   }}
//                 />
//               </div>
//             </Card>
//           </Col>
//         </Row>
//         <Row gutter={16}>
//           <Col span={24}>
//             <Card>
//               {loadingRevenue ? (
//                 <div>Đang tải dữ liệu...</div>
//               ) : (
//                 <Bar
//                   data={{
//                     labels: filledChart.map((item) => item.label),
//                     datasets: [
//                       {
//                         label: "Doanh thu",
//                         data: filledChart.map((item) => item.value),
//                         backgroundColor: "#42A5F5",
//                         borderColor: "#42A5F5",
//                         borderWidth: 1,
//                       },
//                     ],
//                   }}
//                 />
//               )}
//             </Card>
//           </Col>
//         </Row>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

// import React, { useState } from "react";
// import {
//   Card,
//   Table,
//   Row,
//   Col,
//   Divider,
//   List,
//   Select,
//   DatePicker,
//   Statistic,
//   Spin,
// } from "antd";
// import {
//   AppstoreOutlined,
//   ShoppingCartOutlined,
//   ShoppingOutlined,
//   DollarOutlined,
//   UserOutlined,
//   TagOutlined,
// } from "@ant-design/icons";
// import {
//   Chart as ChartJS,
//   ArcElement,
//   Tooltip,
//   Legend,
//   CategoryScale,
//   LinearScale,
//   BarElement,
// } from "chart.js";
// import { Doughnut, Bar } from "react-chartjs-2";
// import { useQuery } from "@tanstack/react-query";
// import API from "../../../services/api";
// import dayjs from "dayjs";

// ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// const { RangePicker } = DatePicker;

// const Dashboard = () => {
//   const [revenueType, setRevenueType] = useState("month");
//   const [customRange, setCustomRange] = useState([]); // Khởi tạo customRange là mảng rỗng

//   // Hàm lấy tham số thời gian
//   const getDateParams = () => {
//     if (revenueType === "custom" && customRange?.length === 2) {
//       return {
//         start_date: customRange[0].format("YYYY-MM-DD"),
//         end_date: customRange[1].format("YYYY-MM-DD"),
//       };
//     }
//     return {};
//   };

//   // Query doanh thu theo thời gian
//   const { data: revenueData, isLoading: loadingRevenue } = useQuery({
//     queryKey: ["revenue", revenueType, customRange],
//     queryFn: async () => {
//       const params = getDateParams();
//       if (revenueType === "custom" && customRange?.length === 2) {
//         const { data } = await API.get(`/admin/reports/revenue/custom-period`, { params });
//         return data;
//       } else {
//         const { data } = await API.get(`/admin/reports/revenue/${revenueType}`);
//         return data;
//       }
//     },
//     enabled: revenueType !== "custom" || (customRange && customRange.length === 2),
//   });

//   // Query thống kê tổng quan
//   const { data: overviewReport, isLoading: loadingOverview } = useQuery({
//     queryKey: ["overview"],
//     queryFn: async () => {
//       const { data } = await API.get("/admin/reports/overview");
//       return data;
//     },
//   });

//   // Query 5 khách hàng hàng đầu
//   const { data: topCustomers, isLoading: loadingTopCustomers } = useQuery({
//     queryKey: ["top-customers", revenueType, customRange],
//     queryFn: async () => {
//       const params = getDateParams();
//       const { data } = await API.get("/admin/reports/customers/top5", { params });
//       return data;
//     },
//     enabled: revenueType !== "custom" || (customRange && customRange.length === 2),
//   });

//   // Query 5 sản phẩm bán chạy nhất
//   const { data: topProducts, isLoading: loadingTopProducts } = useQuery({
//     queryKey: ["top-products", revenueType, customRange],
//     queryFn: async () => {
//       const params = getDateParams();
//       const { data } = await API.get("/admin/reports/products/top5-best-selling", { params });
//       return data;
//     },
//     enabled: revenueType !== "custom" || (customRange && customRange.length === 2),
//   });

//   // Query 5 sản phẩm bán ế nhất
//   const { data: slowProducts, isLoading: loadingSlowProducts } = useQuery({
//     queryKey: ["slow-products", revenueType, customRange],
//     queryFn: async () => {
//       const params = getDateParams();
//       const { data } = await API.get("/admin/reports/products/top5-slow-selling", { params });
//       return data;
//     },
//     enabled: revenueType !== "custom" || (customRange && customRange.length === 2),
//   });

//   // Query số lượng đơn hàng
//   const { data: orderCountData, isLoading: loadingOrderCount } = useQuery({
//     queryKey: ["order-count", revenueType, customRange],
//     queryFn: async () => {
//       const params = getDateParams();
//       const { data } = await API.get("/admin/reports/orders/count", { params });
//       return data;
//     },
//     enabled: revenueType !== "custom" || (customRange && customRange.length === 2),
//   });

//   // Query tình trạng đơn hàng
//   const { data: orderStatusData, isLoading: loadingOrderStatus } = useQuery({
//     queryKey: ["order-status", revenueType, customRange],
//     queryFn: async () => {
//       const params = getDateParams();
//       const { data } = await API.get("/admin/reports/orders/status-report", { params });
//       return data;
//     },
//     enabled: revenueType !== "custom" || (customRange && customRange.length === 2),
//   });

//   // Query số lượng mã giảm giá được sử dụng
//   const { data: voucherUsageData, isLoading: loadingVoucherUsage } = useQuery({
//     queryKey: ["voucher-usage", revenueType, customRange],
//     queryFn: async () => {
//       const params = getDateParams();
//       const { data } = await API.get("/admin/reports/vouchers/usage-count", { params });
//       return data;
//     },
//     enabled: revenueType !== "custom" || (customRange && customRange.length === 2),
//   });

//   // Hàm tạo dữ liệu đầy đủ cho biểu đồ doanh thu
//   const generateFullDateRange = (start, end) => {
//     const startDate = dayjs(start);
//     const endDate = dayjs(end);
//     const dates = [];
//     for (let date = startDate; date.isBefore(endDate) || date.isSame(endDate); date = date.add(1, "day")) {
//       dates.push(date.format("DD/MM"));
//     }
//     return dates;
//   };

//   const fullDates = revenueData
//     ? generateFullDateRange(revenueData.start_date, revenueData.end_date)
//     : [];

//   const revenueMap = (revenueData?.chart || []).reduce((acc, item) => {
//     acc[item.label] = item.value;
//     return acc;
//   }, {});

//   const filledChart = fullDates.map((label) => ({
//     label,
//     value: revenueMap[label] || 0,
//   }));

//   // Hàm lấy màu cho tình trạng đơn hàng
//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Chờ xác nhận":
//         return "orange";
//       case "Đã xác nhận":
//         return "blue";
//       case "Đang giao hàng":
//         return "cyan";
//       case "Giao hàng thành công":
//         return "green";
//       case "Giao hàng thất bại":
//         return "red";
//       case "Hủy đơn":
//         return "volcano";
//       default:
//         return "default";
//     }
//   };

//   // Cột cho bảng khách hàng hàng đầu
//   const customerColumns = [
//     {
//       title: "Tên khách hàng",
//       dataIndex: ["user", "name"],
//       key: "name",
//     },
//     {
//       title: "Số đơn hàng",
//       dataIndex: "order_count",
//       key: "order_count",
//     },
//     {
//       title: "Tổng chi tiêu",
//       dataIndex: "total_spent",
//       key: "total_spent",
//       render: (amount) => `${Number(amount).toLocaleString("vi-VN")} VNĐ`,
//     },
//   ];

//   return (
//     <div style={{ padding: "20px" }}>
//       {/* Tổng quan */}
//       <Row gutter={16}>
//         <Col span={6}>
//           <Card style={{ backgroundColor: "#FFA500", color: "#fff", borderRadius: 8 }}>
//             <Statistic
//               title="Tổng Số Sản Phẩm"
//               value={overviewReport?.total_products || 0}
//               prefix={<AppstoreOutlined />}
//               loading={loadingOverview}
//               valueStyle={{ color: "#fff" }}
//             />
//           </Card>
//         </Col>
//         <Col span={6}>
//           <Card style={{ backgroundColor: "#17a2b8", color: "#fff", borderRadius: 8 }}>
//             <Statistic
//               title="Đã Bán"
//               value={overviewReport?.total_sold_products || 0}
//               prefix={<ShoppingCartOutlined />}
//               loading={loadingOverview}
//               valueStyle={{ color: "#fff" }}
//             />
//           </Card>
//         </Col>
//         <Col span={6}>
//           <Card style={{ backgroundColor: "#28a745", color: "#fff", borderRadius: 8 }}>
//             <Statistic
//               title="Tổng Số Đơn Hàng"
//               value={overviewReport?.total_orders || 0}
//               prefix={<ShoppingOutlined />}
//               loading={loadingOverview}
//               valueStyle={{ color: "#fff" }}
//             />
//           </Card>
//         </Col>
//         <Col span={6}>
//           <Card style={{ backgroundColor: "#FF5733", color: "#fff", borderRadius: 8 }}>
//             <Statistic
//               title="Tổng Doanh Thu"
//               value={overviewReport?.total_revenue || 0}
//               prefix={<DollarOutlined />}
//               suffix="VNĐ"
//               loading={loadingOverview}
//               valueStyle={{ color: "#fff" }}
//               formatter={(value) => Number(value).toLocaleString("vi-VN")}
//             />
//           </Card>
//         </Col>
//       </Row>

//       {/* Bộ lọc thời gian */}
//       <div style={{ marginTop: 24, marginBottom: 16 }}>
//         <h3 style={{ marginBottom: 8 }}>Chọn Khoảng Thời Gian Thống Kê</h3>
//         <Select
//           value={revenueType}
//           style={{ width: 150, marginRight: 16 }}
//           onChange={(value) => {
//             setRevenueType(value);
//             if (value !== "custom") {
//               setCustomRange([]);
//             }
//           }}
//         >
//           <Select.Option value="day">Theo Ngày</Select.Option>
//           <Select.Option value="week">Theo Tuần</Select.Option>
//           <Select.Option value="month">Theo Tháng</Select.Option>
//           <Select.Option value="custom">Tùy Chỉnh</Select.Option>
//         </Select>

//         {revenueType === "custom" && (
//           <RangePicker
//             value={customRange}
//             format="YYYY-MM-DD"
//             onChange={(dates) => setCustomRange(dates || [])} // Đặt customRange thành [] nếu dates là null
//             style={{ marginRight: 16 }}
//           />
//         )}
//       </div>

//       {/* Thống kê chi tiết */}
//       <Row gutter={16}>
//         {/* Doanh thu */}
//         <Col span={24}>
//           <Card title="Thống Kê Doanh Thu" bordered={false}>
//             {loadingRevenue ? (
//               <Spin tip="Đang tải dữ liệu..." />
//             ) : revenueData?.message ? (
//               <div>{revenueData.message}</div>
//             ) : (
//               <Bar
//                 data={{
//                   labels: filledChart.map((item) => item.label),
//                   datasets: [
//                     {
//                       label: "Doanh thu (VNĐ)",
//                       data: filledChart.map((item) => item.value),
//                       backgroundColor: "rgba(66, 165, 245, 0.6)",
//                       borderColor: "rgba(66, 165, 245, 1)",
//                       borderWidth: 1,
//                     },
//                   ],
//                 }}
//                 options={{
//                   scales: {
//                     y: {
//                       beginAtZero: true,
//                       ticks: {
//                         callback: (value) => Number(value).toLocaleString("vi-VN"),
//                       },
//                     },
//                   },
//                   plugins: {
//                     legend: { display: true, position: "top" },
//                     tooltip: {
//                       callbacks: {
//                         label: (context) =>
//                           `${context.dataset.label}: ${Number(context.raw).toLocaleString("vi-VN")} VNĐ`,
//                       },
//                     },
//                   },
//                 }}
//               />
//             )}
//           </Card>
//         </Col>
//       </Row>

//       <Row gutter={16} style={{ marginTop: 16 }}>
//         {/* Tình trạng đơn hàng */}
//         <Col span={12}>
//           <Card title="Tình Trạng Đơn Hàng" bordered={false}>
//             {loadingOrderStatus ? (
//               <Spin tip="Đang tải dữ liệu..." />
//             ) : !orderStatusData || orderStatusData?.message ? (
//               <div>{orderStatusData?.message || "Không có dữ liệu để hiển thị."}</div>
//             ) : (
//               <div style={{ width: "100%", height: "400px", margin: "0 auto" }}>
//                 <Doughnut
//                   data={{
//                     labels: orderStatusData?.map((item) => item.status) || [],
//                     datasets: [
//                       {
//                         data: orderStatusData?.map((item) => item.count) || [],
//                         backgroundColor: orderStatusData?.map((item) => getStatusColor(item.status)) || [],
//                         borderWidth: 1,
//                       },
//                     ],
//                   }}
//                   options={{
//                     plugins: {
//                       legend: {
//                         position: "right",
//                         labels: { boxWidth: 12 },
//                       },
//                       tooltip: {
//                         callbacks: {
//                           label: (context) => `${context.label}: ${context.raw} đơn hàng`,
//                         },
//                       },
//                     },
//                     maintainAspectRatio: false,
//                   }}
//                 />
//               </div>
//             )}
//           </Card>
//         </Col>

//         {/* Số lượng đơn hàng và mã giảm giá */}
//         <Col span={12}>
//           <Card title="Thống Kê Đơn Hàng và Mã Giảm Giá" bordered={false}>
//             <Row gutter={16}>
//               <Col span={12}>
//                 <Statistic
//                   title="Số Lượng Đơn Hàng"
//                   value={orderCountData?.order_count || 0}
//                   prefix={<ShoppingOutlined />}
//                   loading={loadingOrderCount}
//                 />
//               </Col>
//               <Col span={12}>
//                 <Statistic
//                   title="Mã Giảm Giá Được Sử Dụng"
//                   value={voucherUsageData?.voucher_usage_count || 0}
//                   prefix={<TagOutlined />}
//                   loading={loadingVoucherUsage}
//                 />
//               </Col>
//             </Row>
//           </Card>
//         </Col>
//       </Row>

//       <Row gutter={16} style={{ marginTop: 16 }}>
//         {/* 5 khách hàng hàng đầu */}
//         <Col span={12}>
//           <Card title="5 Khách Hàng Hàng Đầu" bordered={false}>
//             {loadingTopCustomers ? (
//               <Spin tip="Đang tải dữ liệu..." />
//             ) : !topCustomers || topCustomers?.message ? (
//               <div>{topCustomers?.message || "Không có dữ liệu để hiển thị."}</div>
//             ) : (
//               <Table
//                 columns={customerColumns}
//                 dataSource={topCustomers}
//                 pagination={false}
//                 rowKey={(record) => record.user_id}
//                 scroll={{ x: "max-content" }}
//               />
//             )}
//           </Card>
//         </Col>

//         {/* 5 sản phẩm bán chạy nhất */}
//         <Col span={12}>
//           <Card title="5 Sản Phẩm Bán Chạy Nhất" bordered={false}>
//             {loadingTopProducts ? (
//               <Spin tip="Đang tải dữ liệu..." />
//             ) : !topProducts || topProducts?.message ? (
//               <div>{topProducts?.message || "Không có dữ liệu để hiển thị."}</div>
//             ) : (
//               <Bar
//                 data={{
//                   labels: topProducts?.map((item) => item.name) || [],
//                   datasets: [
//                     {
//                       label: "Số lượng bán ra",
//                       data: topProducts?.map((item) => item.total_sold) || [],
//                       backgroundColor: "rgba(40, 167, 69, 0.6)",
//                       borderColor: "rgba(40, 167, 69, 1)",
//                       borderWidth: 1,
//                     },
//                   ],
//                 }}
//                 options={{
//                   indexAxis: "y",
//                   scales: {
//                     x: { beginAtZero: true },
//                   },
//                   plugins: {
//                     legend: { display: false },
//                     tooltip: {
//                       callbacks: {
//                         label: (context) => `${context.dataset.label}: ${context.raw}`,
//                       },
//                     },
//                   },
//                 }}
//               />
//             )}
//           </Card>
//         </Col>
//       </Row>

//       <Row gutter={16} style={{ marginTop: 16 }}>
//         {/* 5 sản phẩm bán ế nhất */}
//         <Col span={12}>
//           <Card title="5 Sản Phẩm Bán Ế Nhất" bordered={false}>
//             {loadingSlowProducts ? (
//               <Spin tip="Đang tải dữ liệu..." />
//             ) : !slowProducts || slowProducts?.message ? (
//               <div>{slowProducts?.message || "Không có dữ liệu để hiển thị."}</div>
//             ) : (
//               <Bar
//                 data={{
//                   labels: slowProducts?.map((item) => item.name) || [],
//                   datasets: [
//                     {
//                       label: "Số lượng bán ra",
//                       data: slowProducts?.map((item) => item.total_sold) || [],
//                       backgroundColor: "rgba(255, 87, 51, 0.6)",
//                       borderColor: "rgba(255, 87, 51, 1)",
//                       borderWidth: 1,
//                     },
//                   ],
//                 }}
//                 options={{
//                   indexAxis: "y",
//                   scales: {
//                     x: { beginAtZero: true },
//                   },
//                   plugins: {
//                     legend: { display: false },
//                     tooltip: {
//                       callbacks: {
//                         label: (context) => `${context.dataset.label}: ${context.raw}`,
//                       },
//                     },
//                   },
//                 }}
//               />
//             )}
//           </Card>
//         </Col>
//       </Row>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useState } from "react";
import {
  Card,
  Table,
  Row,
  Col,
  Divider,
  List,
  Select,
  DatePicker,
  Statistic,
  Spin,
  Alert,
} from "antd";
import {
  AppstoreOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  DollarOutlined,
  UserOutlined,
  TagOutlined,
} from "@ant-design/icons";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import { useQuery } from "@tanstack/react-query";
import API from "../../../services/api";
import dayjs from "dayjs";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const { RangePicker } = DatePicker;

const Dashboard = () => {
  const [revenueType, setRevenueType] = useState("month");
  const [customRange, setCustomRange] = useState([]);

  // Hàm lấy tham số thời gian
  const getDateParams = () => {
    if (revenueType === "custom" && customRange?.length === 2) {
      return {
        start_date: customRange[0].format("YYYY-MM-DD"),
        end_date: customRange[1].format("YYYY-MM-DD"),
      };
    }
    return {};
  };

  // Query doanh thu theo thời gian
  const {
    data: revenueData,
    isLoading: loadingRevenue,
    isError: revenueError,
    error: revenueErrorDetails,
  } = useQuery({
    queryKey: ["revenue", revenueType, customRange],
    queryFn: async () => {
      const params = getDateParams();
      if (revenueType === "custom" && customRange?.length === 2) {
        const { data } = await API.get(`/admin/reports/revenue/custom-period`, {
          params,
        });
        return data;
      } else {
        const { data } = await API.get(`/admin/reports/revenue/${revenueType}`);
        return data;
      }
    },
    enabled:
      revenueType !== "custom" || (customRange && customRange.length === 2),
  });

  // Query thống kê tổng quan
  const {
    data: overviewReport,
    isLoading: loadingOverview,
    isError: overviewError,
    error: overviewErrorDetails,
  } = useQuery({
    queryKey: ["overview"],
    queryFn: async () => {
      const { data } = await API.get("/admin/reports/overview");
      console.log("Overview Data:", data); // Debug dữ liệu trả về
      return data;
    },
  });

  // Query 5 khách hàng hàng đầu
  const {
    data: topCustomers,
    isLoading: loadingTopCustomers,
    isError: customersError,
    error: customersErrorDetails,
  } = useQuery({
    queryKey: ["top-customers", revenueType, customRange],
    queryFn: async () => {
      const params = getDateParams();
      const { data } = await API.get("/admin/reports/customers/top5", {
        params,
      });
      return data;
    },
    enabled:
      revenueType !== "custom" || (customRange && customRange.length === 2),
  });

  // Query 5 biến thể sản phẩm bán chạy nhất
  const {
    data: topProductsData,
    isLoading: loadingTopProducts,
    isError: topProductsError,
    error: topProductsErrorDetails,
  } = useQuery({
    queryKey: ["top-products", revenueType, customRange],
    queryFn: async () => {
      const params = getDateParams();
      const { data } = await API.get(
        "/admin/reports/products/top5-best-selling",
        { params }
      );
      console.log("Top Products Data:", data); // Debug dữ liệu trả về
      return data;
    },
    enabled:
      revenueType !== "custom" || (customRange && customRange.length === 2),
  });

  // Query 5 biến thể sản phẩm bán ế nhất
  const {
    data: slowProductsData,
    isLoading: loadingSlowProducts,
    isError: slowProductsError,
    error: slowProductsErrorDetails,
  } = useQuery({
    queryKey: ["slow-products", revenueType, customRange],
    queryFn: async () => {
      const params = getDateParams();
      const { data } = await API.get(
        "/admin/reports/products/top5-slow-selling",
        { params }
      );
      console.log("Slow Products Data:", data); // Debug dữ liệu trả về
      return data;
    },
    enabled:
      revenueType !== "custom" || (customRange && customRange.length === 2),
  });

  // Query số lượng đơn hàng
  const {
    data: orderCountData,
    isLoading: loadingOrderCount,
    isError: orderCountError,
    error: orderCountErrorDetails,
  } = useQuery({
    queryKey: ["order-count", revenueType, customRange],
    queryFn: async () => {
      const params = getDateParams();
      const { data } = await API.get("/admin/reports/orders/count", { params });
      return data;
    },
    enabled:
      revenueType !== "custom" || (customRange && customRange.length === 2),
  });

  // Query tình trạng đơn hàng
  const {
    data: orderStatusData,
    isLoading: loadingOrderStatus,
    isError: orderStatusError,
    error: orderStatusErrorDetails,
  } = useQuery({
    queryKey: ["order-status", revenueType, customRange],
    queryFn: async () => {
      const params = getDateParams();
      const { data } = await API.get("/admin/reports/orders/status-report", {
        params,
      });
      return data;
    },
    enabled:
      revenueType !== "custom" || (customRange && customRange.length === 2),
  });

  // Query số lượng mã giảm giá được sử dụng
  const {
    data: voucherUsageData,
    isLoading: loadingVoucherUsage,
    isError: voucherUsageError,
    error: voucherUsageErrorDetails,
  } = useQuery({
    queryKey: ["voucher-usage", revenueType, customRange],
    queryFn: async () => {
      const params = getDateParams();
      const { data } = await API.get("/admin/reports/vouchers/usage-count", {
        params,
      });
      return data;
    },
    enabled:
      revenueType !== "custom" || (customRange && customRange.length === 2),
  });

  // Xử lý dữ liệu topProducts và slowProducts
  const topProducts = Array.isArray(topProductsData?.data)
    ? topProductsData.data
    : Array.isArray(topProductsData)
    ? topProductsData
    : [];
  const slowProducts = Array.isArray(slowProductsData?.data)
    ? slowProductsData.data
    : Array.isArray(slowProductsData)
    ? slowProductsData
    : [];

  // Hàm tạo dữ liệu đầy đủ cho biểu đồ doanh thu
  const generateFullDateRange = (start, end) => {
    const startDate = dayjs(start);
    const endDate = dayjs(end);
    const dates = [];
    for (
      let date = startDate;
      date.isBefore(endDate) || date.isSame(endDate);
      date = date.add(1, "day")
    ) {
      dates.push(date.format("DD/MM"));
    }
    return dates;
  };

  const fullDates = revenueData
    ? generateFullDateRange(revenueData.start_date, revenueData.end_date)
    : [];

  const revenueMap = (revenueData?.chart || []).reduce((acc, item) => {
    acc[item.label] = item.value;
    return acc;
  }, {});

  const filledChart = fullDates.map((label) => ({
    label,
    value: revenueMap[label] || 0,
  }));

  // Hàm lấy màu cho tình trạng đơn hàng
  const getStatusColor = (status) => {
    switch (status) {
      case "Chờ xác nhận":
        return "orange";
      case "Đã xác nhận":
        return "blue";
      case "Đang giao hàng":
        return "cyan";
      case "Giao hàng thành công":
        return "green";
      case "Giao hàng thất bại":
        return "red";
      case "Hủy đơn":
        return "volcano";
      default:
        return "default";
    }
  };

  // Cột cho bảng khách hàng hàng đầu
  const customerColumns = [
    { title: "Tên khách hàng", dataIndex: ["user", "name"], key: "name" },
    { title: "Số đơn hàng", dataIndex: "order_count", key: "order_count" },
    {
      title: "Tổng chi tiêu",
      dataIndex: "total_spent",
      key: "total_spent",
      render: (amount) => `${Number(amount).toLocaleString("vi-VN")} VNĐ`,
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      {/* Tổng quan */}
      <Row gutter={16}>
        {[
          {
            title: "Tổng Số Sản Phẩm",
            value: overviewReport?.total_products ?? 0,
            prefix: <AppstoreOutlined />,
            backgroundColor: "#FFA500",
            loading: loadingOverview,
            error: overviewError,
          },
          {
            title: "Đã Bán",
            value: overviewReport?.total_sold_products ?? 0,
            prefix: <ShoppingCartOutlined />,
            backgroundColor: "#17a2b8",
            loading: loadingOverview,
            error: overviewError,
          },
          {
            title: "Tổng Số Đơn Hàng",
            value: overviewReport?.total_orders ?? 0,
            prefix: <ShoppingOutlined />,
            backgroundColor: "#28a745",
            loading: loadingOverview,
            error: overviewError,
          },
          {
            title: "Tổng Doanh Thu",
            value: overviewReport?.total_revenue ?? 0,
            prefix: <DollarOutlined />,
            suffix: "VNĐ",
            backgroundColor: "#FF5733",
            loading: loadingOverview,
            error: overviewError,
          },
        ].map((item, index) => (
          <Col span={6} key={index}>
            <Card
              style={{
                backgroundColor: item.backgroundColor,
                color: "#fff",
                borderRadius: 8,
                height: "120px", // Chiều cao cố định
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              bodyStyle={{
                padding: "16px",
                width: "100%",
              }}
            >
              {item.loading ? (
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Spin />
                </div>
              ) : item.error ? (
                <Alert
                  message="Lỗi"
                  description={
                    overviewErrorDetails?.response?.data?.error ||
                    "Không thể tải dữ liệu tổng quan."
                  }
                  type="error"
                  showIcon
                  style={{ fontSize: "12px" }}
                />
              ) : (
                <Statistic
                  title={
                    <span style={{ color: "#fff", fontSize: "16px" }}>
                      {item.title}
                    </span>
                  }
                  value={item.value}
                  prefix={item.prefix}
                  suffix={item.suffix}
                  valueStyle={{ color: "#fff", fontSize: "24px" }}
                  formatter={(value) =>
                    item.suffix
                      ? `${Number(value).toLocaleString("vi-VN")}`
                      : Number(value).toLocaleString("vi-VN")
                  }
                />
              )}
            </Card>
          </Col>
        ))}
      </Row>

      {/* Bộ lọc thời gian */}
      <div style={{ marginTop: 24, marginBottom: 16 }}>
        <h3 style={{ marginBottom: 8 }}>Chọn Khoảng Thời Gian Thống Kê</h3>
        <Select
          value={revenueType}
          style={{ width: 150, marginRight: 16 }}
          onChange={(value) => {
            setRevenueType(value);
            if (value !== "custom") {
              setCustomRange([]);
            }
          }}
        >
          <Select.Option value="day">Theo Ngày</Select.Option>
          <Select.Option value="week">Theo Tuần</Select.Option>
          <Select.Option value="month">Theo Tháng</Select.Option>
          <Select.Option value="custom">Tùy Chỉnh</Select.Option>
        </Select>

        {revenueType === "custom" && (
          <RangePicker
            value={customRange}
            format="YYYY-MM-DD"
            onChange={(dates) => setCustomRange(dates || [])}
            style={{ marginRight: 16 }}
          />
        )}
      </div>

      {/* Thống kê chi tiết */}
      <Row gutter={16}>
        {/* Doanh thu */}
        <Col span={24}>
          <Card title="Thống Kê Doanh Thu" bordered={false}>
            {loadingRevenue ? (
              <Spin tip="Đang tải dữ liệu doanh thu..." />
            ) : revenueError ? (
              <Alert
                message="Lỗi"
                description={
                  revenueErrorDetails?.response?.data?.error ||
                  "Không thể tải dữ liệu doanh thu."
                }
                type="error"
                showIcon
              />
            ) : revenueData?.message ? (
              <Alert message={revenueData.message} type="info" showIcon />
            ) : (
              <Bar
                data={{
                  labels: filledChart.map((item) => item.label),
                  datasets: [
                    {
                      label: "Doanh thu (VNĐ)",
                      data: filledChart.map((item) => item.value),
                      backgroundColor: "rgba(66, 165, 245, 0.6)",
                      borderColor: "rgba(66, 165, 245, 1)",
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) =>
                          Number(value).toLocaleString("vi-VN"),
                      },
                    },
                  },
                  plugins: {
                    legend: { display: true, position: "top" },
                    tooltip: {
                      callbacks: {
                        label: (context) =>
                          `${context.dataset.label}: ${Number(
                            context.raw
                          ).toLocaleString("vi-VN")} VNĐ`,
                      },
                    },
                  },
                }}
              />
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        {/* Tình trạng đơn hàng */}
        <Col span={12}>
          <Card title="Tình Trạng Đơn Hàng" bordered={false}>
            {loadingOrderStatus ? (
              <Spin tip="Đang tải dữ liệu tình trạng đơn hàng..." />
            ) : orderStatusError ? (
              <Alert
                message="Lỗi"
                description={
                  orderStatusErrorDetails?.response?.data?.error ||
                  "Không thể tải dữ liệu tình trạng đơn hàng."
                }
                type="error"
                showIcon
              />
            ) : !orderStatusData || orderStatusData?.message ? (
              <Alert
                message={
                  orderStatusData?.message || "Không có dữ liệu để hiển thị."
                }
                type="info"
                showIcon
              />
            ) : (
              <div style={{ width: "100%", height: "400px", margin: "0 auto" }}>
                <Doughnut
                  data={{
                    labels: orderStatusData?.map((item) => item.status) || [],
                    datasets: [
                      {
                        data: orderStatusData?.map((item) => item.count) || [],
                        backgroundColor:
                          orderStatusData?.map((item) =>
                            getStatusColor(item.status)
                          ) || [],
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      legend: {
                        position: "right",
                        labels: { boxWidth: 12 },
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) =>
                            `${context.label}: ${context.raw} đơn hàng`,
                        },
                      },
                    },
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            )}
          </Card>
        </Col>

        {/* Số lượng đơn hàng và mã giảm giá */}
        <Col span={12}>
          <Card title="Thống Kê Đơn Hàng và Mã Giảm Giá" bordered={false}>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="Số Lượng Đơn Hàng"
                  value={orderCountData?.order_count || 0}
                  prefix={<ShoppingOutlined />}
                  loading={loadingOrderCount}
                />
                {orderCountError && (
                  <Alert
                    message="Lỗi"
                    description={
                      orderCountErrorDetails?.response?.data?.error ||
                      "Không thể tải dữ liệu số lượng đơn hàng."
                    }
                    type="error"
                    showIcon
                  />
                )}
              </Col>
              <Col span={12}>
                <Statistic
                  title="Mã Giảm Giá Được Sử Dụng"
                  value={voucherUsageData?.voucher_usage_count || 0}
                  prefix={<TagOutlined />}
                  loading={loadingVoucherUsage}
                />
                {voucherUsageError && (
                  <Alert
                    message="Lỗi"
                    description={
                      voucherUsageErrorDetails?.response?.data?.error ||
                      "Không thể tải dữ liệu mã giảm giá."
                    }
                    type="error"
                    showIcon
                  />
                )}
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        {/* 5 khách hàng hàng đầu */}
        <Col span={12}>
          <Card title="5 Khách Hàng Hàng Đầu" bordered={false}>
            {loadingTopCustomers ? (
              <Spin tip="Đang tải dữ liệu khách hàng..." />
            ) : customersError ? (
              <Alert
                message="Lỗi"
                description={
                  customersErrorDetails?.response?.data?.error ||
                  "Không thể tải dữ liệu khách hàng."
                }
                type="error"
                showIcon
              />
            ) : !topCustomers || topCustomers?.message ? (
              <Alert
                message={
                  topCustomers?.message || "Không có dữ liệu để hiển thị."
                }
                type="info"
                showIcon
              />
            ) : (
              <Table
                columns={customerColumns}
                dataSource={topCustomers}
                pagination={false}
                rowKey={(record) => record.user_id}
                scroll={{ x: "max-content" }}
              />
            )}
          </Card>
        </Col>

        {/* 5 biến thể sản phẩm bán chạy nhất */}
        <Col span={12}>
          <Card title="5 Biến Thể Sản Phẩm Bán Chạy Nhất" bordered={false}>
            {loadingTopProducts ? (
              <Spin tip="Đang tải dữ liệu sản phẩm bán chạy..." />
            ) : topProductsError ? (
              <Alert
                message="Lỗi"
                description={
                  topProductsErrorDetails?.response?.data?.error ||
                  "Không thể tải dữ liệu sản phẩm bán chạy."
                }
                type="error"
                showIcon
              />
            ) : topProducts.length === 0 ? (
              <Alert
                message="Không có dữ liệu để hiển thị."
                type="info"
                showIcon
              />
            ) : (
              <Bar
                data={{
                  labels: topProducts.map((item) => item.variant_name) || [],
                  datasets: [
                    {
                      label: "Số lượng bán ra",
                      data: topProducts.map((item) => item.total_sold) || [],
                      backgroundColor: "rgba(40, 167, 69, 0.6)",
                      borderColor: "rgba(40, 167, 69, 1)",
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  indexAxis: "y",
                  scales: {
                    x: { beginAtZero: true },
                  },
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (context) =>
                          `${context.dataset.label}: ${context.raw} sản phẩm`,
                      },
                    },
                  },
                }}
              />
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        {/* 5 biến thể sản phẩm bán ế nhất */}
        <Col span={12}>
          <Card title="5 Biến Thể Sản Phẩm Bán Ế Nhất" bordered={false}>
            {loadingSlowProducts ? (
              <Spin tip="Đang tải dữ liệu sản phẩm bán ế..." />
            ) : slowProductsError ? (
              <Alert
                message="Lỗi"
                description={
                  slowProductsErrorDetails?.response?.data?.error ||
                  "Không thể tải dữ liệu sản phẩm bán ế."
                }
                type="error"
                showIcon
              />
            ) : slowProducts.length === 0 ? (
              <Alert
                message="Không có dữ liệu để hiển thị."
                type="info"
                showIcon
              />
            ) : (
              <Bar
                data={{
                  labels: slowProducts.map((item) => item.variant_name) || [],
                  datasets: [
                    {
                      label: "Số lượng bán ra",
                      data: slowProducts.map((item) => item.total_sold) || [],
                      backgroundColor: "rgba(255, 87, 51, 0.6)",
                      borderColor: "rgba(255, 87, 51, 1)",
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  indexAxis: "y",
                  scales: {
                    x: { beginAtZero: true },
                  },
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (context) =>
                          `${context.dataset.label}: ${context.raw} sản phẩm`,
                      },
                    },
                  },
                }}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;

// import React, { useState } from "react";
// import {
//   Card,
//   Table,
//   Row,
//   Col,
//   Select,
//   DatePicker,
//   Statistic,
//   Alert,
// } from "antd";
// import {
//   AppstoreOutlined,
//   ShoppingCartOutlined,
//   ShoppingOutlined,
//   DollarOutlined,
//   TagOutlined,
// } from "@ant-design/icons";
// import {
//   Chart as ChartJS,
//   ArcElement,
//   Tooltip,
//   Legend,
//   CategoryScale,
//   LinearScale,
//   BarElement,
// } from "chart.js";
// import { Doughnut, Bar } from "react-chartjs-2";
// import { useQuery } from "@tanstack/react-query";
// import API from "../../../services/api";
// import dayjs from "dayjs";
// import { motion } from "framer-motion";
// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";

// // Đăng ký các thành phần của Chart.js
// ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// const { RangePicker } = DatePicker;

// // Animation variants cho Framer Motion
// const cardVariants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
// };

// const chartVariants = {
//   hidden: { opacity: 0, scale: 0.95 },
//   visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } },
// };

// const Dashboard = () => {
//   const [revenueType, setRevenueType] = useState("month");
//   const [customRange, setCustomRange] = useState([]);

//   // Hàm lấy tham số thời gian
//   const getDateParams = () => {
//     if (revenueType === "custom" && customRange?.length === 2) {
//       return {
//         start_date: customRange[0].format("YYYY-MM-DD"),
//         end_date: customRange[1].format("YYYY-MM-DD"),
//       };
//     }
//     return {};
//   };

//   // Query doanh thu theo thời gian
//   const { data: revenueData, isLoading: loadingRevenue, isError: revenueError, error: revenueErrorDetails } = useQuery({
//     queryKey: ["revenue", revenueType, customRange],
//     queryFn: async () => {
//       const params = getDateParams();
//       if (revenueType === "custom" && customRange?.length === 2) {
//         const { data } = await API.get(`/admin/reports/revenue/custom-period`, { params });
//         return data;
//       } else {
//         const { data } = await API.get(`/admin/reports/revenue/${revenueType}`);
//         return data;
//       }
//     },
//     enabled: revenueType !== "custom" || (customRange && customRange.length === 2),
//   });

//   // Query thống kê tổng quan
//   const { data: overviewReport, isLoading: loadingOverview, isError: overviewError, error: overviewErrorDetails } = useQuery({
//     queryKey: ["overview"],
//     queryFn: async () => {
//       const { data } = await API.get("/admin/reports/overview");
//       return data;
//     },
//   });

//   // Query 5 khách hàng hàng đầu
//   const { data: topCustomers, isLoading: loadingTopCustomers, isError: customersError, error: customersErrorDetails } = useQuery({
//     queryKey: ["top-customers", revenueType, customRange],
//     queryFn: async () => {
//       const params = getDateParams();
//       const { data } = await API.get("/admin/reports/customers/top5", { params });
//       return data;
//     },
//     enabled: revenueType !== "custom" || (customRange && customRange.length === 2),
//   });

//   // Query 5 biến thể sản phẩm bán chạy nhất
//   const { data: topProductsData, isLoading: loadingTopProducts, isError: topProductsError, error: topProductsErrorDetails } = useQuery({
//     queryKey: ["top-products", revenueType, customRange],
//     queryFn: async () => {
//       const params = getDateParams();
//       const { data } = await API.get("/admin/reports/products/top5-best-selling", { params });
//       return data;
//     },
//     enabled: revenueType !== "custom" || (customRange && customRange.length === 2),
//   });

//   // Query 5 biến thể sản phẩm bán ế nhất
//   const { data: slowProductsData, isLoading: loadingSlowProducts, isError: slowProductsError, error: slowProductsErrorDetails } = useQuery({
//     queryKey: ["slow-products", revenueType, customRange],
//     queryFn: async () => {
//       const params = getDateParams();
//       const { data } = await API.get("/admin/reports/products/top5-slow-selling", { params });
//       return data;
//     },
//     enabled: revenueType !== "custom" || (customRange && customRange.length === 2),
//   });

//   // Query số lượng đơn hàng
//   const { data: orderCountData, isLoading: loadingOrderCount, isError: orderCountError, error: orderCountErrorDetails } = useQuery({
//     queryKey: ["order-count", revenueType, customRange],
//     queryFn: async () => {
//       const params = getDateParams();
//       const { data } = await API.get("/admin/reports/orders/count", { params });
//       return data;
//     },
//     enabled: revenueType !== "custom" || (customRange && customRange.length === 2),
//   });

//   // Query tình trạng đơn hàng
//   const { data: orderStatusData, isLoading: loadingOrderStatus, isError: orderStatusError, error: orderStatusErrorDetails } = useQuery({
//     queryKey: ["order-status", revenueType, customRange],
//     queryFn: async () => {
//       const params = getDateParams();
//       const { data } = await API.get("/admin/reports/orders/status-report", { params });
//       return data;
//     },
//     enabled: revenueType !== "custom" || (customRange && customRange.length === 2),
//   });

//   // Query số lượng mã giảm giá được sử dụng
//   const { data: voucherUsageData, isLoading: loadingVoucherUsage, isError: voucherUsageError, error: voucherUsageErrorDetails } = useQuery({
//     queryKey: ["voucher-usage", revenueType, customRange],
//     queryFn: async () => {
//       const params = getDateParams();
//       const { data } = await API.get("/admin/reports/vouchers/usage-count", { params });
//       return data;
//     },
//     enabled: revenueType !== "custom" || (customRange && customRange.length === 2),
//   });

//   // Xử lý dữ liệu topProducts và slowProducts
//   const topProducts = Array.isArray(topProductsData?.data) ? topProductsData.data : Array.isArray(topProductsData) ? topProductsData : [];
//   const slowProducts = Array.isArray(slowProductsData?.data) ? slowProductsData.data : Array.isArray(slowProductsData) ? slowProductsData : [];

//   // Hàm tạo dữ liệu đầy đủ cho biểu đồ doanh thu
//   const generateFullDateRange = (start, end) => {
//     const startDate = dayjs(start);
//     const endDate = dayjs(end);
//     const dates = [];
//     for (let date = startDate; date.isBefore(endDate) || date.isSame(endDate); date = date.add(1, "day")) {
//       dates.push(date.format("DD/MM"));
//     }
//     return dates;
//   };

//   const fullDates = revenueData ? generateFullDateRange(revenueData.start_date, revenueData.end_date) : [];

//   const revenueMap = (revenueData?.chart || []).reduce((acc, item) => {
//     acc[item.label] = item.value;
//     return acc;
//   }, {});

//   const filledChart = fullDates.map((label) => ({
//     label,
//     value: revenueMap[label] || 0,
//   }));

//   // Hàm lấy màu cho tình trạng đơn hàng
//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Chờ xác nhận": return "#f97316"; // Orange
//       case "Đã xác nhận": return "#3b82f6"; // Blue
//       case "Đang giao hàng": return "#06b6d4"; // Cyan
//       case "Giao hàng thành công": return "#22c55e"; // Green
//       case "Giao hàng thất bại": return "#ef4444"; // Red
//       case "Hủy đơn": return "#f43f5e"; // Volcano
//       default: return "#6b7280"; // Gray
//     }
//   };

//   // Cột cho bảng khách hàng hàng đầu
//   const customerColumns = [
//     { title: "Tên khách hàng", dataIndex: ["user", "name"], key: "name" },
//     { title: "Số đơn hàng", dataIndex: "order_count", key: "order_count" },
//     {
//       title: "Tổng chi tiêu",
//       dataIndex: "total_spent",
//       key: "total_spent",
//       render: (amount) => `${Number(amount).toLocaleString("vi-VN")} VNĐ`,
//     },
//   ];

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       {/* Tổng quan */}
//       <motion.div
//         className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
//         initial="hidden"
//         animate="visible"
//         variants={{
//           visible: {
//             transition: {
//               staggerChildren: 0.2,
//             },
//           },
//         }}
//       >
//         {[
//           {
//             title: "Tổng Số Sản Phẩm",
//             value: overviewReport?.total_products ?? 0,
//             prefix: <AppstoreOutlined className="text-xl" />,
//             backgroundColor: "bg-gradient-to-r from-orange-400 to-orange-500",
//             loading: loadingOverview,
//             error: overviewError,
//           },
//           {
//             title: "Đã Bán",
//             value: overviewReport?.total_sold_products ?? 0,
//             prefix: <ShoppingCartOutlined className="text-xl" />,
//             backgroundColor: "bg-gradient-to-r from-cyan-500 to-teal-500",
//             loading: loadingOverview,
//             error: overviewError,
//           },
//           {
//             title: "Tổng Số Đơn Hàng",
//             value: overviewReport?.total_orders ?? 0,
//             prefix: <ShoppingOutlined className="text-xl" />,
//             backgroundColor: "bg-gradient-to-r from-green-500 to-emerald-500",
//             loading: loadingOverview,
//             error: overviewError,
//           },
//           {
//             title: "Tổng Doanh Thu",
//             value: overviewReport?.total_revenue ?? 0,
//             prefix: <DollarOutlined className="text-xl" />,
//             suffix: "VNĐ",
//             backgroundColor: "bg-gradient-to-r from-red-400 to-pink-500",
//             loading: loadingOverview,
//             error: overviewError,
//           },
//         ].map((item, index) => (
//           <motion.div key={index} variants={cardVariants}>
//             <Card
//               className={`shadow-lg hover:shadow-xl transition-shadow duration-300 ${item.backgroundColor} text-white rounded-xl overflow-hidden`}
//               bodyStyle={{ padding: "16px", textAlign: "center" }}
//             >
//               {item.loading ? (
//                 <Skeleton height={80} baseColor="#ffffff40" highlightColor="#ffffff80" />
//               ) : item.error ? (
//                 <Alert
//                   message="Lỗi"
//                   description={overviewErrorDetails?.response?.data?.error || "Không thể tải dữ liệu tổng quan."}
//                   type="error"
//                   showIcon
//                   className="text-sm bg-white/20 text-white border-none"
//                 />
//               ) : (
//                 <Statistic
//                   title={<span className="text-white font-medium">{item.title}</span>}
//                   value={item.value}
//                   prefix={item.prefix}
//                   suffix={item.suffix}
//                   valueStyle={{ color: "#fff", fontSize: "24px" }}
//                   formatter={(value) => item.suffix ? `${Number(value).toLocaleString("vi-VN")}` : Number(value).toLocaleString("vi-VN")}
//                 />
//               )}
//             </Card>
//           </motion.div>
//         ))}
//       </motion.div>

//       {/* Bộ lọc thời gian */}
//       <motion.div
//         className="bg-white p-4 rounded-xl shadow-md mb-6"
//         initial="hidden"
//         animate="visible"
//         variants={cardVariants}
//       >
//         <h3 className="text-lg font-semibold mb-3 text-gray-800">Chọn Khoảng Thời Gian Thống Kê</h3>
//         <div className="flex items-center flex-wrap gap-4">
//           <Select
//             value={revenueType}
//             className="w-40"
//             onChange={(value) => {
//               setRevenueType(value);
//               if (value !== "custom") {
//                 setCustomRange([]);
//               }
//             }}
//           >
//             <Select.Option value="day">Theo Ngày</Select.Option>
//             <Select.Option value="week">Theo Tuần</Select.Option>
//             <Select.Option value="month">Theo Tháng</Select.Option>
//             <Select.Option value="custom">Tùy Chỉnh</Select.Option>
//           </Select>

//           {revenueType === "custom" && (
//             <RangePicker
//               value={customRange}
//               format="YYYY-MM-DD"
//               onChange={(dates) => setCustomRange(dates || [])}
//               className="w-64"
//             />
//           )}
//         </div>
//       </motion.div>

//       {/* Thống kê chi tiết */}
//       <motion.div
//         className="grid grid-cols-1 gap-6"
//         initial="hidden"
//         animate="visible"
//         variants={{
//           visible: {
//             transition: {
//               staggerChildren: 0.2,
//             },
//           },
//         }}
//       >
//         {/* Doanh thu */}
//         <motion.div variants={cardVariants}>
//           <Card
//             title={<span className="text-lg font-semibold text-gray-800">Thống Kê Doanh Thu</span>}
//             className="shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl"
//             bodyStyle={{ padding: "24px" }}
//           >
//             {loadingRevenue ? (
//               <Skeleton height={300} baseColor="#f0f0f0" highlightColor="#e0e0e0" />
//             ) : revenueError ? (
//               <Alert
//                 message="Lỗi"
//                 description={revenueErrorDetails?.response?.data?.error || "Không thể tải dữ liệu doanh thu."}
//                 type="error"
//                 showIcon
//                 className="rounded-lg"
//               />
//             ) : revenueData?.message ? (
//               <Alert message={revenueData.message} type="info" showIcon className="rounded-lg" />
//             ) : (
//               <motion.div variants={chartVariants}>
//                 <Bar
//                   data={{
//                     labels: filledChart.map((item) => item.label),
//                     datasets: [
//                       {
//                         label: "Doanh thu (VNĐ)",
//                         data: filledChart.map((item) => item.value),
//                         backgroundColor: "rgba(66, 165, 245, 0.6)",
//                         borderColor: "rgba(66, 165, 245, 1)",
//                         borderWidth: 1,
//                         borderRadius: 4,
//                         hoverBackgroundColor: "rgba(66, 165, 245, 0.8)",
//                       },
//                     ],
//                   }}
//                   options={{
//                     animation: {
//                       duration: 1000,
//                       easing: "easeOutQuart",
//                     },
//                     scales: {
//                       y: {
//                         beginAtZero: true,
//                         ticks: {
//                           callback: (value) => Number(value).toLocaleString("vi-VN"),
//                           font: { size: 12 },
//                         },
//                         grid: { color: "#e5e7eb" },
//                       },
//                       x: {
//                         ticks: { font: { size: 12 } },
//                         grid: { display: false },
//                       },
//                     },
//                     plugins: {
//                       legend: {
//                         display: true,
//                         position: "top",
//                         labels: {
//                           font: { size: 14 },
//                           padding: 20,
//                           usePointStyle: true,
//                           pointStyle: "circle",
//                         },
//                       },
//                       tooltip: {
//                         backgroundColor: "#1f2937",
//                         titleFont: { size: 14 },
//                         bodyFont: { size: 12 },
//                         padding: 10,
//                         cornerRadius: 8,
//                         callbacks: {
//                           label: (context) =>
//                             `${context.dataset.label}: ${Number(context.raw).toLocaleString("vi-VN")} VNĐ`,
//                         },
//                       },
//                     },
//                   }}
//                 />
//               </motion.div>
//             )}
//           </Card>
//         </motion.div>
//       </motion.div>

//       <motion.div
//         className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6"
//         initial="hidden"
//         animate="visible"
//         variants={{
//           visible: {
//             transition: {
//               staggerChildren: 0.2,
//             },
//           },
//         }}
//       >
//         {/* Tình trạng đơn hàng */}
//         <motion.div variants={cardVariants}>
//           <Card
//             title={<span className="text-lg font-semibold text-gray-800">Tình Trạng Đơn Hàng</span>}
//             className="shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl"
//             bodyStyle={{ padding: "24px" }}
//           >
//             {loadingOrderStatus ? (
//               <Skeleton height={400} baseColor="#f0f0f0" highlightColor="#e0e0e0" />
//             ) : orderStatusError ? (
//               <Alert
//                 message="Lỗi"
//                 description={orderStatusErrorDetails?.response?.data?.error || "Không thể tải dữ liệu tình trạng đơn hàng."}
//                 type="error"
//                 showIcon
//                 className="rounded-lg"
//               />
//             ) : !orderStatusData || orderStatusData?.message ? (
//               <Alert
//                 message={orderStatusData?.message || "Không có dữ liệu để hiển thị."}
//                 type="info"
//                 showIcon
//                 className="rounded-lg"
//               />
//             ) : (
//               <motion.div variants={chartVariants} className="flex justify-center">
//                 <div style={{ width: "100%", height: "400px" }}>
//                   <Doughnut
//                     data={{
//                       labels: orderStatusData?.map((item) => item.status) || [],
//                       datasets: [
//                         {
//                           data: orderStatusData?.map((item) => item.count) || [],
//                           backgroundColor: orderStatusData?.map((item) => getStatusColor(item.status)) || [],
//                           borderWidth: 2,
//                           borderColor: "#ffffff",
//                           hoverOffset: 20,
//                         },
//                       ],
//                     }}
//                     options={{
//                       animation: {
//                         duration: 1200,
//                         easing: "easeInOutQuart",
//                       },
//                       plugins: {
//                         legend: {
//                           position: "right",
//                           labels: {
//                             font: { size: 12 },
//                             padding: 15,
//                             usePointStyle: true,
//                             pointStyle: "circle",
//                           },
//                         },
//                         tooltip: {
//                           backgroundColor: "#1f2937",
//                           titleFont: { size: 14 },
//                           bodyFont: { size: 12 },
//                           padding: 10,
//                           cornerRadius: 8,
//                           callbacks: {
//                             label: (context) => `${context.label}: ${context.raw} đơn hàng`,
//                           },
//                         },
//                       },
//                       maintainAspectRatio: false,
//                     }}
//                   />
//                 </div>
//               </motion.div>
//             )}
//           </Card>
//         </motion.div>

//         {/* Số lượng đơn hàng và mã giảm giá */}
//         <motion.div variants={cardVariants}>
//           <Card
//             title={<span className="text-lg font-semibold text-gray-800">Thống Kê Đơn Hàng và Mã Giảm Giá</span>}
//             className="shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl"
//             bodyStyle={{ padding: "24px" }}
//           >
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//               <div>
//                 {loadingOrderCount ? (
//                   <Skeleton height={60} baseColor="#f0f0f0" highlightColor="#e0e0e0" />
//                 ) : orderCountError ? (
//                   <Alert
//                     message="Lỗi"
//                     description={orderCountErrorDetails?.response?.data?.error || "Không thể tải dữ liệu số lượng đơn hàng."}
//                     type="error"
//                     showIcon
//                     className="rounded-lg"
//                   />
//                 ) : (
//                   <Statistic
//                     title={<span className="text-gray-700">Số Lượng Đơn Hàng</span>}
//                     value={orderCountData?.order_count || 0}
//                     prefix={<ShoppingOutlined className="text-blue-500 mr-2" />}
//                     valueStyle={{ fontSize: "24px", color: "#1f2937" }}
//                   />
//                 )}
//               </div>
//               <div>
//                 {loadingVoucherUsage ? (
//                   <Skeleton height={60} baseColor="#f0f0f0" highlightColor="#e0e0e0" />
//                 ) : voucherUsageError ? (
//                   <Alert
//                     message="Lỗi"
//                     description={voucherUsageErrorDetails?.response?.data?.error || "Không thể tải dữ liệu mã giảm giá."}
//                     type="error"
//                     showIcon
//                     className="rounded-lg"
//                   />
//                 ) : (
//                   <Statistic
//                     title={<span className="text-gray-700">Mã Giảm Giá Được Sử Dụng</span>}
//                     value={voucherUsageData?.voucher_usage_count || 0}
//                     prefix={<TagOutlined className="text-purple-500 mr-2" />}
//                     valueStyle={{ fontSize: "24px", color: "#1f2937" }}
//                   />
//                 )}
//               </div>
//             </div>
//           </Card>
//         </motion.div>
//       </motion.div>

//       <motion.div
//         className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6"
//         initial="hidden"
//         animate="visible"
//         variants={{
//           visible: {
//             transition: {
//               staggerChildren: 0.2,
//             },
//           },
//         }}
//       >
//         {/* 5 khách hàng hàng đầu */}
//         <motion.div variants={cardVariants}>
//           <Card
//             title={<span className="text-lg font-semibold text-gray-800">5 Khách Hàng Hàng Đầu</span>}
//             className="shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl"
//             bodyStyle={{ padding: "24px" }}
//           >
//             {loadingTopCustomers ? (
//               <Skeleton height={200} count={5} baseColor="#f0f0f0" highlightColor="#e0e0e0" />
//             ) : customersError ? (
//               <Alert
//                 message="Lỗi"
//                 description={customersErrorDetails?.response?.data?.error || "Không thể tải dữ liệu khách hàng."}
//                 type="error"
//                 showIcon
//                 className="rounded-lg"
//               />
//             ) : !topCustomers || topCustomers?.message ? (
//               <Alert
//                 message={topCustomers?.message || "Không có dữ liệu để hiển thị."}
//                 type="info"
//                 showIcon
//                 className="rounded-lg"
//               />
//             ) : (
//               <Table
//                 columns={customerColumns}
//                 dataSource={topCustomers}
//                 pagination={false}
//                 rowKey={(record) => record.user_id}
//                 className="rounded-lg overflow-hidden"
//                 rowClassName="hover:bg-gray-50 transition-colors duration-200"
//               />
//             )}
//           </Card>
//         </motion.div>

//         {/* 5 biến thể sản phẩm bán chạy nhất */}
//         <motion.div variants={cardVariants}>
//           <Card
//             title={<span className="text-lg font-semibold text-gray-800">5 Biến Thể Sản Phẩm Bán Chạy Nhất</span>}
//             className="shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl"
//             bodyStyle={{ padding: "24px" }}
//           >
//             {loadingTopProducts ? (
//               <Skeleton height={300} baseColor="#f0f0f0" highlightColor="#e0e0e0" />
//             ) : topProductsError ? (
//               <Alert
//                 message="Lỗi"
//                 description={topProductsErrorDetails?.response?.data?.error || "Không thể tải dữ liệu sản phẩm bán chạy."}
//                 type="error"
//                 showIcon
//                 className="rounded-lg"
//               />
//             ) : topProducts.length === 0 ? (
//               <Alert message="Không có dữ liệu để hiển thị." type="info" showIcon className="rounded-lg" />
//             ) : (
//               <motion.div variants={chartVariants}>
//                 <Bar
//                   data={{
//                     labels: topProducts.map((item) => item.variant_name) || [],
//                     datasets: [
//                       {
//                         label: "Số lượng bán ra",
//                         data: topProducts.map((item) => item.total_sold) || [],
//                         backgroundColor: "rgba(34, 197, 94, 0.6)",
//                         borderColor: "rgba(34, 197, 94, 1)",
//                         borderWidth: 1,
//                         borderRadius: 4,
//                         hoverBackgroundColor: "rgba(34, 197, 94, 0.8)",
//                       },
//                     ],
//                   }}
//                   options={{
//                     indexAxis: "y",
//                     animation: {
//                       duration: 1000,
//                       easing: "easeOutQuart",
//                     },
//                     scales: {
//                       x: {
//                         beginAtZero: true,
//                         ticks: { font: { size: 12 } },
//                         grid: { color: "#e5e7eb" },
//                       },
//                       y: {
//                         ticks: { font: { size: 12 } },
//                         grid: { display: false },
//                       },
//                     },
//                     plugins: {
//                       legend: { display: false },
//                       tooltip: {
//                         backgroundColor: "#1f2937",
//                         titleFont: { size: 14 },
//                         bodyFont: { size: 12 },
//                         padding: 10,
//                         cornerRadius: 8,
//                         callbacks: {
//                           label: (context) => `${context.dataset.label}: ${context.raw} sản phẩm`,
//                         },
//                       },
//                     },
//                   }}
//                 />
//               </motion.div>
//             )}
//           </Card>
//         </motion.div>
//       </motion.div>

//       <motion.div
//         className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6"
//         initial="hidden"
//         animate="visible"
//         variants={{
//           visible: {
//             transition: {
//               staggerChildren: 0.2,
//             },
//           },
//         }}
//       >
//         {/* 5 biến thể sản phẩm bán ế nhất */}
//         <motion.div variants={cardVariants}>
//           <Card
//             title={<span className="text-lg font-semibold text-gray-800">5 Biến Thể Sản Phẩm Bán Ế Nhất</span>}
//             className="shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl"
//             bodyStyle={{ padding: "24px" }}
//           >
//             {loadingSlowProducts ? (
//               <Skeleton height={300} baseColor="#f0f0f0" highlightColor="#e0e0e0" />
//             ) : slowProductsError ? (
//               <Alert
//                 message="Lỗi"
//                 description={slowProductsErrorDetails?.response?.data?.error || "Không thể tải dữ liệu sản phẩm bán ế."}
//                 type="error"
//                 showIcon
//                 className="rounded-lg"
//               />
//             ) : slowProducts.length === 0 ? (
//               <Alert message="Không có dữ liệu để hiển thị." type="info" showIcon className="rounded-lg" />
//             ) : (
//               <motion.div variants={chartVariants}>
//                 <Bar
//                   data={{
//                     labels: slowProducts.map((item) => item.variant_name) || [],
//                     datasets: [
//                       {
//                         label: "Số lượng bán ra",
//                         data: slowProducts.map((item) => item.total_sold) || [],
//                         backgroundColor: "rgba(239, 68, 68, 0.6)",
//                         borderColor: "rgba(239, 68, 68, 1)",
//                         borderWidth: 1,
//                         borderRadius: 4,
//                         hoverBackgroundColor: "rgba(239, 68, 68, 0.8)",
//                       },
//                     ],
//                   }}
//                   options={{
//                     indexAxis: "y",
//                     animation: {
//                       duration: 1000,
//                       easing: "easeOutQuart",
//                     },
//                     scales: {
//                       x: {
//                         beginAtZero: true,
//                         ticks: { font: { size: 12 } },
//                         grid: { color: "#e5e7eb" },
//                       },
//                       y: {
//                         ticks: { font: { size: 12 } },
//                         grid: { display: false },
//                       },
//                     },
//                     plugins: {
//                       legend: { display: false },
//                       tooltip: {
//                         backgroundColor: "#1f2937",
//                         titleFont: { size: 14 },
//                         bodyFont: { size: 12 },
//                         padding: 10,
//                         cornerRadius: 8,
//                         callbacks: {
//                           label: (context) => `${context.dataset.label}: ${context.raw} sản phẩm`,
//                         },
//                       },
//                     },
//                   }}
//                 />
//               </motion.div>
//             )}
//           </Card>
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// };

// export default Dashboard;
