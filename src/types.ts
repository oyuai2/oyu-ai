export type Lang = "kk" | "ru" | "en";
export type OrnamentCode = "KM" | "TT" | "KK" | "SO";
export type ImageGroup = "train" | "test";
export interface ImageRecord {
  id: string;
  ornament: OrnamentCode;
  blob: Blob;
  fileName: string;
  author: string;
  date: string;
  permission: string;
  group: ImageGroup;
  seriesId: string;
  width: number;
  height: number;
  createdAt: string;
  publishApproved?: boolean;
}
export interface Experiment {
  id: string;
  kind: string;
  label: string;
  correct: number;
  total: number;
  note: string;
  publishApproved?: boolean;
}
export interface DiaryEntry {
  id: string;
  date: string;
  stage: string;
  work: string;
  result: string;
  difficulties: string;
  changes: string;
  next: string;
  publishApproved?: boolean;
}
export interface ReportData {
  goal: string;
  tasks: string;
  hypothesis: string;
  methods: string;
  results: string;
  conclusions: string;
  sources: string;
}
export interface LocalizedText {
  kk: string;
  ru: string;
  en: string;
}
export interface PublicOrnament {
  code: OrnamentCode;
  name: string;
  description: LocalizedText;
  culturalMeaning: LocalizedText;
  use: LocalizedText;
  sources: Array<{ title: string; url?: string }>;
  images: string[];
  verified: boolean;
}
export interface PublicResearch {
  version: number;
  publishedAt: string | null;
  experiments: Experiment[];
}
export interface PublicJournal {
  version: number;
  publishedAt: string | null;
  entries: DiaryEntry[];
}
export interface ModelInfo {
  available: boolean;
  version: string | null;
  updatedAt: string | null;
  modelPath: string;
  metadataPath: string;
  inputSize: number;
  labels: string[];
  accuracyNote: LocalizedText;
  warning?: LocalizedText;
}
export interface ResearchTest {
  id: string;
  imageUrl: string | null;
  actualLabel: string;
  predictedLabel: string;
  confidence: number;
  createdAt: string;
  published: boolean;
}
