import fetchUtils from "../utils/fetchUtils";

const ProductService = {
  /**
   * Fetches a list of products with optional filters.
   * @param {object} filters - An object containing filter criteria (search, category, store, priceRange, inStock, sort, page, pageSize).
   * @returns {Promise<object>} A promise that resolves with the API response data (expected to contain { products: [...], total: N }).
   */
  getProducts: async (filters = {}) => {
    try {
      // Construct query parameters from filters object
      const queryParams = new URLSearchParams();
      for (const key in filters) {
        if (filters[key] !== undefined && filters[key] !== "") {
          if (Array.isArray(filters[key])) {
            filters[key].forEach((item) => queryParams.append(key, item));
          } else {
            queryParams.append(key, filters[key]);
          }
        }
      }

      const response = await fetchUtils.get(
        `/products?${queryParams.toString()}`
      );

      // Return response.data directly on success, handle errors
      if (response.status === 200) {
        return response.data;
      } else {
        console.error("Error fetching products:", response.statusText);
        // Return default empty structure on error
        return { products: [], total: 0 };
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      // Return default empty structure on exception
      return { products: [], total: 0 };
    }
  },

  /**
   * Fetches details of a specific product by ID.
   * @param {string} productId - The ID of the product to fetch.
   * @returns {Promise<object|null>} A promise that resolves with the product data or null if not found/error.
   */
  getProductById: async (productId) => {
    try {
      const response = await fetchUtils.get(`/products/${productId}`);

      // Return response.data directly on success, handle errors
      if (response.status === 200) {
        return response.data;
      } else if (response.status === 404) {
        // Handle 404 specifically if needed
        console.warn(`Product with ID ${productId} not found.`);
        return null;
      } else {
        console.error("Error fetching product by ID:", response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      return null;
    }
  },

  // Add other product-related API calls (create, update, delete) here if needed
};

export default ProductService;
