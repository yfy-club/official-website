import type { WorkDecision, WorkMetric, WorkPrinciple } from "./schema";

export interface WorkDeepDive {
  principles: WorkPrinciple[];
  decisions: WorkDecision[];
  metrics: WorkMetric[];
  tradeoffs: {
    title: string;
    detail: string;
    boundary?: string;
    next?: string;
  }[];
}

export const workDeepDives: Record<string, WorkDeepDive> = {
  "matrix-calculator": {
    principles: [
      {
        code: "RATIONAL_01",
        name: "BigInt 有理数先约分，再参与矩阵运算",
        category: "数值表示",
        summary: "整数、分数与有限小数先统一成最简分数，矩阵内核不把它们降级成 Number。",
        mechanism: "Rational 用两个 BigInt 保存分子和正分母。构造时用欧几里得算法约分；乘法前交叉消去公因子，加法先计算分母的最大公因数。得到的是代数上的精确值，而不是把浮点误差显示得更少。",
        formula: "a/b × c/d = (a/gcd(a,d)) × (c/gcd(c,b)) / ((b/gcd(c,b)) × (d/gcd(a,d)))",
        codeSnippet: `const leftCancellation = gcd(this.numerator, other.denominator);
const rightCancellation = gcd(other.numerator, this.denominator);
return new Rational(
  (this.numerator / leftCancellation) * (other.numerator / rightCancellation),
  (this.denominator / rightCancellation) * (other.denominator / leftCancellation),
);`,
        keyBenefit: "测试覆盖 20 位大整数互为倒数、分数四则运算与有限小数精确解析。",
        tags: ["BigInt", "Rational", "Euclidean GCD", "TypeScript"],
      },
      {
        code: "BAREISS_02",
        name: "Bareiss 只接管行列式的无分数消元",
        category: "行列式",
        summary: "每轮用当前主元交叉相乘，再除以前一主元；遇到零主元会换行并翻转符号。",
        mechanism: "源码没有把所有消元都包装成 Bareiss：RREF 仍走精确有理数高斯消元，Bareiss 专门用于 determinant。这个边界既压住行列式中间分数的增长，也让逐步行变换保持直观。",
        formula: "mᵢⱼ ← (mₖₖmᵢⱼ − mᵢₖmₖⱼ) / pₖ₋₁",
        codeSnippet: `const numerator = rows[row][col]
  .multiply(pivot)
  .subtract(rows[row][pivotIndex].multiply(rows[pivotIndex][col]));
rows[row][col] = numerator.divide(previousPivot);
rows[row][pivotIndex] = Rational.ZERO;`,
        keyBenefit: "单元测试精确得到整数行列式 22 与分数行列式 17/210。",
        tags: ["Bareiss", "Determinant", "Exact Division", "Pivot Swap"],
      },
      {
        code: "FADDEEV_03",
        name: "Faddeev–LeVerrier 从迹递推出特征多项式",
        category: "特征多项式",
        summary: "不先近似求特征值，直接在有理数域中生成 det(λI − A) 的全部系数。",
        mechanism: "每一阶先算 A·B，再用 trace(A·B)/k 得到下一个系数，随后把该系数加回单位矩阵。最终结果是 Rational 数组，测试还会核对三阶多项式常数项与 −det(A) 一致。",
        formula: "cₖ = −tr(ABₖ₋₁)/k,  Bₖ = ABₖ₋₁ + cₖI",
        codeSnippet: `for (let degree = 1; degree <= size; degree += 1) {
  const product = multiply(matrix, previous);
  const coefficient = trace(product)
    .divide(Rational.fromInteger(degree))
    .negate();
  coefficients.push(coefficient);
  previous = add(product, scale(identity, coefficient));
}`,
        keyBenefit: "特征多项式的每个系数都保持为可复制、可继续运算的精确有理数。",
        tags: ["Faddeev-LeVerrier", "Trace", "Characteristic Polynomial", "Rational"],
      },
      {
        code: "TRACE_04",
        name: "行操作日志把计算与教学回放分开",
        category: "推导回放",
        summary: "计算阶段只记录 swap、scale 与 addMultiple；需要展示时再从初始矩阵重放。",
        mechanism: "RowOperation 是三分支联合类型，不是泛化的符号 AST。eliminate 在运算时写入操作日志，并用 maxTraceSteps 限制记录长度；materializeTrace 才把操作逐项应用成教学快照。",
        codeSnippet: `export type RowOperation =
  | { readonly type: "swap"; readonly first: number; readonly second: number }
  | { readonly type: "scale"; readonly row: number; readonly factor: Rational }
  | { readonly type: "addMultiple"; readonly target: number;
      readonly source: number; readonly factor: Rational };`,
        keyBenefit: "测试确认日志可重放到最终 RREF，并在超过记录上限时只截断讲解、不停止计算。",
        tags: ["Discriminated Union", "Replay", "LaTeX", "Trace Limit"],
      },
    ],
    decisions: [
      {
        what: "矩阵元素统一用 BigInt 有理数表示",
        why: "答案的可信度来自表示方式，而不是最后多保留几位小数。",
        tag: "数值表示",
        problem: "0.1、1/3 与大整数一旦进入 Number，多轮行变换后就可能出现伪非零项，直接影响秩和主元判断。",
        solution: "解析层把整数、分数、有限小数全部转成规范化 Rational；加乘时先做 GCD 消元，分母始终保持正数。",
        impact: "矩阵四则、消元、求逆和多项式系数共享同一套精确值语义。",
        tradeoff: "BigInt 不能与 Number 混算，位数增长也是真实成本；大输入仍然需要资源上限。",
        highlight: "Rational(BigInt numerator, BigInt denominator)",
      },
      {
        what: "Bareiss 只用于行列式，RREF 保留行操作语义",
        why: "两个问题需要不同表达：行列式关心中间项，教学消元关心每次初等变换。",
        tag: "算法分工",
        problem: "把一种算法套到所有矩阵任务上，会让行变换难以讲解，也会掩盖真实实现边界。",
        solution: "determinant 使用 Bareiss；REF/RREF、求逆和线性方程组使用基于 Rational 的主元扫描与初等行操作。",
        impact: "行列式得到紧凑的精确递推，推导面板仍能逐步解释换行、倍乘和倍加。",
        tradeoff: "项目需要维护两条消元路径，并分别覆盖换行、奇异矩阵与符号翻转。",
        highlight: "Bareiss(det) / RowOperation(RREF)",
      },
      {
        what: "特征多项式求精确系数，不承诺数值特征值",
        why: "Faddeev–LeVerrier 与产品的全程精确约束一致。",
        tag: "谱计算边界",
        problem: "QR 迭代能给近似特征值，却会在同一个结果面板里混入另一套误差语义。",
        solution: "只输出 det(λI−A) 的 Rational 系数，并用性质测试核对常数项和 determinant 的关系。",
        impact: "结果可以直接复制为 LaTeX，也能继续用于符号推导。",
        tradeoff: "当前版本不提供 SVD、QR 数值迭代或一般高次多项式的近似根。",
        highlight: "coefficients: readonly Rational[]",
      },
      {
        what: "推导先记操作，展示时再物化快照",
        why: "求答案和讲过程不必在同一时刻支付全部展示成本。",
        tag: "回放策略",
        problem: "每次变换都立即深拷贝矩阵，会让长推导在计算阶段制造大量临时对象。",
        solution: "eliminate 只追加 RowOperation；materializeTrace 接到初始矩阵和日志后再顺序重放，默认最多记录 10,000 步。",
        impact: "关闭追踪时计算完全不记录步骤；开启追踪也能在超限后继续完成最终答案。",
        tradeoff: "一旦进入完整回放，仍需为每一步生成矩阵快照；当前实现没有关键帧随机定位。",
        highlight: "operations + materializeTrace(initial, operations)",
      },
    ],
    metrics: [
      { label: "矩阵值语义", value: "0 次浮点降级", tag: "RATIONAL CORE", status: "verified", description: "整数、分数和有限小数进入矩阵后均由 BigInt Rational 运算；这是实现约束，不是性能百分比。" },
      { label: "输入资源上限", value: "100 × 100", tag: "PARSER LIMIT", status: "benchmark", description: "parseMatrix 默认最多接受 100 行、100 列，Matrix 同时限制 10,000 个元素。它是防分配边界，不代表百阶任务都能即时完成。" },
      { label: "性质随机样本", value: "5 条 / 650 次", tag: "FAST-CHECK", status: "hardened", description: "测试分别运行 200 次 det(AB)、150 次 RREF 幂等，以及各 100 次逆矩阵、PLU 和特征多项式性质检查。" },
      { label: "推导记录上限", value: "10,000 步", tag: "TRACE CAP", status: "hardened", description: "maxTraceSteps 默认值为 10,000；超限会标记 traceTruncated，但最终计算继续执行。" },
    ],
    tradeoffs: [
      {
        title: "精确代数优先，不在结果里悄悄混入近似",
        detail: "当前输出统一服从 Rational 语义，特征多项式给精确系数，教学步骤也只展示可复算的分数。",
        boundary: "SVD、QR 数值迭代与一般特征值近似不在当前能力内；这是一条明确产品边界。",
        next: "若加入数值路线，会使用独立模式标明误差、迭代阈值与收敛状态，避免和精确结果混排。",
      },
      {
        title: "输入上限不等于性能承诺",
        detail: "100×100 是解析和分配保护；真实耗时仍取决于算法、矩阵稠密度以及 BigInt 位数。",
        boundary: "计算目前运行在浏览器主线程；奇异矩阵的余子式伴随矩阵另有 8 阶硬限制，完整回放也会占用内存。",
        next: "把重任务迁入 Web Worker，并以时间预算、取消信号和真实基准矩阵共同决定交互级上限。",
      },
    ],
  },

  "zgyc-smart-light": {
    principles: [
      {
        code: "CONTRACT_01",
        name: "OpenAPI 3.1 快照生成唯一的前端请求面",
        category: "接口契约",
        summary: "后端契约先固化为可提交快照，Orval 再生成模型与请求函数，生成目录不接受手改。",
        mechanism: "orval.config.ts 读取 openapi/api-docs.json，先通过 transformer 解开 ApiResponse<T> 信封，再以 single 模式生成入口与 models。所有函数最终进入同一个 orvalRequest，继续复用项目既有的鉴权与错误处理。",
        codeSnippet: `output: {
  clean: true,
  mode: "single",
  schemas: "./src/api/generated/models",
  target: "./src/api/generated/index.ts",
  override: {
    mutator: { name: "orvalRequest", path: "./src/api/request/orval-mutator.ts" },
  },
}`,
        keyBenefit: "仓库内有可离线复现的 OpenAPI 3.1 快照和只读生成目录，接口改动能进入类型检查。",
        tags: ["OpenAPI 3.1", "Orval", "TypeScript", "RequestClient"],
      },
      {
        code: "EVENT_02",
        name: "事务提交后再把通知送进 SSE 长连接",
        category: "实时通知",
        summary: "领域服务发布通知事件，只有事务成功提交后，SseEmitter 才向在线客户端发送。",
        mechanism: "SseNotificationService 按 userId 保存 CopyOnWriteArraySet<SseEmitter>。监听器使用 AFTER_COMMIT，并为每条通知生成 id 和事件名；30 秒心跳负责清理断开的连接，单连接超时为 30 分钟。",
        codeSnippet: `@TransactionalEventListener(
    phase = TransactionPhase.AFTER_COMMIT,
    fallbackExecution = true)
public void publish(NotificationEvent event) {
  clients.forEach((userId, emitters) ->
      emitters.forEach(emitter -> send(userId, emitter, notification)));
}`,
        keyBenefit: "设备上下线、告警创建与工单创建都通过同一 NotificationEvent 路径进入推送服务。",
        tags: ["SseEmitter", "AFTER_COMMIT", "Spring Event", "Heartbeat"],
      },
      {
        code: "MOCK_03",
        name: "可开关的遥测任务复用真实 ingest 链路",
        category: "设备仿真",
        summary: "演示环境按配置周期生成遥测，不为 Mock 另写一条只更新界面的捷径。",
        mechanism: "MockTelemetryJob 仅在 zgyc.mock.enabled=true 时装配。默认每 60 秒选取最多 50 台启用设备，根据八种场景生成电压、功率、温度和亮度，再调用 TelemetryService.ingest，让阈值告警与持久化走真实业务路径。",
        codeSnippet: `@Scheduled(fixedDelayString = "\${zgyc.mock.telemetry-interval:60s}")
public void execute() {
  mockService.generateTelemetry();
}`,
        keyBenefit: "NORMAL、离线、高低压、功率异常、灯具故障、高温和指令失败均有明确枚举。",
        tags: ["Spring Schedule", "ConditionalOnProperty", "Telemetry", "Scenario"],
      },
      {
        code: "DATA_04",
        name: "版本化关系模型先满足资产与状态查询",
        category: "数据底座",
        summary: "灯杆、设备、遥测、告警和工单由七个 Flyway 版本逐步建立，位置先用定点经纬度表达。",
        mechanism: "lamp_pole 使用 NUMERIC(10,7) 保存经纬度并在数据库层校验范围；当前索引围绕区域、灯杆状态和设备连接状态建立。源码没有 PostGIS geometry 或 GiST，因此页面不再把它写成空间索引。",
        codeSnippet: `longitude NUMERIC(10, 7) NOT NULL,
latitude NUMERIC(10, 7) NOT NULL,
CONSTRAINT ck_lamp_pole_longitude CHECK (longitude >= -180 AND longitude <= 180),
CONSTRAINT ck_lamp_pole_latitude CHECK (latitude >= -90 AND latitude <= 90)`,
        keyBenefit: "七个只增不改的 V1–V7 迁移脚本覆盖系统、资产、遥测、告警工单与通知策略。",
        tags: ["PostgreSQL", "Flyway", "Partial Index", "NUMERIC"],
      },
    ],
    decisions: [
      {
        what: "提交 OpenAPI 快照，再由 Orval 生成客户端",
        why: "运行时文档适合探索，已提交快照更适合离线构建、代码审查与可复现生成。",
        tag: "契约生成",
        problem: "手写 DTO 和请求函数容易与后端字段、枚举及响应信封分叉。",
        solution: "用 OpenAPI 3.1 快照作为输入，先解包统一响应，再把全部生成函数收口到既有 RequestClient mutator。",
        impact: "生成代码不创建第二个 Axios 实例，Authorization、401 与统一错误处理仍只有一套。",
        tradeoff: "后端契约变化后必须显式刷新快照和重新生成；陈旧快照仍需要 CI 检查才能及时暴露。",
        highlight: "api-docs.json → transformer → Orval → RequestClient",
      },
      {
        what: "服务端通知走 SSE，控制命令继续走 REST",
        why: "告警和状态是服务端单向下发，开关灯与调光则需要明确的鉴权、幂等和结果记录。",
        tag: "通信分工",
        problem: "轮询会产生空查询，单纯 WebSocket 又会把命令与通知绑成一套更重的会话协议。",
        solution: "通知由 SseEmitter 长连接发送；反向控制保持普通 HTTP 请求，领域服务负责状态机和审计。",
        impact: "两条路径的失败语义清楚：通知可以重连，控制命令可以独立重试和查询结果。",
        tradeoff: "当前 SSE 客户端集合存在单个 JVM 内存中，多实例部署不会自动共享订阅。",
        highlight: "REST command / SSE notification",
      },
      {
        what: "经纬度先用关系列与业务索引，不提前引入 PostGIS",
        why: "当前地图页面主要读取点位并按区域、状态过滤，关系模型已能覆盖实际查询。",
        tag: "数据范围",
        problem: "为了“空间感”过早引入 geometry、GiST 和空间函数，会增加迁移、驱动和运维复杂度。",
        solution: "用 NUMERIC(10,7) 和数据库 CHECK 保证坐标范围，区域、状态、连接状态使用条件索引。",
        impact: "地图点位、资产详情和筛选查询保持简单，也与现有 MyBatis 映射直接对应。",
        tradeoff: "半径查询、多边形包含和大规模空间聚类尚无数据库级加速。",
        highlight: "NUMERIC coordinates + relational indexes",
      },
      {
        what: "Mock 遥测调用真实 TelemetryService",
        why: "演示数据只有穿过同一 ingest、告警与事件路径，才能暴露业务链路问题。",
        tag: "仿真边界",
        problem: "直接改前端状态只能制造动画，无法验证持久化、阈值规则与告警创建。",
        solution: "定时任务按场景生成物理量并调用 telemetryService.ingest；整个服务由配置开关控制。",
        impact: "不接硬件也能反复演练正常、离线与异常工况，测试同一套领域代码。",
        tradeoff: "它是离散场景发生器，不是设备协议、网络拥塞或城市规模负载模拟器。",
        highlight: "MockTelemetryJob → TelemetryService.ingest",
      },
    ],
    metrics: [
      { label: "契约版本", value: "OpenAPI 3.1.0", tag: "API SNAPSHOT", status: "verified", description: "前端仓库提交 api-docs.json；Orval 配置从该快照生成单入口请求函数和模型目录。" },
      { label: "SSE 保活参数", value: "30s / 30min", tag: "HEARTBEAT / TIMEOUT", status: "realtime", description: "服务端每 30 秒发送注释心跳，单个 SseEmitter 的超时值为 30 分钟；这里不虚构网络推送延迟。" },
      { label: "演示仿真默认值", value: "50 台 / 60s", tag: "MOCK PROFILE", status: "benchmark", description: "application-demo.yml 默认选择最多 50 台设备，每 60 秒生成一轮遥测；可通过环境变量调整。" },
      { label: "数据库演进", value: "7 个版本脚本", tag: "FLYWAY V1–V7", status: "hardened", description: "迁移依次覆盖系统表、资产、遥测、告警工单、初始权限、登录锁定以及导出附件通知策略。" },
    ],
    tradeoffs: [
      {
        title: "轻量 SSE 先满足单实例实时通知",
        detail: "事务后事件与 SseEmitter 已把通知从轮询中拆出，连接清理、心跳和事件 id 也有独立实现。",
        boundary: "订阅表位于 JVM 内存；水平扩容后，不同实例之间不会转发事件，也没有离线重放日志。",
        next: "需要多实例时再引入共享消息总线与 Last-Event-ID 重放，而不是把当前实现描述成分布式广播。",
      },
      {
        title: "关系坐标模型服从当前地图任务",
        detail: "现阶段优先保证资产归属、状态筛选和坐标合法性，避免为尚未出现的空间查询增加系统成本。",
        boundary: "当前没有 PostGIS、GiST 或多边形范围查询；前端聚合也不等于数据库空间索引。",
        next: "当出现半径检索、围栏告警或百万点聚类，再以真实查询计划评估 PostGIS 迁移。",
      },
      {
        title: "Mock 用于业务演练，不冒充容量测试",
        detail: "八种场景复用真实 ingest 路径，适合开发、演示和状态机回归。",
        boundary: "默认 50 台、60 秒一轮，不能据此推导万级设备吞吐、端到端延迟或生产网络行为。",
        next: "容量结论需要独立压测器、固定数据集、采样指标和可重复报告，和演示任务分开运行。",
      },
    ],
  },

  intellibuddy: {
    principles: [
      {
        code: "GRAPH_01",
        name: "AntV X6 把先修关系排成稳定的分层图",
        category: "知识导航",
        summary: "节点层级由 prerequisites 递归计算，同层等距排布，再用 Manhattan 路由连接。",
        mechanism: "KnowledgeGraph.vue 注册 200×120 的自定义 knowledge-card。calculateHierarchicalLayout 按最长先修链计算 level，X6 负责缩放、平移、节点事件与边路由；节点固定不拖动，避免学习路径被随手破坏。",
        codeSnippet: `const maxPreLevel = Math.max(
  ...point.prerequisites.map(preId => calculateLevel(preId)),
);
levels.set(pointId, maxPreLevel + 1);

router: { name: "manhattan", args: { padding: 20 } },
connector: { name: "rounded", args: { radius: 10 } }`,
        keyBenefit: "推荐路径、锁定状态与缺失先修项都来自同一 prerequisites 数据模型。",
        tags: ["AntV X6", "DAG", "Hierarchical Layout", "Prerequisites"],
      },
      {
        code: "STREAM_02",
        name: "后端已有单通道 SSE 适配层",
        category: "模型输出",
        summary: "POST /chat/stream 逐块写出 content，并用 [DONE] 结束；不是双轨思维链协议。",
        mechanism: "Express 路由设置 text/event-stream，遍历模型 provider 的 AsyncGenerator，把每个 chunk 包装为 data: {content}。当前 AIChatWindow 仍调用普通 /ai/chat 并在完整响应后用 marked + KaTeX 渲染，因此流端点和可见聊天界面尚未接通。",
        codeSnippet: `for await (const chunk of streamChatCompletion(messagesToSend)) {
  if (chunk.done) {
    res.write("data: [DONE]\\n\\n");
    break;
  }
  res.write("data: " + JSON.stringify({ content: chunk.content }) + "\\n\\n");
}`,
        keyBenefit: "服务端流式边界已经独立，前端接入前仍能明确看到当前缺口。",
        tags: ["Express", "SSE", "AsyncGenerator", "Single Channel"],
      },
      {
        code: "FALLBACK_03",
        name: "多模型按明确顺序逐个降级",
        category: "模型调度",
        summary: "主模型失败后依次尝试已配置 provider；没有虚构权重、熔断器或 200ms 切换。",
        mechanism: "AIService 维护 spark、kimi、qianwen、zhipu、ernie 五种适配器。请求先走 primaryModel，再遍历 fallbackModels；provider 未配置就跳过，调用抛错就记录并继续，全部失败后返回最后错误。",
        codeSnippet: `const modelsToTry = [
  this.config.primaryModel,
  ...this.config.fallbackModels,
];
for (const modelType of modelsToTry) {
  const provider = this.providers.get(modelType);
  if (!provider) continue;
  try { return (await provider.chatCompletion(messages, options)).content; }
  catch (error) { lastError = error; }
}`,
        keyBenefit: "五种模型共享同一 AIModelProvider 接口，并提供独立 healthCheck。",
        tags: ["Provider Pattern", "Sequential Fallback", "Health Check", "Cache"],
      },
      {
        code: "MARKDOWN_04",
        name: "完整响应进入 marked 与 KaTeX 排版",
        category: "内容渲染",
        summary: "当前前端处理 GitHub Flavored Markdown、换行与数学公式，但不是增量 AST。",
        mechanism: "AIChatWindow 在消息写入 store 后执行 marked.parse；marked-katex-extension 处理行内和块级公式。普通聊天请求有 30 秒 Axios 超时，失败后最多再试两次，每次间隔 1 秒。",
        codeSnippet: `marked.use(markedKatex({
  throwOnError: false,
  nonStandard: true,
  strict: false,
}));
return marked.parse(text);`,
        keyBenefit: "Markdown 与公式渲染已经落地；流式补全和未闭合语法修复仍是下一阶段工作。",
        tags: ["marked", "KaTeX", "GFM", "Vue 3"],
      },
    ],
    decisions: [
      {
        what: "知识图谱采用稳定分层，而不是运行时力导向",
        why: "先修关系需要可重复阅读；每次打开都重新漂移的节点会破坏空间记忆。",
        tag: "图谱布局",
        problem: "扁平课程列表看不到前置依赖，而自由拖拽或力导向又会让同一条路径不断换位置。",
        solution: "递归计算最长先修层级，同层等距排布；节点禁止拖动，边使用 Manhattan 路由与圆角连接。",
        impact: "推荐路径、锁定课程与缺失前置项能在稳定坐标中持续对应。",
        tradeoff: "同层节点多时画布会变宽，当前布局没有视口剔除或自动聚类。",
        highlight: "calculateHierarchicalLayout() + X6",
      },
      {
        what: "先保留普通聊天，再独立建设 SSE 端点",
        why: "模型 provider 的流式差异先在服务端收口，不让未完成协议直接冲击现有聊天记录。",
        tag: "流式迁移",
        problem: "当前普通 POST 要等待完整回答，长内容的首屏反馈较慢。",
        solution: "后端增加单通道 content SSE 与 [DONE] 终止标记；现有界面继续走稳定的 /ai/chat。",
        impact: "服务端已经有可接入的流边界，普通聊天功能不因半成品前端解析器回归。",
        tradeoff: "用户当前仍看不到逐 Token 输出，也没有 thought/content 双通道和增量语法闭合。",
        highlight: "/ai/chat (current) / /ai/chat/stream (server-ready)",
      },
      {
        what: "多模型先做顺序降级，不假装自适应调度",
        why: "明确、可读的 provider 顺序已经能隔离单一供应商故障，且容易追踪失败原因。",
        tag: "模型容错",
        problem: "单一模型缺少配置、超时或报错时，AI 功能会整体中断。",
        solution: "统一五种 provider 接口，主模型失败后按配置顺序继续尝试可用适配器。",
        impact: "模型接入与业务调用解耦，健康检查也能列出当前可用 provider。",
        tradeoff: "没有延迟分位数、动态权重、熔断窗口和切换时延基准；流式中途失败还可能产生重复片段。",
        highlight: "primaryModel → fallbackModels[]",
      },
      {
        what: "pnpm Workspace 统一命令，但前后端类型仍各自维护",
        why: "Monorepo 先解决安装、构建和脚本编排，不把尚不存在的共享 DTO 包写成既成事实。",
        tag: "工程组织",
        problem: "前端 Vue/Vite 与后端 Express 的依赖、构建入口和发布产物不同。",
        solution: "根目录用 pnpm filter 编排两个 package，Node 与 TypeScript 版本通过 workspace 约束。",
        impact: "一条根命令可以启动、构建或 lint 两端，发布脚本也能同步产物。",
        tradeoff: "接口类型尚未抽成共享 package，后端也没有可执行的自动测试脚本。",
        highlight: "pnpm -C frontend build && pnpm -C backend build",
      },
    ],
    metrics: [
      { label: "模型适配器", value: "5 种 provider", tag: "MODEL PORTS", status: "verified", description: "代码包含 Spark、Kimi、Qianwen、Ernie 与 Zhipu 适配器，运行时只加载具备配置的 provider。" },
      { label: "聊天请求边界", value: "30s + 2 次重试", tag: "HTTP CLIENT", status: "benchmark", description: "当前 AIChatWindow 使用普通 Axios 请求；超时 30 秒，失败后最多重试两次，每次固定等待 1 秒。" },
      { label: "SSE 负载通道", value: "1 条 content", tag: "SERVER STREAM", status: "realtime", description: "后端流端点只发送 { content } 和 [DONE]，没有 thought/content 双轨字段；当前聊天 UI 尚未消费它。" },
      { label: "自动化测试门禁", value: "尚未建立", tag: "KNOWN GAP", status: "hardened", description: "backend package 的 test 脚本明确返回失败，仓库也未发现对应测试文件；不能声称 99.9% 可用或固定容灾时延。" },
    ],
    tradeoffs: [
      {
        title: "稳定图谱优先于物理漂移效果",
        detail: "分层坐标让同一先修关系每次打开都处于可预测位置，推荐路径也更容易追踪。",
        boundary: "同层节点增多时横向宽度会快速增长；当前没有视口剔除、折叠层级或大图性能基准。",
        next: "先加入层级折叠和可见区域渲染，再用真实知识点规模决定是否引入离线布局算法。",
      },
      {
        title: "服务端流能力与前端体验分开验收",
        detail: "单通道 SSE 路由已经实现，但当前界面仍以完整响应渲染 Markdown 和 KaTeX。",
        boundary: "没有前端流读取、增量 AST、未闭合公式修补或双轨思维链协议，因此不宣称 TTFT 指标。",
        next: "接入前先定义事件 schema、取消与重连状态机，再用真实模型响应测试 Markdown 和公式的增量稳定性。",
      },
      {
        title: "顺序降级是起点，不是自适应容灾",
        detail: "Provider 抽象和 fallback 顺序已经消除业务层对单一模型类的直接依赖。",
        boundary: "当前没有熔断、退避、动态权重、请求幂等或切换耗时观测，流式失败还需处理部分输出。",
        next: "先补自动测试与结构化指标，再决定是否需要基于健康窗口的熔断和流式接续策略。",
      },
    ],
  },
};
