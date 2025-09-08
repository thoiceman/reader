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
  message,
  theme
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { RegisterFormData } from '../types/auth';
import { AuthService } from '../services/authService';

const { Title, Text } = Typography;

const Register: React.FC = () => {
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values: RegisterFormData) => {
    setLoading(true);
    try {
      const result = await AuthService.register(values);
      
      if (result.success) {
        message.success(result.message || '注册成功！请登录您的账户。');
        navigate('/login');
      } else {
        message.error(result.message || '注册失败');
      }
    } catch (error) {
      message.error('注册失败，请稍后重试。');
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error('请输入密码'));
    }
    if (value.length < 8) {
      return Promise.reject(new Error('密码长度至少为8位'));
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
      return Promise.reject(new Error('密码必须包含大小写字母和数字'));
    }
    return Promise.resolve();
  };

  const validateConfirmPassword = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error('请确认密码'));
    }
    if (value !== form.getFieldValue('password')) {
      return Promise.reject(new Error('两次输入的密码不一致'));
    }
    return Promise.resolve();
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
                创建账户
              </Title>
              <Text type="secondary" style={{ fontSize: '16px' }}>
                加入我们，开始您的阅读之旅
              </Text>
            </div>

            <Form
              form={form}
              name="register"
              onFinish={handleSubmit}
              layout="vertical"
              size="large"
              requiredMark={false}
            >
              <Form.Item
                name="username"
                label="用户名"
                rules={[
                  { required: true, message: '请输入用户名' },
                  { min: 3, message: '用户名至少3个字符' },
                  { max: 20, message: '用户名最多20个字符' },
                  {
                    pattern: /^[a-zA-Z0-9_]+$/,
                    message: '用户名只能包含字母、数字和下划线'
                  }
                ]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: token.colorTextTertiary }} />}
                  placeholder="请输入用户名"
                  style={{ borderRadius: token.borderRadius }}
                />
              </Form.Item>

              <Form.Item
                name="name"
                label="姓名"
                rules={[
                  { required: true, message: '请输入姓名' },
                  { min: 2, message: '姓名至少2个字符' },
                  { max: 50, message: '姓名最多50个字符' }
                ]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: token.colorTextTertiary }} />}
                  placeholder="请输入姓名"
                  style={{ borderRadius: token.borderRadius }}
                />
              </Form.Item>

              <Form.Item
                 name="email"
                 label="电子邮箱（可选）"
                 rules={[
                   { type: 'email', message: '请输入有效的邮箱地址' }
                 ]}
               >
                <Input
                  prefix={<MailOutlined style={{ color: token.colorTextTertiary }} />}
                  placeholder="请输入电子邮箱"
                  style={{ borderRadius: token.borderRadius }}
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="密码"
                rules={[{ validator: validatePassword }]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: token.colorTextTertiary }} />}
                  placeholder="请输入密码"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  style={{ borderRadius: token.borderRadius }}
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="确认密码"
                rules={[{ validator: validateConfirmPassword }]}
                dependencies={['password']}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: token.colorTextTertiary }} />}
                  placeholder="请再次输入密码"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  style={{ borderRadius: token.borderRadius }}
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: '16px' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  style={{
                    height: '48px',
                    borderRadius: token.borderRadius,
                    fontSize: '16px',
                    fontWeight: 500
                  }}
                >
                  {loading ? '注册中...' : '注册账户'}
                </Button>
              </Form.Item>

              <div style={{ textAlign: 'center' }}>
                <Text type="secondary">
                  注册即表示您同意我们的{' '}
                  <Link to="/terms" style={{ color: token.colorPrimary }}>
                    服务条款
                  </Link>
                  {' '}和{' '}
                  <Link to="/privacy" style={{ color: token.colorPrimary }}>
                    隐私政策
                  </Link>
                </Text>
              </div>
            </Form>

            <Divider style={{ margin: '24px 0' }}>
              <Text type="secondary">或</Text>
            </Divider>

            <div style={{ textAlign: 'center' }}>
              <Space>
                <Text type="secondary">已有账户？</Text>
                <Link
                  to="/login"
                  style={{
                    color: token.colorPrimary,
                    fontWeight: 500,
                    textDecoration: 'none'
                  }}
                >
                  立即登录
                </Link>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Register;