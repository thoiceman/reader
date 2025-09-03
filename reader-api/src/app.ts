import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';
import { testMySQLConnection } from './config/mysql';
import { connectMongoDB } from './config/mongodb';
import apiRoutes from './routes';

// 创建Express应用实例
const app: Application = express();

// 安全中间件
app.use(helmet());

// CORS配置
app.use(cors({
  origin: config.server.corsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 请求日志中间件
if (config.server.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// 解析JSON请求体
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 健康检查路由
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: config.server.nodeEnv
  });
});

// API路由
app.use('/api', apiRoutes);

// 404错误处理
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

// 全局错误处理中间件
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Global error handler:', error);
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: config.server.nodeEnv === 'development' ? error.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  });
});

// 初始化数据库连接
export const initializeDatabases = async (): Promise<void> => {
  console.log('🔄 正在初始化数据库连接...');
  
  // 测试MySQL连接
  const mysqlConnected = await testMySQLConnection();
  if (!mysqlConnected) {
    console.warn('⚠️  MySQL连接失败，但服务器将继续运行');
  }
  
  // 连接MongoDB
  const mongoConnected = await connectMongoDB();
  if (!mongoConnected) {
    console.warn('⚠️  MongoDB连接失败，但服务器将继续运行');
  }
  
  if (mysqlConnected || mongoConnected) {
    console.log('✅ 至少一个数据库连接成功');
  } else {
    console.warn('⚠️  所有数据库连接都失败了');
  }
};

export default app;