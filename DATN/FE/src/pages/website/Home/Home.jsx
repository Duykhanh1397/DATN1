import React from "react";
import { Link } from "react-router-dom";

// const Home = () => {
//   return (

  
    import Banner from "../components/Banner";

    const Home = () => {
      return (
        <>
          <Banner />
          <div style={{ backgroundColor: "#333", padding: "20px 0" }}>
            <section>
              <div className="container mb-4 d-flex justify-content-between align-items-center">
                <h2 className="fs-2 fw-semibold text-light">Danh Mục</h2>
                <Link
                  to="/"
                  className="btn border border-warning text-light custom-hover"
                >
                  View all
                </Link>
              </div>
    
              <div className="container mb-3">
                <div className="row g-3 justify-content-center">
                  <div className="col-lg-2 col-md-4 col-sm-6">
                    <div className="p-3 d-flex justify-content-center align-items-center category-box bg-dark rounded">
                      <img
                        src="https://cdnv2.tgdd.vn/webmwg/2024/tz/images/desktop/IP_Desk.png"
                        className="img-fluid hover-scale"
                        alt="iPhone"
                      />
                    </div>
                  </div>
                  <div className="col-lg-2 col-md-4 col-sm-6">
                    <div className="p-3 d-flex justify-content-center align-items-center category-box bg-dark rounded">
                      <img
                        src="https://cdnv2.tgdd.vn/webmwg/2024/tz/images/desktop/Mac_Desk.png"
                        className="img-fluid hover-scale"
                        alt="Mac"
                      />
                    </div>
                  </div>
                  <div className="col-lg-2 col-md-4 col-sm-6">
                    <div className="p-3 d-flex justify-content-center align-items-center category-box bg-dark rounded">
                      <img
                        src="https://cdnv2.tgdd.vn/webmwg/2024/tz/images/desktop/Ipad_Desk.png"
                        className="img-fluid hover-scale"
                        alt="iPad"
                      />
                    </div>
                  </div>
                  <div className="col-lg-2 col-md-4 col-sm-6">
                    <div className="p-3 d-flex justify-content-center align-items-center category-box bg-dark rounded">
                      <img
                        src="https://cdnv2.tgdd.vn/webmwg/2024/tz/images/desktop/Watch_Desk.png"
                        className="img-fluid hover-scale"
                        alt="Apple Watch"
                      />
                    </div>
                  </div>
                  <div className="col-lg-2 col-md-4 col-sm-6">
                    <div className="p-3 d-flex justify-content-center align-items-center category-box bg-dark rounded">
                      <img
                        src="https://cdnv2.tgdd.vn/webmwg/2024/tz/images/desktop/Speaker_Desk.png"
                        className="img-fluid hover-scale"
                        alt="Speaker"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
    
            <section className="font-poppins">
              <div className="container mb-4">
                <div className="d-flex justify-content-between align-items-center">
                  <h2 className="fs-2 fw-semibold text-light">Sản Phẩm Nổi Bật</h2>
                  <a
                    href="/"
                    className="btn border-warning text-light custom-hover"
                  >
                    View all
                  </a>
                </div>
              </div>
    
              <div className="container mb-4">
                <div className="row g-3">
                  <div className="col-md-3">
                    <div className="card border-0 shadow-sm">
                      <Link to="detail">
                        <img
                          src="https://cdn.tgdd.vn/Products/Images/42/334864/s16/iphone-16e-black-thumbtz-650x650.png"
                          className="card-img-top img-fluid hover-scale"
                          alt="Product Image"
                        />
                      </Link>
                      <div className="card-body bg-dark text-center">
                        <Link
                          to="detail"
                          className="text-decoration-none text-light"
                        >
                          <h5 className="fw-semibold">iPhone 16 Pro Max</h5>
                        </Link>
                        <p className="text-secondary">iPhone</p>
                        <p className="text-warning fw-semibold fs-5">33.590.000đ</p>
                        <Link to="">
                          <button className="btn border border-warning text-light w-100 py-2 px-3 custom-hover">
                            Add to cart
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
    
                  <div className="col-md-3">
                    <div className="card border-0 shadow-sm">
                      <Link to="detail">
                        <img
                          src="https://cdn.tgdd.vn/Products/Images/42/334864/s16/iphone-16e-black-thumbtz-650x650.png"
                          className="card-img-top img-fluid hover-scale"
                          alt="Product Image"
                        />
                      </Link>
                      <div className="card-body bg-dark text-center">
                        <Link
                          to="product_detail"
                          className="text-decoration-none text-light"
                        >
                          <h5 className="fw-semibold">iPhone 16 Pro Max</h5>
                        </Link>
                        <p className="text-secondary">iPhone</p>
                        <p className="text-warning fw-semibold fs-5">33.590.000đ</p>
                        <Link to="">
                          <button className="btn border border-warning text-light w-100 py-2 px-3 custom-hover">
                            Add to cart
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
    
                  <div className="col-md-3">
                    <div className="card border-0 shadow-sm">
                      <Link to="detail">
                        <img
                          src="https://cdn.tgdd.vn/Products/Images/42/334864/s16/iphone-16e-black-thumbtz-650x650.png"
                          className="card-img-top img-fluid hover-scale"
                          alt="Product Image"
                        />
                      </Link>
                      <div className="card-body bg-dark text-center">
                        <Link
                          to="detail"
                          className="text-decoration-none text-light"
                        >
                          <h5 className="fw-semibold">iPhone 16 Pro Max</h5>
                        </Link>
                        <p className="text-secondary">iPhone</p>
                        <p className="text-warning fw-semibold fs-5">33.590.000đ</p>
                        <Link to="">
                          <button className="btn border border-warning text-light w-100 py-2 px-3 custom-hover">
                            Add to cart
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
    
                  <div className="col-md-3">
                    <div className="card border-0 shadow-sm">
                      <Link to="detail">
                        <img
                          src="https://cdn.tgdd.vn/Products/Images/42/334864/s16/iphone-16e-black-thumbtz-650x650.png"
                          className="card-img-top img-fluid hover-scale"
                          alt="Product Image"
                        />
                      </Link>
                      <div className="card-body bg-dark text-center">
                        <Link
                          to="/detail"
                          className="text-decoration-none text-light"
                        >
                          <h5 className="fw-semibold">iPhone 16 Pro Max</h5>
                        </Link>
                        <p className="text-secondary">iPhone</p>
                        <p className="text-warning fw-semibold fs-5">33.590.000đ</p>
                        <Link to="">
                          <button className="btn border border-warning text-light w-100 py-2 px-3 custom-hover">
                            Add to cart
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </>
      );
    };
    
    export default Home;
    

    







    // <div>
    //   <h1>Chào mừng bạn đến với hệ thống</h1>
    //   <p>Vui lòng chọn một hành động:</p>
    //   <Link to="/login">
    //     <button>Đăng nhập</button>
    //   </Link>
    //   <Link to="/register">
    //     <button>Đăng ký</button>
    //   </Link>
    // </div>







//   );
// };

// export default Home;
