import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Incident Simulation & Decision Intelligence
export const processIncident = (payload) => API.post('/incidents/process', payload);

// Data Retrieval Endpoints
export const getTelecomSites = () => API.get('/sites');
export const getSiteStatuses = () => API.get('/site-statuses');
export const getScoreResults = () => API.get('/score-results');

export default API;