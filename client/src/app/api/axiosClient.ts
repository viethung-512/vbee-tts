import axios from 'axios';
import queryString from 'query-string';

const baseURL = process.env.REACT_APP_BASE_API_URL;

console.log({ baseURL });

const axiosClient = axios.create({
  baseURL: baseURL,
  headers: {
    'content-type': 'application/json',
  },
  paramsSerializer: params => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async config => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  response => {
    if (response && response.data) {
      return response.data;
    }

    return response;
  },
  error => {
    // Handle errors
    if (error && error.response.data && error.response.data.errors) {
      throw error.response.data.errors;
    }
    throw error;
  }
);

export default axiosClient;
