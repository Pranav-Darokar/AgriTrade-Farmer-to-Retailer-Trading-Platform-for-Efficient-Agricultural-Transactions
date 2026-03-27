import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/orders`;

const getAuthHeader = () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    return { Authorization: `Bearer ${user?.token}` };
};

const placeOrder = async (orderRequest) => {
    const response = await axios.post(API_URL, orderRequest, { headers: getAuthHeader() });
    return response.data;
};

const getMyOrders = async () => {
    const response = await axios.get(API_URL, { headers: getAuthHeader() });
    return response.data;
};

const getFarmerOrders = async () => {
    const response = await axios.get(`${API_URL}/farmer`, { headers: getAuthHeader() });
    return response.data;
};

const cancelOrder = async (orderId) => {
    const response = await axios.delete(`${API_URL}/${orderId}`, { headers: getAuthHeader() });
    return response.data;
};

const updateOrderStatus = async (orderId, status) => {
    const response = await axios.patch(`${API_URL}/${orderId}/status`, null, {
        params: { status },
        headers: getAuthHeader()
    });
    return response.data;
};

const getDashboardStats = async () => {
    const response = await axios.get(`${API_URL}/dashboard-stats`, { headers: getAuthHeader() });
    return response.data;
};

const createPaymentOrder = async (orderRequest) => {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/payments/create-order`, orderRequest, { headers: getAuthHeader() });
    return response.data;
};

const verifyPayment = async (verificationData) => {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/payments/verify-payment`, verificationData, { headers: getAuthHeader() });
    return response.data;
};

const submitOrderReview = async (orderId, reviewData) => {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/order-reviews/${orderId}`, reviewData, { headers: getAuthHeader() });
    return response.data;
};

const getOrderReview = async (orderId) => {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/order-reviews/${orderId}`, { headers: getAuthHeader() });
    return response.data;
};

const getFarmerProductReviews = async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/farmer/reviews`, { headers: getAuthHeader() });
    return response.data;
};

const getFarmerOrderReviews = async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/order-reviews/farmer`, { headers: getAuthHeader() });
    return response.data;
};

const getPublicFarmerProfile = async (farmerId) => {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/public/${farmerId}`);
    return response.data;
};

const getPublicFarmerProductReviews = async (farmerId) => {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/public/farmers/${farmerId}/reviews`);
    return response.data;
};

const getPublicFarmerOrderReviews = async (farmerId) => {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/order-reviews/public/farmer/${farmerId}`);
    return response.data;
};

const OrderService = {
    placeOrder,
    getMyOrders,
    getFarmerOrders,
    cancelOrder,
    updateOrderStatus,
    getDashboardStats,
    createPaymentOrder,
    verifyPayment,
    submitOrderReview,
    getOrderReview,
    getFarmerProductReviews,
    getFarmerOrderReviews,
    getPublicFarmerProfile,
    getPublicFarmerProductReviews,
    getPublicFarmerOrderReviews
};

export default OrderService;
