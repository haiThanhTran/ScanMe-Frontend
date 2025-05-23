import React from "react";

const ProductSort = () => {
  return (
    <div className="product-sort">
      <label htmlFor="sort">Sort by:</label>
      <select id="sort">
        <option value="">Default</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="newest">Newest</option>
      </select>
    </div>
  );
};

export default ProductSort;
