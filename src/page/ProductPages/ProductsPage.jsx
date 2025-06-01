import React, { useState, useEffect, useCallback } from "react";
import ProductFilter from "../../components/productComponent/ProductFilter";
import ProductList from "../../components/productComponent/products/ProductList";
import ProductSearch from "../../components/productComponent/ProductSearch"; // Bạn có component này, hãy đảm bảo nó được tích hợp đúng
import ProductSort from "../../components/productComponent/ProductSort"; // Bạn có component này, hãy đảm bảo nó được tích hợp đúng
import fetchUtils from "../../utils/fetchUtils";
import "../../static/css/styles.css";
import {
  Space,
  Input,
  Select,
  Pagination,
  Empty,
  Spin,
  Typography,
} from "antd";

const { Title } = Typography;

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true); // Loading cho lần tải đầu tiên
  const [filteringLoading, setFilteringLoading] = useState(false); // Loading khi filter/search/sort/paginate
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    sort: "newest",
    categories: [],
    stores: [],
    inStock: false,
  });
  const [pagination, setPagination] = useState({ current: 1, pageSize: 12 });
  const [totalProducts, setTotalProducts] = useState(0);
  const [categories, setCategories] = useState([]);

  // 1. Fetch categories một lần khi component mount
  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const data = await fetchUtils.get("/categories", false);
        console.log("data", data);
        setCategories(data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategories([]); // Đảm bảo categories là mảng nếu có lỗi
      }
    };
    fetchCategoriesData();
  }, []); // Mảng dependency rỗng để chạy 1 lần

  // 2. Fetch products khi filters hoặc pagination thay đổi
  useEffect(() => {
    const fetchProducts = async () => {
      if (initialLoading) {
        // Nếu là lần tải đầu, không set filteringLoading
        // setInitialLoading(true) đã được set ở trên
      } else {
        setFilteringLoading(true); // Bật loading khi filter/search/sort/paginate
      }
      setError(null); // Reset error trước mỗi lần fetch

      try {
        const queryParams = new URLSearchParams();

        // Thêm search nếu có
        if (filters.search) {
          queryParams.append("search", filters.search);
        }
        // Thêm sort
        queryParams.append("sort", filters.sort);

        // Thêm categories nếu có và không rỗng
        if (filters.categories && filters.categories.length > 0) {
          queryParams.append("categories", filters.categories.join(","));
        }
        // Thêm stores nếu có và không rỗng
        if (filters.stores && filters.stores.length > 0) {
          queryParams.append("stores", filters.stores.join(","));
        }
        // Thêm inStock nếu true
        if (filters.inStock) {
          queryParams.append("inStock", String(filters.inStock));
        }
        // Thêm pagination
        queryParams.append("page", String(pagination.current));
        queryParams.append("limit", String(pagination.pageSize));

        const data = await fetchUtils.get(
          `/products?${queryParams.toString()}`,
          false
        );
        setProducts(data.products || []);
        setTotalProducts(data.pagination?.total || 0);
      } catch (err) {
        setError(err);
        setProducts([]);
        setTotalProducts(0);
      } finally {
        if (initialLoading) setInitialLoading(false);
        setFilteringLoading(false);
      }
    };

    fetchProducts();
  }, [filters, pagination.current, pagination.pageSize, initialLoading]); // Thêm initialLoading để fetch lần đầu

  const handleFilterChange = useCallback((childFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...childFilters,
    }));
    setPagination((prevPagination) => ({ ...prevPagination, current: 1 }));
  }, []);

  const handleSearch = useCallback((value) => {
    setFilters((prevFilters) => ({ ...prevFilters, search: value.trim() }));
    setPagination((prevPagination) => ({ ...prevPagination, current: 1 }));
  }, []);

  const handleSort = useCallback((value) => {
    setFilters((prevFilters) => ({ ...prevFilters, sort: value }));
    // Pagination không cần reset khi sort nếu đang ở trang 1, nhưng để đơn giản cứ reset
    setPagination((prevPagination) => ({ ...prevPagination, current: 1 }));
  }, []);

  const handlePaginationChange = useCallback((page, pageSize) => {
    setPagination({ current: page, pageSize: pageSize });
  }, []);

  if (initialLoading && categories.length === 0) {
    // Chỉ hiển thị loading toàn trang khi categories chưa load xong
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Spin size="large" tip="Đang tải dữ liệu trang..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        <Title level={3} type="danger">
          Lỗi tải sản phẩm
        </Title>
        <p>{error.message || "Đã có lỗi xảy ra. Vui lòng thử lại sau."}</p>
      </div>
    );
  }

  return (
    <div className="products-page-container">
      <div
        style={{
          display: "flex",
          padding: "24px",
          gap: "24px", // Tăng gap
          maxWidth: "1300px", // Tăng max width
          margin: "50px auto",
          alignItems: "flex-start",
          minHeight: "80vh",
          background: "#fff",
          borderRadius: "8px", // Thêm border radius
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)", // Thêm box shadow
        }}
      >
        <div
          className="filter-sidebar-container"
          style={{
            width: 280,
            // marginRight: 0, // Bỏ vì đã có gap ở container cha
            alignSelf: "flex-start",
            position: "sticky",
            top: 64, // Giả sử header cao 72px, thanh controls dính dưới header cũng top 72px
            zIndex: 10,
            maxHeight: "calc(100vh - 100px)", // Chiều cao tối đa, 100px là tổng của top và padding bottom (nếu có)
            overflowY: "auto",
          }}
        >
          <ProductFilter
            onFilterChange={handleFilterChange}
            categories={categories} // Truyền categories đã fetch
            initialFilters={{
              // Truyền giá trị filter ban đầu nếu cần
              categories: filters.categories,
              stores: filters.stores,
              inStock: filters.inStock,
            }}
          />
        </div>
        <div
          className="product-list-area"
          style={{ flex: 1, position: "relative" }}
        >
          {" "}
          {/* Thêm position relative cho Spin */}
          <div
            className="product-controls"
            style={{
              width: "100%",
              marginBottom: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: "16px",
              borderBottom: "1px solid #f0f0f0",
              top: 72,
              zIndex: 9,
              background: "#fff",
              padding: "16px 0",
            }}
          >
            <Space>
              <Input.Search
                placeholder="Tìm kiếm sản phẩm..."
                allowClear
                enterButton
                onSearch={handleSearch}
                style={{ width: 300 }}
                defaultValue={filters.search}
                className="ecommerce-search-input"
              />
              <Select
                defaultValue={filters.sort}
                style={{ width: 180 }} // Rộng hơn một chút
                onChange={handleSort}
                options={[
                  { value: "newest", label: "Mới nhất" },
                  { value: "price_asc", label: "Giá: Thấp đến Cao" },
                  { value: "price_desc", label: "Giá: Cao đến Thấp" },
                  // { value: "name_asc", label: "Tên: A-Z" }, // Ví dụ thêm sort theo tên
                  // { value: "name_desc", label: "Tên: Z-A" },
                ]}
              />
            </Space>
            {/* Hiển thị số lượng sản phẩm */}
            <Typography.Text type="secondary">
              {totalProducts > 0
                ? `Tìm thấy ${totalProducts} sản phẩm`
                : "Không có sản phẩm"}
            </Typography.Text>
          </div>
          {/* Spin bao bọc ProductList và Empty */}
          <Spin
            spinning={filteringLoading && !initialLoading}
            tip="Đang cập nhật sản phẩm..."
          >
            {products.length > 0 ? (
              <ProductList products={products} />
            ) : (
              !initialLoading &&
              !filteringLoading && (
                <Empty description="Không có sản phẩm nào phù hợp với lựa chọn của bạn." />
              )
            )}
          </Spin>
          {totalProducts > 0 &&
            !filteringLoading && ( // Chỉ hiển thị pagination khi có sản phẩm và không đang loading
              <div
                style={{
                  textAlign: "right",
                  marginTop: "24px",
                  padding: "16px 0",
                  borderTop: "1px solid #f0f0f0",
                }}
              >
                <Pagination
                  current={pagination.current}
                  pageSize={pagination.pageSize}
                  total={totalProducts}
                  onChange={handlePaginationChange}
                  showSizeChanger
                  onShowSizeChange={handlePaginationChange} // Quan trọng: dùng cùng handler cho cả page và pageSize
                  pageSizeOptions={["12", "16", "20", "24"]}
                  showTotal={(total, range) =>
                    `${range[0]}-${range[1]} của ${total} sản phẩm`
                  }
                />
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
