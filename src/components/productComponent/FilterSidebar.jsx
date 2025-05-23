import React, { useState, useEffect } from "react";
import { Checkbox, Collapse, Spin } from "antd";
import fetchUtils from "../../utils/fetchUtils";

const { Panel } = Collapse;

const FilterSidebar = ({
  selectedStores,
  setSelectedStores,
  selectedCategories,
  setSelectedCategories,
}) => {
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch stores & categories
    const fetchData = async () => {
      setLoading(true);
      const [storeRes, cateRes] = await Promise.all([
        fetchUtils.get("/stores", false),
        fetchUtils.get("/categories", false),
      ]);
      setStores(storeRes.stores || storeRes);
      setCategories(cateRes.categories || cateRes);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <Spin spinning={loading}>
      <Collapse defaultActiveKey={["store", "category"]} ghost>
        <Panel header={<b>Lọc theo cửa hàng</b>} key="store">
          <Checkbox.Group
            style={{ width: "100%" }}
            value={selectedStores}
            onChange={setSelectedStores}
          >
            {stores.map((store) => (
              <div key={store._id} style={{ marginBottom: 8 }}>
                <Checkbox value={store._id}>
                  <img
                    src={store.logo}
                    alt="logo"
                    style={{
                      width: 20,
                      marginRight: 8,
                      verticalAlign: "middle",
                    }}
                  />
                  {store.name}
                </Checkbox>
              </div>
            ))}
          </Checkbox.Group>
        </Panel>
        <Panel header={<b>Lọc theo ngành hàng</b>} key="category">
          <Checkbox.Group
            style={{ width: "100%" }}
            value={selectedCategories}
            onChange={setSelectedCategories}
          >
            {categories.map((cate) => (
              <div key={cate._id} style={{ marginBottom: 8 }}>
                <Checkbox value={cate._id}>
                  {cate.icon && (
                    <img
                      src={cate.icon}
                      alt="icon"
                      style={{
                        width: 18,
                        marginRight: 8,
                        verticalAlign: "middle",
                      }}
                    />
                  )}
                  {cate.name}
                </Checkbox>
              </div>
            ))}
          </Checkbox.Group>
        </Panel>
      </Collapse>
    </Spin>
  );
};

export default FilterSidebar;
