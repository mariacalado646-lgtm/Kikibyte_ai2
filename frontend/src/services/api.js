import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', // Points to your Django backend API
    timeout: 5000,                          // Timeout after 5 seconds
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

export default api;
