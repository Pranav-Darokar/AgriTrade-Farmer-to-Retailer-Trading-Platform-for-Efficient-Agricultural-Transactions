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

const OrderService = {
    placeOrder,
    getMyOrders,
    getFarmerOrders,
    cancelOrder,
    updateOrderStatus,
    getDashboardStats,
    createPaymentOrder,
    verifyPayment
};

export default OrderService;
