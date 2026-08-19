# M2 实现记录

## Stamp 接入依赖

`src/components/motion/stamp.tsx` 只提供可复用的成功状态组件与 `aria-live` 播报接入点，当前页面不渲染，也没有伪造提交动作。

实际接入依赖 M3 完成以下事项后再进行：

- `POST /api/join` Route Handler
- 前后端共用的 Zod 校验
- Turnstile、蜜罐与速率限制
- 明确的通知投递渠道

只有服务端返回真实成功结果后，报名表才可以用 `Stamp` 替换提交按钮区域。
