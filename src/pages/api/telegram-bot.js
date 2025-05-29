const TelegramBot = require('node-telegram-bot-api');
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// 从环境变量获取配置
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// 初始化OpenAI
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// Bot实例
let bot = null;

// 启动Bot
function startBot() {
  if (bot) {
    console.log('Bot已在运行');
    return;
  }

  bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
  
  // 处理消息
  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    try {
      if (text === '/start') {
        await bot.sendMessage(chatId, '🎉 欢迎使用FlizaOS Bot！\n\n发送任何消息开始对话，或使用 /image 生成图片！');
      } else if (text === '/help') {
        await bot.sendMessage(chatId, '🤖 FlizaOS Bot 帮助\n\n/start - 开始使用\n/help - 显示帮助\n/image <描述> - 生成图片\n\n直接发送消息即可开始AI对话！');
      } else if (text && text.startsWith('/image ')) {
        const prompt = text.replace('/image ', '');
        await generateImage(chatId, prompt);
      } else if (text) {
        await handleChat(chatId, text);
      }
    } catch (error) {
      console.error('处理消息错误:', error);
      await bot.sendMessage(chatId, '抱歉，处理您的请求时出现了错误。');
    }
  });

  // 错误处理
  bot.on('polling_error', (error) => {
    console.error('Bot轮询错误:', error);
  });

  console.log('✅ Telegram Bot已启动');
}

// AI对话处理
async function handleChat(chatId, message) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: '你是FlizaOS，一个友好的AI助手。用中文回复，保持简洁有趣。' },
        { role: 'user', content: message }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const reply = response.choices[0].message.content;
    await bot.sendMessage(chatId, reply);
  } catch (error) {
    console.error('AI对话错误:', error);
    await bot.sendMessage(chatId, '抱歉，AI服务暂时不可用。');
  }
}

// 图片生成
async function generateImage(chatId, prompt) {
  try {
    await bot.sendMessage(chatId, '🎨 正在生成图片，请稍候...');

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: `Create: ${prompt}. High quality, beautiful composition.`,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
    });

    const imageUrl = response.data[0].url;
    
    // 下载并发送图片
    const imageResponse = await axios.get(imageUrl, { responseType: 'stream' });
    const fileName = `fliza_${Date.now()}.png`;
    const filePath = path.join(process.cwd(), 'public', 'temp', fileName);
    
    const writer = fs.createWriteStream(filePath);
    imageResponse.data.pipe(writer);
    
    writer.on('finish', async () => {
      await bot.sendPhoto(chatId, fs.createReadStream(filePath), {
        caption: `🎨 ${prompt}`
      });
      
      // 清理临时文件
      setTimeout(() => {
        fs.unlink(filePath, () => {});
      }, 60000);
    });

  } catch (error) {
    console.error('图片生成错误:', error);
    await bot.sendMessage(chatId, '抱歉，图片生成失败。请稍后再试。');
  }
}

// API路由处理
export default async function handler(req, res) {
  if (req.method === 'GET') {
    // 启动Bot
    if (!bot) {
      startBot();
    }
    res.status(200).json({ message: 'FlizaOS Bot正在运行', running: !!bot });
  } else if (req.method === 'POST') {
    const { action } = req.body;
    
    if (action === 'start') {
      startBot();
      res.status(200).json({ message: 'Bot已启动' });
    } else if (action === 'stop') {
      if (bot) {
        bot.stopPolling();
        bot = null;
      }
      res.status(200).json({ message: 'Bot已停止' });
    } else if (action === 'status') {
      res.status(200).json({ running: !!bot });
    } else {
      res.status(400).json({ error: '无效的操作' });
    }
  } else {
    res.status(405).json({ error: '方法不允许' });
  }
} 