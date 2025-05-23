import fetchUtils from "../utils/fetchUtils";

const CategoryService = {
  getAllCategories: async () => {
    try {
      // Assuming fetchUtils.get throws an error on non-2xx responses
      // and directly returns the data payload (the array of categories) on success.
      const data = await fetchUtils.get("/categories", false); // Assuming the API endpoint is /api/categories, false for public
      // Based on the network tab, the data is likely the array itself.
      return data; // Return the data directly
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Depending on how fetchUtils handles errors, you might want to
      // inspect the error object to get more details.
      return []; // Return empty array in case of error
    }
  },
  // Add other category-related API calls here if needed
};

export default CategoryService;
