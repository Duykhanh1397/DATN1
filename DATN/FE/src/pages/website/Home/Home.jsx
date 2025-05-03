import React from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Banner from "../components/Banner";
import API from "../../../services/api";
import { ShoppingCartOutlined } from "@ant-design/icons";

const Home = () => {
  const queryClient = useQueryClient();
  const { data: products, isLoading } = useQuery({
    queryKey: ["PRODUCTS_KEY"],
    queryFn: async () => {
      const { data } = await API.get("/products");
      console.log(data);
      return data.data.map((item, index) => {
        const imageUrl = item.image
          ? item.image.startsWith("/storage/")
            ? `http://localhost:8000/${item.image}`
            : `http://localhost:8000/storage/${item.image}`
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
    onSuccess: () => {
      queryClient.invalidateQueries(["CART_ITEM"]);
    },
  });

  const categories = [
    {
      name: "iPhone",
      img: "https://cdnv2.tgdd.vn/webmwg/2024/tz/images/desktop/IP_Desk.png",
    },
    {
      name: "MacBook",
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
    return <div className="text-center py-5 text-light">Đang tải...</div>;
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
                    to={`/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
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
            <h2 className="fs-2 fw-semibold text-light">Sản Phẩm</h2>
            {/* <Link
              to="/products"
              className="btn border border-warning text-light custom-hover"
            >
              Xem tất cả
            </Link> */}
          </div>

          <div className="row g-3">
            {products?.map((product) => (
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
                      {product.price
                        ? `${Number(product.price).toLocaleString("vi-VN")} VNĐ`
                        : "0 VNĐ"}
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
