import React, { useState, useEffect, useCallback } from "react";
import ProductFilter from "../../components/productComponent/ProductFilter";
import ProductList from "../../components/productComponent/products/ProductList";
import ProductSearch from "../../components/productComponent/ProductSearch";
import ProductSort from "../../components/productComponent/ProductSort";
import fetchUtils from "../../utils/fetchUtils";
import {
  Space,
  Input,
  Select,
  Pagination,
  Empty,
  Spin,
  Typography,
} from "antd";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import banner1 from "../../assets/banner1.jpeg";
import banner2 from "../../assets/banner2.jpeg";
import banner3 from "../../assets/banner3.jpeg";
import banner4 from "../../assets/banner4.jpeg";
import FlashSaleBar from "./FlashSaleBar";

const { Title } = Typography;

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [filteringLoading, setFilteringLoading] = useState(false);
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

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const data = await fetchUtils.get("/categories", false);
        setCategories(data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategories([]);
      }
    };
    fetchCategoriesData();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (initialLoading) {
      } else {
        setFilteringLoading(true);
      }
      setError(null);

      try {
        const queryParams = new URLSearchParams();
        if (filters.search) {
          queryParams.append("search", filters.search);
        }
        queryParams.append("sort", filters.sort);
        if (filters.categories && filters.categories.length > 0) {
          queryParams.append("categories", filters.categories.join(","));
        }
        if (filters.stores && filters.stores.length > 0) {
          queryParams.append("stores", filters.stores.join(","));
        }
        if (filters.inStock) {
          queryParams.append("inStock", String(filters.inStock));
        }
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
  }, [filters, pagination.current, pagination.pageSize, initialLoading]);

  const handleFilterChange = useCallback((childFilters) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...childFilters }));
    setPagination((prevPagination) => ({ ...prevPagination, current: 1 }));
  }, []);

  const handleSearch = useCallback((value) => {
    setFilters((prevFilters) => ({ ...prevFilters, search: value.trim() }));
    setPagination((prevPagination) => ({ ...prevPagination, current: 1 }));
  }, []);

  const handleSort = useCallback((value) => {
    setFilters((prevFilters) => ({ ...prevFilters, sort: value }));
    setPagination((prevPagination) => ({ ...prevPagination, current: 1 }));
  }, []);

  const handlePaginationChange = useCallback((page, pageSize) => {
    setPagination({ current: page, pageSize });
  }, []);

  if (initialLoading && categories.length === 0) {
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

  const bannerImages = [banner1, banner2, banner3, banner4];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="products-page-container">
      <div className="product-banner-slider">
        <Slider {...settings}>
          {bannerImages.map((image, index) => (
            <div key={index}>
              <img src={image} alt={`Banner ${index + 1}`} />
            </div>
          ))}
        </Slider>
      </div>
      <FlashSaleBar
       
      />
      <div
        style={{
          display: "flex",
          padding: "24px",
          gap: "24px",
          maxWidth: "1300px",
          margin: "0 auto",
          alignItems: "flex-start",
          minHeight: "80vh",
          background: "#fff",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <div
          className="filter-sidebar-container"
          style={{
            width: 280,
            alignSelf: "flex-start",
            position: "sticky",
            top: 72,
            zIndex: 10,
            maxHeight: "calc(100vh - 100px)",
            overflowY: "auto",
          }}
        >
          <ProductFilter
            onFilterChange={handleFilterChange}
            categories={categories}
            initialFilters={{
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
                enterButton={
                  <button
                    style={{
                      backgroundColor: "#C31E29",
                      color: "white",
                      border: "none",
                      padding: "0 16px",
                      borderRadius: "4px",
                      height: "32px",
                      cursor: "pointer",
                    }}
                  >
                    Tìm
                  </button>
                }
                onSearch={handleSearch}
                style={{ width: 300 }}
                defaultValue={filters.search}
              />

              <Select
                defaultValue={filters.sort}
                style={{ width: 180 }}
                onChange={handleSort}
                options={[
                  { value: "newest", label: "Mới nhất" },
                  { value: "price_asc", label: "Giá: Thấp đến Cao" },
                  { value: "price_desc", label: "Giá: Cao đến Thấp" },
                ]}
              />
            </Space>
            <Typography.Text type="secondary">
              {totalProducts > 0
                ? `Tìm thấy ${totalProducts} sản phẩm`
                : "Không có sản phẩm"}
            </Typography.Text>
          </div>
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
          {totalProducts > 0 && !filteringLoading && (
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
                onShowSizeChange={handlePaginationChange}
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
