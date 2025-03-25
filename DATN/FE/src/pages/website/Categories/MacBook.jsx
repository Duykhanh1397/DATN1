import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Banner from "../components/Banner";
import API from "../../../services/api";
import { ShoppingCartOutlined } from "@ant-design/icons";

const MacBook = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const { data: products, isLoading } = useQuery({
    queryKey: ["MACBOOK_PRODUCTS"],
    queryFn: async () => {
      const { data } = await API.get("/admin/products");

      // Lọc sản phẩm thuộc danh mục
      return data.data
        .filter((item) => item.category?.name === "MacBook")
        .map((item, index) => {
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
  // Lọc sản phẩm theo tên và giá
  const filteredData = products?.filter((product) => {
    const matchesName = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const price = Number(product.price);
    let matchesPrice = true;

    switch (priceFilter) {
      case "<10tr":
        matchesPrice = price < 10000000;
        break;
      case "10tr-20tr":
        matchesPrice = price >= 10000000 && price <= 20000000;
        break;
      case "20tr-30tr":
        matchesPrice = price > 20000000 && price <= 30000000;
        break;
      case ">30tr":
        matchesPrice = price > 30000000;
        break;
      default:
        matchesPrice = true;
    }
    return matchesName && matchesPrice;
  });

  // Xử lý loading
  if (isLoading) {
    return <div className="text-center py-5 text-light">Đang tải...</div>;
  }

  return (
    <>
      <Banner />

      <div style={{ backgroundColor: "#333", padding: "20px 0" }}>
        <section className="container mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="fs-2 fw-semibold text-light">MacBook</h2>
          </div>

          {/* Bộ lọc tìm kiếm và lọc theo giá */}
          <div className="row mt-4">
            {/* Sidebar bộ lọc */}
            <div className="col-md-3">
              <section className="p-3 bg-dark text-light rounded shadow-sm">
                <h4 className="fw-semibold mb-3">Tìm kiếm & Lọc</h4>

                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nhập tên sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} // 4. Handle tìm kiếm
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Lọc theo giá:</label>
                  <select
                    className="form-select"
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                  >
                    <option value="">Tất cả</option>
                    <option value="<10tr">Dưới 10 triệu</option>
                    <option value="10tr-20tr">10 triệu - 20 triệu</option>
                    <option value="20tr-30tr">20 triệu - 30 triệu</option>
                    <option value=">30tr">Trên 30 triệu</option>
                  </select>
                </div>
              </section>
            </div>

            {/* Danh sách sản phẩm */}
            <div className="col-md-9">
              <div className="row g-3">
                {filteredData.length === 0 && (
                  <div className="text-center text-light">
                    Không có sản phẩm MacBook nào.
                  </div>
                )}

                {filteredData.map((product) => (
                  <div key={product.key} className="col-md-4">
                    <div className="card border-0 shadow-sm h-100 product-box">
                      <Link to={`/product/${product.key}`}>
                        <img
                          src={product.image}
                          className="card-img-top img-fluid"
                          alt={product.name}
                          style={{
                            height: "250px",
                            objectFit: "contain",
                          }}
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
                            ? `${Number(product.price).toLocaleString(
                                "vi-VN"
                              )} VNĐ`
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
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default MacBook;
