import React from 'react';
import {
  Row,
  Col,
  Card,
  Statistic,
  Progress,
  Table,
  Tag,
  Space,
  Button,
  Typography,
  Divider,
  Alert,
} from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Paragraph } = Typography;

// 表格数据类型
interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

// 示例数据
const tableData: DataType[] = [
  {
    key: '1',
    name: '张三',
    age: 32,
    address: '北京市朝阳区',
    tags: ['开发者', 'React'],
  },
  {
    key: '2',
    name: '李四',
    age: 28,
    address: '上海市浦东新区',
    tags: ['设计师', 'UI/UX'],
  },
  {
    key: '3',
    name: '王五',
    age: 35,
    address: '广州市天河区',
    tags: ['产品经理', 'Agile'],
  },
];

// 表格列配置
const columns: ColumnsType<DataType> = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <Button type="link" size="small">{text}</Button>,
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
    responsive: ['md'], // 在中等屏幕及以上显示
  },
  {
    title: '地址',
    dataIndex: 'address',
    key: 'address',
    responsive: ['lg'], // 在大屏幕及以上显示
  },
  {
    title: '标签',
    key: 'tags',
    dataIndex: 'tags',
    render: (tags: string[]) => (
      <>
        {tags.map((tag) => {
          const color = tag.length > 5 ? 'geekblue' : 'green';
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: '操作',
    key: 'action',
    render: () => (
      <Space size="middle">
        <Button type="link" size="small">编辑</Button>
        <Button type="link" size="small" danger>删除</Button>
      </Space>
    ),
  },
];

const ResponsiveDemo: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>响应式布局示例</Title>
      <Paragraph>
        以下展示了 Ant Design 5 的响应式特性，包括栅格系统、组件响应式配置等。
      </Paragraph>

      <Alert
        message="响应式提示"
        description="请尝试调整浏览器窗口大小，观察布局变化。在不同屏幕尺寸下，组件会自动调整显示方式。"
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      {/* 统计卡片 - 响应式栅格 */}
      <Title level={3}>统计面板</Title>
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={11280}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
              suffix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="订单数量"
              value={9280}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#cf1322' }}
              suffix={<ArrowDownOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总收入"
              value={128000}
              prefix={<DollarOutlined />}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              suffix="¥"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="页面浏览量"
              value={93000}
              prefix={<EyeOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 进度条 - 响应式布局 */}
      <Title level={3}>项目进度</Title>
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col xs={24} md={12}>
          <Card title="前端开发" size="small">
            <Progress percent={75} status="active" />
            <p style={{ marginTop: 8, color: '#666' }}>React + TypeScript</p>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="后端开发" size="small">
            <Progress percent={60} status="active" strokeColor="#52c41a" />
            <p style={{ marginTop: 8, color: '#666' }}>Node.js + Express</p>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="数据库设计" size="small">
            <Progress percent={90} strokeColor="#1890ff" />
            <p style={{ marginTop: 8, color: '#666' }}>MongoDB</p>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="测试覆盖" size="small">
            <Progress percent={45} status="exception" />
            <p style={{ marginTop: 8, color: '#666' }}>Jest + Testing Library</p>
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* 响应式表格 */}
      <Title level={3}>用户列表</Title>
      <Paragraph>
        表格在不同屏幕尺寸下会隐藏部分列，保证在移动设备上的可用性。
      </Paragraph>
      
      <Card>
        <Table 
          columns={columns} 
          dataSource={tableData} 
          pagination={false}
          scroll={{ x: 800 }} // 水平滚动
        />
      </Card>

      <Divider />

      {/* 操作按钮 - 响应式间距 */}
      <Row justify="center" style={{ marginTop: 32 }}>
        <Col xs={24} sm={12} md={8}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Button type="primary" size="large" block>
              主要操作
            </Button>
            <Button size="large" block>
              次要操作
            </Button>
            <Button type="dashed" size="large" block>
              其他操作
            </Button>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default ResponsiveDemo;