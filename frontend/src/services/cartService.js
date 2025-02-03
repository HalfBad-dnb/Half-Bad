const API_URL = 'http://localhost:8080/cart';  // Adjust to your backend URL

export const getCartItems = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/getCartItems/${userId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching cart items:", error);
        return [];
    }
};

export const addCartItem = async (userId, productId, quantity) => {
    try {
        const response = await fetch(`${API_URL}/add/${userId}/${productId}/${quantity}`, {
            method: 'POST',
        });
        return await response.json();
    } catch (error) {
        console.error("Error adding cart item:", error);
    }
};

export const removeCartItem = async (userId, productId, quantity) => {
    try {
        const response = await fetch(`${API_URL}/remove/${userId}/${productId}/${quantity}`, {
            method: 'DELETE',
        });
        return await response.json();
    } catch (error) {
        console.error("Error removing cart item:", error);
        return false;
    }
};

export const getCartTotal = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/total/${userId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching cart total:", error);
        return 0;
    }
};
