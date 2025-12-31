import axios from 'axios';
import { supabase } from '../services/supabase';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      await supabase.auth.signOut();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const readingsApi = {
  // Get readings for current user
  getAll: (params) => api.get('/readings/', { params }),
  
  // Get latest reading
  getLatest: () => api.get('/readings/latest/'),
  
  // Get readings for specific time range
  getByTimeRange: (startDate, endDate) => 
    api.get('/readings/range/', { params: { start_date: startDate, end_date: endDate } }),
  
  // Add new reading (for ESP32)
  create: (data) => api.post('/readings/', data),
};

export const controlApi = {
  // Fan control
  controlFan: (data) => api.post('/control/fan/', data),
  
  // LED control
  controlLED: (data) => api.post('/control/led/', data),
  
  // Get device status
  getStatus: () => api.get('/control/status/'),
  
  // Update device settings
  updateSettings: (data) => api.put('/control/settings/', data),
};

export const userApi = {
  // Get user profile
  getProfile: () => api.get('/users/profile/'),
  
  // Update user profile
  updateProfile: (data) => api.put('/users/profile/', data),
  
  // Get user devices
  getDevices: () => api.get('/users/devices/'),
  
  // Add new device
  addDevice: (data) => api.post('/users/devices/', data),
};

export const analyticsApi = {
  // Get daily consumption
  getDailyConsumption: (date) => 
    api.get('/analytics/daily/', { params: { date } }),
  
  // Get monthly summary
  getMonthlySummary: (year, month) => 
    api.get('/analytics/monthly/', { params: { year, month } }),
  
  // Get energy cost estimate
  getCostEstimate: (ratePerKwh) => 
    api.get('/analytics/cost/', { params: { rate_per_kwh: ratePerKwh } }),
  
  // Get peak usage times
  getPeakUsage: () => api.get('/analytics/peak-usage/'),
};

// Helper function to format API errors
export const formatApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    switch (status) {
      case 400:
        return data.detail || 'Bad request. Please check your input.';
      case 401:
        return 'Unauthorized. Please log in again.';
      case 403:
        return 'Access forbidden. You do not have permission.';
      case 404:
        return 'Resource not found.';
      case 409:
        return 'Conflict. Resource already exists.';
      case 422:
        return 'Validation error. Please check your input.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return data.detail || `Error ${status}: ${data.message || 'Unknown error'}`;
    }
  } else if (error.request) {
    // Request made but no response received
    return 'Network error. Please check your connection.';
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred.';
  }
};

// Helper function for real-time updates
export const createWebSocketConnection = (userId) => {
  const wsUrl = process.env.REACT_APP_WS_URL || 'ws://127.0.0.1:8000/ws';
  const socket = new WebSocket(`${wsUrl}/${userId}`);
  
  socket.onopen = () => {
    console.log('WebSocket connection established');
  };
  
  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
  
  return socket;
};

// Utility functions
export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return {
    time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    date: date.toLocaleDateString(),
    full: date.toLocaleString(),
    iso: date.toISOString(),
  };
};

export const calculateEnergy = (power, timeInHours) => {
  // power in watts, time in hours, result in kWh
  return (power * timeInHours) / 1000;
};

export const estimateCost = (energyKwh, ratePerKwh) => {
  return energyKwh * ratePerKwh;
};

export const generateMockData = (count = 50) => {
  const mockData = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now.getTime() - (count - i) * 2 * 60 * 1000); // Every 2 minutes
    const voltage = 5 + Math.random() * 0.5;
    const current = 0.1 + Math.random() * 0.5;
    const power = voltage * current;
    const temperature = 25 + Math.random() * 10;
    
    mockData.push({
      id: i + 1,
      timestamp: timestamp.toISOString(),
      voltage: parseFloat(voltage.toFixed(3)),
      current: parseFloat(current.toFixed(3)),
      power: parseFloat(power.toFixed(3)),
      temperature: parseFloat(temperature.toFixed(1)),
      source: 'ESP32_Sensor',
      user_id: 'mock-user-id',
    });
  }
  
  return mockData;
};

export default api;