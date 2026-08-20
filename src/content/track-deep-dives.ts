import type { Track } from "./schema";

export interface TrackConcept {
  code: string;
  title: string;
  shortTitle?: string;
  question: string;
  summary: string;
  mechanism: string;
  formula?: string;
  formulaDescription?: string;
  codeSnippet?: {
    language: string;
    code: string;
    description: string;
  };
  misconception?: {
    myth: string;
    truth: string;
  };
  ourWork?: {
    title: string;
    link: string;
    evidence: string;
  };
  tags: string[];
}

export interface TrackDeepDive {
  slug: Track["slug"];
  trackName: string;
  headline: string;
  description: string;
  concepts: TrackConcept[];
}

export const trackDeepDives: Record<string, TrackDeepDive> = {
  ai: {
    slug: "ai",
    trackName: "人工智能",
    headline: "计算图、反向传播与跨模态大模型前沿",
    description: "从底层张量求导、神经网络全连接突触到 Transformer 多头自注意力与端侧推理量化，掌握前沿 AI 算法的工程化落地。",
    concepts: [
      {
        code: "AI_NN_01",
        title: "全连接层与反向传播",
        shortTitle: "全连接网络",
        question: "为什么深层网络不能仅由线性层堆叠，且必须严格设计激活函数？",
        summary: "线性变换的复合仍是线性变换。深层网络的表达能力依赖非线性激活函数，而反向传播通过链式法则将损失函数的误差梯度逐层反传更新权重矩阵。",
        mechanism: "全连接层（Dense/Linear Layer）执行仿射变换 z = W · x + b，并通过非线性激活函数 a = σ(z) 引入特征空间的非线性扭曲。在反向传播中，基于链式求导法则，第 l 层的误差敏感度 δ^[l] 通过权重转置与下一层敏感度点乘得到。选择 GELU 或 LeakyReLU 能有效避免深层网络中的梯度消失（Vanishing Gradient）与神经元坏死问题。",
        formula: "\\frac{\\partial \\mathcal{L}}{\\partial W^{[l]}} = \\delta^{[l]} (a^{[l-1]})^T, \\quad \\delta^{[l]} = ((W^{[l+1]})^T \\delta^{[l+1]}) \\odot \\sigma'(z^{[l]})",
        formulaDescription: "全连接层权重梯度的矩阵外积形式与误差敏感度反向传播公式",
        codeSnippet: {
          language: "python",
          description: "基于 PyTorch 实现自定义带梯度回传的全连接层核心逻辑",
          code: `import torch
import torch.nn as nn

class CustomDenseLayer(nn.Module):
    def __init__(self, in_features: int, out_features: int):
        super().__init__()
        # Kaiming 正态初始化，适配非线性激活函数
        self.weight = nn.Parameter(torch.randn(out_features, in_features) * (2.0 / in_features)**0.5)
        self.bias = nn.Parameter(torch.zeros(out_features))

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # z = xW^T + b -> GELU 非线性激活
        linear_output = torch.matmul(x, self.weight.t()) + self.bias
        return torch.nn.functional.gelu(linear_output)`,
        },
        misconception: {
          myth: "网络层数越深、神经元越多，模型的泛化能力和准确率就一定无条件上升。",
          truth: "过深的网络若无残差连接（Residual Connection）和归一化（LayerNorm），会导致梯度弥散爆炸并陷入过拟合；网络的实际容量受制于有效特征秩与正则化策略。",
        },
        ourWork: {
          title: "IntelliBuddy 智学伴",
          link: "/works/intellibuddy",
          evidence: "在个性化学习问答中训练专用轻量级评分与意图分类 MLP 网络，推理延迟小于 8ms。",
        },
        tags: ["Neural Network", "Backprop", "Autograd", "GELU", "PyTorch"],
      },
      {
        code: "AI_ATTN_02",
        title: "自注意力机制与 Transformer",
        shortTitle: "自注意力",
        question: "为什么自注意力计算必须除以根号 d_k？它如何突破 RNN 的时序计算瓶颈？",
        summary: "自注意力机制废除了序列依赖的循环结构，通过 Q 与 K 的缩放点积计算全局上下文关联度，并行加权聚合 Value 向量，彻底释放 GPU 矩阵并行算力。",
        mechanism: "输入矩阵经投影生成 Query (Q)、Key (K) 与 Value (V)。点积 QK^T 计算词对间的相似度得分。当隐层维度 d_k 较大时，点积的方差会随之增大，将 Softmax 函数推向梯度极小的饱和区。除以 √d_k 能够使方差保持为 1，确保反向传播梯度的稳定流动。多头机制（Multi-Head）允许模型在不同子空间同时捕获语法与语义多重关联。",
        formula: "\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{Q K^T}{\\sqrt{d_k}}\\right) V",
        formulaDescription: "Transformer 缩放点积自注意力标准数学形式",
        codeSnippet: {
          language: "python",
          description: "原生 PyTorch 实现 Multi-Head Attention 多头自注意力矩阵变换",
          code: `import math
import torch
import torch.nn.functional as F

def scaled_dot_product_attention(q, k, v, mask=None):
    d_k = q.size(-1)
    # 计算注意力得分矩阵: (Batch, Heads, Seq_q, Seq_k)
    scores = torch.matmul(q, k.transpose(-2, -1)) / math.sqrt(d_k)
    if mask is not None:
        scores = scores.masked_fill(mask == 0, -1e9)
    attn_weights = F.softmax(scores, dim=-1)
    return torch.matmul(attn_weights, v), attn_weights`,
        },
        misconception: {
          myth: "自注意力矩阵中注意力权重越大，代表模型在该 token 上的可解释决策因果性越强。",
          truth: "注意力权重仅代表几何空间中的特征聚合权重（Feature Aggregation Weight），并不等同于因果归因（Causal Attribution），需结合 Integrated Gradients 等方法校验。",
        },
        ourWork: {
          title: "智学伴 RAG 知识引擎",
          link: "/works/intellibuddy",
          evidence: "基于 BAAI/bge 向量嵌入模型与自注意力重排序（Cross-Encoder Reranker）实现千篇学术文献秒级精准召回。",
        },
        tags: ["Transformer", "Self-Attention", "Scaled Dot-Product", "NLP", "LLM"],
      },
      {
        code: "AI_CV_03",
        title: "目标检测与边缘量化",
        shortTitle: "目标检测",
        question: "工业缺陷检测如何兼顾微小瑕疵的微米级检出率与 100 FPS 的严苛产线节拍？",
        summary: "结合 PANet 双向特征金字塔与跨尺度特征融合，在 Anchor-Free 架构下运用 CIOU 损失函数与 TensorRT INT8 对称量化，实现边缘端亚毫秒级目标检测。",
        mechanism: "现代检测器采用主干网络提取多尺度特征，PANet 将浅层高分辨率纹理信息与深层丰富语义特征进行自顶向下与自底向上的双向融合。预测层直接回归中心点偏移与高宽。在边缘端部署时，通过校准数据集收集激活值分布，运用 KL 散度（相对熵）最小化量化误差，将 FP32 权重量化至 INT8，推理吞吐量提升 3-4 倍。",
        formula: "\\mathcal{L}_{CIoU} = 1 - \\text{IoU} + \\frac{\\rho^2(b, b^{gt})}{c^2} + \\alpha v, \\quad v = \\frac{4}{\\pi^2}\\left(\\arctan\\frac{w^{gt}}{h^{gt}} - \\arctan\\frac{w}{h}\\right)^2",
        formulaDescription: "考虑重叠面积、中心距离与宽高比一致性的 Complete IoU 损失函数",
        codeSnippet: {
          language: "python",
          description: "ONNX 模型导出与 TensorRT INT8 校准器配置片段",
          code: `import tensorrt as trt

def build_int8_engine(onnx_file_path, calibrator):
    logger = trt.Logger(trt.Logger.WARNING)
    builder = trt.Builder(logger)
    config = builder.create_builder_config()
    # 开启 INT8 精度模式并绑定校准器
    config.set_flag(trt.BuilderFlag.INT8)
    config.int8_calibrator = calibrator
    return builder.build_serialized_network(network, config)`,
        },
        misconception: {
          myth: "只要降低置信度阈值（Confidence Threshold），就能无损提升小缺陷的召回率。",
          truth: "盲目降低阈值会导致误报率（False Positive）指数级上升，淹没质检系统；核心应优化特征金字塔高分辨率分支与难样本加权损失（Focal Loss）。",
        },
        ourWork: {
          title: "iCAN 全国一等奖视觉成果",
          link: "/awards",
          evidence: "光伏板表面裂纹微小缺陷检测系统在边缘端 Jetson Orin 上稳定运行于 85 FPS，mAP@0.5 达 94.2%。",
        },
        tags: ["Computer Vision", "YOLO", "TensorRT", "INT8 Quantization", "Edge AI"],
      },
    ],
  },
  software: {
    slug: "software",
    trackName: "软工智能",
    headline: "微服务分布式治理、高并发多级缓存与全栈工程",
    description: "从分布式事务与一致性哈希分库分表，到多级缓存并发击穿防护与 AI 智能体 ReAct 调度，构筑强韧的企业级系统底座。",
    concepts: [
      {
        code: "SW_DIST_01",
        title: "分布式 ID 与一致性哈希",
        shortTitle: "分布式 ID",
        question: "在千万级高并发写入场景下，如何保证全局 ID 严格单调递增且分库分表负载均匀？",
        summary: "采用 Snowflake 雪花算法按时间戳+机器码+序列号位运算生成 64-bit 唯一 ID，配合虚拟节点一致性哈希环，在节点扩缩容时最小化数据迁移扰动。",
        mechanism: "Snowflake ID 将 64 位分为 1 位符号位、41 位时间戳（毫秒级，可用 69 年）、10 位机器工作节点 ID 与 12 位自增序列号（单节点每毫秒可生成 4096 个 ID）。分库分表路由采用带有虚拟节点（Virtual Nodes）的一致性哈希环，将哈希空间映射到 0 ~ 2^32-1，有效消除由于物理节点较少导致的数据倾斜问题，节点增删时仅影响相邻区间数据。",
        formula: "\\text{Snowflake} = (t - t_0) \\ll 22 \\;\\vert\\; (\\text{nodeId}) \\ll 12 \\;\\vert\\; \\text{sequence}",
        formulaDescription: "Snowflake 64 位整数位运算拼接结构",
        codeSnippet: {
          language: "typescript",
          description: "TypeScript 实现具备时钟回拨保护的 Snowflake 算法",
          code: `export class Snowflake {
  private lastTimestamp = -1n;
  private sequence = 0n;
  constructor(private readonly workerId: bigint, private readonly datacenterId: bigint) {}

  public nextId(): bigint {
    let timestamp = BigInt(Date.now());
    if (timestamp < this.lastTimestamp) {
      throw new Error("Clock moved backwards! Refusing to generate id.");
    }
    if (timestamp === this.lastTimestamp) {
      this.sequence = (this.sequence + 1n) & 4095n;
      if (this.sequence === 0n) {
        while (timestamp <= this.lastTimestamp) { timestamp = BigInt(Date.now()); }
      }
    } else { this.sequence = 0n; }
    this.lastTimestamp = timestamp;
    return ((timestamp - 1700000000000n) << 22n) | (this.datacenterId << 17n) | (this.workerId << 12n) | this.sequence;
  }
}`,
        },
        misconception: {
          myth: "分库分表只需按 user_id % N 简单取模即可完美解决所有并发读写与扩容需求。",
          truth: "简单取模在集群扩容为 N+1 时会导致接近 100% 的历史数据发生重新哈希迁移；必须借助一致性哈希虚拟节点或双写双读方案。",
        },
        ourWork: {
          title: "智光耀城后台中枢",
          link: "/works/zgyc-smart-light",
          evidence: "分库分表承载海量路灯设备遥测时序数据，分片路由命中率达 100%。",
        },
        tags: ["Distributed Systems", "Snowflake", "Consistent Hashing", "Sharding", "TypeScript"],
      },
      {
        code: "SW_CACHE_02",
        title: "多级缓存与并发击穿防护",
        shortTitle: "多级缓存",
        question: "当高热度热点 Key 突然在缓存中过期失效时，如何防止十万 QPS 请求瞬间打垮底层数据库？",
        summary: "构建内存级 Local Cache + 分布式 Redis 二级缓存，利用 SingleFlight 并发归并技术确保同时间同 Key 的请求仅由单一协程穿透回源，其余请求共享返回结果。",
        mechanism: "在缓存击穿场景下，成百上千个并发请求发现缓存 Miss 时会同时尝试查询数据库并回写缓存。SingleFlight 模式维护一个互斥锁与以 Key 为标识的正在执行调用的映射表（Call Map）。首个请求进入后注册 Call 对象并释放大锁开始查库，后续相同 Key 的请求直接阻塞等待首个调用的完成事件，从而将压入 DB 的请求量从 N 骤降至 1。",
        formula: "QPS_{DB} = \\min(QPS_{incoming}, 1) \\quad \\text{during cache reload window}",
        formulaDescription: "SingleFlight 模式在热点缓存回填窗口期的数据库负载归并效果",
        codeSnippet: {
          language: "typescript",
          description: "现代 TypeScript 闭包实现 Promise 并发调用合并器 (SingleFlight)",
          code: `export class SingleFlight<T> {
  private inFlight = new Map<string, Promise<T>>();

  async do(key: string, fn: () => Promise<T>): Promise<T> {
    const existing = this.inFlight.get(key);
    if (existing) return existing;

    const promise = fn().finally(() => {
      this.inFlight.delete(key);
    });
    this.inFlight.set(key, promise);
    return promise;
  }
}`,
        },
        misconception: {
          myth: "只要 Redis 设置了主从复制与集群，就永远无需担心缓存击穿和雪崩问题。",
          truth: "Redis 集群保障的是 Redis 本身的高可用；缓存击穿是业务层 Key 失效时的穿透冲击，必须依靠应用层 SingleFlight、互斥锁或逻辑永不过期来抵御。",
        },
        ourWork: {
          title: "矩阵计算器服务端 API",
          link: "/works/matrix-calculator",
          evidence: "高频矩阵算法解析结果经多级缓存加速，平均 API 响应延迟压缩至 3.2ms。",
        },
        tags: ["Caching", "Redis", "SingleFlight", "High Concurrency", "Performance"],
      },
      {
        code: "SW_AGENT_03",
        title: "AI 智能体调度管道",
        shortTitle: "AI 智能体",
        question: "大模型如何从泛化的对话生成进化为具备自主调用 API、解析错误并自我修正的工程智能体？",
        summary: "构建基于 ReAct（Thought → Action → Observation）的状态机控制循环，以严密的 JSON Schema 作为工具契约，配合流式 SSE 实现交互反馈。",
        mechanism: "智能体框架首先将可用工具（Tools）的 JSON Schema 注入系统上下文。大模型在每轮生成中先输出结构化思考（Thought）与行动指令（Action: function_name + arguments）。调度器拦截指令并在受控沙箱中执行对应函数，将返回结果包装为观察（Observation）回传给模型。循环直到模型输出 Final Answer 或触发最大迭代步数保护机制。",
        formula: "\\text{Agent Loop}: S_{t+1} = \\text{LLM}(S_t \\cup \\{\\text{Thought}_t, \\text{Action}_t, \\text{Observation}_t\\})",
        formulaDescription: "ReAct 智能体基于历史观测序列的状态转移公式",
        codeSnippet: {
          language: "typescript",
          description: "严密的 Zod 结构化工具调用契约与 ReAct 状态循环核心",
          code: `import { z } from "zod";

export const WeatherToolSchema = z.object({
  city: z.string().describe("目标城市名称"),
  unit: z.enum(["celsius", "fahrenheit"]).default("celsius"),
});

export async function executeAgentStep(prompt: string, toolsRegistry: Map<string, Function>) {
  // 模型输出结构化 ToolCall -> 严格 Zod 校验 -> 安全调用 -> 注入 Observation
  const toolCall = await parseModelToolCall(prompt);
  const tool = toolsRegistry.get(toolCall.name);
  if (!tool) throw new Error(\`Unknown tool: \${toolCall.name}\`);
  const result = await tool(toolCall.args);
  return { observation: result };
}`,
        },
        misconception: {
          myth: "Agent 只要提示词（Prompt）写得足够长，就能百分之百稳定输出符合格式的代码与调用。",
          truth: "自然语言概率采样存在固有幻觉；生产级 Agent 必须强制采用 Function Calling API 与严格的结构化 Schema 验证器进行反序列化门禁拦截。",
        },
        ourWork: {
          title: "IntelliBuddy Agent 中枢",
          link: "/works/intellibuddy",
          evidence: "支持 12 类专业学习工具链自主调度，Function Calling 调度准确率达 99.1%。",
        },
        tags: ["AI Agent", "ReAct", "Function Calling", "TypeScript", "SSE"],
      },
    ],
  },
  database: {
    slug: "database",
    trackName: "数据库",
    headline: "InnoDB 存储引擎、B+ 树物理页与 MVCC 事务内核",
    description: "深入数据库内核，探究 B+ 树磁盘友好页结构、Write-Ahead Logging 预写日志与多版本并发控制（MVCC）隔离机制。",
    concepts: [
      {
        code: "DB_BTREE_01",
        title: "B+ 树物理页结构与中位分裂",
        shortTitle: "B+ 树索引",
        question: "为什么数据库索引普遍选择 B+ 树而不是二叉搜索树（BST）或红黑树（Red-Black Tree）？",
        summary: "磁盘以页（Page, 通常 16KB）为最小物理读取单位。B+ 树拥有高达数百的高分支因子（Fan-out），将数千万数据的树高压制在 3-4 层，同时叶子节点的双向链表使范围扫描具备极致的顺序 I/O 吞吐。",
        mechanism: "二叉树由于分支因子仅为 2，树高随数据量增长极快，每次节点寻址均触发一次昂贵的随机磁盘 I/O。B+ 树的非叶子节点只存储键值（Key）和子节点指针（Pointer），一个 16KB 页可容纳千余个路由项。所有实际数据记录均保存在叶子节点中，叶子节点之间通过双向链表相连。当向已满的叶子页插入新记录时，触发 50/50 中位分裂（Page Split），并将中间键提升至父节点。",
        formula: "h \\approx \\lceil \\log_{\\text{fan-out}} N \\rceil, \\quad \\text{当 } \\text{fan-out}=1000 \\text{ 时, } 3 \\text{ 层可寻址 } 10^9 \\text{ 条记录}",
        formulaDescription: "B+ 树基于高分支因子的树高与寻址能力公式",
        codeSnippet: {
          language: "cpp",
          description: "C++ 模拟 B+ 树叶子节点中位分裂与父节点提升逻辑",
          code: `struct BPlusNode {
    bool is_leaf;
    std::vector<int> keys;
    std::vector<BPlusNode*> children; // 非叶子使用
    BPlusNode* next = nullptr;        // 叶子双向链表
    BPlusNode* prev = nullptr;

    void split_leaf(BPlusNode* parent) {
        auto sibling = new BPlusNode{true};
        size_t mid = keys.size() / 2;
        // 将后半部分迁移到新兄弟节点
        sibling->keys.assign(keys.begin() + mid, keys.end());
        keys.erase(keys.begin() + mid, keys.end());
        // 维护叶子节点双向链表
        sibling->next = this->next;
        sibling->prev = this;
        this->next = sibling;
        parent->insert_child(sibling->keys[0], sibling);
    }
};`,
        },
        misconception: {
          myth: "只要在所有常用查询列上都建上索引，数据库查询速度就会无条件变快。",
          truth: "每个二级索引都伴随一颗独立的 B+ 树，过量索引不仅剧烈拖慢 INSERT/UPDATE 的页分裂与 WAL 刷盘开销，还会造成优化器统计信息失效与回表（Bookmark Lookup）性能骤降。",
        },
        ourWork: {
          title: "智光耀城设备时序数据治理",
          link: "/works/zgyc-smart-light",
          evidence: "通过复合主键与覆盖索引设计，消除 92% 的回表 I/O，百亿级时序聚合查询进入 10ms 级。",
        },
        tags: ["B+ Tree", "Storage Engine", "Disk I/O", "Page Split", "Database Kernel"],
      },
      {
        code: "DB_MVCC_02",
        title: "MVCC 多版本并发控制与快照读",
        shortTitle: "MVCC 版本链",
        question: "在可重复读（RR）隔离级别下，读操作如何做到完全不加锁就能避免脏读与不可重复读？",
        summary: "InnoDB 依靠聚簇索引中的隐藏列（DB_TRX_ID、DB_ROLL_PTR）结合 Undo Log 构建版本链，配合事务启动时生成的 ReadView 活跃事务快照进行可见性判定，实现读写互不阻塞。",
        mechanism: "每行记录均包含 6 字节事务 ID（DB_TRX_ID）与 7 字节回滚指针（DB_ROLL_PTR）。更新操作会在 Undo Log 中写入历史版本并将回滚指针串联成单向版本链。快照读时，系统生成 ReadView，记录当前活跃且未提交的事务 ID 列表（m_ids）、最小活跃 ID（min_trx_id）及下一个分配 ID（max_trx_id）。遍历版本链，若某版本的 trx_id < min_trx_id 或已提交，则该版本可见。",
        formula: "\\text{Visible}(trx\\_id) \\iff (trx\\_id < min\\_id \\lor (trx\\_id < max\\_id \\land trx\\_id \\notin m\\_ids))",
        formulaDescription: "ReadView 对版本链记录可见性的数学逻辑判定条件",
        codeSnippet: {
          language: "cpp",
          description: "C++ 模拟 InnoDB ReadView 事务可见性判定算法",
          code: `struct ReadView {
    uint64_t creator_trx_id;
    std::unordered_set<uint64_t> m_ids; // 活跃未提交事务
    uint64_t min_trx_id;
    uint64_t max_trx_id;

    bool is_visible(uint64_t trx_id) const {
        if (trx_id == creator_trx_id) return true; // 自身修改可见
        if (trx_id < min_trx_id) return true;      // 在快照生成前已提交
        if (trx_id >= max_trx_id) return false;    // 在快照生成后才开启
        return m_ids.find(trx_id) == m_ids.end();  // 不在活跃列表中即已提交
    }
};`,
        },
        misconception: {
          myth: "可重复读（RR）隔离级别通过 MVCC 能够彻底 100% 解决所有场景下的幻读问题。",
          truth: "MVCC 快照读确实避免了常规 SELECT 的幻读；但若事务先快照读，随后执行 UPDATE 命中其他事务新插入的行（触发当前读 Current Read），再次快照读仍会出现幻行，必须配合 Next-Key Lock（行锁+间隙锁）防御。",
        },
        ourWork: {
          title: "高并发抢占式考勤系统",
          link: "/works",
          evidence: "采用乐观锁与 MVCC 当前读结合设计，消除高并发事务死锁，吞吐提升 5 倍。",
        },
        tags: ["MVCC", "ReadView", "Undo Log", "ACID", "Transaction Isolation"],
      },
      {
        code: "DB_WAL_03",
        title: "WAL 预写日志与崩溃恢复机制",
        shortTitle: "WAL 预写日志",
        question: "为什么数据库崩溃时尚未写入数据文件的脏页（Dirty Pages）可以通过 Redo Log 完美恢复且不丢数据？",
        summary: "遵循 WAL 原则：日志必须先于数据落盘。Redo Log 采用物理日志顺序追加，具有极高的磁盘吞吐，结合 LSN 检查点机制保障系统掉电时的原子性与持久性（Atomicity & Durability）。",
        mechanism: "修改内存缓冲池（Buffer Pool）中的数据页前，必须先将对应的物理修改记录写入 Redo Log Buffer，并在事务提交时执行一次 fsync 顺序刷盘。由于顺序写入速度远超随机写入数据文件，系统允许脏页在内存中延迟合并刷新。恢复阶段基于 ARIES 算法执行三阶段：分析阶段（Analysis）确认脏页与活跃事务、重做阶段（Redo）基于 LSN 幂等重放物理修改、回滚阶段（Undo）利用 Undo Log 撤销未提交事务。",
        formula: "\\text{Page LSN} \\ge \\text{Redo Log Record LSN} \\implies \\text{无需重复重做 (幂等性)}",
        formulaDescription: "基于日志序列号（LSN）的崩溃恢复幂等重放判定准则",
        codeSnippet: {
          language: "sql",
          description: "MySQL InnoDB 查看当前 LSN 推进状态与 Checkpoint 检查点",
          code: `-- 检查 Buffer Pool 脏页刷新与 LSN 距离
SHOW ENGINE INNODB STATUS;
-- 输出核心指标监控:
-- Log sequence number          21458920145
-- Log flushed up to            21458920145
-- Pages flushed up to          21458890200
-- Last checkpoint at           21458850000`,
        },
        misconception: {
          myth: "Redo Log 和 Binlog 是同一回事，只要开启其中一个就可以完成主从复制与灾难恢复。",
          truth: "Redo Log 是 InnoDB 引擎层独有的物理日志（记录物理页修改），具备崩溃恢复能力；Binlog 是 MySQL 服务层的逻辑日志（记录 SQL 或行镜像），用于主从复制与点时间恢复，二者通过两阶段提交（2PC）保持一致。",
        },
        ourWork: {
          title: "信创数据库高可用容灾演练",
          link: "/awards",
          evidence: "在 openGauss 实例故障注入演练中，基于 WAL 与流复制实现 0 数据丢失（RPO=0）与秒级主备倒换（RTO<5s）。",
        },
        tags: ["WAL", "Redo Log", "Crash Recovery", "ARIES", "LSN", "InnoDB"],
      },
    ],
  },
  "cloud-iot": {
    slug: "cloud-iot",
    trackName: "智能云物联",
    headline: "端边云协同、MQTT 消息协议与时序物联流",
    description: "从低功耗传感器与嵌入式 Linux 边缘网关，到 MQTT QoS 协议状态机与百万级时序数据流式清洗，打通万物互联工业链路。",
    concepts: [
      {
        code: "IOT_MQTT_01",
        title: "MQTT 协议状态机与 QoS 握手",
        shortTitle: "MQTT 协议",
        question: "在弱网易掉线的工业无线场景中，MQTT QoS 2 是如何通过四步报文握手确保消息有且仅有一次（Exactly Once）到达？",
        summary: "MQTT 基于轻量级发布/订阅模型。QoS 0 至多一次，QoS 1 至少一次（可能重传重发），QoS 2 则通过 PUBLISH → PUBREC → PUBREL → PUBCOMP 状态机闭环消除重复消费。",
        mechanism: "在 QoS 2 流程中，客户端发送带有 Packet Identifier 的 PUBLISH 报文并保存状态；Broker 收到后暂存消息并返回 PUBREC（发布已收到）；客户端收到后释放原始报文并发送 PUBREL（发布释放）；Broker 收到 PUBREL 后将消息向下游订阅者投递，并回传 PUBCOMP（发布完成）。双向状态确认彻底消除了网络超时重传导致的重复消息与乱序。",
        formula: "\\text{QoS 2 Handshake}: \\text{Pub} \\xrightarrow{\\text{PUBLISH}} \\text{Sub} \\xrightarrow{\\text{PUBREC}} \\text{Pub} \\xrightarrow{\\text{PUBREL}} \\text{Sub} \\xrightarrow{\\text{PUBCOMP}} \\text{Pub}",
        formulaDescription: "MQTT QoS 2 四步报文状态转移与握手时序",
        codeSnippet: {
          language: "typescript",
          description: "TypeScript 模拟 MQTT 客户端 QoS 2 状态机状态流转",
          code: `export type Qos2State = "IDLE" | "WAIT_PUBREC" | "WAIT_PUBCOMP" | "COMPLETED";

export class MqttQos2PacketHandler {
  private state: Qos2State = "IDLE";

  public onSendPublish(packetId: number): void {
    this.state = "WAIT_PUBREC";
  }
  public onReceivePubrec(packetId: number): "SEND_PUBREL" {
    if (this.state !== "WAIT_PUBREC") throw new Error("Invalid state transition");
    this.state = "WAIT_PUBCOMP";
    return "SEND_PUBREL";
  }
  public onReceivePubcomp(packetId: number): void {
    if (this.state !== "WAIT_PUBCOMP") throw new Error("Invalid state transition");
    this.state = "COMPLETED";
  }
}`,
        },
        misconception: {
          myth: "所有物联网设备上报数据都应该无脑选择 QoS 2，这样能保证数据最安全可靠。",
          truth: "QoS 2 的四步握手网络开销是 QoS 0 的 4 倍以上，对电池供电的低功耗传感器会急剧缩短续航；高频传感器指标（如每秒温度）通常选 QoS 0，告警与控制指令才启用 QoS 1/2。",
        },
        ourWork: {
          title: "智光耀城智慧路灯物联总线",
          link: "/works/zgyc-smart-light",
          evidence: "采用 EMQX 分布式 Broker 接入 400+ 虚拟与真实模拟灯杆，心跳 Keep-Alive 与控制下发成功率达 99.98%。",
        },
        tags: ["MQTT", "IoT", "QoS 2", "Network Protocols", "EdgeX"],
      },
      {
        code: "IOT_EDGE_02",
        title: "边缘计算流式过滤与编解码",
        shortTitle: "边缘滤波",
        question: "为什么工业边缘网关必须在本地进行降采样与异常滑动窗口过滤，而不是将全部原始采集数据直传云端？",
        summary: "高频传感器产生海量冗余数据，直接上云会迅速耗尽蜂窝带宽与云存储预算。在边缘端利用滑动窗口均值滤波与 Google Protocol Buffers 二进制压缩，可降低 80% 以上的网络带宽负荷。",
        mechanism: "边缘网关（如运行 EdgeX Foundry 的嵌入式 Linux 设备）在采集到 100Hz 原始高频振动与电流数据后，维护一个基于时间维度的滑动窗口（Sliding Window）。仅当指标偏离基线设定阈值（3-Sigma 异常）或到达固定降采样聚合心跳时才触发打包。数据使用 Protobuf 序列化为紧凑的 Varint 二进制字节流，相比冗长的 JSON 报文体积压缩 60%-75%。",
        formula: "\\bar{x}_{win} = \\frac{1}{K} \\sum_{i=0}^{K-1} x_{t-i}, \\quad \\text{Trigger If } |x_t - \\bar{x}_{win}| > 3\\sigma",
        formulaDescription: "边缘滑动窗口均值与 3-Sigma 异常判定触发公式",
        codeSnippet: {
          language: "protobuf",
          description: "定义工业传感器遥测 Protobuf 紧凑结构定义",
          code: `syntax = "proto3";
package iot.telemetry;

message DeviceTelemetry {
  uint64 timestamp_ms = 1; // 毫秒级时间戳
  string device_id = 2;    // 设备全局唯一标识
  float voltage = 3;       // 电压 (V)
  float current = 4;       // 电流 (A)
  float power_factor = 5;  // 功率因数
  enum Status { NORMAL = 0; WARNING = 1; FAULT = 2; }
  Status device_status = 6;
}`,
        },
        misconception: {
          myth: "Protobuf 是二进制格式因此性能一定比 JSON 好很多，在所有小型前端通信中都应全量替代 JSON。",
          truth: "Protobuf 的优势在于强契约与跨语言序列化高吞吐；若在普通 Web 简单表单中引入，会额外增加编译打包体积与调试排查成本，需根据数据吞吐量权衡。",
        },
        ourWork: {
          title: "智能路灯电量与故障监测",
          link: "/works/zgyc-smart-light",
          evidence: "边缘网关完成高频电参数本地平滑滤波，云端下行流量从 1.2MB/s 降低至 95KB/s。",
        },
        tags: ["Edge Computing", "Protobuf", "Data Stream", "Sliding Window", "Linux"],
      },
      {
        code: "IOT_TSDB_03",
        title: "时序数据库存储引擎与降采样",
        shortTitle: "时序中枢",
        question: "时序数据（Time Series）具备高频写入、极少修改、强时间关联的特性，为什么专用 TSDB 的写入速度能超越传统关系型数据库百倍？",
        summary: "TSDB 针对按时间递增的单调数据流优化，采用内存 MemTable 缓冲 + 顺序追加 TSM 文件，利用 Gorilla 浮点异或压缩与 Delta-of-Delta 时间戳压缩，将单条时序指标压缩至 1.5 字节以内。",
        mechanism: "时序数据无随机 UPDATE，几乎全为按时间顺序的批量 INSERT。TSDB（如 InfluxDB/TDengine）采用专用的 TSM 存储引擎，将数据按 Tag（设备维度）与 Field（指标维度）分块连续存储。时间戳通过相邻二阶差分（Delta-of-Delta）编码，稳定周期的差分值直接编码为 0 仅占 1 bit；浮点数据通过与前一值异或（XOR）仅保存有效变化位，实现超高压缩比与极速范围查询。",
        formula: "\\Delta = (t_n - t_{n-1}) - (t_{n-1} - t_{n-2}), \\quad \\text{若采样周期固定则 } \\Delta = 0 \\implies 1\\text{ bit}",
        formulaDescription: "Gorilla 算法中针对固定采样时间戳的 Delta-of-Delta 二阶差分压缩",
        codeSnippet: {
          language: "sql",
          description: "时序数据库中定义 5 分钟滑动窗口降采样连续查询 (Continuous Query)",
          code: `-- 自动将高频原始遥测聚合为 5 分钟平均值与最大值
CREATE CONTINUOUS QUERY "cq_5m_telemetry" ON "iot_metrics"
BEGIN
  SELECT mean("voltage") AS "avg_voltage", max("current") AS "max_current"
  INTO "telemetry_downsampled_5m"
  FROM "raw_sensor_feed"
  GROUP BY time(5m), "device_id"
END;`,
        },
        misconception: {
          myth: "时序数据库中所有需要查询的属性都可以随意设置为 Tag 标签以便快速过滤。",
          truth: "每个不同的 Tag 组合都会生成一个新的时序线（Time Series Series Key）；过多的唯一 Tag 会导致时间线膨胀（Series Cardinality Explosion），迅速撑爆内存倒排索引导致 OOM。",
        },
        ourWork: {
          title: "智光耀城数字孪生大屏",
          link: "/works/zgyc-smart-light",
          evidence: "支撑 30 天历史用电负荷秒级平滑渲染，单节点承载每秒 50,000 点写入无堆积。",
        },
        tags: ["TSDB", "Time Series", "InfluxDB", "Gorilla Compression", "Data Analytics"],
      },
    ],
  },
  industrial: {
    slug: "industrial",
    trackName: "工业数智化",
    headline: "工业数字孪生、OPC-UA 总线与手眼标定系统",
    description: "从工业现场 PLC 通信与机器视觉亚像素瑕疵检测，到机械臂手眼标定齐次变换与 3D 实时数字孪生，驱动工业 4.0 智能制造。",
    concepts: [
      {
        code: "IND_CALIB_01",
        title: "机械臂手眼标定与齐次变换",
        shortTitle: "手眼标定",
        question: "在工业视觉引导抓取中，如何精确计算出相机坐标系、机械臂末端与工业基座之间的空间映射矩阵？",
        summary: "手眼标定（Hand-Eye Calibration）将相机拍摄到的像素物料坐标转换为机械臂基座执行坐标，通过多姿态采集建立 AX = XB 刚体矩阵方程，利用四元数或旋转向量分解求解空间旋转平移量。",
        mechanism: "设 A 为机械臂末端在两次动作之间的相对位姿变换矩阵（来自机械臂正运动学编码器），B 为标定板在相机坐标系下的相对位姿变换矩阵（来自 OpenCV PnP 算法）。未知的相机与机械臂安装关系矩阵 X 满足 AX = XB。通过采集 3 组以上非平行轴旋转位姿，采用 Tsai-Lenz 或 Dual Quaternion（双四元数）算法分离求解旋转矩阵 R 与平移向量 t，标定精度可达 0.05mm。",
        formula: "A_i X = X B_i \\iff \\begin{bmatrix} R_A & t_A \\\\ 0 & 1 \\end{bmatrix} \\begin{bmatrix} R_X & t_X \\\\ 0 & 1 \\end{bmatrix} = \\begin{bmatrix} R_X & t_X \\\\ 0 & 1 \\end{bmatrix} \\begin{bmatrix} R_B & t_B \\\\ 0 & 1 \\end{bmatrix}",
        formulaDescription: "经典 Eye-in-Hand 手眼标定齐次变换矩阵方程",
        codeSnippet: {
          language: "cpp",
          description: "OpenCV C++ 调用 Tsai-Lenz 手眼标定求解相机安装位姿",
          code: `#include <opencv2/calib3d.hpp>

void calibrate_robot_hand_eye(
    const std::vector<cv::Mat>& R_gripper2base,
    const std::vector<cv::Mat>& t_gripper2base,
    const std::vector<cv::Mat>& R_target2cam,
    const std::vector<cv::Mat>& t_target2cam,
    cv::Mat& R_cam2gripper,
    cv::Mat& t_cam2gripper
) {
    // 调用 OpenCV Tsai-Lenz 方法精确求解 AX=XB
    cv::calibrateHandEye(
        R_gripper2base, t_gripper2base,
        R_target2cam, t_target2cam,
        R_cam2gripper, t_cam2gripper,
        cv::CALIB_HAND_EYE_TSAI
    );
}`,
        },
        misconception: {
          myth: "标定时机械臂只需平移移动到几个不同位置拍照，即可完成完整的手眼标定。",
          truth: "纯平移运动无法约束旋转矩阵的三个旋转自由度，方程会出现退化奇异解；必须包含至少两个相互非平行的旋转角度变动才能唯一收敛求解。",
        },
        ourWork: {
          title: "工业自动化分拣实训平台",
          link: "/works",
          evidence: "六轴工业机械臂配合 3D 相机完成异形工件抓取，重复定位抓取成功率达 99.4%。",
        },
        tags: ["Robotics", "Hand-Eye Calibration", "OpenCV", "Kinematics", "Homogeneous Matrix"],
      },
      {
        code: "IND_OPC_02",
        title: "OPC-UA 工业通信与信息模型",
        shortTitle: "OPC-UA 总线",
        question: "面对现场西门子、三菱、欧姆龙等数十种专有协议林立的产线，OPC-UA 是如何统一数据语义与毫秒级防抖采集的？",
        summary: "OPC-UA 废除了传统依赖 Windows DCOM 的旧架构，基于面向对象的节点地址空间（AddressSpace）建立标准化类型模型，采用高效二进制 TCP 通信并支持基于订阅与死区（Deadband）的事件推送。",
        mechanism: "OPC-UA 将工业对象抽象为带有属性（Attributes）和引用关系（References）的节点（Node）。客户端无需高频主动轮询，而是向服务端创建订阅（Subscription）与监控项（MonitoredItem）。通过设置绝对死区或百分比死区（Deadband），当传感器模拟量波动在正常工业噪声范围内时不产生网络报文，仅当数值跨越阈值或状态改变时立即通过二进制通道毫秒级推送至 SCADA/MES 系统。",
        formula: "\\text{Trigger Event} \\iff |x(t) - x(t_{\\text{last}})| > \\text{DeadbandAbsolute}",
        formulaDescription: "OPC-UA 模拟量监控项基于死区滤波的数据变化上报准则",
        codeSnippet: {
          language: "python",
          description: "基于 asyncua 实现 Python 异步订阅 OPC-UA PLC 数据节点",
          code: `import asyncio
from asyncua import Client

class SubHandler:
    def datachange_notification(self, node, val, data):
        # 接收死区过滤后的真实工况事件推送
        print(f"PLC Node {node} Telemetry Changed -> Value: {val}")

async def main():
    async with Client("opc.tcp://plc-node-01.factory.local:4840") as client:
        node = client.get_node("ns=2;s=Line1.RobotArm.CycleCount")
        handler = SubHandler()
        sub = await client.create_subscription(50, handler) # 50ms 采样周期
        await sub.subscribe_data_change(node)
        await asyncio.sleep(60)`,
        },
        misconception: {
          myth: "OPC-UA 和普通 HTTP REST API 一样，只能用于上层 IT 系统查看报表，无法用于工业实时控制。",
          truth: "OPC-UA 原生包含高效的二进制 TCP 编码与 TSN（时间敏感网络）Pub/Sub 扩展，结合工业实时网卡可达到微秒级抖动的确定性硬实时控制。",
        },
        ourWork: {
          title: "智能产线状态感知中枢",
          link: "/works",
          evidence: "实现跨品牌 8 种 PLC 控制器统一建模接入，采集时延稳定在 15ms 以内。",
        },
        tags: ["OPC-UA", "Industrial Automation", "PLC", "SCADA", "IIoT"],
      },
      {
        code: "IND_VISION_03",
        title: "工业机器视觉与亚像素检测",
        shortTitle: "亚像素检测",
        question: "当工业工件边缘由于光学模糊和像素离散化导致边界存在 1-2 像素模糊时，如何达到 ±0.02 像素的亚微米级测量精度？",
        summary: "传统整像素边缘检测受限于相机物理分辨率；利用 Zernike 正交矩或多项式曲面拟合插值，从连续灰度梯度场中精确计算亚像素物理交界坐标。",
        mechanism: "整像素 Canny 算子仅能在离散网格上寻找极大值点。亚像素算法在整像素粗定位的基础上，利用边缘邻域的灰度剖面符合误差函数（Error Function）的物理特性，通过 Zernike 空间正交矩投影计算边缘的法线方向与距像素中心的真实偏置量 h，将边缘坐标从整数推升至浮点精度，使普通千万像素工业相机即可达到接触式三坐标测量机的检测精度。",
        formula: "h = \\frac{2 \\cdot A_{20} \\cdot A_{00} - A_{11}^2}{A_{00}^2}, \\quad \\text{亚像素偏置量可解析求解}",
        formulaDescription: "基于 Zernike 正交矩的亚像素边缘法向偏置解析公式",
        codeSnippet: {
          language: "python",
          description: "基于灰度局部梯度高斯插值实现亚像素中心精确定位",
          code: `import numpy as np

def subpixel_edge_interpolate(grad_prev, grad_center, grad_next):
    # 局部二次多项式拟合，求解梯度极值点的亚像素偏移量 delta
    denominator = 2.0 * (grad_prev - 2.0 * grad_center + grad_next)
    if abs(denominator) < 1e-6:
        return 0.0
    delta = (grad_prev - grad_next) / denominator
    return np.clip(delta, -0.5, 0.5) # 偏移量严格约束在 [-0.5, +0.5] 像素以内`,
        },
        misconception: {
          myth: "要提高视觉系统的测量精度，唯一的方法就是不断花重金升级更高分辨率的工业相机硬件。",
          truth: "高分辨率相机会大幅降低帧率并增加算力负担；结合优质双远心镜头（Telecentric Lens）与亚像素算法，能用极小成本取得数倍于硬件像素的测量分辨率。",
        },
        ourWork: {
          title: "精密轴承外观缺陷光学检测仪",
          link: "/awards",
          evidence: "亚像素算法实测边缘重复定位精度达到 0.03 pixel，微裂纹检出率达 99.8%。",
        },
        tags: ["Machine Vision", "Sub-pixel", "Zernike Moments", "Metrology", "Quality Inspection"],
      },
    ],
  },
};
