import app, { initializeDatabases } from './app';
import { config, validateConfig } from './config';

// 启动服务器
const startServer = async (): Promise<void> => {
  try {
    // 验证配置
    validateConfig();
    console.log('✅ 配置验证通过');
    
    // 初始化数据库连接
    await initializeDatabases();
    
    // 启动HTTP服务器
    const server = app.listen(config.server.port, () => {
      console.log(`🚀 服务器运行在端口 ${config.server.port}`);
      console.log(`🌍 环境: ${config.server.nodeEnv}`);
      console.log(`📡 API地址: http://localhost:${config.server.port}/api`);
      console.log(`❤️  健康检查: http://localhost:${config.server.port}/health`);
    });
    
    // 优雅关闭处理
    const gracefulShutdown = (signal: string) => {
      console.log(`\n收到 ${signal} 信号，正在优雅关闭服务器...`);
      
      server.close(() => {
        console.log('HTTP服务器已关闭');
        process.exit(0);
      });
      
      // 强制关闭超时
      setTimeout(() => {
        console.error('强制关闭服务器');
        process.exit(1);
      }, 10000);
    };
    
    // 监听关闭信号
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
  } catch (error) {
    console.error('❌ 服务器启动失败:', error);
    process.exit(1);
  }
};

// 处理未捕获的异常
process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的Promise拒绝:', reason);
  process.exit(1);
});

// 启动应用
startServer();