import type {
  Lang,
  ModelInfo,
  PublicJournal,
  PublicOrnament,
  PublicResearch,
  ResearchTest,
} from "./types";

export type ResearchFile = {
  tests: ResearchTest[];
  summary: {
    conclusion: Record<Lang, string>;
    recommendation: Record<Lang, string>;
  };
};

const asset = (path: string) =>
  /^https?:\/\//i.test(path)
    ? path
    : `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
async function readJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(asset(path), { cache: "no-cache" });
    if (!response.ok) return fallback;
    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}
export const emptyResearch: PublicResearch = {
  version: 1,
  publishedAt: null,
  experiments: [],
};
export const emptyJournal: PublicJournal = {
  version: 1,
  publishedAt: null,
  entries: [],
};
export const emptyModel: ModelInfo = {
  available: false,
  version: null,
  updatedAt: null,
  modelPath: "models/oyu-ai/model.json",
  metadataPath: "models/oyu-ai/metadata.json",
  inputSize: 224,
  labels: [],
  accuracyNote: {
    kk: "Модель туралы тексерілген мәлімет әлі жарияланбаған.",
    ru: "Проверенные сведения о модели ещё не опубликованы.",
    en: "Verified model information has not been published yet.",
  },
};
export async function loadPublicData() {
  const [fileOrnaments, research, journal, fileModel] = await Promise.all([
    readJson<PublicOrnament[]>("data/ornaments.json", []),
    readJson<PublicResearch>("data/research-results.json", emptyResearch),
    readJson<PublicJournal>("data/published-journal.json", emptyJournal),
    readJson<ModelInfo>("models/oyu-ai/model-info.json", emptyModel),
  ]);
  return { ornaments: fileOrnaments, research, journal, model: fileModel };
}
export const loadResearchTests = () =>
  readJson<ResearchFile>("data/research-tests.json", {
    tests: [],
    summary: {
      conclusion: { kk: "", ru: "", en: "" },
      recommendation: { kk: "", ru: "", en: "" },
    },
  });
export { asset };
