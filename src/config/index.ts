// 环境变量
const ENV = process.env.NODE_ENV;

// API 基础配置
export const API_CONFIG = {
  // 开发环境使用代理，生产环境使用实际地址
  BASE_URL: ENV === 'development' ? '/api' : 'http://47.122.125.199/tradex',
  TIMEOUT: 10000,
  // 其他配置...
};

// 其他常量配置
export const APP_CONFIG = {
  APP_NAME: 'TradeX',
  // 其他应用配置...
};
