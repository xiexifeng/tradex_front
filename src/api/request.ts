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
      config.headers.Authorization = `${token}`;
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
    let errorMessage = '请求失败';
    const shouldReject = true;
    
    try {
      // 处理 HTTP 错误响应
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.desc || error.response.data?.message;
        
        switch (status) {
          case 401:
            // token 过期或无效
            localStorage.removeItem('token');
            localStorage.removeItem('userInfo');
            errorMessage = '登录已过期，请重新登录';
            showToast(errorMessage);
            router.push('/login');
            break;
          case 403:
            errorMessage = message || '没有权限访问';
            showToast(errorMessage);
            break;
          case 404:
            errorMessage = message || '请求的资源不存在';
            showToast(errorMessage);
            break;
          case 500:
          case 502:
          case 503:
          case 504:
            errorMessage = message || '服务器错误，请稍后重试';
            showToast(errorMessage);
            break;
          default:
            errorMessage = message || `请求失败 (${status})`;
            showToast(errorMessage);
        }
      }
      // 处理网络错误
      else if (error.request) {
        if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
          errorMessage = '请求超时，请检查网络连接';
        } else {
          errorMessage = '网络错误，请检查网络连接';
        }
        showToast(errorMessage);
      }
      // 其他错误
      else {
        errorMessage = error.message || '请求失败';
        showToast(errorMessage);
      }
    } catch (toastError) {
      // 如果 showToast 失败，至少记录到控制台
      console.error('显示错误提示失败:', toastError);
      console.error('原始错误:', error);
    }
    
    // 返回一个被拒绝的 Promise，但确保错误信息是安全的
    return Promise.reject(new Error(errorMessage));
  }
);

export default request;