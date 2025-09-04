import React, { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  Space,
  Divider,
  Avatar,
  Typography,
  App
} from 'antd';
import {
  UserOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  CloseOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;

interface UserSettingsModalProps {
  visible: boolean;
  onCancel: () => void;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const UserSettingsModal: React.FC<UserSettingsModalProps> = ({ visible, onCancel }) => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const { message } = App.useApp();
  const { user } = useAuth();

  const handleSave = async (values: any) => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('用户信息更新成功');
      onCancel();
    } catch (error) {
      message.error('更新失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (values: PasswordFormData) => {
    setPasswordLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('密码修改成功');
      passwordForm.resetFields();
    } catch (error) {
      message.error('密码修改失败，请重试');
    } finally {
      setPasswordLoading(false);
    }
  };

  const validatePassword = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error('请输入新密码'));
    }
    if (value.length < 6) {
      return Promise.reject(new Error('密码至少6个字符'));
    }
    return Promise.resolve();
  };

  const validateConfirmPassword = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error('请确认新密码'));
    }
    if (value !== passwordForm.getFieldValue('newPassword')) {
      return Promise.reject(new Error('两次输入的密码不一致'));
    }
    return Promise.resolve();
  };

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={520}
      centered
      closeIcon={<CloseOutlined style={{ color: '#fff', fontSize: '16px' }} />}
      styles={{
        mask: { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
        content: {
          backgroundColor: '#2a2a2a',
          border: '1px solid #404040',
          borderRadius: '8px',
          padding: 0
        }
      }}
    >
      <div style={{ 
        backgroundColor: '#2a2a2a', 
        color: '#fff',
        borderRadius: '8px'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: '1px solid #404040'
        }}>
          <Title level={4} style={{ 
            color: '#fff', 
            margin: 0,
            fontSize: '16px',
            fontWeight: 500
          }}>
            用户资料信息
          </Title>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {/* User Profile Section */}
          <div style={{ marginBottom: '32px' }}>
            <Title level={5} style={{ 
              color: '#fff', 
              marginBottom: '16px',
              fontSize: '14px',
              fontWeight: 500
            }}>
              用户资料
            </Title>
            
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSave}
              initialValues={{
                username: user?.username || '',
                name: user?.name || '',
                email: user?.email || ''
              }}
              requiredMark={false}
            >
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <Avatar 
                    size={48} 
                    icon={<UserOutlined />} 
                    style={{ 
                      backgroundColor: '#404040',
                      color: '#fff'
                    }} 
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <Text style={{ color: '#999', fontSize: '12px', display: 'block', marginBottom: '4px' }}>用户名</Text>
                        <Form.Item name="username" style={{ margin: 0 }}>
                          <Input
                            style={{
                              backgroundColor: '#1a1a1a',
                              border: '1px solid #404040',
                              borderRadius: '4px',
                              color: '#fff',
                              fontSize: '14px',
                              height: '32px'
                            }}
                            placeholder="用户名"
                          />
                        </Form.Item>
                      </div>
                      <div style={{ flex: 1 }}>
                        <Text style={{ color: '#999', fontSize: '12px', display: 'block', marginBottom: '4px' }}>姓名</Text>
                        <Form.Item name="name" style={{ margin: 0 }}>
                          <Input
                            style={{
                              backgroundColor: '#1a1a1a',
                              border: '1px solid #404040',
                              borderRadius: '4px',
                              color: '#fff',
                              fontSize: '14px',
                              height: '32px'
                            }}
                            placeholder="全名"
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Text style={{ color: '#999', fontSize: '12px', display: 'block', marginBottom: '4px' }}>邮箱</Text>
                  <Form.Item name="email" style={{ margin: 0 }}>
                    <Input
                      style={{
                        backgroundColor: '#1a1a1a',
                        border: '1px solid #404040',
                        borderRadius: '4px',
                        color: '#fff',
                        fontSize: '14px',
                        height: '32px'
                      }}
                      placeholder="邮箱"
                    />
                  </Form.Item>
                </div>
              </Space>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                gap: '8px',
                marginTop: '20px'
              }}>
                <Button
                  onClick={onCancel}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid #404040',
                    color: '#fff',
                    borderRadius: '4px',
                    height: '32px',
                    fontSize: '14px'
                  }}
                >
                  取消
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  style={{
                    backgroundColor: '#1890ff',
                    border: 'none',
                    borderRadius: '4px',
                    height: '32px',
                    fontSize: '14px'
                  }}
                >
                  保存
                </Button>
              </div>
            </Form>
          </div>

          <Divider style={{ 
            borderColor: '#404040',
            margin: '24px 0'
          }} />

          {/* Change Password Section */}
          <div>
            <Title level={5} style={{ 
              color: '#fff', 
              marginBottom: '16px',
              fontSize: '14px',
              fontWeight: 500
            }}>
              修改密码
            </Title>
            
            <Form
              form={passwordForm}
              layout="vertical"
              onFinish={handlePasswordChange}
              requiredMark={false}
            >
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <div>
                  <Text style={{ color: '#999', fontSize: '12px', display: 'block', marginBottom: '4px' }}>当前密码</Text>
                  <Form.Item 
                    name="currentPassword"
                    rules={[{ required: true, message: '请输入当前密码' }]}
                    style={{ margin: 0 }}
                  >
                    <Input.Password
                      placeholder="当前密码"
                      iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                      style={{
                        backgroundColor: '#1a1a1a',
                        border: '1px solid #404040',
                        borderRadius: '4px',
                        color: '#fff',
                        fontSize: '14px',
                        height: '32px'
                      }}
                    />
                  </Form.Item>
                </div>
                
                <div>
                  <Text style={{ color: '#999', fontSize: '12px', display: 'block', marginBottom: '4px' }}>新密码（至少6个字符）</Text>
                  <Form.Item 
                    name="newPassword"
                    rules={[{ validator: validatePassword }]}
                    style={{ margin: 0 }}
                  >
                    <Input.Password
                      placeholder="新密码"
                      iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                      style={{
                        backgroundColor: '#1a1a1a',
                        border: '1px solid #404040',
                        borderRadius: '4px',
                        color: '#fff',
                        fontSize: '14px',
                        height: '32px'
                      }}
                    />
                  </Form.Item>
                </div>
                
                <div>
                  <Text style={{ color: '#999', fontSize: '12px', display: 'block', marginBottom: '4px' }}>确认新密码</Text>
                  <Form.Item 
                    name="confirmPassword"
                    rules={[{ validator: validateConfirmPassword }]}
                    dependencies={['newPassword']}
                    style={{ margin: 0 }}
                  >
                    <Input.Password
                      placeholder="确认新密码"
                      iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                      style={{
                        backgroundColor: '#1a1a1a',
                        border: '1px solid #404040',
                        borderRadius: '4px',
                        color: '#fff',
                        fontSize: '14px',
                        height: '32px'
                      }}
                    />
                  </Form.Item>
                </div>
              </Space>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'center',
                marginTop: '24px'
              }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={passwordLoading}
                  style={{
                    backgroundColor: '#1890ff',
                    border: 'none',
                    borderRadius: '4px',
                    height: '32px',
                    fontSize: '14px',
                    minWidth: '120px'
                  }}
                >
                  修改密码
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UserSettingsModal;