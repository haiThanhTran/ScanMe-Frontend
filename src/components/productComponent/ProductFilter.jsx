import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Card,
  Typography,
  Checkbox,
  Space,
  Collapse,
  Spin, // Giữ lại Spin cho việc tải stores
} from "antd";
import StoreService from "../../services/StoreService";
import "../../static/css/styles.css";
import { CaretRightOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Panel } = Collapse;

const ProductFilter = ({ onFilterChange, categories, initialFilters }) => {
  // Sử dụng initialFilters để khởi tạo state nếu được cung cấp
  const [selectedCategories, setSelectedCategories] = useState(initialFilters?.categories || []);
  const [selectedStores, setSelectedStores] = useState(initialFilters?.stores || []);
  const [inStock, setInStock] = useState(initialFilters?.inStock || false);

  const [stores, setStores] = useState([]);
  const [storeLoading, setStoreLoading] = useState(false);
  const isMounted = useRef(false); // Kiểm tra component đã mount chưa
  const debounceTimeoutRef = useRef(null); // Ref cho debounce timeout

  // Fetch stores một lần
  useEffect(() => {
    const fetchStores = async () => {
      setStoreLoading(true);
      try {
        const fetchedStores = await StoreService.getAllStores();
        setStores(fetchedStores || []);
      } catch (error) {
        console.error("Error fetching stores:", error);
        setStores([]);
      } finally {
        setStoreLoading(false);
      }
    };
    fetchStores();
  }, []); // Dependency rỗng, chạy 1 lần

  // Sử dụng useCallback cho onFilterChange để nó ổn định
  const memoizedOnFilterChange = useCallback(onFilterChange, [onFilterChange]);

  useEffect(() => {
    if (!isMounted.current) {
      // Nếu chưa mount, đánh dấu là đã mount và không làm gì thêm ở lần render đầu tiên
      // Trừ khi bạn muốn filter ngay từ giá trị initialFilters
      // Nếu muốn filter ngay từ initialFilters, bỏ đoạn isMounted này và đảm bảo
      // ProductsPage xử lý được việc này mà không gây vòng lặp.
      // Hiện tại, logic ở ProductsPage fetch khi initialLoading=true nên có thể không cần check isMounted ở đây.
      // Tuy nhiên, để an toàn, vẫn giữ isMounted để tránh gọi onFilterChange không cần thiết
      // khi các giá trị filter ban đầu chưa thực sự thay đổi bởi người dùng.
      // Nếu initialFilters có giá trị, useEffect này SẼ chạy sau khi stores/categories load xong
      // và onFilterChange SẼ được gọi.
      isMounted.current = true;
      // Nếu có initialFilters và chúng không rỗng, bạn có thể muốn gọi onFilterChange ngay
      // if (initialFilters && (initialFilters.categories?.length || initialFilters.stores?.length || initialFilters.inStock)) {
      //     // Bỏ qua debounce cho lần đầu nếu muốn
      //     memoizedOnFilterChange({
      //         categories: selectedCategories,
      //         stores: selectedStores,
      //         inStock: inStock,
      //     });
      // }
      return; // Không làm gì ở lần đầu nếu không có initial filter đáng kể
    }

    // Xóa timeout cũ nếu có
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Đặt timeout mới
    debounceTimeoutRef.current = setTimeout(() => {
      const filtersToUpdate = {
        categories: selectedCategories,
        stores: selectedStores,
        inStock: inStock,
      };
      memoizedOnFilterChange(filtersToUpdate);
    }, 800); // Debounce 800ms

    // Cleanup function
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [selectedCategories, selectedStores, inStock, memoizedOnFilterChange]);
  // Bỏ initialFilters khỏi dependency của useEffect này, vì nó chỉ để khởi tạo.

  const handleCategoryChange = (checkedValues) => {
    setSelectedCategories(checkedValues);
  };

  const handleStoreChange = (checkedValues) => {
    setSelectedStores(checkedValues);
  };

  const handleStockChange = (e) => {
    setInStock(e.target.checked);
  };

  return (
    <Card
      className="product-filter-card"
      title={
        <Title level={4} style={{ marginBottom: 0 }}>
          Bộ lọc
        </Title>
      }
      bordered={false}
      style={{ background: 'transparent' }} // Nền trong suốt nếu ProductsPage đã có nền
    >
      <Collapse
        bordered={false}
        defaultActiveKey={["category", "store", "stock"]}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
        className="site-collapse-custom-collapse"
        ghost // Làm cho Panel trong suốt hơn
      >
        <Panel header={<Text strong>Danh mục</Text>} key="category">
          {categories && categories.length > 0 ? (
            <Checkbox.Group
              options={categories.map((cat) => ({
                label: cat.name,
                value: cat._id,
              }))}
              onChange={handleCategoryChange}
              value={selectedCategories}
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            />
          ) : (
            <Text type="secondary">Không có danh mục.</Text>
          )}
        </Panel>

        <Panel header={<Text strong>Cửa hàng</Text>} key="store">
          <Spin spinning={storeLoading} size="small">
            {stores && stores.length > 0 ? (
              <Checkbox.Group
                onChange={handleStoreChange}
                value={selectedStores}
                style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
              >
                {stores.map((store) => (
                  <Checkbox key={store._id} value={store._id}>
                    {/* Nếu có logo, bạn có thể thêm lại */}
                    {/* <img src={store.logo} alt={store.name} style={{ width: 20, marginRight: 8, verticalAlign: 'middle' }} /> */}
                    <Text>{store.name}</Text>
                  </Checkbox>
                ))}
              </Checkbox.Group>
            ) : (
              !storeLoading && <Text type="secondary">Không có cửa hàng.</Text>
            )}
          </Spin>
        </Panel>

        <Panel header={<Text strong>Tồn kho</Text>} key="stock">
          <Checkbox checked={inStock} onChange={handleStockChange}>
            Chỉ hiển thị sản phẩm còn hàng
          </Checkbox>
        </Panel>
      </Collapse>
    </Card>
  );
};

export default ProductFilter;