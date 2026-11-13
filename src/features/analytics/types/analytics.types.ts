export interface TimeSeriesPoint {
  date: string;
  count: number;
}

export interface AnalyticsSummary {
  rangeDays: number;
  totalViews: number;
  totalClicks: number;
  ctr: number;
  viewsSeries: TimeSeriesPoint[];
  clicksSeries: TimeSeriesPoint[];
  topLinks: { id: string; title: string; clicks: number }[];
}

export interface TopLinkPerformance {
  id: string;
  rank: number;
  title: string;
  badge: string;
  badgeColor: string;
  icon: string;
  iconColor: string;
  url: string;
  clicks: number;
  ctr: string;
  barWidth: string;
  barColor: string;
  bounceRate: string;
  avgStay: string;
  tag: string;
  tagColor: string;
}

export interface TrafficSourceItem {
  name: string;
  percentage: number;
  color: string;
  text: string;
}

export interface CountryItem {
  name: string;
  percentage: string;
  flag: string;
}

