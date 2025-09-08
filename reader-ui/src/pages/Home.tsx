import React from 'react';
import { Card, Row, Col, Typography, theme } from 'antd';
import { BookOutlined } from '@ant-design/icons';
import './Home.css';

const { Title } = Typography;

const Home: React.FC = () => {
  const { token } = theme.useToken();
  const lastReadBooks = [
    { id: 1, title: 'Project Hail Mary', author: 'Andy Weir', progress: 75 },
    { id: 2, title: 'The Battle of the Labyrinth', author: 'Rick Riordan', progress: 100 },
    { id: 3, title: 'A Functional Approach to Java', author: 'Ben Weidig', progress: 45 },
    { id: 4, title: 'The Graduate', author: 'Charles Webb', progress: 30 },
    { id: 5, title: 'Harry Potter', author: 'J.K. Rowling', progress: 85 }
  ];

  const latestBooks = [
    { id: 1, title: 'Lead Developer', author: 'Unknown' },
    { id: 2, title: 'Quarkus in Action', author: 'Martin Stefanko' },
    { id: 3, title: 'Harry Potter Series', author: 'J.K. Rowling' },
    { id: 4, title: 'User Stories Applied', author: 'Mike Cohn' }
  ];

  return (
    <div className="home">
      {/* 最近阅读的书籍 */}
      <div style={{ marginBottom: '32px' }}>
        <Title level={3} style={{ marginBottom: '16px' }}>Last Read Books</Title>
        <Row gutter={[16, 16]}>
          {lastReadBooks.map(book => (
            <Col xs={12} sm={8} md={6} lg={4} xl={3} key={book.id}>
              <Card
                hoverable
                cover={
                  <div style={{ 
                    height: '160px', 
                    background: token.colorFillSecondary, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    position: 'relative'
                  }}>
                    <BookOutlined style={{ fontSize: '32px', color: token.colorPrimary }} />
                    {book.progress === 100 && (
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: token.colorSuccess,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <span style={{ color: token.colorWhite, fontSize: '12px' }}>✓</span>
                      </div>
                    )}
                  </div>
                }
                styles={{ body: { padding: '8px' } }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
                    {book.title}
                  </div>
                  <div style={{ fontSize: '10px', color: token.colorTextSecondary, marginBottom: '8px' }}>
                    {book.author}
                  </div>
                  {book.progress < 100 && (
                    <div style={{ fontSize: '10px', color: token.colorPrimary }}>
                      {book.progress}%
                    </div>
                  )}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* 最新添加的书籍 */}
      <div style={{ marginBottom: '32px' }}>
        <Title level={3} style={{ marginBottom: '16px' }}>Latest Added Books</Title>
        <Row gutter={[16, 16]}>
          {latestBooks.map(book => (
            <Col xs={12} sm={8} md={6} lg={4} xl={3} key={book.id}>
              <Card
                hoverable
                cover={
                  <div style={{ 
                    height: '160px', 
                    background: token.colorFillSecondary, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <BookOutlined style={{ fontSize: '32px', color: token.colorPrimary }} />
                  </div>
                }
                styles={{ body: { padding: '8px' } }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
                    {book.title}
                  </div>
                  <div style={{ fontSize: '10px', color: token.colorTextSecondary }}>
                    {book.author}
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* 随机推荐 */}
      <div>
        <Title level={3} style={{ marginBottom: '16px' }}>Discover Random Reads</Title>
        <Row gutter={[16, 16]}>
          {Array.from({ length: 8 }, (_, index) => (
            <Col xs={12} sm={8} md={6} lg={4} xl={3} key={index}>
              <Card
                hoverable
                cover={
                  <div style={{ 
                    height: '160px', 
                    background: token.colorFillSecondary, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <BookOutlined style={{ fontSize: '32px', color: token.colorPrimary }} />
                  </div>
                }
                styles={{ body: { padding: '8px' } }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
                    Random Book {index + 1}
                  </div>
                  <div style={{ fontSize: '10px', color: token.colorTextSecondary }}>
                    Author Name
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default Home;