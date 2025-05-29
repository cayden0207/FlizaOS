const axios = require('axios');

async function startBot() {
  try {
    console.log('🚀 正在启动Telegram Bot...');
    
    // 等待Next.js服务器启动
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 调用API启动Bot
    const response = await axios.get('http://localhost:8080/api/telegram-bot');
    console.log('✅ Bot启动响应:', response.data);
    
    // 保持脚本运行
    setInterval(async () => {
      try {
        const statusResponse = await axios.post('http://localhost:8080/api/telegram-bot', {
          action: 'status'
        });
        console.log('📊 Bot状态检查:', statusResponse.data);
      } catch (error) {
        console.error('❌ 状态检查失败:', error.message);
      }
    }, 60000); // 每分钟检查一次
    
  } catch (error) {
    console.error('❌ Bot启动失败:', error.message);
    // 重试
    setTimeout(startBot, 5000);
  }
}

// 如果在Railway环境中运行
if (process.env.RAILWAY_ENVIRONMENT) {
  console.log('🚂 检测到Railway环境，启动Bot...');
  startBot();
} else {
  console.log('�� 本地环境，跳过自动启动');
} 