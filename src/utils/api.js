// src/utils/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://roadresq-backkend.onrender.com/api',
  withCredentials: true, // optional if not using cookies
});

export default API;
