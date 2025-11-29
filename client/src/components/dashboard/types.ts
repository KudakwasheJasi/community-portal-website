export interface StatData {
  id: string;
  label: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
  icon: React.ElementType;
}