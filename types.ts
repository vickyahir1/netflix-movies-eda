
export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface ReleaseTrendDataPoint {
    year: number;
    count: number;
}

export interface KeyMetrics {
  totalMovies: number;
  averageDuration: number;
  peakReleaseYear: number;
}

export interface AnalysisResult {
  keyMetrics: KeyMetrics;
  genreDistribution: ChartDataPoint[];
  popularActors: ChartDataPoint[];
  durationDistribution: ChartDataPoint[];
  releaseTrends: ReleaseTrendDataPoint[];
  summary: string;
}
