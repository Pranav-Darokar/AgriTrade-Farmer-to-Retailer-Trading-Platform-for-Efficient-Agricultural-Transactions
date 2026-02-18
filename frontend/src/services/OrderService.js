import axios from 'axios';

const API_URL = 'http://localhost:8080/api/orders';

const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
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

const OrderService = {
    placeOrder,
    getMyOrders,
    getFarmerOrders
};

export default OrderService;
