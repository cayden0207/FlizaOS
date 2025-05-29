# 🤖 FlizaOS - AI-Powered Telegram Bot

FlizaOS是一个功能强大的Telegram机器人，集成了OpenAI的GPT和DALL-E技术，提供智能对话和图像生成功能。

## ✨ 功能特性

- 🤖 **AI智能对话** - 基于GPT-3.5的自然语言处理
- 🎨 **图像生成** - 使用DALL-E 3生成高质量图片
- 🚀 **云端部署** - 支持Railway等平台24小时运行
- 🔒 **安全配置** - 环境变量管理API密钥

## 🛠️ 技术栈

- **框架**: Next.js
- **AI服务**: OpenAI GPT-3.5 & DALL-E 3
- **Bot框架**: node-telegram-bot-api
- **部署**: Railway

## 📋 环境变量

创建 `.env.local` 文件并设置以下变量：

```bash
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
OPENAI_API_KEY=your_openai_api_key
NODE_ENV=development
```

## 🚀 快速开始

1. **安装依赖**
   ```bash
   npm install
   ```

2. **配置环境变量**
   ```bash
   cp .env.example .env.local
   # 编辑 .env.local 填入真实的API密钥
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

4. **启动Bot**
   ```bash
   curl http://localhost:3000/api/telegram-bot
   ```

## 📱 Bot命令

- `/start` - 开始使用Bot
- `/help` - 显示帮助信息
- `/image <描述>` - 生成图片
- 直接发送消息 - AI对话

## 🌐 部署到Railway

1. 推送代码到GitHub
2. 在Railway中连接GitHub仓库
3. 设置环境变量
4. 自动部署完成

## �� 许可证

MIT License 