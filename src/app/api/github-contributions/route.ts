import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // 1 hour ISR cache

const ORG_NAME = "yfy-club";
const GITHUB_API_URL = "https://api.github.com";

export interface GithubContributionItem {
  date: string; // YYYY-MM-DD
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
  detail?: string;
  repo?: string;
}

interface GithubRepo {
  name: string;
  description: string | null;
  fork: boolean;
  pushed_at: string;
}

interface GithubCommit {
  sha: string;
  commit: {
    author: {
      date: string;
      name: string;
    } | null;
    message: string;
  };
}

function getAuthHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN?.trim() || process.env.GH_TOKEN?.trim();
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "YFY-Trajectory-Website (https://github.com/yfy-club)",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

function calculateLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 4) return 2;
  if (count <= 7) return 3;
  return 4;
}

export async function GET() {
  try {
    const headers = getAuthHeaders();

    // 1. 获取组织下的公开仓库列表
    const reposRes = await fetch(`${GITHUB_API_URL}/orgs/${ORG_NAME}/repos?per_page=100&sort=updated`, {
      headers,
      signal: AbortSignal.timeout(8000),
      next: { revalidate: 3600 },
    });

    if (!reposRes.ok) {
      throw new Error(`GitHub Repos API failed with status ${reposRes.status}`);
    }

    const repos = (await reposRes.json()) as GithubRepo[];

    // 2. 并行拉取各仓库的近半年 commits
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const sinceIso = sixMonthsAgo.toISOString();

    const commitPromises = repos.map(async (repo) => {
      try {
        const commitsRes = await fetch(
          `${GITHUB_API_URL}/repos/${ORG_NAME}/${repo.name}/commits?per_page=100&since=${sinceIso}`,
          {
            headers,
            signal: AbortSignal.timeout(8000),
            next: { revalidate: 3600 },
          }
        );
        if (!commitsRes.ok) return [];
        const commits = (await commitsRes.json()) as GithubCommit[];
        return commits.map((c) => ({
          repo: repo.name,
          date: c.commit.author?.date ? c.commit.author.date.split("T")[0] : null,
          message: c.commit.message.split("\n")[0].trim(),
          author: c.commit.author?.name ?? "Maintainer",
        }));
      } catch {
        return [];
      }
    });

    const commitResults = await Promise.all(commitPromises);
    const allCommits = commitResults.flat().filter((c): c is { repo: string; date: string; message: string; author: string } => Boolean(c.date));

    // 3. 按日期聚类统计
    const dateMap = new Map<string, { count: number; details: string[]; repos: Set<string> }>();

    for (const c of allCommits) {
      const existing = dateMap.get(c.date) || { count: 0, details: [], repos: new Set<string>() };
      existing.count += 1;
      existing.repos.add(c.repo);
      if (existing.details.length < 3) {
        existing.details.push(`[${c.repo}] ${c.message}`);
      }
      dateMap.set(c.date, existing);
    }

    // 4. 生成连续 180 天（6 个月）完整网格
    const totalDays = 180;
    const contributions: GithubContributionItem[] = [];
    const today = new Date();

    for (let i = totalDays; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const entry = dateMap.get(dateStr);

      const count = entry?.count ?? 0;
      const level = calculateLevel(count);
      const detail = entry && entry.details.length > 0
        ? entry.details.join("；")
        : count > 0
        ? `在 ${Array.from(entry?.repos ?? []).join("、")} 完成了 ${count} 次代码提交`
        : "日常代码研读与课设准备";

      contributions.push({
        date: dateStr,
        count,
        level,
        detail,
        repo: entry ? Array.from(entry.repos).join(", ") : undefined,
      });
    }

    const totalCommits = allCommits.length;
    const activeDays = dateMap.size;

    return NextResponse.json({
      ok: true,
      source: "live",
      org: ORG_NAME,
      reposCount: repos.length,
      totalCommits,
      activeDays,
      contributions,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        ok: false,
        source: "fallback",
        error: errorMsg,
      },
      { status: 500 }
    );
  }
}
