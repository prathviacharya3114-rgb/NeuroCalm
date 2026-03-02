import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

export const analyzeStress = async (data) => {
    const response = await api.post('/stress/analyze', data);
    return response.data;
};

export const saveSession = async (sessionData) => {
    const response = await api.post('/sessions', sessionData);
    return response.data;
};

export const getSessions = async () => {
    const response = await api.get('/sessions');
    return response.data;
};
