import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

export const getDrrmDashboard = () => API.get('/dashboard/drrm');
export const getEngineerDashboard = () => API.get('/dashboard/engineer');
export const getExecutiveDashboard = () => API.get('/dashboard/executive');

export default API;