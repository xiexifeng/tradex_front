import axios from 'axios';
import { showToast } from 'vant';
import router from '@/router';
import { API_CONFIG } from '@/config';

// 创建 axios 实例
const request = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
});

// 请求拦截器
request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 如果是文件上传，不修改 Content-Type
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  response => {
    const res = response.data;
    if (!res.success) {
      showToast(res.desc || '请求失败');
      return Promise.reject(new Error(res.desc || '请求失败'));
    }
    return res;
  },
  error => {
    if (error.response?.status === 401) {
      // token 过期或无效
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      router.push('/login');
    }
    showToast(error.message || '请求失败');
    return Promise.reject(error);
  }
);

export default request;