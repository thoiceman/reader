import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { message } from 'antd';

// API 基础配置
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// 创建 axios 实例
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config: any) => {
    // 添加认证令牌
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // 处理通用错误
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // 未授权，清除本地存储并跳转到登录页
          localStorage.removeItem('authToken');
          localStorage.removeItem('userInfo');
          window.location.href = '/login';
          message.error('登录已过期，请重新登录');
          break;
        case 403:
          message.error('没有权限访问此资源');
          break;
        case 404:
          message.error('请求的资源不存在');
          break;
        case 500:
          message.error('服务器内部错误');
          break;
        default:
          // 显示后端返回的错误信息
          const errorMessage = (data as any)?.message || '请求失败';
          message.error(errorMessage);
      }
    } else if (error.request) {
      // 网络错误
      message.error('网络连接失败，请检查网络设置');
    } else {
      // 其他错误
      message.error('请求发生错误');
    }
    
    return Promise.reject(error);
  }
);

// API 响应类型定义
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// 通用 API 请求方法
export const api = {
  get: <T = any>(url: string, params?: any): Promise<AxiosResponse<T>> => {
    return apiClient.get(url, { params });
  },
  
  post: <T = any>(url: string, data?: any): Promise<AxiosResponse<T>> => {
    return apiClient.post(url, data);
  },
  
  put: <T = any>(url: string, data?: any): Promise<AxiosResponse<T>> => {
    return apiClient.put(url, data);
  },
  
  delete: <T = any>(url: string): Promise<AxiosResponse<T>> => {
    return apiClient.delete(url);
  },
};

export default apiClient;