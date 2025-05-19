import React, { useState, useEffect } from "react";
import FilterSidebar from "../components/FilterSidebar";
import VoucherList from "../components/VoucherList";
import fetchUtils from "../utils/fetchUtils";

const VouchersPage = () => {
  const [selectedStores, setSelectedStores] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [storeRes, cateRes] = await Promise.all([
        fetchUtils.get("/store", false),
        fetchUtils.get("/category", false),
      ]);
      setStores(storeRes.stores || storeRes);
      setCategories(cateRes.categories || cateRes);
    };

    fetchData();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        padding: "72px 32px 32px 32px",
        minHeight: "80vh",
        background: "#f7f7f7",
      }}
    >
      <div style={{ width: 280, marginRight: 32 }}>
        <FilterSidebar
          selectedStores={selectedStores}
          setSelectedStores={setSelectedStores}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />
      </div>
      <div style={{ flex: 1 }}>
        <VoucherList
          selectedStores={selectedStores}
          selectedCategories={selectedCategories}
        />
      </div>
    </div>
  );
};
export default VouchersPage;
