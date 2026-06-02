export interface RankingItem {
  rank: number;
  term_name: string;
  theme_name: string | null;
  category: string | null;
  total_score: number;
  rank_change: number | null;
  rise_reason: string | null;
}

export interface ThemeRankingItem {
  theme_key: string;
  theme_name: string;
  total_score: number;
  term_count: number;
}

export interface NewTermItem {
  term_name: string;
  theme_name: string | null;
  category: string | null;
  first_seen: string;
  total_score: number | null;
}

export interface TermDetail {
  term_id: number;
  term_name: string;
  theme_key: string | null;
  theme_name: string | null;
  category: string | null;
  first_seen: string;
  last_seen: string;
  peak_rank: number | null;
  description: string | null;
  is_permanent: number;
  today: {
    rank: number | null;
    rank_change: number | null;
    total_score: number;
    github_score: number;
    hn_score: number;
    rise_reason: string | null;
  } | null;
}

export interface ScoreHistory {
  date: string;
  total_score: number;
  github_score: number;
  hn_score: number;
  rank: number | null;
}

export interface StatusResponse {
  last_updated: string | null;
  total_terms: number;
  permanent_terms: number;
}
