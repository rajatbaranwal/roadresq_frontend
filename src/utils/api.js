// src/utils/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5050/api',
  withCredentials: true, // optional if not using cookies
});

export default API;
