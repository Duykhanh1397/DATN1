import banner from "../../image/bn1.png";

const Banner = () => {
  return (
    <div style={{ width: "100%", overflow: "hidden" }}>
      <img
        src={banner}
        alt="Banner"
        style={{ width: "100%", objectFit: "cover" }}
      />
    </div>
  );
};

export default Banner;
