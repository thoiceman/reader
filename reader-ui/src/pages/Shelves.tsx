import React from 'react';
import { Card, Row, Col, Typography, Button, Empty, theme } from 'antd';
import { HeartOutlined, BookOutlined, PlusOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Shelves: React.FC = () => {
  const { token } = theme.useToken();
  const shelves = [
    {
      id: 1,
      name: 'Favorites',
      description: '我最喜欢的书籍收藏',
      bookCount: 12,
      icon: <HeartOutlined style={{ fontSize: '24px', color: token.colorError }} />
    },
    {
      id: 2,
      name: 'Want to Read',
      description: '想要阅读的书籍列表',
      bookCount: 8,
      icon: <BookOutlined style={{ fontSize: '24px', color: token.colorPrimary }} />
    },
    {
      id: 3,
      name: 'Currently Reading',
      description: '正在阅读的书籍',
      bookCount: 3,
      icon: <BookOutlined style={{ fontSize: '24px', color: token.colorSuccess }} />
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={2}>我的书架</Title>
          <Text type="secondary">组织和管理您的阅读收藏</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />}>
          创建新书架
        </Button>
      </div>
      
      <Row gutter={[16, 16]}>
        {shelves.map(shelf => (
          <Col xs={24} sm={12} md={8} lg={6} key={shelf.id}>
            <Card
              hoverable
              style={{ textAlign: 'center' }}
              styles={{ body: { padding: '24px' } }}
            >
              <div style={{ marginBottom: '16px' }}>
                {shelf.icon}
              </div>
              <Title level={4} style={{ marginBottom: '8px' }}>{shelf.name}</Title>
              <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '16px' }}>
                {shelf.description}
              </Text>
              <Text strong style={{ fontSize: '18px', color: token.colorPrimary }}>
                {shelf.bookCount} 本书
              </Text>
              <div style={{ marginTop: '16px' }}>
                <Button type="link" size="small">查看详情</Button>
              </div>
            </Card>
          </Col>
        ))}
        
        {/* 空状态示例 */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card
            hoverable
            style={{ 
              textAlign: 'center', 
              border: `2px dashed ${token.colorBorder}`,
              background: token.colorFillAlter
            }}
            styles={{ body: { padding: '24px' } }}
          >
            <Empty 
              image={<PlusOutlined style={{ fontSize: '32px', color: token.colorTextDisabled }} />}
              description="创建新书架"
              style={{ margin: 0 }}
            >
              <Button type="dashed">添加书架</Button>
            </Empty>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Shelves;