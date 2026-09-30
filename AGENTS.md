# GlobalEcom AI 出口电商平台

## 项目概览

AI Agent 驱动的出口电商平台，包含买家端 B2C 商城和卖家端 AI 工作台，共享同一套数据库。

## 技术架构

- 前端：React 19 + TypeScript + Tailwind CSS + shadcn/ui
- 后端：NestJS 10 + TypeScript + Drizzle ORM
- 数据库：PostgreSQL
- AI：统一 AI Gateway（OpenAI 兼容协议）

## 设计规范

### 色彩系统

**买家端（清新商业风）**
- 主色：`#2563eb` (blue-600)
- 辅助色：`#0ea5e9` (sky-500)
- 强调色：`#f97316` (orange-500) - 促销/折扣
- 成功：`#10b981` (emerald-500)
- 背景：`#f8fafc` (slate-50)
- 卡片：`#ffffff`

**卖家端（专业管理风）**
- 主色：`#1e40af` (blue-800)
- 辅助色：`#6366f1` (indigo-500)
- 强调色：`#8b5cf6` (violet-500) - AI 功能
- 背景：`#f1f5f9` (slate-100)
- 侧边栏：`#0f172a` (slate-900)

### 排版

- 字体：system-ui, -apple-system, sans-serif
- 标题：`text-2xl font-bold` / `text-xl font-semibold` / `text-lg font-semibold`
- 正文：`text-base` (16px)
- 辅助文字：`text-sm text-muted-foreground`
- 行高：标题 1.2，正文 1.5

### 间距

- 页面内边距：`p-6` (24px)
- 卡片内边距：`p-4` (16px)
- 元素间距：`gap-4` (16px)
- 区块间距：`space-y-6` (24px)

### 组件规范

- 圆角：`rounded-lg` (8px) 默认，`rounded-xl` (12px) 卡片
- 阴影：`shadow-sm` 默认，`shadow-md` hover
- 按钮：shadcn Button，variant 按语义选择
- 卡片：shadcn Card，统一风格

## 模块划分

### 买家端（/）
- 首页 `/` - Banner、分类、热销、推荐
- 商品列表 `/products` - 筛选、排序、分页、搜索
- 商品详情 `/products/:id` - 多图、规格、加购
- 购物车 `/cart` - 列表、增减、结算
- 结算 `/checkout` - 收货信息、支付
- 订单 `/orders` - 列表、详情、物流

### 卖家端（/seller）
- 数据看板 `/seller/dashboard` - GMV、订单、趋势图
- 商品管理 `/seller/products` - CRUD、上下架
- 订单管理 `/seller/orders` - 列表、状态流转
- 咨询管理 `/seller/inquiries` - 会话、AI/人工回复
- AI 分析中心 `/seller/ai-center` - 4个AI功能入口

## 数据库表

- `products` - 商品表（含多语言字段）
- `product_images` - 商品图片表
- `categories` - 分类表
- `orders` - 订单表
- `order_items` - 订单明细表
- `cart_items` - 购物车表
- `inquiry_sessions` - 咨询会话表
- `inquiry_messages` - 咨询消息表
- `ai_reports` - AI 报告表
- `shop_settings` - 店铺设置表

## AI Agent

统一通过 `ai-gateway.service.ts` 调用 LLM，环境变量：
- `LLM_BASE_URL` - API base URL
- `LLM_API_KEY` - API key
- `LLM_MODEL` - 模型名称

5个 Agent：Copywriter、Support、Trend、Select、Translation
