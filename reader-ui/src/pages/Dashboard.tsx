import React from 'react';
import { Card, Row, Col, Typography, Statistic, Progress, List, Avatar, theme } from 'antd';
import { BookOutlined, ClockCircleOutlined, TrophyOutlined, FireOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const { token } = theme.useToken();
  const recentBooks = [
    {
      title: 'Project Hail Mary',
      author: 'Andy Weir',
      progress: 75,
      lastRead: '2小时前'
    },
    {
      title: 'The Battle of the Labyrinth',
      author: 'Rick Riordan',
      progress: 100,
      lastRead: '1天前'
    },
    {
      title: 'A Functional Approach to Java',
      author: 'Ben Weidig',
      progress: 45,
      lastRead: '3天前'
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>仪表板</Title>
        <Text type="secondary">查看您的阅读统计和进度</Text>
      </div>
      
      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总藏书量"
              value={156}
              prefix={<BookOutlined />}
              valueStyle={{ color: token.colorPrimary }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="本月阅读"
              value={8}
              prefix={<FireOutlined />}
              suffix="本"
              valueStyle={{ color: token.colorSuccess }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="阅读时长"
              value={24.5}
              prefix={<ClockCircleOutlined />}
              suffix="小时"
              valueStyle={{ color: token.colorWarning }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="完成书籍"
              value={42}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: token.colorInfo }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 阅读进度 */}
        <Col xs={24} lg={12}>
          <Card title="本月阅读目标" extra={<Text type="secondary">目标: 10本</Text>}>
            <Progress 
              percent={80} 
              strokeColor={{
                '0%': token.colorPrimary,
                '100%': token.colorSuccess,
              }}
              format={() => '8/10 本'}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>还需要完成 2 本书就能达成本月目标</Text>
          </Card>
        </Col>

        {/* 最近阅读 */}
        <Col xs={24} lg={12}>
          <Card title="最近阅读" extra={<Text type="secondary">查看全部</Text>}>
            <List
              itemLayout="horizontal"
              dataSource={recentBooks}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<BookOutlined />} style={{ backgroundColor: token.colorPrimary }} />}
                    title={<Text style={{ fontSize: '14px' }}>{item.title}</Text>}
                    description={
                      <div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>{item.author}</Text>
                        <br />
                        <Progress percent={item.progress} size="small" style={{ marginTop: '4px' }} />
                        <Text type="secondary" style={{ fontSize: '11px' }}>最后阅读: {item.lastRead}</Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;