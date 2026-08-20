import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

interface TechIconProps extends SVGProps<SVGSVGElement> {
  name: string;
  className?: string;
  size?: number;
}

// 真实标准化 SVG 路径字典（基于 Simple Icons / Devicon 规范路径）
export function TechIcon({ name, className, size = 20, ...props }: TechIconProps) {
  const norm = name.trim().toLowerCase();

  // 1. Python
  if (norm.includes("python")) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={cn("shrink-0", className)} {...props}>
        <path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.006 2.752h5.814v.826H3.896S0 5.79 0 11.904c0 6.112 3.402 5.908 3.402 5.908h2.034v-2.858s-.11-3.404 3.348-3.404h5.758V9.824S14.88 6.42 11.914 0zm-1.63 1.684a.972.972 0 0 1 .972.972.972.972 0 0 1-.972.972.972.972 0 0 1-.972-.972c0-.537.435-.972.972-.972zm1.802 22.316c6.094 0 5.714-2.656 5.714-2.656l-.006-2.752H11.98v-.826h8.124s3.896.444 3.896-5.67c0-6.112-3.402-5.908-3.402-5.908h-2.034v2.858s.11 3.404-3.348 3.404H9.458v1.726s-.34 3.404 2.626 9.824zm1.63-1.684a.972.972 0 0 1-.972-.972.972.972 0 0 1 .972-.972.972.972 0 0 1 .972.972c0 .537-.435.972-.972.972z" />
      </svg>
    );
  }

  // 2. C / C++
  if (norm === "c++" || norm === "c/c++" || norm === "cpp" || norm === "c") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={cn("shrink-0", className)} {...props}>
        <path d="M22.394 6.786l-9.6-5.542a1.59 1.59 0 0 0-1.588 0l-9.6 5.542a1.6 1.6 0 0 0-.8 1.386v11.084a1.6 1.6 0 0 0 .8 1.386l9.6 5.542a1.59 1.59 0 0 0 1.588 0l9.6-5.542a1.6 1.6 0 0 0 .8-1.386V8.172a1.6 1.6 0 0 0-.8-1.386zm-10.394 13.88a6.666 6.666 0 1 1 0-13.332 6.6 6.6 0 0 1 4.542 1.838l-1.8 1.8a4.134 4.134 0 1 0 0 5.856l1.8 1.8a6.6 6.6 0 0 1-4.542 1.838zm5.834-5.334h-1.334v-1.334h-1.334v1.334h-1.334v1.334h1.334v1.334h1.334v-1.334h1.334v-1.334zm3.334 0h-1.334v-1.334h-1.334v1.334h-1.334v1.334h1.334v1.334h1.334v-1.334h1.334v-1.334z" />
      </svg>
    );
  }

  // 3. C#
  if (norm.includes("c#") || norm === "csharp") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={cn("shrink-0", className)} {...props}>
        <path d="M22.394 6.786l-9.6-5.542a1.59 1.59 0 0 0-1.588 0l-9.6 5.542a1.6 1.6 0 0 0-.8 1.386v11.084a1.6 1.6 0 0 0 .8 1.386l9.6 5.542a1.59 1.59 0 0 0 1.588 0l9.6-5.542a1.6 1.6 0 0 0 .8-1.386V8.172a1.6 1.6 0 0 0-.8-1.386zm-10.394 13.88a6.666 6.666 0 1 1 0-13.332 6.6 6.6 0 0 1 4.542 1.838l-1.8 1.8a4.134 4.134 0 1 0 0 5.856l1.8 1.8a6.6 6.6 0 0 1-4.542 1.838zm5.5-3.5h-1.2l.3-1.5h-1.2l-.3 1.5h-.8l.3-1.5h-.8v-.8h1l.3-1.5h-1v-.8h1.2l.3-1.5h1.2l-.3 1.5h.8l.3-1.5h.8v.8h-1l-.3 1.5h1v.8zm-1.8-1.5h.8l.3-1.5h-.8z" />
      </svg>
    );
  }

  // 4. Java
  if (norm.includes("java") && !norm.includes("javascript")) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={cn("shrink-0", className)} {...props}>
        <path d="M8.852 18.107s-.436.425.328.575c3.089.608 4.962.548 8.043-.277 0 0 .546.335.912.486-4.004 1.488-10.608 1.054-9.283-.784zm-1.44 2.454s-.474.553.359.704c3.483.633 6.442.593 10.518-.328 0 0 .393.298.718.425-4.887 1.465-13.064 1.258-11.595-.801zM7.5 12.75s-2.023 2.062 1.458 2.217c4.279.191 7.218-.946 7.218-.946s-.664.397-1.413.682c-3.832 1.458-10.155.438-7.263-1.953zm11.55 3.376c3.493-1.854 1.867-3.666 1.867-3.666-.54 1.054-1.895 1.93-3.664 2.261 1.637.382 1.797 1.405 1.797 1.405zm-4.708-8.73c1.378 1.521-.365 3.328-.365 3.328 1.83-1.412 1.03-2.997.365-3.328zm-3.635-4.834c.946 1.042-.25 2.28-.25 2.28 1.255-.968.708-2.054.25-2.28zM17.432 9.5s1.282 1.341-.532 3.197c0 0 2.203-1.492.532-3.197zM5.534 15.688s-3.791.902-1.328 1.642c2.895.867 7.07.636 11.23-.231 0 0-.616.326-1.312.55-4.577.893-10.748.868-8.59-1.961z" />
      </svg>
    );
  }

  // 5. TypeScript
  if (norm.includes("typescript") || norm === "ts") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={cn("shrink-0", className)} {...props}>
        <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.71-.246 5.84 5.84 0 0 0-.795-.145 4.544 4.544 0 0 0-.895-.084c-.387 0-.71.04-.969.12a1.644 1.644 0 0 0-.66.36c-.156.16-.27.361-.341.603-.072.241-.108.528-.108.861 0 .28.036.528.108.744.072.216.184.408.336.576.153.168.349.32.589.456.24.136.53.268.87.396.42.156.843.32 1.269.492.426.172.81.384 1.152.636.342.252.618.56.828.924.21.364.315.816.315 1.356 0 .612-.114 1.158-.342 1.638a3.987 3.987 0 0 1-.954 1.26c-.408.336-.918.588-1.53.756a6.974 6.974 0 0 1-1.926.252c-.672 0-1.332-.06-1.98-.18a8.3 8.3 0 0 1-1.74-.528v-2.616c.552.336 1.116.588 1.692.756.576.168 1.164.252 1.764.252.408 0 .762-.044 1.062-.132.3-.088.54-.216.72-.384.18-.168.312-.376.396-.624.084-.248.126-.532.126-.852 0-.312-.042-.584-.126-.816a1.982 1.982 0 0 0-.378-.636 2.766 2.766 0 0 0-.666-.48c-.288-.144-.642-.288-1.062-.432-.42-.144-.84-.3-1.26-.468a5.203 5.203 0 0 1-1.152-.612 3.655 3.655 0 0 1-.846-.888 3.518 3.518 0 0 1-.342-1.32c0-.588.114-1.11.342-1.566.228-.456.546-.84.954-1.152.408-.312.9-.546 1.476-.702a6.37 6.37 0 0 1 1.776-.234zm-8.82 2.436h3.42v9.84H9.668V12.186H6.248v-2.436z" />
      </svg>
    );
  }

  // 6. PyTorch
  if (norm.includes("pytorch")) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={cn("shrink-0", className)} {...props}>
        <path d="M12.784 0l.444.444-2.88 2.88a9.42 9.42 0 0 1 6.643 2.754 9.475 9.475 0 0 1 2.775 6.702 9.467 9.467 0 0 1-2.775 6.703 9.475 9.475 0 0 1-6.702 2.775 9.475 9.475 0 0 1-6.703-2.775 9.48 9.48 0 0 1-2.774-6.703c0-2.476.953-4.838 2.686-6.611l.035.034 1.342 1.342-.036-.035A7.544 7.544 0 0 0 2.69 12.78a7.585 7.585 0 0 0 7.59 7.59 7.585 7.585 0 0 0 7.59-7.59 7.585 7.585 0 0 0-7.59-7.59c-1.353 0-2.65.35-3.792 1.018l2.25 2.25-1.34 1.342L3.92 6.326l3.473-3.474a9.414 9.414 0 0 1 5.39-1.638v-1.214zM16.92 4.416a1.35 1.35 0 1 1-1.91 1.91 1.35 1.35 0 0 1 1.91-1.91z" />
      </svg>
    );
  }

  // 7. OpenCV
  if (norm.includes("opencv")) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={cn("shrink-0", className)} {...props}>
        <path d="M12 0C8.948 0 6.368 1.708 5.093 4.22a7.03 7.03 0 0 1 6.907-2.316A7.034 7.034 0 0 1 17.584 7.49a7.027 7.027 0 0 1-2.68 5.708 6.974 6.974 0 0 0 2.203-5.243C17.107 3.563 14.444 0 12 0zm-6.094 9.48a6.97 6.97 0 0 0-2.203 5.244c0 4.392 2.663 7.955 5.107 7.955a5.86 5.86 0 0 0 3.73-1.378 7.034 7.034 0 0 1-5.584-5.584 7.027 7.027 0 0 1-.05-1.042c0-1.936.78-3.69 2.05-4.962a6.985 6.985 0 0 0-3.05-.233zm12.188 0a6.985 6.985 0 0 0-3.05.233 7.027 7.027 0 0 1 2.05 4.962c0 .354-.02.702-.05 1.042a7.034 7.034 0 0 1-5.584 5.584A5.86 5.86 0 0 0 15.19 22.68c2.444 0 5.107-3.563 5.107-7.955a6.97 6.97 0 0 0-2.203-5.244z" />
      </svg>
    );
  }

  // 8. Vue / Vue 3
  if (norm.includes("vue")) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={cn("shrink-0", className)} {...props}>
        <path d="M24 1.61H14.04L12 5.16 9.96 1.61H0L12 22.39 24 1.61zM12 14.08L5.16 2.23h4.16L12 7.01l2.68-4.78h4.16L12 14.08z" />
      </svg>
    );
  }

  // 9. Next.js / React
  if (norm.includes("next") || norm.includes("react")) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={cn("shrink-0", className)} {...props}>
        <path d="M18.665 21.978C16.787 23.25 14.492 24 12 24 5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12c0 3.328-1.353 6.34-3.541 8.513l-9.873-12.87A.996.996 0 0 0 9.77 7.2H7.2v9.6h1.6V9.474l9.865 12.504zM16.8 7.2h-1.6v6.4h1.6V7.2z" />
      </svg>
    );
  }

  // 10. Spring / Spring Boot / Spring Cloud
  if (norm.includes("spring")) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={cn("shrink-0", className)} {...props}>
        <path d="M21.503 9.404a11.966 11.966 0 0 0-4.044-5.32 12.046 12.046 0 0 0-6.495-2.07c-.438 0-.872.022-1.3.065a12.016 12.016 0 0 0-7.254 3.73A11.962 11.962 0 0 0 .157 11.02a12.044 12.044 0 0 0 1.258 7.202 11.996 11.996 0 0 0 4.673 4.62c4.01 2.057 8.878 1.636 12.518-1.077a11.976 11.976 0 0 0 3.824-5.372c.677-2.18.68-4.524-.927-6.989zm-7.66 8.354a5.05 5.05 0 0 1-5.052-5.052c0-1.74.88-3.275 2.227-4.173a5.042 5.042 0 0 1 2.825-.879c2.791 0 5.052 2.261 5.052 5.052a5.04 5.04 0 0 1-5.052 5.052z" />
      </svg>
    );
  }

  // 11. Docker
  if (norm.includes("docker")) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={cn("shrink-0", className)} {...props}>
        <path d="M13.983 11.078h2.119a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.119a.185.185 0 0 0-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 0 0 .186-.186V3.574a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 0 0 .186-.186V6.29a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.887c0 .102.082.186.185.186m-2.93 0h2.12a.186.186 0 0 0 .184-.186V6.29a.185.185 0 0 0-.185-.185H8.1a.185.185 0 0 0-.185.185v1.887c0 .102.083.186.185.186m-2.964 0h2.119a.186.186 0 0 0 .185-.186V6.29a.185.185 0 0 0-.185-.185H5.136a.186.186 0 0 0-.186.185v1.887c0 .102.084.186.186.186m5.893 2.714h2.119a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.119a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 0 0 .184-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.185.185 0 0 0-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 0 0 .185-.185V9.006a.185.185 0 0 0-.185-.186H5.136a.186.186 0 0 0-.186.185v1.888c0 .102.084.185.186.185m-2.928 0h2.119a.185.185 0 0 0 .185-.185V9.006a.185.185 0 0 0-.185-.186H2.208a.186.186 0 0 0-.186.185v1.888c0 .102.084.185.186.185M23.97 11.5a4.52 4.52 0 0 0-2.483-3.036 6.064 6.064 0 0 0-.323-.105l-.2-.047c-.098-.02-.19-.045-.286-.062a4.4 4.4 0 0 0-1.785.03c-.22.046-.432.112-.638.196a.187.187 0 0 0-.097.161v2.392a.186.186 0 0 1-.186.186H.186A.186.186 0 0 0 0 11.399c0 3.328 1.156 6.136 3.47 8.423 2.158 2.134 4.887 3.201 8.19 3.201 5.922 0 10.354-3.13 11.83-8.877a4.966 4.966 0 0 0 .48-2.646" />
      </svg>
    );
  }

  // 12. Redis
  if (norm.includes("redis")) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={cn("shrink-0", className)} {...props}>
        <path d="M22.56 16.892l-9.873 4.298a1.602 1.602 0 0 1-1.374 0L1.44 16.892a1.608 1.608 0 0 1-.954-1.472V7.15c0-.62.366-1.185.954-1.472L11.313 1.38a1.602 1.602 0 0 1 1.374 0l9.873 4.298c.588.287.954.852.954 1.472v8.27c0 .62-.366 1.185-.954 1.472zm-10.56-4.508l7.554-3.29-7.554-3.29-7.554 3.29 7.554 3.29zm0 2.186l-7.554-3.29v4.384l7.554 3.29 7.554-3.29v-4.384l-7.554 3.29z" />
      </svg>
    );
  }

  // 13. MySQL / PostgreSQL / openGauss / OceanBase / TiDB / Database / SQL
  if (
    norm.includes("sql") ||
    norm.includes("mysql") ||
    norm.includes("postgres") ||
    norm.includes("opengauss") ||
    norm.includes("oceanbase") ||
    norm.includes("tidb") ||
    norm.includes("database") ||
    norm.includes("innodb") ||
    norm.includes("b+ tree") ||
    norm.includes("dbeaver") ||
    norm.includes("navicat")
  ) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("shrink-0", className)} {...props}>
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5V19A9 3 0 0 0 21 19V5" />
        <path d="M3 12A9 3 0 0 0 21 12" />
      </svg>
    );
  }

  // 14. Linux
  if (norm.includes("linux")) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={cn("shrink-0", className)} {...props}>
        <path d="M12.002 0c-2.404 0-4.343 1.939-4.343 4.343 0 .708.17 1.378.471 1.968C7.03 7.37 5.86 8.847 5.148 10.59c-.93 2.277-1.144 4.79-.623 7.22.42 1.96 1.48 3.73 2.99 5.02.73.63 1.63 1.05 2.61 1.17.65.08 1.31 0 1.88-.24.57.24 1.23.32 1.88.24.98-.12 1.88-.54 2.61-1.17 1.51-1.29 2.57-3.06 2.99-5.02.521-2.43.307-4.943-.623-7.22-.712-1.743-1.882-3.22-3.982-4.279.301-.59.471-1.26.471-1.968C16.345 1.939 14.406 0 12.002 0zm-1.85 3.75c.41 0 .75.34.75.75s-.34.75-.75.75-.75-.34-.75-.75.34-.75.75-.75zm3.7 0c.41 0 .75.34.75.75s-.34.75-.75.75-.75-.34-.75-.75.34-.75.75-.75z" />
      </svg>
    );
  }

  // 15. Git / GitHub
  if (norm.includes("git")) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={cn("shrink-0", className)} {...props}>
        <path d="M23.546 10.93L13.067.452a1.5 1.5 0 0 0-2.122 0L8.85 2.547l3.26 3.26a1.782 1.782 0 0 1 2.253 2.274l3.14 3.14a1.782 1.782 0 0 1 2.043 2.043l3.998-3.998a1.5 1.5 0 0 0 .002-2.336zM3.46 12.146l8.396 8.396a1.5 1.5 0 0 0 2.122 0l2.096-2.096-3.26-3.26a1.782 1.782 0 0 1-2.253-2.274L7.42 9.772a1.782 1.782 0 0 1-2.043-2.043L.454 11.646a1.5 1.5 0 0 0 0 2.122l2.006 2.006-2.006-2.006a1.5 1.5 0 0 0 0-2.122z" />
      </svg>
    );
  }

  // 16. FreeRTOS / STM32 / MCU / 嵌入式 / PlatformIO / Keil
  if (norm.includes("freertos") || norm.includes("stm32") || norm.includes("esp32") || norm.includes("esp-idf") || norm.includes("mcu") || norm.includes("嵌入式") || norm.includes("keil") || norm.includes("platformio")) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("shrink-0", className)} {...props}>
        <rect width="16" height="16" x="4" y="4" rx="2" />
        <rect width="6" height="6" x="9" y="9" rx="1" />
        <path d="M15 2v2" />
        <path d="M15 20v2" />
        <path d="M2 15h2" />
        <path d="M2 9h2" />
        <path d="M20 15h2" />
        <path d="M20 9h2" />
        <path d="M9 2v2" />
        <path d="M9 20v2" />
      </svg>
    );
  }

  // 17. MQTT / EMQX / 物联网 / 通信 / 网关 / MQTTX / Wireshark
  if (norm.includes("mqtt") || norm.includes("emqx") || norm.includes("iot") || norm.includes("网关") || norm.includes("通信") || norm.includes("thingsboard") || norm.includes("wireshark") || norm.includes("modbus")) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("shrink-0", className)} {...props}>
        <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
        <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
        <circle cx="12" cy="12" r="2" />
        <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
        <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" />
      </svg>
    );
  }

  // 18. Three.js / WebGL / 数字孪生 / 3D
  if (norm.includes("three") || norm.includes("webgl") || norm.includes("数字孪生") || norm.includes("3d")) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("shrink-0", className)} {...props}>
        <path d="m21.12 6.4-6-3.4a2 2 0 0 0-2 0l-6 3.4a2 2 0 0 0-1 1.7v6.8a2 2 0 0 0 1 1.7l6 3.4a2 2 0 0 0 2 0l6-3.4a2 2 0 0 0 1-1.7V8.1a2 2 0 0 0-1-1.7Z" />
        <path d="m7.5 4.2 9 5.2" />
        <path d="M3.29 7 12 12v10" />
        <path d="m12 12 8.71-5" />
      </svg>
    );
  }

  // 19. Siemens / PLC / OPC UA / 工控 / 梯形图 / TIA / SCADA / Node-RED / TwinCAT
  if (norm.includes("siemens") || norm.includes("plc") || norm.includes("opc") || norm.includes("工控") || norm.includes("tia") || norm.includes("scada") || norm.includes("node-red") || norm.includes("twincat")) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("shrink-0", className)} {...props}>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" x2="16" y1="21" y2="21" />
        <line x1="12" x2="12" y1="17" y2="21" />
        <path d="m7 8 2 2-2 2" />
        <path d="M13 12h4" />
      </svg>
    );
  }

  // 20. AI Agent / 智能体 / LLM / 大模型 / RAG / Prompt / LangChain / vLLM / HuggingFace
  if (norm.includes("agent") || norm.includes("智能体") || norm.includes("llm") || norm.includes("大模型") || norm.includes("rag") || norm.includes("langchain") || norm.includes("vllm") || norm.includes("huggingface") || norm.includes("onnx") || norm.includes("tensorboard") || norm.includes("conda") || norm.includes("jupyter")) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("shrink-0", className)} {...props}>
        <path d="M12 8V4H8" />
        <rect width="16" height="12" x="4" y="8" rx="2" />
        <path d="M2 14h2" />
        <path d="M20 14h2" />
        <path d="M15 13v2" />
        <path d="M9 13v2" />
      </svg>
    );
  }

  // 21. 计算机视觉 / CV / 目标检测 / YOLO / 缺陷识别
  if (norm.includes("vision") || norm.includes("视觉") || norm.includes("yolo") || norm.includes("defect") || norm.includes("检测")) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("shrink-0", className)} {...props}>
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }

  // 22. 智能机器人 / ROS / 机械臂
  if (norm.includes("robot") || norm.includes("机器人") || norm.includes("ros") || norm.includes("机械臂")) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("shrink-0", className)} {...props}>
        <path d="M12 2v4" />
        <path d="m19 13 2 2" />
        <path d="m5 13-2 2" />
        <rect width="14" height="12" x="5" y="6" rx="2" />
        <circle cx="9" cy="11" r="1" />
        <circle cx="15" cy="11" r="1" />
        <path d="M8 15h8" />
        <path d="M9 18v3" />
        <path d="M15 18v3" />
      </svg>
    );
  }

  // 23. Nginx
  if (norm.includes("nginx")) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={cn("shrink-0", className)} {...props}>
        <path d="M12 0L1.605 6v12L12 24l10.395-6V6L12 0zm5.4 16.5h-2.1L8.7 8.7v7.8H6.6V7.5h2.1l6.6 7.8V7.5h2.1v9z" />
      </svg>
    );
  }

  // 24. Vite
  if (norm.includes("vite")) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={cn("shrink-0", className)} {...props}>
        <path d="M21.996 4.095L12.72 23.23a.75.75 0 0 1-1.354.015L2.016 4.095a.75.75 0 0 1 .84-1.042l8.835 2.14a.75.75 0 0 0 .356 0l8.835-2.14a.75.75 0 0 1 .84 1.042z" />
      </svg>
    );
  }

  // 25. Tailwind CSS
  if (norm.includes("tailwind")) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={cn("shrink-0", className)} {...props}>
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z" />
      </svg>
    );
  }

  // 26. CI/CD / 流水线 / Maven / Postman / Visual Studio
  if (norm.includes("ci/cd") || norm.includes("流水线") || norm.includes("maven") || norm.includes("postman") || norm.includes("visual studio")) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("shrink-0", className)} {...props}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    );
  }

  // 27. Shell / Bash / 终端
  if (norm.includes("shell") || norm.includes("bash") || norm.includes("terminal")) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("shrink-0", className)} {...props}>
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" x2="20" y1="19" y2="19" />
      </svg>
    );
  }

  // 28. 微服务 / 分布式 / RPC / MyBatis-Plus / Express
  if (norm.includes("微服务") || norm.includes("分布式") || norm.includes("rpc") || norm.includes("restful") || norm.includes("mybatis") || norm.includes("express") || norm.includes("numpy") || norm.includes("pandas")) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("shrink-0", className)} {...props}>
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="8.5" y="3" width="7" height="7" rx="1" />
        <path d="M12 10v4" />
        <path d="M6.5 14V12h11v2" />
      </svg>
    );
  }

  // 默认兜底通用代码芯片图标
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("shrink-0", className)} {...props}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}
