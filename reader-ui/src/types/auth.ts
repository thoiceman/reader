// 用户认证相关的类型定义

// 用户信息接口
export interface User {
  id: number;
  username: string;
  name: string;
  email?: string;
  book_preferences: string;
  is_default_password: boolean;
  created_at: string;
}

// 注册表单数据接口
export interface RegisterFormData {
  username: string;
  name: string;
  email?: string;
  password: string;
  confirmPassword: string;
  book_preferences?: string;
}

// 登录表单数据接口
export interface LoginFormData {
  username: string;
  password: string;
  rememberMe?: boolean;
}

// 认证响应接口
export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

// 表单验证错误接口
export interface FormErrors {
  [key: string]: string;
}

// 认证状态接口
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// 密码重置表单数据接口
export interface ForgotPasswordFormData {
  email: string;
}

// 密码重置响应接口
export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}