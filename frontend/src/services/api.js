import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 seconds for safety checks
});

/**
 * Shorten a URL with safety checks.
 */
export const shortenUrl = async (originalUrl, customSlug) => {
    const response = await api.post('/shorten', {
        originalUrl,
        customSlug,
    });
    return response.data;
};

/**
 * Generate a QR code for a given URL.
 */
export const generateQrCode = async (url) => {
    const response = await api.post('/qr', { url });
    return response.data;
};

/**
 * Get all shortened URLs for dashboard.
 */
export const getAllUrls = async () => {
    const response = await api.get('/urls');
    return response.data;
};

/**
 * Delete a shortened URL by ID.
 */
export const deleteUrl = async (id) => {
    const response = await api.delete(`/urls/${id}`);
    return response.data;
};

export default api;
