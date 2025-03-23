import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Banner from "../components/Banner";
import API from "../../../services/api";
import { ShoppingCartOutlined } from "@ant-design/icons";

const Home = () => {
  // Query fetch products từ API backend Laravel
  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["PRODUCTS_KEY"],
    queryFn: async () => {
      const { data } = await API.get("/admin/products");
      console.log("Fetched products:", data);

      return data.data.map((item, index) => {
        const imageUrl = item.image
          ? `http://localhost:8000/storage/${item.image}`
          : null;

        return {
          key: item.id,
          stt: index + 1,
          name: item.name,
          image: imageUrl,
          price: item.price,
          description: item.description,
          category: item.category?.name,
          status: item.status,
        };
      });
    },
  });

  const categories = [
    {
      name: "iPhone",
      img: "https://cdnv2.tgdd.vn/webmwg/2024/tz/images/desktop/IP_Desk.png",
    },
    {
      name: "Mac",
      img: "https://cdnv2.tgdd.vn/webmwg/2024/tz/images/desktop/Mac_Desk.png",
    },
    {
      name: "iPad",
      img: "https://cdnv2.tgdd.vn/webmwg/2024/tz/images/desktop/Ipad_Desk.png",
    },
    {
      name: "Apple Watch",
      img: "https://cdnv2.tgdd.vn/webmwg/2024/tz/images/desktop/Watch_Desk.png",
    },
    {
      name: "Phụ kiện",
      img: "https://cdnv2.tgdd.vn/webmwg/2024/tz/images/desktop/Speaker_Desk.png",
    },
  ];

  // Xử lý loading & error
  if (isLoading) {
    return (
      <div className="text-center py-5 text-light">Đang tải sản phẩm...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-5 text-danger">
        Lỗi tải sản phẩm: {error.message}
      </div>
    );
  }

  return (
    <>
      <Banner />

      {/* Danh mục */}
      <div style={{ backgroundColor: "#333", padding: "20px 0" }}>
        <section className="container mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="fs-2 fw-semibold text-light">Danh Mục</h2>
          </div>

          <div className="row g-3 justify-content-center mt-3">
            {categories.map((category, index) => (
              <div key={index} className="col-6 col-sm-4 col-md-2">
                <div
                  className="card border-0 bg-dark text-center h-100 hover-scale custom-hover"
                  style={{
                    cursor: "pointer",
                    borderRadius: "12px",
                    transition: "transform 0.3s",
                  }}
                >
                  <Link
                    to={`/categories/${category.name.toLowerCase()}`}
                    className="text-decoration-none text-light"
                  >
                    <div
                      className="card-body d-flex flex-column align-items-center justify-content-center"
                      style={{ padding: "1rem" }}
                    >
                      <img
                        src={category.img}
                        alt={category.name}
                        className="img-fluid mb-2"
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "contain",
                        }}
                      />
                      <h5 className="fw-semibold">{category.name}</h5>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sản phẩm nổi bật */}
        <section className="font-poppins container mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="fs-2 fw-semibold text-light">Sản Phẩm Nổi Bật</h2>
            <Link
              to="/products"
              className="btn border border-warning text-light custom-hover"
            >
              Xem tất cả
            </Link>
          </div>

          <div className="row g-3">
            {products?.slice(0, 4).map((product) => (
              <div key={product.key} className="col-md-3">
                <div className="card border-0 shadow-sm h-100 product-box ">
                  <Link to={`/product/${product.key}`}>
                    <img
                      src={product.image}
                      className="card-img-top img-fluid"
                      alt={product.name}
                      style={{ height: "250px", objectFit: "contain" }}
                    />
                  </Link>
                  <div className="card-body bg-dark text-center">
                    <Link
                      to={`/product/${product.key}`}
                      className="text-decoration-none text-light"
                    >
                      <h5 className="fw-semibold">{product.name}</h5>
                    </Link>
                    <p className="text-secondary">{product.category}</p>
                    <p className="text-warning fw-semibold fs-5">
                      {Number(product.price).toLocaleString("vi-VN")} VNĐ
                    </p>
                    <Link
                      to={`/product/${product.key}`}
                      className="text-decoration-none text-light"
                    >
                      <button className="btn border border-warning text-light w-100 py-2 px-3 custom-hover">
                        <ShoppingCartOutlined />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;

// import React from "react";
// import { Link } from "react-router-dom";
// import Banner from "../components/Banner";

// const Home = () => {
//   return (
//     <>
//       <Banner />
//       <div style={{ backgroundColor: "#333", padding: "20px 0" }}>
//         <section>
//           <div className="container mb-4 d-flex justify-content-between align-items-center">
//             <h2 className="fs-2 fw-semibold text-light">Danh Mục</h2>
//             <Link
//               to="/"
//               className="btn border border-warning text-light custom-hover"
//             >
//               View all
//             </Link>
//           </div>

//           <div className="container mb-3">
//             <div className="row g-3 justify-content-center">
//               <div className="col-lg-2 col-md-4 col-sm-6">
//                 <div className="p-3 d-flex justify-content-center align-items-center category-box bg-dark rounded">
//                   <img
//                     src="https://cdnv2.tgdd.vn/webmwg/2024/tz/images/desktop/IP_Desk.png"
//                     className="img-fluid hover-scale"
//                     alt="iPhone"
//                   />
//                 </div>
//               </div>
//               <div className="col-lg-2 col-md-4 col-sm-6">
//                 <div className="p-3 d-flex justify-content-center align-items-center category-box bg-dark rounded">
//                   <img
//                     src="https://cdnv2.tgdd.vn/webmwg/2024/tz/images/desktop/Mac_Desk.png"
//                     className="img-fluid hover-scale"
//                     alt="Mac"
//                   />
//                 </div>
//               </div>
//               <div className="col-lg-2 col-md-4 col-sm-6">
//                 <div className="p-3 d-flex justify-content-center align-items-center category-box bg-dark rounded">
//                   <img
//                     src="https://cdnv2.tgdd.vn/webmwg/2024/tz/images/desktop/Ipad_Desk.png"
//                     className="img-fluid hover-scale"
//                     alt="iPad"
//                   />
//                 </div>
//               </div>
//               <div className="col-lg-2 col-md-4 col-sm-6">
//                 <div className="p-3 d-flex justify-content-center align-items-center category-box bg-dark rounded">
//                   <img
//                     src="https://cdnv2.tgdd.vn/webmwg/2024/tz/images/desktop/Watch_Desk.png"
//                     className="img-fluid hover-scale"
//                     alt="Apple Watch"
//                   />
//                 </div>
//               </div>
//               <div className="col-lg-2 col-md-4 col-sm-6">
//                 <div className="p-3 d-flex justify-content-center align-items-center category-box bg-dark rounded">
//                   <img
//                     src="https://cdnv2.tgdd.vn/webmwg/2024/tz/images/desktop/Speaker_Desk.png"
//                     className="img-fluid hover-scale"
//                     alt="Speaker"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         <section className="font-poppins">
//           <div className="container mb-4">
//             <div className="d-flex justify-content-between align-items-center">
//               <h2 className="fs-2 fw-semibold text-light">Sản Phẩm Nổi Bật</h2>
//               <a
//                 href="/"
//                 className="btn border-warning text-light custom-hover"
//               >
//                 View all
//               </a>
//             </div>
//           </div>

//           <div className="container mb-4">
//             <div className="row g-3">
//               <div className="col-md-3">
//                 <div className="card border-0 shadow-sm">
//                   <Link to="detail">
//                     <img
//                       src="https://cdn.tgdd.vn/Products/Images/42/334864/s16/iphone-16e-black-thumbtz-650x650.png"
//                       className="card-img-top img-fluid hover-scale"
//                       alt="Product Image"
//                     />
//                   </Link>
//                   <div className="card-body bg-dark text-center">
//                     <Link
//                       to="detail"
//                       className="text-decoration-none text-light"
//                     >
//                       <h5 className="fw-semibold">iPhone 16 Pro Max</h5>
//                     </Link>
//                     <p className="text-secondary">iPhone</p>
//                     <p className="text-warning fw-semibold fs-5">33.590.000đ</p>
//                     <Link to="">
//                       <button className="btn border border-warning text-light w-100 py-2 px-3 custom-hover">
//                         Add to cart
//                       </button>
//                     </Link>
//                   </div>
//                 </div>
//               </div>

//               <div className="col-md-3">
//                 <div className="card border-0 shadow-sm">
//                   <Link to="detail">
//                     <img
//                       src="https://cdn.tgdd.vn/Products/Images/42/334864/s16/iphone-16e-black-thumbtz-650x650.png"
//                       className="card-img-top img-fluid hover-scale"
//                       alt="Product Image"
//                     />
//                   </Link>
//                   <div className="card-body bg-dark text-center">
//                     <Link
//                       to="product_detail"
//                       className="text-decoration-none text-light"
//                     >
//                       <h5 className="fw-semibold">iPhone 16 Pro Max</h5>
//                     </Link>
//                     <p className="text-secondary">iPhone</p>
//                     <p className="text-warning fw-semibold fs-5">33.590.000đ</p>
//                     <Link to="">
//                       <button className="btn border border-warning text-light w-100 py-2 px-3 custom-hover">
//                         Add to cart
//                       </button>
//                     </Link>
//                   </div>
//                 </div>
//               </div>

//               <div className="col-md-3">
//                 <div className="card border-0 shadow-sm">
//                   <Link to="detail">
//                     <img
//                       src="https://cdn.tgdd.vn/Products/Images/42/334864/s16/iphone-16e-black-thumbtz-650x650.png"
//                       className="card-img-top img-fluid hover-scale"
//                       alt="Product Image"
//                     />
//                   </Link>
//                   <div className="card-body bg-dark text-center">
//                     <Link
//                       to="detail"
//                       className="text-decoration-none text-light"
//                     >
//                       <h5 className="fw-semibold">iPhone 16 Pro Max</h5>
//                     </Link>
//                     <p className="text-secondary">iPhone</p>
//                     <p className="text-warning fw-semibold fs-5">33.590.000đ</p>
//                     <Link to="">
//                       <button className="btn border border-warning text-light w-100 py-2 px-3 custom-hover">
//                         Add to cart
//                       </button>
//                     </Link>
//                   </div>
//                 </div>
//               </div>

//               <div className="col-md-3">
//                 <div className="card border-0 shadow-sm">
//                   <Link to="detail">
//                     <img
//                       src="https://cdn.tgdd.vn/Products/Images/42/334864/s16/iphone-16e-black-thumbtz-650x650.png"
//                       className="card-img-top img-fluid hover-scale"
//                       alt="Product Image"
//                     />
//                   </Link>
//                   <div className="card-body bg-dark text-center">
//                     <Link
//                       to="/detail"
//                       className="text-decoration-none text-light"
//                     >
//                       <h5 className="fw-semibold">iPhone 16 Pro Max</h5>
//                     </Link>
//                     <p className="text-secondary">iPhone</p>
//                     <p className="text-warning fw-semibold fs-5">33.590.000đ</p>
//                     <Link to="">
//                       <button className="btn border border-warning text-light w-100 py-2 px-3 custom-hover">
//                         Add to cart
//                       </button>
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>
//     </>
//   );
// };

// export default Home;

// import React from "react";
// import { Link } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import Banner from "../components/Banner";

// const Home = () => {
//   // Fetch categories from the API
//   const { data: categories = [], isLoading: categoriesLoading } = useQuery({
//     queryKey: ["categories"],
//     queryFn: async () => {
//       const res = await axios.get("http://localhost:3000/categories");
//       return res.data;
//     },
//   });

//   // Fetch products from the API
//   const { data: products = [], isLoading: productsLoading } = useQuery({
//     queryKey: ["products"],
//     queryFn: async () => {
//       const res = await axios.get("http://localhost:3000/products");
//       return res.data;
//     },
//   });

//   if (categoriesLoading || productsLoading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <>
//       <Banner />
//       <div style={{ backgroundColor: "#333", padding: "20px 0" }}>
//         {/* Categories Section */}
//         <section>
//           <div className="container mb-4 d-flex justify-content-between align-items-center">
//             <h2 className="fs-2 fw-semibold text-light">Danh Mục</h2>
//             <Link
//               to="/"
//               className="btn border border-warning text-light custom-hover"
//             >
//               View all
//             </Link>
//           </div>

//           <div className="container mb-3">
//             <div className="row g-3 justify-content-center">
//               {categories.map((category) => (
//                 <div className="col-lg-2 col-md-4 col-sm-6" key={category.id}>
//                   <div className="p-3 d-flex justify-content-center align-items-center category-box bg-dark rounded">
//                     <img
//                       src={category.image}
//                       className="img-fluid hover-scale"
//                       alt={category.name}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* Products Section */}
//         <section className="font-poppins">
//           <div className="container mb-4">
//             <div className="d-flex justify-content-between align-items-center">
//               <h2 className="fs-2 fw-semibold text-light">Sản Phẩm Nổi Bật</h2>
//               <a
//                 href="/"
//                 className="btn border-warning text-light custom-hover"
//               >
//                 View all
//               </a>
//             </div>
//           </div>

//           <div className="container mb-4">
//             <div className="row g-3">
//               {products.map((product) => (
//                 <div className="col-md-3" key={product.id}>
//                   <div className="card border-0 shadow-sm">
//                     <Link to={`/product/${product.id}`}>
//                       <img
//                         src={product.image}
//                         className="card-img-top img-fluid hover-scale"
//                         alt={product.name}
//                       />
//                     </Link>
//                     <div className="card-body bg-dark text-center">
//                       <Link
//                         to={`/product/${product.id}`}
//                         className="text-decoration-none text-light"
//                       >
//                         <h5 className="fw-semibold">{product.name}</h5>
//                       </Link>
//                       <p className="text-secondary">iPhone</p>
//                       <p className="text-warning fw-semibold fs-5">
//                         {product.price.toLocaleString()} đ
//                       </p>
//                       <Link to="">
//                         <button className="btn border border-warning text-light w-100 py-2 px-3 custom-hover">
//                           Add to cart
//                         </button>
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//       </div>
//     </>
//   );
// };

// export default Home;

// import React from "react";
// import { Link } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import Banner from "../components/Banner";

// const Home = () => {
//   // Fetch categories from the API
//   const { data: categories = [], isLoading: categoriesLoading } = useQuery({
//     queryKey: ["categories"],
//     queryFn: async () => {
//       const res = await axios.get("http://localhost:3000/categories");
//       return res.data;
//     },
//   });

//   // Fetch products from the API
//   const { data: products = [], isLoading: productsLoading } = useQuery({
//     queryKey: ["products"],
//     queryFn: async () => {
//       const res = await axios.get("http://localhost:3000/products");
//       return res.data;
//     },
//   });

//   if (categoriesLoading || productsLoading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <>
//       <Banner />
//       <div style={{ backgroundColor: "#333", padding: "20px 0" }}>
//         {/* Categories Section */}
//         <section>
//           <div className="container mb-4 d-flex justify-content-between align-items-center">
//             <h2 className="fs-2 fw-semibold text-light">Danh Mục</h2>
//             <Link
//               to="/"
//               className="btn border border-warning text-light custom-hover"
//             >
//               View all
//             </Link>
//           </div>

//           <div className="container mb-3">
//             <div className="row g-3 justify-content-center">
//               {categories.map((category) => (
//                 <div className="col-lg-2 col-md-4 col-sm-6" key={category.id}>
//                   <div className="p-3 d-flex justify-content-center align-items-center category-box bg-dark rounded">
//                     <img
//                       src={category.image}
//                       className="img-fluid hover-scale"
//                       alt={category.name}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* Products Section */}
//         <section className="font-poppins">
//           <div className="container mb-4">
//             <div className="d-flex justify-content-between align-items-center">
//               <h2 className="fs-2 fw-semibold text-light">Sản Phẩm Nổi Bật</h2>
//               <a
//                 href="/"
//                 className="btn border-warning text-light custom-hover"
//               >
//                 View all
//               </a>
//             </div>
//           </div>

//           <div className="container mb-4">
//             <div className="row g-3">
//               {products.map((product) => (
//                 <div className="col-md-3" key={product.id}>
//                   <div className="card border-0 shadow-sm">
//                     <Link to={`/product/${product.id}`}>
//                       <img
//                         src={product.image}
//                         className="card-img-top img-fluid hover-scale"
//                         alt={product.name}
//                       />
//                     </Link>
//                     <div className="card-body bg-dark text-center">
//                       <Link
//                         to={`/product/${product.id}`}
//                         className="text-decoration-none text-light"
//                       >
//                         <h5 className="fw-semibold">{product.name}</h5>
//                       </Link>
//                       <p className="text-secondary">iPhone</p>
//                       <p className="text-warning fw-semibold fs-5">
//                         {/* Check if price exists and format it */}
//                         {product.price
//                           ? product.price.toLocaleString() + " đ"
//                           : "Price not available"}
//                       </p>
//                       <Link to="">
//                         <button className="btn border border-warning text-light w-100 py-2 px-3 custom-hover">
//                           Add to cart
//                         </button>
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//       </div>
//     </>
//   );
// };

// export default Home;
