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
  Result,
  message,
  theme
} from 'antd';
import {
  MailOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { ForgotPasswordFormData } from '../types/auth';

const { Title, Text, Paragraph } = Typography;

const ForgotPassword: React.FC = () => {
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (values: ForgotPasswordFormData) => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 这里应该调用实际的忘记密码API
      console.log('忘记密码请求:', values);
      
      setEmail(values.email);
      setEmailSent(true);
      message.success('密码重置邮件已发送！');
    } catch (error) {
      message.error('发送失败，请稍后重试。');
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setLoading(true);
    try {
      // 模拟重新发送邮件
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('邮件已重新发送！');
    } catch (error) {
      message.error('重新发送失败，请稍后重试。');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
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
              <Result
                status="success"
                title="邮件已发送"
                subTitle={
                  <div>
                    <Paragraph style={{ color: token.colorTextSecondary, fontSize: '16px' }}>
                      我们已向 <strong>{email}</strong> 发送了密码重置链接。
                    </Paragraph>
                    <Paragraph style={{ color: token.colorTextSecondary }}>
                      请检查您的邮箱（包括垃圾邮件文件夹），并点击链接重置密码。
                    </Paragraph>
                  </div>
                }
                extra={[
                  <Space key="actions" direction="vertical" style={{ width: '100%' }}>
                    <Button
                      type="primary"
                      size="large"
                      onClick={handleResendEmail}
                      loading={loading}
                      style={{
                        borderRadius: token.borderRadius,
                        fontWeight: 500
                      }}
                    >
                      重新发送邮件
                    </Button>
                    <Link to="/login">
                      <Button
                        type="default"
                        size="large"
                        icon={<ArrowLeftOutlined />}
                        style={{
                          borderRadius: token.borderRadius,
                          width: '100%'
                        }}
                      >
                        返回登录
                      </Button>
                    </Link>
                  </Space>
                ]}
              />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }

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
                忘记密码
              </Title>
              <Text type="secondary" style={{ fontSize: '16px' }}>
                输入您的邮箱地址，我们将发送密码重置链接
              </Text>
            </div>

            <Form
              form={form}
              name="forgotPassword"
              onFinish={handleSubmit}
              layout="vertical"
              size="large"
              requiredMark={false}
            >
              <Form.Item
                name="email"
                label="电子邮箱"
                rules={[
                  { required: true, message: '请输入电子邮箱' },
                  { type: 'email', message: '请输入有效的邮箱地址' }
                ]}
              >
                <Input
                  prefix={<MailOutlined style={{ color: token.colorTextTertiary }} />}
                  placeholder="请输入您的邮箱地址"
                  style={{ borderRadius: token.borderRadius }}
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: '24px' }}>
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
                  {loading ? '发送中...' : '发送重置链接'}
                </Button>
              </Form.Item>

              <div style={{ textAlign: 'center' }}>
                <Space>
                  <Link
                    to="/login"
                    style={{
                      color: token.colorTextSecondary,
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <ArrowLeftOutlined />
                    返回登录
                  </Link>
                </Space>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ForgotPassword;