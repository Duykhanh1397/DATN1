import React, { useEffect, useState } from "react";
import { Select, Row, Col } from "antd";
import axios from "axios";

const ShippingFeeForm = ({ onFeeChange, onAddressChange, initialAddress }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  // Load danh sách tỉnh
  useEffect(() => {
    const fetchProvinces = async () => {
      const res = await axios.get("https://provinces.open-api.vn/api/p/");
      setProvinces(res.data);

      if (initialAddress) {
        const parts = initialAddress.split(",").map((p) => p.trim());
        const [wardName, districtName, provinceName] = parts.reverse(); // Xã, huyện, tỉnh

        const foundProvince = res.data.find((p) => p.name === provinceName);
        if (foundProvince) {
          setSelectedProvince(foundProvince.name);
          handleProvinceChange(
            foundProvince.code,
            { label: foundProvince.name },
            districtName,
            wardName
          );
        }
      }
    };
    fetchProvinces();
  }, [initialAddress]);

  const handleProvinceChange = async (
    value,
    option,
    preDistrictName = "",
    preWardName = ""
  ) => {
    const res = await axios.get(
      `https://provinces.open-api.vn/api/p/${value}?depth=2`
    );
    setDistricts(res.data.districts);
    setSelectedProvince(option.label);

    // Tính phí vận chuyển
    if (option.label.toLowerCase().includes("hà nội")) {
      onFeeChange(0);
    } else {
      onFeeChange(20000);
    }

    if (preDistrictName) {
      const foundDistrict = res.data.districts.find(
        (d) => d.name === preDistrictName
      );
      if (foundDistrict) {
        setSelectedDistrict(foundDistrict.name);
        handleDistrictChange(
          foundDistrict.code,
          { label: foundDistrict.name },
          preWardName
        );
      }
    }
  };

  const handleDistrictChange = async (value, option, preWardName = "") => {
    const res = await axios.get(
      `https://provinces.open-api.vn/api/d/${value}?depth=2`
    );
    setWards(res.data.wards);
    setSelectedDistrict(option.label);

    if (preWardName) {
      const foundWard = res.data.wards.find((w) => w.name === preWardName);
      if (foundWard) {
        setSelectedWard(foundWard.name);
        handleWardChange(foundWard.code, { label: foundWard.name });
      }
    }
  };

  const handleWardChange = (value, option) => {
    const wardName = option.label;
    setSelectedWard(wardName);

    const fullAddress = `${wardName}, ${selectedDistrict}, ${selectedProvince}`;
    onAddressChange(fullAddress);
  };

  return (
    <Row gutter={12}>
      <Col span={8}>
        <Select
          showSearch
          style={{ width: "100%" }}
          placeholder="Chọn tỉnh"
          value={selectedProvince || undefined}
          onChange={handleProvinceChange}
          options={provinces.map((p) => ({
            value: p.code,
            label: p.name,
          }))}
        />
      </Col>
      <Col span={8}>
        <Select
          showSearch
          style={{ width: "100%" }}
          placeholder="Chọn quận/huyện"
          value={selectedDistrict || undefined}
          onChange={handleDistrictChange}
          options={districts.map((d) => ({
            value: d.code,
            label: d.name,
          }))}
          disabled={!selectedProvince}
        />
      </Col>
      <Col span={8}>
        <Select
          showSearch
          style={{ width: "100%" }}
          placeholder="Chọn phường/xã"
          value={selectedWard || undefined}
          onChange={handleWardChange}
          options={wards.map((w) => ({
            value: w.code,
            label: w.name,
          }))}
          disabled={!selectedDistrict}
        />
      </Col>
    </Row>
  );
};

export default ShippingFeeForm;
