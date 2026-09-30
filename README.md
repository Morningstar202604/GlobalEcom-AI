<div align="center">

# GlobalEcom AI

**AI 原生跨境出货台**

### *AI 让跨境生意更简单*

买家商城 + 卖家 AI 工作台双端一体，5 个 AI Agent 真实驱动商品文案、智能客服、趋势分析、选品建议与多语言翻译。

</div>

---

## 项目简介

**GlobalEcom AI** 是一套 AI 原生的出口电商全栈平台，面向跨境卖家提供"开店 → 上架 → 获客 → 成交 → 客服 → 复盘"的完整闭环。平台采用买家商城（B2C）与卖家 AI 工作台双端同仓架构，内置 5 个真实调用大模型的 AI Agent，帮助卖家以更低成本完成商品文案生成、多语言翻译、智能客服、趋势分析与选品决策。

- **品牌定位**：AI 原生跨境出货台
- **主传播语**：AI 让跨境生意更简单
- **主色**：深海军蓝 `#0B1F3A` + 科技青 `#00C2B8`
- **当前版本**：v1.0.0

---

## 核心功能

### 买家商城（B2C）
- **浏览与搜索**：首页推荐、分类导航、商品列表筛选/排序/分页、关键词搜索（pg_trgm 模糊匹配）
- **购物车**：增删改、数量调整、价格实时计算；匿名购物车支持跨设备"迁移码"恢复
- **下单与支付**：收货信息校验、Stripe / PayPal 演示接入（未配 key 走演示支付）、金额后端重算
- **订单跟踪**：订单列表、详情、物流时间线（17TRACK 接入点，未配 key 走演示时间线）
- **评价与收藏**：已购用户可评价、心形收藏、我的收藏页
- **优惠券**：结算时输入折扣码，原子核销防超用
- **多语言**：界面与商品内容支持 zh / en / es / pt 四语言切换

### 卖家 AI 工作台
- **运营看板**：GMV / 订单量 / 访客数，SQL 真实聚合 + ECharts 图表
- **商品管理**：CRUD、上下架、库存、CSV 批量导入（≤10MB）
- **订单管理**：列表、状态流转、发货、物流录入
- **咨询管理**：买家咨询会话列表与回复（SupportAgent 自动回复 + 人工兜底）
- **AI 分析中心**：5 个 Agent 入口 + AI 调用用量统计（token / 耗时 / 成功率）
- **优惠券管理**：卖家创建折扣码、查看核销记录
- **操作审计日志**：9 类写操作前后值 diff + IP，可筛选回看

### 5 个 AI Agent
| Agent | 职责 | 模型 |
|---|---|---|
| **CopywriterAgent** | 商品文案生成（标题/卖点/长描述/SEO 关键词） | DeepSeek-chat + JSON 输出 |
| **SupportAgent** | RAG 智能客服（pgvector 向量检索 + 关键词回退 + LLM） | DeepSeek-chat |
| **TrendAgent** | 趋势分析报告（销售数据 SQL 聚合 + LLM 解读） | DeepSeek-reasoner |
| **SelectAgent** | 选品建议（类目 + Top 商品 + LLM 推荐） | DeepSeek-chat |
| **TranslationAgent** | 多语言翻译（12 种语言） | DeepSeek-chat |

> 所有 Agent 均为真实 LLM 调用（OpenAI 兼容协议），未配 key 时诚实报错 400，**绝不返回假数据**。详见 [docs/AI-AGENTS.md](docs/AI-AGENTS.md)。

---

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | React 19 + TypeScript + Vite + Tailwind CSS + shadcn/ui + React Router v6 + ECharts |
| 后端 | NestJS 10 + TypeScript + Drizzle ORM |
| 数据库 | PostgreSQL 16（含 `pgvector` 向量检索、`pg_trgm` 模糊搜索扩展） |
| AI 调用 | OpenAI 兼容协议（DeepSeek / 火山方舟 / OpenAI / 通义 / 智谱等） |
| 认证 | JWT（HttpOnly Cookie）+ bcrypt + Google OAuth + CSRF 头校验 |
| 支付 | Stripe / PayPal（演示模式，配 key 即真实收款） |
| 部署 | Docker Compose 一键启动 |

---

## 目录结构

```
GlobalEcom-AI/
├── client/                     # React 19 + Vite 前端（买家端 + 卖家端）
│   ├── public/                 # 静态资源（Logo / Favicon）
│   └── src/
│       ├── api/                # fetch 封装（credentials: include）
│       ├── components/          # shadcn/ui 基础组件 + 业务组件
│       ├── contexts/            # AuthContext / LanguageContext
│       ├── hooks/
│       ├── i18n/               # zh / en / es / pt 四语言
│       ├── pages/
│       │   ├── Home/           # 买家首页
│       │   ├── ProductList/    # 商品列表
│       │   ├── ProductDetail/  # 商品详情
│       │   ├── Cart/           # 购物车
│       │   ├── Checkout/       # 结算
│       │   ├── Orders/         # 订单跟踪
│       │   ├── Favorites/     # 我的收藏
│       │   ├── Login/ Register/# 登录注册
│       │   └── seller/         # 卖家工作台 7 个页面
│       │       ├── DashboardPage.tsx
│       │       ├── ProductManagePage.tsx
│       │       ├── OrderManagePage.tsx
│       │       ├── InquiryManagePage.tsx
│       │       ├── AICenterPage.tsx
│       │       ├── CouponsPage/
│       │       └── AuditLogPage.tsx
│       └── utils/
├── server/                     # NestJS 10 后端
│   ├── common/                  # middleware / guards / filters / constants
│   ├── database/                # Drizzle schema.ts
│   └── modules/                 # 16 个业务模块
│       ├── auth/                # JWT + bcrypt + Google OAuth
│       ├── products/ categories/
│       ├── cart/ orders/ payments/
│       ├── reviews/ favorites/ coupons/
│       ├── inquiry/ logistics/ dashboard/ audit/
│       └── ai/                  # 5 Agent + ai-gateway + embedding
│           ├── ai-gateway.service.ts
│           ├── copywriter.service.ts
│           ├── support.service.ts
│           ├── trend.service.ts
│           ├── select.service.ts
│           └── translation.service.ts
├── shared/                     # 前后端共享 TypeScript 类型
│   └── api.interface.ts
├── scripts/                    # 构建 / 开发 / lint 脚本
├── docker/
│   └── postgres/init.sql       # 自动建 pgvector / pg_trgm 扩展
├── docs/
│   ├── DEPLOY.md               # 部署指南
│   ├── ARCHITECTURE.md         # 架构说明
│   ├── AI-AGENTS.md            # 5 Agent 详细说明
│   └── audit-summary.md        # 历史检查与修复摘要
├── docker-compose.yml
├── .env.example
└── package.json
```

---

## 本地运行与部署

### 前置要求
- Docker ≥ 24.x + Docker Compose ≥ v2
- 可用外网（调用 LLM / Stripe / PayPal / 17TRACK API）

### 一键启动
```bash
cp .env.example .env       # 填入 JWT_SECRET 与各服务商密钥
docker compose up -d --build
```

启动后访问：
- 买家商城：http://localhost:3000/
- 卖家工作台：http://localhost:3000/seller/dashboard

> **未配 key 的能力自动进入演示模式，不会阻断启动。** 详细密钥清单、常用命令、常见问题排查见 [docs/DEPLOY.md](docs/DEPLOY.md)。

### 架构与设计
- 整体架构、数据库表、AI Gateway 调用链路、认证方案：见 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- 5 个 Agent 的输入输出、模型、降级行为：见 [docs/AI-AGENTS.md](docs/AI-AGENTS.md)
- 版本演进与修复历史：见 [CHANGELOG.md](CHANGELOG.md)

---

## 版本

当前版本：**v1.0.0**（2026-09-30）

完整变更历史见 [CHANGELOG.md](CHANGELOG.md)。

---

## 版权声明

本仓库代码**仅作展示用途**，版权归 GlobalEcom AI 公司所有。未经书面许可，不得复制、修改、分发或用于任何商业目的。本项目不附带开源 LICENSE 文件，不授予任何开源许可证下的权利。

© 2026 GlobalEcom AI. All rights reserved.
