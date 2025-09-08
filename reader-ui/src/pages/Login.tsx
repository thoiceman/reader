import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Row,
  Col,
  Space,
  Divider,
  Checkbox,
  message,
  theme
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone
} from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LoginFormData } from '../types/auth';
import { AuthService } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoginLoading } = useAuth();
  
  // 获取重定向路径
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (values: LoginFormData) => {
    setLoading(true);
    try {
      const result = await AuthService.login(values);
      
      if (result.success && result.user && result.token) {
        // 更新认证上下文
        login(result.token, result.user);
        message.success(result.message || '登录成功！');
        // 重定向到之前访问的页面或首页
        navigate(from, { replace: true });
      } else {
        message.error(result.message || '登录失败');
      }
    } catch (error) {
      message.error('登录失败，请稍后重试。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${token.colorPrimary}15 0%, ${token.colorPrimaryBg} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <Row justify="center" style={{ width: '100%', maxWidth: '1200px' }}>
        <Col xs={24} sm={20} md={16} lg={12} xl={10}>
          <Card
            style={{
              boxShadow: token.boxShadowTertiary,
              borderRadius: token.borderRadiusLG,
              border: `1px solid ${token.colorBorderSecondary}`
            }}
            styles={{
              body: { padding: '40px 32px' }
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <Title level={2} style={{ color: token.colorText, marginBottom: '8px' }}>
                欢迎回来
              </Title>
              <Text type="secondary" style={{ fontSize: '16px' }}>
                登录您的账户继续阅读
              </Text>
            </div>

            <Form
              form={form}
              name="login"
              onFinish={handleSubmit}
              layout="vertical"
              size="large"
              requiredMark={false}
              initialValues={{ rememberMe: false }}
            >
              <Form.Item
                name="username"
                label="用户名"
                rules={[
                  { required: true, message: '请输入用户名！' },
                  { min: 3, message: '用户名至少3个字符！' }
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="用户名"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="密码"
                rules={[
                  { required: true, message: '请输入密码' },
                  { min: 6, message: '密码至少6个字符' }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: token.colorTextTertiary }} />}
                  placeholder="请输入密码"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  style={{ borderRadius: token.borderRadius }}
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: '24px' }}>
                <Row justify="space-between" align="middle">
                  <Col>
                    <Form.Item name="rememberMe" valuePropName="checked" noStyle>
                      <Checkbox style={{ color: token.colorText }}>
                        记住我
                      </Checkbox>
                    </Form.Item>
                  </Col>
                  <Col>
                    <Link
                      to="/forgot-password"
                      style={{
                        color: token.colorPrimary,
                        textDecoration: 'none',
                        fontSize: '14px'
                      }}
                    >
                      忘记密码？
                    </Link>
                  </Col>
                </Row>
              </Form.Item>

              <Form.Item style={{ marginBottom: '16px' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading || isLoginLoading}
                  block
                  style={{
                    height: '48px',
                    borderRadius: token.borderRadius,
                    fontSize: '16px',
                    fontWeight: 500
                  }}
                >
                  {(loading || isLoginLoading) ? '登录中...' : '登录'}
                </Button>
              </Form.Item>

              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <Space direction="vertical" size="small">
                  <Button
                    type="default"
                    block
                    style={{
                      height: '48px',
                      borderRadius: token.borderRadius,
                      fontSize: '16px',
                      borderColor: token.colorBorder
                    }}
                    onClick={() => {
                      // 这里可以添加第三方登录逻辑
                      message.info('第三方登录功能开发中...');
                    }}
                  >
                    使用 Google 登录
                  </Button>
                </Space>
              </div>
            </Form>

            <Divider style={{ margin: '24px 0' }}>
              <Text type="secondary">或</Text>
            </Divider>

            <div style={{ textAlign: 'center' }}>
              <Space>
                <Text type="secondary">还没有账户？</Text>
                <Link
                  to="/register"
                  style={{
                    color: token.colorPrimary,
                    fontWeight: 500,
                    textDecoration: 'none'
                  }}
                >
                  立即注册
                </Link>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Login;