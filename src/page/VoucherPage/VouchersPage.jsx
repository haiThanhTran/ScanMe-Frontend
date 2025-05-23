import React, { useState, useEffect, useRef } from "react";
import FilterSidebar from "../../components/productComponent/FilterSidebar";
import VoucherList from "../../components/voucherComponent/VoucherList";
import fetchUtils from "../../utils/fetchUtils";

const VouchersPage = () => {
  const [selectedStores, setSelectedStores] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);

  // Sticky FilterSidebar
  const sidebarRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const [storeRes, cateRes] = await Promise.all([
        fetchUtils.get("/stores", false),
        fetchUtils.get("/categories", false),
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
      <div
        style={{
          width: 280,
          marginRight: 32,
          alignSelf: "flex-start",
          position: "sticky",
          top: 88,
          zIndex: 10,
          maxHeight: "calc(100vh - 120px)",
        }}
        ref={sidebarRef}
      >
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
