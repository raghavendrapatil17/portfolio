export type RepoInfo = {
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  homepage: string | null;
  stars: number;
  forks: number;
  language: string | null;
  topics: string[];
  pushedAt: string;
};

export type GitHubData = {
  user: {
    login: string;
    publicRepos: number;
    followers: number;
    avatar: string;
  };
  totalStars: number;
  languages: { name: string; count: number }[];
  /** keyed by lower-cased "owner/repo" */
  repos: Record<string, RepoInfo>;
  recent: RepoInfo[];
  fetchedAt: string;
};

type RawRepo = {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics?: string[];
  pushed_at: string;
  fork: boolean;
  archived: boolean;
};

const REVALIDATE_SECONDS = 3600;

function headers(): HeadersInit {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "portfolio-site",
  };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

/**
 * Fetches live GitHub data. Cached and revalidated hourly (ISR).
 * Returns null on any failure so the page always renders with static content.
 */
export async function getGitHubData(username: string): Promise<GitHubData | null> {
  try {
    const opts = { headers: headers(), next: { revalidate: REVALIDATE_SECONDS } };
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, opts),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`, opts),
    ]);
    if (!userRes.ok || !reposRes.ok) return null;

    const user = await userRes.json();
    const raw: RawRepo[] = await reposRes.json();
    const own = raw.filter((r) => !r.fork);

    const map = (r: RawRepo): RepoInfo => ({
      name: r.name,
      fullName: r.full_name,
      description: r.description,
      url: r.html_url,
      homepage: r.homepage || null,
      stars: r.stargazers_count,
      forks: r.forks_count,
      language: r.language,
      topics: r.topics ?? [],
      pushedAt: r.pushed_at,
    });

    const repos: Record<string, RepoInfo> = {};
    for (const r of own) repos[r.full_name.toLowerCase()] = map(r);

    const langCount = new Map<string, number>();
    for (const r of own) if (r.language) langCount.set(r.language, (langCount.get(r.language) ?? 0) + 1);

    return {
      user: {
        login: user.login,
        publicRepos: user.public_repos,
        followers: user.followers,
        avatar: user.avatar_url,
      },
      totalStars: own.reduce((s, r) => s + r.stargazers_count, 0),
      languages: [...langCount.entries()]
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6),
      repos,
      recent: own.filter((r) => !r.archived).slice(0, 8).map(map),
      fetchedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}
