import { api } from './api';
import { LoginFormData, RegisterFormData, AuthResponse, User } from '../types/auth';

// 定义API响应接口
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// 认证服务类
export class AuthService {
  // 用户登录
  static async login(loginData: LoginFormData): Promise<AuthResponse> {
    try {
      // 转换前端表单数据为后端API格式
      const apiData = {
        username: loginData.username,
        password: loginData.password
      };
      
      const response = await api.post<ApiResponse<{ user: any; token: string }>>('/users/login', apiData);
      
      if (response.data.success && response.data.data) {
         const { user, token } = response.data.data;
         
         // 存储认证令牌和用户信息
         localStorage.setItem('authToken', token);
         if (user) {
           localStorage.setItem('userInfo', JSON.stringify(user));
         }
        
        // 处理记住我功能
        if (loginData.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('rememberMe');
        }
        
        return {
          success: true,
          message: response.data.message || '登录成功',
          user,
          token
        };
      } else {
        return {
          success: false,
          message: response.data.message || '登录失败'
        };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.response) {
        // 服务器返回了错误响应
        const status = error.response.status;
        const message = error.response.data?.message || '登录失败';
        
        if (status === 401) {
          return { success: false, message: '用户名或密码错误' };
        } else if (status === 404) {
          return { success: false, message: '用户不存在' };
        } else if (status === 422) {
          return { success: false, message: '请求参数错误' };
        } else if (status >= 500) {
          return { success: false, message: '服务器错误，请稍后重试' };
        }
        
        return { success: false, message };
      } else if (error.request) {
        // 请求已发出但没有收到响应
        return { success: false, message: '网络连接超时，请检查网络设置' };
      } else {
        // 其他错误
        return { success: false, message: '登录失败，请稍后重试' };
      }
    }
  }
  
  // 用户注册
  static async register(registerData: RegisterFormData): Promise<AuthResponse> {
    try {
      // 转换前端表单数据为后端API格式
      const apiData = {
        username: registerData.username,
        email: registerData.email,
        password: registerData.password,
        name: registerData.username // 使用用户名作为姓名的默认值
      };
      
      const response = await api.post<ApiResponse<{ user: any; token: string }>>('/users/register', apiData);
      
      if (response.data.success && response.data.data) {
        const { user, token } = response.data.data;
        
        return {
          success: true,
          message: response.data.message || '注册成功',
          user,
          token
        };
      } else {
        return {
          success: false,
          message: response.data.message || '注册失败'
        };
      }
    } catch (error: any) {
      console.error('Register error:', error);
      
      if (error.response) {
        // 服务器返回了错误响应
        const status = error.response.status;
        const message = error.response.data?.message || '注册失败';
        
        if (status === 409) {
          return { success: false, message: '用户名或邮箱已存在' };
        } else if (status === 422) {
          return { success: false, message: '请求参数错误，请检查输入信息' };
        } else if (status === 400) {
          return { success: false, message: '请求格式错误' };
        } else if (status >= 500) {
          return { success: false, message: '服务器错误，请稍后重试' };
        }
        
        return { success: false, message };
      } else if (error.request) {
        // 请求已发出但没有收到响应
        return { success: false, message: '网络连接超时，请检查网络设置' };
      } else {
        // 其他错误
        return { success: false, message: '注册失败，请稍后重试' };
      }
    }
  }
  
  // 用户退出登录
  // 用户退出登录
  static async logout(): Promise<{ success: boolean; message: string }> {
    try {
      const token = this.getToken();
      
      // 如果有令牌，调用后端退出登录接口
      if (token) {
        try {
          const response = await api.post<ApiResponse>('/users/logout');
          
          // 无论后端调用是否成功，都清除本地存储
          localStorage.removeItem('authToken');
          localStorage.removeItem('userInfo');
          localStorage.removeItem('rememberMe');
          
          return {
            success: true,
            message: response.data.message || '退出登录成功'
          };
        } catch (error: any) {
          // 即使后端调用失败，也要清除本地存储
          localStorage.removeItem('authToken');
          localStorage.removeItem('userInfo');
          localStorage.removeItem('rememberMe');
          
          console.warn('后端退出登录失败，但已清除本地存储:', error);
          return {
            success: true,
            message: '退出登录成功'
          };
        }
      } else {
        // 没有令牌，直接清除本地存储
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('rememberMe');
        
        return {
          success: true,
          message: '退出登录成功'
        };
      }
    } catch (error: any) {
      // 确保即使发生意外错误也要清除本地存储
      localStorage.removeItem('authToken');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('rememberMe');
      
      console.error('退出登录过程中发生错误:', error);
      return {
        success: true,
        message: '退出登录成功'
      };
    }
  }

  // 全局退出登录（从所有设备退出）
  static async logoutAllDevices(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post<ApiResponse>('/users/logout-all');
      
      // 清除本地存储
      localStorage.removeItem('authToken');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('rememberMe');
      
      return {
        success: response.data.success,
        message: response.data.message || '已从所有设备退出登录'
      };
    } catch (error: any) {
      // 即使后端调用失败，也要清除本地存储
      localStorage.removeItem('authToken');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('rememberMe');
      
      return {
        success: false,
        message: error.response?.data?.message || '退出登录失败'
      };
    }
  }
  
  // 检查用户是否已登录
  static isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  }
  
  // 获取当前用户信息
  static getCurrentUser(): User | null {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        return JSON.parse(userInfo);
      } catch (error) {
        console.error('解析用户信息失败:', error);
        return null;
      }
    }
    return null;
  }
  
  // 获取认证令牌
  static getToken(): string | null {
    return localStorage.getItem('authToken');
  }
  
  // 刷新用户信息
  static async refreshUserInfo(): Promise<User | null> {
    try {
      const response = await api.get<{ user: User }>('/users/me');
      if (response.data.user) {
        localStorage.setItem('userInfo', JSON.stringify(response.data.user));
        return response.data.user;
      }
      return null;
    } catch (error) {
      console.error('刷新用户信息失败:', error);
      return null;
    }
  }
}

export default AuthService;