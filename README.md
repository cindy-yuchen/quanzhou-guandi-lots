# 泉州关帝庙圣杯抽签问事

高度还原泉州通淮关岳庙「问事 → 掷圣杯 → 抽签 → 解签」全流程的数字化民俗文化产品。香客在手机上诚心默念所求，掷出圣杯求得神明应允，抽取签诗，再由 AI 解签师傅以温厚、富有传统文化温度的口吻为你解签。

## 特性

- 🎐 **完整还原问事流程**：问事、掷圣杯、抽签、验签，一环不落
- 🧧 **沉浸式体验**：庙宇氛围、烟雾缭绕、签筒摇签等细节还原
- 📜 **AI 解签**：由 DeepSeek 驱动，语气如长者，结合所求给出具体善意的建议，结尾送福
- 📱 **移动端优先**：手机上竖屏使用体验最佳

## 技术栈

- **前端**：React 19 · Vite 6 · Tailwind CSS 4 · Framer Motion
- **后端**：Cloudflare Pages Functions
- **AI**：DeepSeek（`deepseek-chat`）

## 本地运行

**前置**：Node.js ≥ 18，Cloudflare Wrangler

```bash
npm install
```

复制 `.env.example` 为 `.dev.vars`，填入你的 DeepSeek API key：

```bash
cp .env.example .dev.vars
# 编辑 .dev.vars，填写 DEEPSEEK_API_KEY
```

构建并本地预览（含后端 Functions）：

```bash
npm run build
npx wrangler pages dev dist
```

## 部署

项目部署在 Cloudflare Pages，`push` 到 `main` 分支会通过 GitHub Actions 自动构建并部署。

需要配置以下密钥（均只存服务端，绝不进 Git）：

| 位置 | 名称 | 说明 |
|------|------|------|
| Cloudflare Pages Secret | `DEEPSEEK_API_KEY` | DeepSeek API key |
| GitHub Actions Secret | `CLOUDFLARE_API_TOKEN` | Cloudflare API Token（「Edit Cloudflare Workers」模板） |
| GitHub Actions Secret | `CLOUDFLARE_ACCOUNT_ID` | Cloudflare 账号 ID |

## 安全

- API key 只存服务端（Cloudflare Pages Secret 或本地 `.dev.vars`），**绝不进前端、不进 Git**
- `.dev.vars`、`.env` 已被 `.gitignore` 排除

## License

[GPL-3.0](LICENSE)
