import React from 'react';
import { Card, Row, Col, Typography, Tag, Button, theme } from 'antd';
import { BookOutlined, StarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Library: React.FC = () => {
  const { token } = theme.useToken();
  const books = [
    {
      id: 1,
      title: 'Project Hail Mary',
      author: 'Andy Weir',
      cover: '/api/placeholder/150/200',
      rating: 4.5,
      category: 'Science Fiction',
      progress: 75
    },
    {
      id: 2,
      title: 'The Battle of the Labyrinth',
      author: 'Rick Riordan',
      cover: '/api/placeholder/150/200',
      rating: 4.2,
      category: 'Fantasy',
      progress: 100
    },
    {
      id: 3,
      title: 'A Functional Approach to Java',
      author: 'Ben Weidig',
      cover: '/api/placeholder/150/200',
      rating: 4.0,
      category: 'Technology',
      progress: 45
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>我的图书馆</Title>
        <Text type="secondary">管理您的个人图书收藏</Text>
      </div>
      
      <Row gutter={[16, 16]}>
        {books.map(book => (
          <Col xs={24} sm={12} md={8} lg={6} xl={4} key={book.id}>
            <Card
              hoverable
              cover={
                <div style={{ 
                  height: '200px', 
                  background: token.colorFillSecondary, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <BookOutlined style={{ fontSize: '48px', color: token.colorPrimary }} />
                </div>
              }
              actions={[
                <Button type="link" size="small">阅读</Button>,
                <Button type="link" size="small">详情</Button>
              ]}
            >
              <Card.Meta
                title={<div style={{ fontSize: '14px', fontWeight: 'bold' }}>{book.title}</div>}
                description={
                  <div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>{book.author}</Text>
                    <br />
                    <Tag color="blue" style={{ marginTop: '4px', fontSize: '10px' }}>{book.category}</Tag>
                    <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <StarOutlined style={{ color: token.colorWarning, fontSize: '12px' }} />
                      <Text style={{ fontSize: '12px' }}>{book.rating}</Text>
                      <Text type="secondary" style={{ fontSize: '12px', marginLeft: '8px' }}>进度: {book.progress}%</Text>
                    </div>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Library;