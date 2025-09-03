import mongoose from 'mongoose';
import { config } from './index';

// MongoDB连接选项
const mongoOptions = {
  maxPoolSize: 10, // 连接池最大连接数
  serverSelectionTimeoutMS: 5000, // 服务器选择超时时间
  socketTimeoutMS: 45000 // Socket超时时间
};

// 连接MongoDB数据库
export const connectMongoDB = async (): Promise<boolean> => {
  try {
    await mongoose.connect(config.mongodb.uri, mongoOptions);
    console.log('✅ MongoDB数据库连接成功');
    return true;
  } catch (error) {
    console.error('❌ MongoDB数据库连接失败:', error);
    return false;
  }
};

// 断开MongoDB连接
export const disconnectMongoDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB连接已断开');
  } catch (error) {
    console.error('断开MongoDB连接时出错:', error);
  }
};

// 监听MongoDB连接事件
mongoose.connection.on('connected', () => {
  console.log('MongoDB连接已建立');
});

mongoose.connection.on('error', (error) => {
  console.error('MongoDB连接错误:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB连接已断开');
});

// 优雅关闭
process.on('SIGINT', async () => {
  await disconnectMongoDB();
  process.exit(0);
});

export default mongoose;