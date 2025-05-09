import apiConfig from "../configs/apiConfig.jsx";

/**
 * Gets the authentication token from localStorage
 * @returns {string|null} The authentication token or null if not found
 * @throws {Error} If the token is not found
 */
const getAuthToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/403";
    throw new Error("Đã hết hạn đăng nhập !!!");
  }
  return token;
};

/**
 * Makes an authenticated API request
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {Object} [body] - Request body (optional)
 * @param {boolean} [requiresAuth=true] - Whether the request requires authentication
 * @returns {Promise<any>} - Response data
 */
const fetchApi = async (endpoint, method, body, requiresAuth = true) => {
  try {
    const url = `${apiConfig.baseUrl}${endpoint}`;
    const options = {
      method,
      headers: requiresAuth
        ? apiConfig.getAuthHeaders(getAuthToken())
        : apiConfig.headers,
    };

    if (body && (method === "POST" || method === "PUT")) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Đã xảy ra lỗi");
    }

    return data;
  } catch (error) {
    throw new Error(error.message || "Đã xảy ra lỗi");
  }
};

/**
 * GET request wrapper
 * @param {string} endpoint - API endpoint
 * @param {boolean} [requiresAuth=true] - Whether the request requires authentication
 */
const get = (endpoint, requiresAuth = true) =>
  fetchApi(endpoint, "GET", null, requiresAuth);

/**
 * POST request wrapper
 * @param {string} endpoint - API endpoint
 * @param {Object} body - Request body
 * @param {boolean} [requiresAuth=true] - Whether the request requires authentication
 */
const post = (endpoint, body, requiresAuth = true) =>
  fetchApi(endpoint, "POST", body, requiresAuth);

/**
 * PUT request wrapper
 * @param {string} endpoint - API endpoint
 * @param {Object} body - Request body
 * @param {boolean} [requiresAuth=true] - Whether the request requires authentication
 */
const put = (endpoint, body, requiresAuth = true) =>
  fetchApi(endpoint, "PUT", body, requiresAuth);

/**
 * DELETE request wrapper
 * @param {string} endpoint - API endpoint
 * @param {boolean} [requiresAuth=true] - Whether the request requires authentication
 */
const remove = (endpoint, requiresAuth = true) =>
  fetchApi(endpoint, "DELETE", null, requiresAuth);

const fetchUtils = {
  getAuthToken,
  fetchApi,
  get,
  post,
  put,
  remove,
};

export default fetchUtils;
