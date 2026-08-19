import { CardFrame, CardPanel } from "@/components/ui/card";
import { works } from "@/content";
import { countWorkScreenshots } from "@/lib/work-media";

export function WorksMetricsBar() {
  const shippedCount = works.filter((w) => w.status === "已上线").length;
  const incubatingCount = works.filter((w) => w.status === "在研").length;
  const totalScreenshots = works.reduce((sum, w) => sum + countWorkScreenshots(w), 0);
  const allTracks = Array.from(new Set(works.flatMap((w) => w.trackSlugs))).length;

  const metrics = [
    {
      code: "METRIC 01",
      value: `${shippedCount + incubatingCount}`,
      label: "工程项目总数",
      subtext: `${shippedCount} 个已上线 · ${incubatingCount} 个在研`,
    },
    {
      code: "METRIC 02",
      value: "100%",
      label: "真实项目代码",
      subtext: "具备完整工程闭环与可验证成果",
    },
    {
      code: "METRIC 03",
      value: `${totalScreenshots}+`,
      label: "系统界面实录",
      subtext: "多模块实机截图与真实交互",
    },
    {
      code: "METRIC 04",
      value: `${allTracks}`,
      label: "技术方向全面覆盖",
      subtext: "全栈开发 / 算法应用 / 物联网 / 工业数智",
    },
  ];

  return (
    <CardFrame className="works-metrics mb-10 overflow-hidden border-[var(--border)] bg-[var(--surface)] shadow-2xs">
      <CardPanel className="p-0">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[var(--border)]">
          {metrics.map((metric) => (
            <div
              key={metric.code}
              className="p-4 sm:p-5 flex flex-col justify-between hover:bg-[var(--surface-2)]/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] text-[var(--fg-faint)] tracking-wider">
                  {metric.code}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              </div>
              <div>
                <div className="font-mono text-2xl sm:text-3xl font-semibold text-[var(--fg)] tabular">
                  {metric.value}
                </div>
                <div className="font-sans text-xs sm:text-sm font-medium text-[var(--fg)] mt-0.5">
                  {metric.label}
                </div>
                <div className="font-sans text-[11px] text-[var(--fg-muted)] mt-1 line-clamp-1">
                  {metric.subtext}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardPanel>
    </CardFrame>
  );
}
