import type { SVGProps } from "react";
import {
  SiAnaconda,
  SiApachemaven,
  SiArm,
  SiC,
  SiCplusplus,
  SiDbeaver,
  SiDocker,
  SiDotnet,
  SiEspressif,
  SiExpress,
  SiGit,
  SiGnubash,
  SiHuggingface,
  SiJupyter,
  SiLangchain,
  SiLinux,
  SiMongodb,
  SiMqtt,
  SiMysql,
  SiNextdotjs,
  SiNginx,
  SiNodered,
  SiNumpy,
  SiOnnx,
  SiOpencv,
  SiOpenjdk,
  SiPandas,
  SiPlatformio,
  SiPostgresql,
  SiPostman,
  SiPython,
  SiPytorch,
  SiRedis,
  SiRos,
  SiRust,
  SiSharp,
  SiSiemens,
  SiSpring,
  SiSpringboot,
  SiStmicroelectronics,
  SiTailwindcss,
  SiTauri,
  SiTensorflow,
  SiThreedotjs,
  SiTypescript,
  SiVite,
  SiVuedotjs,
  SiWireshark,
} from "@icons-pack/react-simple-icons";
import {
  Bot,
  Box,
  Cpu,
  Database,
  Eye,
  Network,
  Radio,
  Terminal,
  Waypoints,
  Zap,
} from "lucide-react";

import { cn } from "@/lib/utils";

export interface TechIconProps extends SVGProps<SVGSVGElement> {
  name: string;
  className?: string;
  size?: number;
}

export function TechIcon({ name, className, size = 20, ...props }: TechIconProps) {
  const norm = name.trim().toLowerCase();

  // 1. 编程语言 (Languages)
  if (norm === "python") return <SiPython size={size} className={className} {...props} />;
  if (norm === "c++" || norm === "cpp") return <SiCplusplus size={size} className={className} {...props} />;
  if (norm === "c") return <SiC size={size} className={className} {...props} />;
  if (norm === "c/c++") return <SiCplusplus size={size} className={className} {...props} />;
  if (norm.includes("c#") || norm === "csharp") return <SiSharp size={size} className={className} {...props} />;
  if (norm.includes("java") && !norm.includes("javascript")) return <SiOpenjdk size={size} className={className} {...props} />;
  if (norm.includes("typescript") || norm === "ts") return <SiTypescript size={size} className={className} {...props} />;
  if (norm.includes("rust")) return <SiRust size={size} className={className} {...props} />;
  if (norm.includes("shell") || norm.includes("bash")) return <SiGnubash size={size} className={className} {...props} />;

  // 2. AI 与数据科学 (AI, CV & ML)
  if (norm.includes("pytorch")) return <SiPytorch size={size} className={className} {...props} />;
  if (norm.includes("opencv")) return <SiOpencv size={size} className={className} {...props} />;
  if (norm.includes("numpy")) return <SiNumpy size={size} className={className} {...props} />;
  if (norm.includes("pandas")) return <SiPandas size={size} className={className} {...props} />;
  if (norm.includes("langchain")) return <SiLangchain size={size} className={className} {...props} />;
  if (norm.includes("huggingface")) return <SiHuggingface size={size} className={className} {...props} />;
  if (norm.includes("onnx") || norm.includes("vllm")) return <SiOnnx size={size} className={className} {...props} />;
  if (norm.includes("tensorboard") || norm.includes("tensorflow")) return <SiTensorflow size={size} className={className} {...props} />;
  if (norm.includes("conda") || norm.includes("anaconda")) return <SiAnaconda size={size} className={className} {...props} />;
  if (norm.includes("jupyter")) return <SiJupyter size={size} className={className} {...props} />;

  // 3. Web 全栈与前端框架 (Full-Stack & Front-End)
  if (norm.includes("vue")) return <SiVuedotjs size={size} className={className} {...props} />;
  if (norm.includes("next")) return <SiNextdotjs size={size} className={className} {...props} />;
  if (norm.includes("spring boot") || norm === "spring") return <SiSpringboot size={size} className={className} {...props} />;
  if (norm.includes("spring cloud")) return <SiSpring size={size} className={className} {...props} />;
  if (norm.includes("express")) return <SiExpress size={size} className={className} {...props} />;
  if (norm.includes("tailwind")) return <SiTailwindcss size={size} className={className} {...props} />;
  if (norm.includes("vite")) return <SiVite size={size} className={className} {...props} />;
  if (norm.includes("three")) return <SiThreedotjs size={size} className={className} {...props} />;
  if (norm.includes("tauri")) return <SiTauri size={size} className={className} {...props} />;

  // 4. 数据库与存储 (Databases & Storage)
  if (norm.includes("mysql")) return <SiMysql size={size} className={className} {...props} />;
  if (norm.includes("postgres") || norm.includes("opengauss") || norm.includes("oceanbase") || norm.includes("tidb") || norm === "sql") {
    return <SiPostgresql size={size} className={className} {...props} />;
  }
  if (norm.includes("redis")) return <SiRedis size={size} className={className} {...props} />;
  if (norm.includes("mongodb")) return <SiMongodb size={size} className={className} {...props} />;
  if (norm.includes("dbeaver")) return <SiDbeaver size={size} className={className} {...props} />;

  // 5. 物联网、工控与嵌入式 (IoT, Embedded & Industrial)
  if (norm.includes("stm32") || norm.includes("freertos") || norm.includes("hal")) return <SiStmicroelectronics size={size} className={className} {...props} />;
  if (norm.includes("esp") || norm.includes("esp32") || norm.includes("esp-idf")) return <SiEspressif size={size} className={className} {...props} />;
  if (norm.includes("keil") || norm.includes("arm")) return <SiArm size={size} className={className} {...props} />;
  if (norm.includes("platformio")) return <SiPlatformio size={size} className={className} {...props} />;
  if (norm.includes("mqtt") || norm.includes("emqx") || norm.includes("thingsboard")) return <SiMqtt size={size} className={className} {...props} />;
  if (norm.includes("siemens") || norm.includes("tia") || norm.includes("s7") || norm.includes("opc")) return <SiSiemens size={size} className={className} {...props} />;
  if (norm.includes("node-red")) return <SiNodered size={size} className={className} {...props} />;
  if (norm.includes("ros") || norm.includes("robot")) return <SiRos size={size} className={className} {...props} />;
  if (norm.includes("wireshark")) return <SiWireshark size={size} className={className} {...props} />;

  // 6. DevOps、工具链与容器 (DevOps & Toolchain)
  if (norm.includes("docker")) return <SiDocker size={size} className={className} {...props} />;
  if (norm.includes("git")) return <SiGit size={size} className={className} {...props} />;
  if (norm.includes("linux")) return <SiLinux size={size} className={className} {...props} />;
  if (norm.includes("nginx")) return <SiNginx size={size} className={className} {...props} />;
  if (norm.includes("maven")) return <SiApachemaven size={size} className={className} {...props} />;
  if (norm.includes("postman")) return <SiPostman size={size} className={className} {...props} />;
  if (norm.includes("visual studio") || norm.includes(".net")) return <SiDotnet size={size} className={className} {...props} />;

  // 7. 抽象工程概念语义图标 (Conceptual Lucide Fallbacks)
  if (norm.includes("agent") || norm.includes("智能体") || norm.includes("rag")) {
    return <Bot size={size} className={cn("shrink-0", className)} />;
  }
  if (norm.includes("vision") || norm.includes("视觉") || norm.includes("yolo") || norm.includes("检测")) {
    return <Eye size={size} className={cn("shrink-0", className)} />;
  }
  if (norm.includes("微服务") || norm.includes("分布式") || norm.includes("rpc") || norm.includes("restful")) {
    return <Network size={size} className={cn("shrink-0", className)} />;
  }
  if (norm.includes("网关") || norm.includes("iot") || norm.includes("物联") || norm.includes("通信") || norm.includes("modbus")) {
    return <Radio size={size} className={cn("shrink-0", className)} />;
  }
  if (norm.includes("存储") || norm.includes("database") || norm.includes("b+ tree") || norm.includes("mvcc") || norm.includes("分库分表") || norm.includes("容灾")) {
    return <Database size={size} className={cn("shrink-0", className)} />;
  }
  if (norm.includes("孪生") || norm.includes("3d") || norm.includes("scada") || norm.includes("webgl")) {
    return <Box size={size} className={cn("shrink-0", className)} />;
  }
  if (norm.includes("plc") || norm.includes("工控") || norm.includes("硬件") || norm.includes("驱动") || norm.includes("mcu")) {
    return <Cpu size={size} className={cn("shrink-0", className)} />;
  }
  if (norm.includes("流水线") || norm.includes("ci/cd") || norm.includes("架构")) {
    return <Waypoints size={size} className={cn("shrink-0", className)} />;
  }
  if (norm.includes("缓存") || norm.includes("并发")) {
    return <Zap size={size} className={cn("shrink-0", className)} />;
  }

  // 默认通用终端图标
  return <Terminal size={size} className={cn("shrink-0", className)} />;
}
