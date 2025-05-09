const API_URL = 'http://localhost:9999/api';

const headers = {
    'Content-Type': 'application/json',
};

const getAuthHeaders = (token) => ({
    ...headers,
    'Authorization': `Bearer ${token}`,
});

const apiConfig = {
    baseUrl: API_URL,
    headers,
    getAuthHeaders,
};

export default apiConfig;
