import { useEffect, useMemo, useRef, useState } from "react";
import {
  Navigate,
  NavLink,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BookOpen,
  Camera,
  ChartNoAxesColumnIncreasing,
  CheckCircle2,
  Database,
  Download,
  FileText,
  FlaskConical,
  Home,
  ImagePlus,
  Maximize2,
  Menu,
  Microscope,
  NotebookPen,
  PackageCheck,
  Play,
  Power,
  Save,
  ShieldCheck,
  Trash2,
  Upload,
  Wifi,
  X,
} from "lucide-react";
import { db, exportBackup, importBackup } from "./db";
import { texts } from "./i18n";
import { asset, loadPublicData } from "./publicData";
import { buildPublicationPackage } from "./publication";
import type { ModelState } from "./model";
import StudentResearch from "./StudentResearch";
import type {
  DiaryEntry,
  Experiment,
  ImageRecord,
  Lang,
  ModelInfo,
  PublicOrnament,
  PublicResearch,
  ReportData,
} from "./types";

const ornaments = [
  {
    code: "KM" as const,
    name: "Қошқармүйіз",
    shape: {
      kk: "Қошқардың иірілген мүйізіне ұқсайтын симметриялы иілім.",
      ru: "Симметричный завиток, напоминающий изогнутый рог барана.",
      en: "A symmetrical curl resembling a ram’s curved horn.",
    },
    meaning: {
      kk: "Мағынасы мен қолданылуы тек тексерілген дереккөзден кейін толтырылады.",
      ru: "Значение и применение заполняются только после проверки источника.",
      en: "Meaning and use are added only after the source is verified.",
    },
  },
  {
    code: "TT" as const,
    name: "Түйетабан",
    shape: {
      kk: "Түйе табанының ізін еске түсіретін геометриялық пішін.",
      ru: "Геометрическая форма, напоминающая след верблюда.",
      en: "A geometric form resembling a camel footprint.",
    },
    meaning: {
      kk: "Этнографиялық мәлімет тек дереккөз көрсетілгенде енгізіледі.",
      ru: "Этнографические сведения вносятся только со ссылкой на источник.",
      en: "Ethnographic details are added only with a cited source.",
    },
  },
  {
    code: "KK" as const,
    name: "Құсқанат",
    shape: {
      kk: "Құстың жайылған қанатына ұқсас ырғақты элемент.",
      ru: "Ритмичный элемент, похожий на раскрытое крыло птицы.",
      en: "A rhythmic element resembling an open bird wing.",
    },
    meaning: {
      kk: "Мәдени түсіндірме зерттеу барысында тексеріледі.",
      ru: "Культурное толкование проверяется в ходе исследования.",
      en: "Its cultural interpretation is verified during the study.",
    },
  },
  {
    code: "SO" as const,
    name: "Сыңарөкше",
    shape: {
      kk: "Пішін ерекшелігі тексерілген дереккөз қосылғаннан кейін сипатталады.",
      ru: "Особенности формы будут описаны после добавления проверенного источника.",
      en: "Shape features will be described after a verified source is added.",
    },
    meaning: {
      kk: "Қолданылуы мен мағынасына тек расталған дерек қосылады.",
      ru: "Применение и значение добавляются только из подтверждённых источников.",
      en: "Use and meaning are added only from verified sources.",
    },
  },
];
const uid = () => crypto.randomUUID();
const download = (name: string, data: string, type = "application/json") => {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([data], { type }));
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
};
const ornamentDescription = (label: string, lang: Lang) =>
  ornaments.find((o) => o.name === label)?.shape[lang];
function App() {
  const [lang, setLang] = useState<Lang>(
    () => (localStorage.getItem("oyu-lang") as Lang) || "kk",
  );
  const [open, setOpen] = useState(false);
  const t = texts[lang];
  useEffect(() => {
    localStorage.setItem("oyu-lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);
  const nav = [
    ["/", t.home, Home],
    ["/recognize", t.recognize, Camera],
    [
      "/ornaments",
      lang === "kk"
        ? "Оюлар әлемі"
        : lang === "ru"
          ? "Мир орнаментов"
          : "Ornament world",
      BookOpen,
    ],
    [
      "/research",
      lang === "kk"
        ? "Менің зерттеуім"
        : lang === "ru"
          ? "Моё исследование"
          : "My research",
      ChartNoAxesColumnIncreasing,
    ],
  ] as const;
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
          <NavLink to="/" className="mr-auto flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-turquoise font-black text-ink">
              O
            </span>
            <span className="font-extrabold tracking-wide">
              OYU <span className="text-turquoise">AI</span>
            </span>
          </NavLink>
          <nav className="hidden items-center gap-1 xl:flex">
            {nav.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-semibold transition ${isActive ? "bg-white/10 text-turquoise" : "text-slate-300 hover:text-white"}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <LangSelect lang={lang} setLang={setLang} />
          <button
            className="rounded-lg p-2 xl:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <nav className="grid gap-1 border-t border-white/10 p-3 xl:hidden">
            {nav.map(([to, label, Icon]) => (
              <NavLink
                onClick={() => setOpen(false)}
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 ${isActive ? "bg-turquoise/10 text-turquoise" : "text-slate-300"}`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>
      <main>
        <Routes>
          <Route path="/" element={<HomePage lang={lang} />} />
          <Route path="/recognize" element={<Recognize lang={lang} />} />
          <Route path="/ornaments" element={<Ornaments lang={lang} />} />
          <Route path="/research" element={<StudentResearch lang={lang} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="border-t border-white/10 px-4 py-8 text-center text-sm leading-6 text-slate-500">
        OYU AI · «Зерде» 2026–2027 · {t.localNote}
      </footer>
    </div>
  );
}
function LangSelect({
  lang,
  setLang,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
}) {
  return (
    <div className="flex rounded-lg border border-white/10 p-1">
      {(["kk", "ru", "en"] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`rounded-md px-2.5 py-1.5 text-xs font-extrabold uppercase ${lang === l ? "bg-gold text-ink" : "text-slate-400"}`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

function HomePage({ lang }: { lang: Lang }) {
  const t = texts[lang];
  const nav = useNavigate();
  return (
    <div>
      <section className="ornament-bg relative overflow-hidden border-b border-white/10">
        <div className="page grid min-h-[620px] items-center gap-12 py-16 lg:grid-cols-[1.15fr_.85fr]">
          <div>
            <div className="kicker">«Зерде» · 2026–2027</div>
            <h1 className="font-display text-6xl font-bold leading-none sm:text-8xl">
              OYU <span className="text-turquoise">AI</span>
            </h1>
            <p className="mt-5 text-xl font-semibold text-gold sm:text-2xl">
              {t.tag}
            </p>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300">
              {lang === "kk"
                ? "OYU AI суреттен төрт қазақ оюын танып, олардың атауын үйренуге көмектеседі."
                : lang === "ru"
                  ? "OYU AI распознаёт четыре казахских орнамента по изображению и помогает запомнить их названия."
                  : "OYU AI recognizes four Kazakh ornaments from an image and helps children learn their names."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => nav("/recognize")}
                className="btn-primary px-7 py-4 text-lg"
              >
                <Camera size={22} />
                {lang === "kk"
                  ? "Оюды танып көр"
                  : lang === "ru"
                    ? "Попробовать распознавание"
                    : "Try recognition"}
              </button>
            </div>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <div className="absolute inset-0 rounded-full border border-turquoise/20 bg-turquoise/5 shadow-glow" />
            <div className="absolute inset-[12%] rotate-45 rounded-[35%] border-2 border-gold/40" />
            <div className="absolute inset-[25%] -rotate-12 rounded-full border-[12px] border-turquoise/30" />
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-center">
                <Microscope className="mx-auto text-turquoise" size={64} />
                <p className="mt-4 text-xs font-black uppercase tracking-[.3em] text-slate-400">
                  Digital research lab
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="page">
        <div className="grid gap-4 md:grid-cols-4">
          {ornaments.map((o, i) => (
            <div key={o.code} className="card rounded-2xl p-5">
              <span className="text-xs font-black text-gold">
                0{i + 1} / {o.code}
              </span>
              <h3 className="mt-8 text-xl font-bold">{o.name}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {o.shape[lang]}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Ornaments({ lang }: { lang: Lang }) {
  const [publicItems, setPublicItems] = useState<PublicOrnament[]>([]);
  useEffect(() => {
    loadPublicData().then((x) => setPublicItems(x.ornaments));
  }, []);
  const items = publicItems.length
    ? publicItems
    : ornaments.map((o) => ({
        code: o.code,
        name: o.name,
        description: o.shape,
        culturalMeaning: o.meaning,
        use: o.meaning,
        sources: [],
        images: [],
        verified: false,
      }));
  return (
    <div className="page">
      <Header
        kicker="01 · KNOWLEDGE"
        title={
          lang === "kk"
            ? "Оюлар әлемі"
            : lang === "ru"
              ? "Мир орнаментов"
              : "Ornament world"
        }
        desc={
          lang === "kk"
            ? "Төрт оюдың атауын және бір-бірінен айырмашылығын танып үйрен."
            : lang === "ru"
              ? "Познакомься с названиями четырёх орнаментов и научись различать их."
              : "Learn the names of four ornaments and how to tell them apart."
        }
      />
      <div className="grid gap-5 lg:grid-cols-2">
        {items.map((o) => (
          <article key={o.code} className="card overflow-hidden rounded-3xl">
            {o.images[0] ? (
              <img
                src={asset(o.images[0])}
                className="h-52 w-full object-cover"
                alt={o.name}
              />
            ) : (
              <div className="ornament-bg grid h-52 place-items-center border-b border-white/10">
                <div className="text-center text-slate-500">
                  <ImagePlus className="mx-auto mb-3" />
                  <span className="text-sm">
                    {lang === "kk"
                      ? "Жарияланған сурет әлі жоқ"
                      : lang === "ru"
                        ? "Опубликованного изображения пока нет"
                        : "No published image yet"}
                  </span>
                </div>
              </div>
            )}
            <div className="p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-3xl font-bold">{o.name}</h2>
                <span className="rounded-lg bg-gold/10 px-3 py-1 text-sm font-black text-gold">
                  {o.code}
                </span>
              </div>
              <p className="mt-5 leading-7 text-slate-300">
                {o.description[lang]}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                {o.culturalMeaning[lang]}
              </p>
              {o.sources.length > 0 && (
                <ul className="mt-4 text-sm text-slate-400">
                  {o.sources.map((s, i) => (
                    <li key={i}>
                      {s.url ? (
                        <a
                          className="text-turquoise underline"
                          href={s.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {s.title}
                        </a>
                      ) : (
                        s.title
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Recognize({ lang }: { lang: Lang }) {
  const t = texts[lang];
  const video = useRef<HTMLVideoElement>(null);
  const preview = useRef<HTMLImageElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [model, setModel] = useState<ModelState | null>(null);
  const [loading, setLoading] = useState(true);
  const [prediction, setPrediction] = useState<{
    label: string;
    probability: number;
  } | null>(null);
  const stop = () => {
    stream?.getTracks().forEach((x) => x.stop());
    setStream(null);
  };
  useEffect(() => {
    let active = true;
    loadPublicData().then(async (data) => {
      if (!active) return;
      setModelInfo(data.model);
      if (data.model.available) {
        try {
          const { loadTeachableModel } = await import("./model");
          const loaded = await loadTeachableModel(
            asset(data.model.modelPath),
            data.model.labels,
            data.model.inputSize,
          );
          if (active) setModel(loaded);
        } catch {
          if (active)
            setError(
              lang === "kk"
                ? "Модель файлын жүктеу мүмкін болмады."
                : lang === "ru"
                  ? "Не удалось загрузить файлы модели."
                  : "Could not load the model files.",
            );
        }
      }
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [lang]);
  useEffect(() => {
    if (video.current && stream) video.current.srcObject = stream;
  }, [stream]);
  useEffect(
    () => () => {
      stream?.getTracks().forEach((x) => x.stop());
    },
    [stream],
  );
  const start = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      setImage("");
      setPrediction(null);
      setStream(s);
      setError("");
    } catch {
      setError(
        lang === "kk"
          ? "Камераға рұқсат берілмеді немесе HTTPS қолданылмайды."
          : lang === "ru"
            ? "Нет разрешения на камеру или страница открыта без HTTPS."
            : "Camera permission was denied or HTTPS is not active.",
      );
    }
  };
  async function recognize() {
    const source = stream ? video.current : preview.current;
    if (!model || !source) return;
    try {
      const { predictSource } = await import("./model");
      const results = await predictSource(model, source);
      setPrediction(results[0] ?? null);
    } catch {
      setError(
        lang === "kk"
          ? "Суретті өңдеу қатесі."
          : lang === "ru"
            ? "Ошибка обработки изображения."
            : "Image processing error.",
      );
    }
  }
  return (
    <div className="page">
      <Header
        kicker="02 · RECOGNITION"
        title={t.recognize}
        desc={
          lang === "kk"
            ? "Распознау браузерде жарияланған TensorFlow.js моделімен орындалады. Сурет серверге жіберілмейді."
            : lang === "ru"
              ? "Распознавание выполняется в браузере опубликованной моделью TensorFlow.js. Изображение не отправляется на сервер."
              : "Recognition runs in the browser with the published TensorFlow.js model. The image is not sent to a server."
        }
      />
      <div className="grid gap-6 lg:grid-cols-[1.25fr_.75fr]">
        <div className="card rounded-3xl p-4 sm:p-6">
          <div className="aspect-video overflow-hidden rounded-2xl bg-black/30">
            {stream ? (
              <video
                ref={video}
                autoPlay
                playsInline
                className="h-full w-full object-cover"
              />
            ) : image ? (
              <img
                ref={preview}
                src={image}
                className="h-full w-full object-contain"
                alt="Preview"
              />
            ) : (
              <div className="grid h-full place-items-center text-center text-slate-500">
                <Camera className="mx-auto mb-4" size={42} />
                <p>
                  {lang === "kk"
                    ? "Камера немесе сурет таңдалмаған"
                    : lang === "ru"
                      ? "Камера или изображение не выбраны"
                      : "No camera or image selected"}
                </p>
              </div>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              className={stream ? "btn-secondary" : "btn-primary"}
              onClick={stream ? stop : start}
            >
              {stream ? <Power size={18} /> : <Camera size={18} />}{" "}
              {stream
                ? lang === "kk"
                  ? "Камераны өшіру"
                  : lang === "ru"
                    ? "Выключить камеру"
                    : "Stop camera"
                : lang === "kk"
                  ? "Камераны қосу"
                  : lang === "ru"
                    ? "Включить камеру"
                    : "Start camera"}
            </button>
            <label className="btn-secondary cursor-pointer">
              <Upload size={18} />
              {lang === "kk"
                ? "Сурет жүктеу"
                : lang === "ru"
                  ? "Загрузить изображение"
                  : "Upload image"}
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(e) => {
                  stop();
                  setPrediction(null);
                  const f = e.target.files?.[0];
                  if (f) setImage(URL.createObjectURL(f));
                }}
              />
            </label>
            <button
              className="btn-primary"
              disabled={!model || (!stream && !image)}
              onClick={recognize}
            >
              <Play size={18} />
              {lang === "kk"
                ? "Тану"
                : lang === "ru"
                  ? "Распознать"
                  : "Recognize"}
            </button>
          </div>
          {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
        </div>
        <aside className="card rounded-3xl p-6">
          <div
            className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${model ? "bg-turquoise/10 text-turquoise" : "bg-gold/10 text-gold"}`}
          >
            {model ? <CheckCircle2 /> : <FlaskConical />}
          </div>
          <h2 className="text-xl font-bold">
            {lang === "kk"
              ? "Модель күйі"
              : lang === "ru"
                ? "Состояние модели"
                : "Model status"}
          </h2>
          {loading ? (
            <div className="mt-5 text-slate-400">
              {lang === "kk"
                ? "Тексерілуде…"
                : lang === "ru"
                  ? "Проверка…"
                  : "Checking…"}
            </div>
          ) : model ? (
            <div className="mt-5 rounded-2xl border border-turquoise/20 bg-turquoise/5 p-4 text-turquoise">
              {lang === "kk"
                ? "Модель жүктелді және браузерде жұмыс істеуге дайын."
                : lang === "ru"
                  ? "Модель загружена и готова работать в браузере."
                  : "The model is loaded and ready in the browser."}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-gold/20 bg-gold/5 p-4 text-gold">
              {t.modelMissing}
            </div>
          )}
          {prediction && (
            <div className="mt-5 rounded-2xl bg-white/[.05] p-5">
              <p className="text-sm text-slate-400">
                {lang === "kk"
                  ? "Нәтиже"
                  : lang === "ru"
                    ? "Результат"
                    : "Result"}
              </p>
              <p className="mt-1 text-2xl font-bold">{prediction.label}</p>
              <p className="mt-2 text-turquoise">
                {(prediction.probability * 100).toFixed(1)}%
              </p>
            </div>
          )}
          <p className="mt-4 text-sm leading-6 text-slate-400">
            {modelInfo?.accuracyNote[lang]}
          </p>
        </aside>
      </div>
    </div>
  );
}

function Dataset({ lang }: { lang: Lang }) {
  const [items, setItems] = useState<ImageRecord[]>([]);
  const [message, setMessage] = useState("");
  const load = () => db.all<ImageRecord>("images").then(setItems);
  useEffect(() => {
    load();
  }, []);
  const counts = useMemo(
    () =>
      Object.fromEntries(
        ornaments.map((o) => [
          o.code,
          {
            train: items.filter(
              (x) => x.ornament === o.code && x.group === "train",
            ).length,
            test: items.filter(
              (x) => x.ornament === o.code && x.group === "test",
            ).length,
          },
        ]),
      ),
    [items],
  );
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const file = fd.get("file") as File;
    const seriesId = String(fd.get("seriesId")).trim();
    const group = String(fd.get("group"));
    if (!file?.size || !seriesId) return;
    const conflict = items.some(
      (x) =>
        x.seriesId.toLowerCase() === seriesId.toLowerCase() &&
        x.group !== group,
    );
    if (conflict) {
      setMessage(
        lang === "kk"
          ? "Бұл серия басқа топта бар. Train және test топтарын араластыруға болмайды."
          : lang === "ru"
            ? "Эта серия уже есть в другой группе. Нельзя смешивать train и test."
            : "This series already exists in the other group. Train and test must stay separate.",
      );
      return;
    }
    const dims = await new Promise<{ width: number; height: number }>((ok) => {
      const img = new Image();
      img.onload = () =>
        ok({ width: img.naturalWidth, height: img.naturalHeight });
      img.src = URL.createObjectURL(file);
    });
    await db.put("images", {
      id: uid(),
      ornament: fd.get("ornament"),
      blob: file,
      fileName: file.name,
      author: String(fd.get("author")),
      date: String(fd.get("date")),
      permission: String(fd.get("permission")),
      group,
      seriesId,
      ...dims,
      createdAt: new Date().toISOString(),
      publishApproved: false,
    } as ImageRecord);
    e.currentTarget.reset();
    setMessage(
      lang === "kk"
        ? "Сурет тіркелді."
        : lang === "ru"
          ? "Изображение зарегистрировано."
          : "Image registered.",
    );
    load();
  }
  async function approve(x: ImageRecord) {
    await db.put("images", { ...x, publishApproved: !x.publishApproved });
    load();
  }
  return (
    <div className="page">
      <Header
        kicker="03 · DATASET"
        title={texts[lang].dataset}
        desc={
          lang === "kk"
            ? "Жоспар: 240 оқу және 80 тест суреті. Барлығы — 320. Жариялауға тек рұқсаты расталған суреттер белгіленеді."
            : lang === "ru"
              ? "План: 240 обучающих и 80 тестовых изображений. Всего — 320. Для публикации отмечаются только изображения с подтверждённым разрешением."
              : "Plan: 240 training and 80 test images. Total — 320. Mark only images with confirmed permission for publication."
        }
      />
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {ornaments.map((o) => (
          <div className="card rounded-2xl p-5" key={o.code}>
            <div className="flex justify-between">
              <strong>{o.name}</strong>
              <span className="text-gold">{o.code}</span>
            </div>
            <div className="mt-4 flex gap-5 text-sm text-slate-400">
              <span>
                Train <b className="text-white">{counts[o.code].train}/60</b>
              </span>
              <span>
                Test <b className="text-white">{counts[o.code].test}/20</b>
              </span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded bg-white/10">
              <div
                className="h-full bg-turquoise"
                style={{
                  width: `${Math.min(100, (counts[o.code].train + counts[o.code].test) / 0.8)}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
        <form onSubmit={submit} className="card rounded-3xl p-6">
          <h2 className="mb-5 text-xl font-bold">
            {lang === "kk"
              ? "Суретті тіркеу"
              : lang === "ru"
                ? "Регистрация изображения"
                : "Register image"}
          </h2>
          <label className="label">
            {lang === "kk"
              ? "Ою түрі"
              : lang === "ru"
                ? "Тип орнамента"
                : "Ornament type"}
          </label>
          <select name="ornament" className="field mb-4">
            {ornaments.map((o) => (
              <option className="bg-navy" value={o.code} key={o.code}>
                {o.name} — {o.code}
              </option>
            ))}
          </select>
          <label className="label">Train / Test</label>
          <select name="group" className="field mb-4">
            <option className="bg-navy">train</option>
            <option className="bg-navy">test</option>
          </select>
          <Field
            name="seriesId"
            label={
              lang === "kk"
                ? "Түпнұсқа/серия ID"
                : lang === "ru"
                  ? "ID оригинала/серии"
                  : "Original/series ID"
            }
            required
          />
          <Field
            name="author"
            label={
              lang === "kk"
                ? "Автор немесе дереккөз"
                : lang === "ru"
                  ? "Автор или источник"
                  : "Author or source"
            }
            required
          />
          <Field
            name="date"
            type="date"
            label={lang === "kk" ? "Күні" : lang === "ru" ? "Дата" : "Date"}
            required
          />
          <Field
            name="permission"
            label={
              lang === "kk"
                ? "Пайдалануға рұқсат"
                : lang === "ru"
                  ? "Разрешение на использование"
                  : "Usage permission"
            }
            required
          />
          <label className="btn-secondary mt-2 w-full cursor-pointer">
            <ImagePlus size={18} />
            {lang === "kk"
              ? "Файл таңдау"
              : lang === "ru"
                ? "Выбрать файл"
                : "Choose file"}
            <input name="file" hidden type="file" accept="image/*" required />
          </label>
          <button className="btn-primary mt-3 w-full">
            <Save size={18} />
            {lang === "kk" ? "Сақтау" : lang === "ru" ? "Сохранить" : "Save"}
          </button>
          {message && <p className="mt-4 text-sm text-gold">{message}</p>}
        </form>
        <div className="card rounded-3xl p-6">
          <h2 className="mb-5 text-xl font-bold">
            {lang === "kk"
              ? "Осы браузердегі суреттер"
              : lang === "ru"
                ? "Изображения в этом браузере"
                : "Images in this browser"}
          </h2>
          {!items.length ? (
            <div className="empty">
              {lang === "kk"
                ? "База бос. Жасанды немесе кездейсоқ суреттер қосылмаған."
                : lang === "ru"
                  ? "База пуста. Искусственные или случайные изображения не добавлены."
                  : "The dataset is empty. No artificial or random images were added."}
            </div>
          ) : (
            <div className="max-h-[700px] space-y-3 overflow-auto">
              {items.map((x) => (
                <div
                  key={x.id}
                  className="flex items-center gap-4 rounded-xl bg-white/[.04] p-3"
                >
                  <img
                    className="h-16 w-16 rounded-lg object-cover"
                    src={URL.createObjectURL(x.blob)}
                    alt=""
                  />
                  <div className="min-w-0 flex-1">
                    <b>{ornaments.find((o) => o.code === x.ornament)?.name}</b>
                    <p className="truncate text-xs text-slate-400">
                      {x.fileName} · {x.width}×{x.height} · {x.seriesId}
                    </p>
                    <span className="text-xs font-bold uppercase text-turquoise">
                      {x.group}
                    </span>
                  </div>
                  <button
                    onClick={() => approve(x)}
                    className={`rounded-lg px-3 py-2 text-xs font-bold ${x.publishApproved ? "bg-turquoise text-ink" : "bg-white/10 text-slate-300"}`}
                  >
                    {x.publishApproved
                      ? lang === "kk"
                        ? "Жариялау"
                        : lang === "ru"
                          ? "Публикация"
                          : "Publish"
                      : lang === "kk"
                        ? "Черновик"
                        : lang === "ru"
                          ? "Черновик"
                          : "Draft"}
                  </button>
                  <button
                    aria-label="Delete"
                    onClick={async () => {
                      await db.del("images", x.id);
                      load();
                    }}
                    className="p-2 text-slate-500 hover:text-red-300"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const kinds = ["accuracy", "color", "rotation", "amount", "errors"];
function Research({ lang }: { lang: Lang }) {
  const t = texts[lang];
  const [drafts, setDrafts] = useState<Experiment[]>([]);
  const [published, setPublished] = useState<PublicResearch>({
    version: 1,
    publishedAt: null,
    experiments: [],
  });
  const [kind, setKind] = useState(kinds[0]);
  const load = () => db.all<Experiment>("experiments").then(setDrafts);
  useEffect(() => {
    load();
    loadPublicData().then((x) => setPublished(x.research));
  }, []);
  const names =
    lang === "kk"
      ? [
          "Бастапқы тану дәлдігі",
          "Түсті өзгертудің әсері",
          "Оюды бұрудың әсері",
          "Оқу суреттері санының әсері",
          "Модель қателерін талдау",
        ]
      : lang === "ru"
        ? [
            "Первичная точность распознавания",
            "Влияние изменения цвета",
            "Влияние поворота орнамента",
            "Влияние количества обучающих изображений",
            "Анализ ошибок модели",
          ]
        : [
            "Initial recognition accuracy",
            "Effect of color change",
            "Effect of ornament rotation",
            "Effect of training image count",
            "Model error analysis",
          ];
  const visible = published.experiments.filter((x) => x.kind === kind);
  const chart = visible.map((x) => ({
    name: x.label,
    accuracy: x.total ? Math.round((x.correct / x.total) * 1000) / 10 : 0,
  }));
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    await db.put("experiments", {
      id: uid(),
      kind,
      label: String(f.get("label")),
      correct: Number(f.get("correct")),
      total: Number(f.get("total")),
      note: String(f.get("note")),
      publishApproved: false,
    } as Experiment);
    e.currentTarget.reset();
    load();
  }
  async function approve(x: Experiment) {
    await db.put("experiments", { ...x, publishApproved: !x.publishApproved });
    load();
  }
  return (
    <div className="page">
      <Header
        kicker="04 · ANALYSIS"
        title={t.research}
        desc={
          lang === "kk"
            ? "Диаграммалар тек жобамен бірге жарияланған нақты нәтижелерден құрылады. Жаңа жазбалар алдымен жеке черновик ретінде сақталады."
            : lang === "ru"
              ? "Диаграммы строятся только по реальным результатам, опубликованным вместе с проектом. Новые записи сначала сохраняются как локальные черновики."
              : "Charts use only real results published with the project. New entries are saved as local drafts first."
        }
      />
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {kinds.map((k, i) => (
          <button
            key={k}
            onClick={() => setKind(k)}
            className={
              kind === k
                ? "btn-primary whitespace-nowrap"
                : "btn-secondary whitespace-nowrap"
            }
          >
            {i + 1}. {names[i]}
          </button>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[.7fr_1.3fr]">
        <form onSubmit={submit} className="card rounded-3xl p-6">
          <h2 className="mb-5 text-xl font-bold">
            {names[kinds.indexOf(kind)]}
          </h2>
          <Field
            name="label"
            label={
              lang === "kk"
                ? "Тест атауы"
                : lang === "ru"
                  ? "Название теста"
                  : "Test name"
            }
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Field
              name="correct"
              type="number"
              min="0"
              label={
                lang === "kk"
                  ? "Дұрыс жауап"
                  : lang === "ru"
                    ? "Правильных"
                    : "Correct"
              }
              required
            />
            <Field
              name="total"
              type="number"
              min="1"
              label={
                lang === "kk"
                  ? "Барлық тест"
                  : lang === "ru"
                    ? "Всего тестов"
                    : "Total tests"
              }
              required
            />
          </div>
          <Field
            name="note"
            label={
              lang === "kk" ? "Ескерту" : lang === "ru" ? "Примечание" : "Note"
            }
          />
          <button className="btn-primary w-full">
            <Save size={18} />
            {lang === "kk"
              ? "Черновикті қосу"
              : lang === "ru"
                ? "Добавить черновик"
                : "Add draft"}
          </button>
        </form>
        <div className="card min-w-0 rounded-3xl p-6">
          <div className="mb-4 flex items-center gap-2 text-sm font-bold text-turquoise">
            <Wifi size={17} />
            {lang === "kk"
              ? "Жарияланған нәтижелер"
              : lang === "ru"
                ? "Опубликованные результаты"
                : "Published results"}
          </div>
          {!visible.length ? (
            <div className="empty">{t.noData}</div>
          ) : (
            <>
              <div className="h-64 w-full">
                <ResponsiveContainer>
                  <AreaChart data={chart}>
                    <defs>
                      <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0"
                          stopColor="#18c7c8"
                          stopOpacity={0.5}
                        />
                        <stop offset="1" stopColor="#18c7c8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#ffffff12" />
                    <XAxis dataKey="name" stroke="#7890a8" />
                    <YAxis domain={[0, 100]} stroke="#7890a8" />
                    <Tooltip
                      contentStyle={{
                        background: "#0a2342",
                        border: "1px solid #ffffff22",
                        borderRadius: 12,
                      }}
                    />
                    <Area
                      dataKey="accuracy"
                      stroke="#18c7c8"
                      fill="url(#fill)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <ResultsTable rows={visible} lang={lang} />
            </>
          )}
        </div>
      </div>
      <section className="mt-6 card rounded-3xl p-6">
        <h2 className="text-xl font-bold">
          {lang === "kk"
            ? "Осы браузердегі жұмыс жазбалары"
            : lang === "ru"
              ? "Рабочие записи в этом браузере"
              : "Working records in this browser"}
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          {lang === "kk"
            ? "Тек тексерілген жолдарды жариялауға белгілеңіз."
            : lang === "ru"
              ? "Отмечайте для публикации только проверенные строки."
              : "Mark only verified rows for publication."}
        </p>
        {drafts.length ? (
          <div className="mt-4 space-y-2">
            {drafts.map((x) => (
              <div
                key={x.id}
                className="flex flex-wrap items-center gap-3 rounded-xl bg-white/[.04] p-3"
              >
                <button
                  onClick={() => approve(x)}
                  className={`rounded-lg px-3 py-2 text-xs font-bold ${x.publishApproved ? "bg-turquoise text-ink" : "bg-white/10 text-slate-300"}`}
                >
                  {x.publishApproved
                    ? lang === "kk"
                      ? "Жариялауға дайын"
                      : lang === "ru"
                        ? "Готово к публикации"
                        : "Ready to publish"
                    : lang === "kk"
                      ? "Черновик"
                      : lang === "ru"
                        ? "Черновик"
                        : "Draft"}
                </button>
                <span className="min-w-40 flex-1 font-semibold">{x.label}</span>
                <span className="text-turquoise">
                  {x.total ? ((x.correct / x.total) * 100).toFixed(1) : 0}%
                </span>
                <button
                  onClick={async () => {
                    await db.del("experiments", x.id);
                    load();
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty mt-4">
            {lang === "kk"
              ? "Жұмыс жазбалары жоқ."
              : lang === "ru"
                ? "Рабочих записей нет."
                : "No working records."}
          </div>
        )}
      </section>
    </div>
  );
}

function ResultsTable({ rows, lang }: { rows: Experiment[]; lang: Lang }) {
  return (
    <div className="mt-5 overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="text-slate-400">
          <tr>
            <th className="p-3">
              {lang === "kk" ? "Тест" : lang === "ru" ? "Тест" : "Test"}
            </th>
            <th>
              {lang === "kk"
                ? "Есеп"
                : lang === "ru"
                  ? "Расчёт"
                  : "Calculation"}
            </th>
            <th>
              {lang === "kk"
                ? "Дәлдік"
                : lang === "ru"
                  ? "Точность"
                  : "Accuracy"}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((x) => (
            <tr className="border-t border-white/10" key={x.id}>
              <td className="p-3 font-semibold">{x.label}</td>
              <td>
                {x.correct} / {x.total} × 100%
              </td>
              <td className="font-bold text-turquoise">
                {x.total ? ((x.correct / x.total) * 100).toFixed(1) : 0}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Diary({ lang }: { lang: Lang }) {
  const [rows, setRows] = useState<DiaryEntry[]>([]);
  const [published, setPublished] = useState<DiaryEntry[]>([]);
  const load = () =>
    db
      .all<DiaryEntry>("diary")
      .then((x) => setRows(x.sort((a, b) => b.date.localeCompare(a.date))));
  useEffect(() => {
    load();
    loadPublicData().then((x) => setPublished(x.journal.entries));
  }, []);
  const labels =
    lang === "kk"
      ? [
          "Күні",
          "Кезең",
          "Орындалған жұмыс",
          "Нәтиже",
          "Қиындықтар",
          "Енгізілген өзгерістер",
          "Келесі қадам",
        ]
      : lang === "ru"
        ? [
            "Дата",
            "Этап",
            "Выполненная работа",
            "Результат",
            "Трудности",
            "Внесённые изменения",
            "Следующий шаг",
          ]
        : [
            "Date",
            "Stage",
            "Work completed",
            "Result",
            "Difficulties",
            "Changes made",
            "Next step",
          ];
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    await db.put("diary", {
      id: uid(),
      date: f.get("date"),
      stage: f.get("stage"),
      work: f.get("work"),
      result: f.get("result"),
      difficulties: f.get("difficulties"),
      changes: f.get("changes"),
      next: f.get("next"),
      publishApproved: false,
    } as DiaryEntry);
    e.currentTarget.reset();
    load();
  }
  async function approve(x: DiaryEntry) {
    await db.put("diary", { ...x, publishApproved: !x.publishApproved });
    load();
  }
  const csv =
    "\ufeff" +
    [
      labels.join(";"),
      ...rows.map((x) =>
        [x.date, x.stage, x.work, x.result, x.difficulties, x.changes, x.next]
          .map((v) => `"${String(v).replaceAll('"', '""')}"`)
          .join(";"),
      ),
    ].join("\n");
  return (
    <div className="page">
      <Header
        kicker="05 · JOURNAL"
        title={texts[lang].diary}
        action={
          <button
            className="btn-secondary"
            onClick={() => download("oyu-ai-diary.csv", csv, "text/csv")}
          >
            <Download size={18} />
            {lang === "kk"
              ? "CSV экспорт"
              : lang === "ru"
                ? "Экспорт CSV"
                : "Export CSV"}
          </button>
        }
      />
      {published.length > 0 && (
        <section className="mb-6">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-turquoise">
            <Wifi size={17} />
            {lang === "kk"
              ? "Жарияланған күнделік"
              : lang === "ru"
                ? "Опубликованный дневник"
                : "Published journal"}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {published.map((x) => (
              <article key={x.id} className="card rounded-2xl p-5">
                <time className="text-sm text-gold">{x.date}</time>
                <h3 className="mt-1 text-lg font-bold">{x.stage}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {x.work}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}
      <form
        onSubmit={submit}
        className="card mb-6 grid gap-4 rounded-3xl p-6 md:grid-cols-2"
      >
        <Field name="date" type="date" label={labels[0]} required />
        <Field name="stage" label={labels[1]} required />
        {labels.slice(2).map((l, i) => (
          <label className={i === 0 ? "md:col-span-2" : ""} key={l}>
            <span className="label">{l}</span>
            <textarea
              name={["work", "result", "difficulties", "changes", "next"][i]}
              className="field min-h-24"
              required
            />
          </label>
        ))}
        <button className="btn-primary md:col-span-2">
          <Save size={18} />
          {lang === "kk"
            ? "Черновикті қосу"
            : lang === "ru"
              ? "Добавить черновик"
              : "Add draft"}
        </button>
      </form>
      <h2 className="mb-4 text-xl font-bold">
        {lang === "kk"
          ? "Жеке жұмыс жазбалары"
          : lang === "ru"
            ? "Личные рабочие записи"
            : "Private working entries"}
      </h2>
      {!rows.length ? (
        <div className="empty">
          {lang === "kk"
            ? "Күнделік жазбалары әлі жоқ."
            : lang === "ru"
              ? "Записей в дневнике пока нет."
              : "There are no journal entries yet."}
        </div>
      ) : (
        <div className="space-y-4">
          {rows.map((x) => (
            <article key={x.id} className="card rounded-2xl p-6">
              <div className="flex flex-wrap justify-between gap-4">
                <div>
                  <time className="text-sm text-gold">{x.date}</time>
                  <h3 className="mt-1 text-xl font-bold">{x.stage}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => approve(x)}
                    className={`rounded-lg px-3 py-2 text-xs font-bold ${x.publishApproved ? "bg-turquoise text-ink" : "bg-white/10 text-slate-300"}`}
                  >
                    {x.publishApproved
                      ? lang === "kk"
                        ? "Жариялауға дайын"
                        : lang === "ru"
                          ? "Готово к публикации"
                          : "Ready to publish"
                      : lang === "kk"
                        ? "Черновик"
                        : lang === "ru"
                          ? "Черновик"
                          : "Draft"}
                  </button>
                  <button
                    onClick={async () => {
                      await db.del("diary", x.id);
                      load();
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <p className="mt-4 text-slate-300">{x.work}</p>
              <p className="mt-2 text-sm text-slate-400">
                {labels[3]}: {x.result}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function Report({ lang }: { lang: Lang }) {
  const [data, setData] = useState<ReportData>({
    goal: "",
    tasks: "",
    hypothesis: "",
    methods: "",
    results: "",
    conclusions: "",
    sources: "",
  });
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    db.all<ReportData & { id: string }>("report").then((x) => {
      if (x[0]) setData(x[0]);
    });
  }, []);
  const labels =
    lang === "kk"
      ? [
          "Мақсаты",
          "Міндеттері",
          "Гипотеза",
          "Әдістері",
          "Нәтижелері",
          "Қорытындысы",
          "Дереккөздер",
        ]
      : lang === "ru"
        ? [
            "Цель",
            "Задачи",
            "Гипотеза",
            "Методы",
            "Результаты",
            "Выводы",
            "Источники",
          ]
        : [
            "Goal",
            "Objectives",
            "Hypothesis",
            "Methods",
            "Results",
            "Conclusions",
            "Sources",
          ];
  const keys = Object.keys(data) as (keyof ReportData)[];
  async function save() {
    await db.put("report", { id: "main", ...data });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }
  return (
    <div className="page">
      <Header
        kicker="06 · REPORT"
        title={texts[lang].report}
        desc={
          lang === "kk"
            ? "Ғылыми мазмұнды оқушы өзі енгізеді. Жүйе қорытындыны автоматты түрде жазбайды."
            : lang === "ru"
              ? "Научное содержание вводит ученик. Система не генерирует выводы автоматически."
              : "The student writes the scientific content. The system does not generate conclusions."
        }
      />
      <div className="card rounded-3xl p-6 sm:p-8">
        <div className="grid gap-5 md:grid-cols-2">
          {keys.map((k, i) => (
            <label key={k} className={i > 1 ? "md:col-span-2" : ""}>
              <span className="label">{labels[i]}</span>
              <textarea
                value={data[k]}
                onChange={(e) => setData({ ...data, [k]: e.target.value })}
                className="field min-h-32"
              />
            </label>
          ))}
        </div>
        <button onClick={save} className="btn-primary mt-6">
          <Save size={18} />
          {saved
            ? lang === "kk"
              ? "Сақталды"
              : lang === "ru"
                ? "Сохранено"
                : "Saved"
            : lang === "kk"
              ? "Есепті сақтау"
              : lang === "ru"
                ? "Сохранить отчёт"
                : "Save report"}
        </button>
      </div>
    </div>
  );
}

function DemoPage({ lang }: { lang: Lang }) {
  const nav = useNavigate();
  const [data, setData] = useState<PublicResearch>({
    version: 1,
    publishedAt: null,
    experiments: [],
  });
  const [model, setModel] = useState<ModelInfo | null>(null);
  useEffect(() => {
    loadPublicData().then((x) => {
      setData(x.research);
      setModel(x.model);
    });
  }, []);
  const chart = data.experiments.map((x) => ({
    name: x.label,
    accuracy: x.total ? Math.round((x.correct / x.total) * 1000) / 10 : 0,
  }));
  return (
    <div className="page min-h-[calc(100vh-4rem)]">
      <div className="ornament-bg rounded-[2rem] border border-white/10 p-6 sm:p-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="kicker">OYU AI · LIVE DEMO</div>
            <h1 className="font-display text-5xl font-bold sm:text-7xl">
              {lang === "kk"
                ? "Ғылыми жоба"
                : lang === "ru"
                  ? "Научный проект"
                  : "Science project"}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-300">
              {texts[lang].question}
            </p>
          </div>
          <button
            onClick={() => nav("/recognize")}
            className="btn-primary px-10 py-6 text-2xl"
          >
            <Camera size={30} />
            {texts[lang].recognize}
          </button>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-[1.5fr_.5fr]">
          <div className="card min-w-0 rounded-3xl p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold">{texts[lang].research}</h2>
              <button
                onClick={() => nav("/research")}
                className="btn-secondary"
              >
                {lang === "kk"
                  ? "Толығырақ"
                  : lang === "ru"
                    ? "Подробнее"
                    : "Details"}
              </button>
            </div>
            {chart.length ? (
              <div className="h-80">
                <ResponsiveContainer>
                  <AreaChart data={chart}>
                    <CartesianGrid stroke="#ffffff12" />
                    <XAxis dataKey="name" stroke="#7890a8" />
                    <YAxis domain={[0, 100]} stroke="#7890a8" />
                    <Tooltip
                      contentStyle={{
                        background: "#0a2342",
                        border: "1px solid #ffffff22",
                        borderRadius: 12,
                      }}
                    />
                    <Area
                      dataKey="accuracy"
                      stroke="#18c7c8"
                      fill="#18c7c833"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="empty">{texts[lang].noData}</div>
            )}
          </div>
          <aside className="card rounded-3xl p-6">
            <FlaskConical
              className={model?.available ? "text-turquoise" : "text-gold"}
              size={36}
            />
            <h2 className="mt-5 text-2xl font-bold">
              {lang === "kk" ? "Модель" : lang === "ru" ? "Модель" : "Model"}
            </h2>
            <p className="mt-3 text-slate-400">
              {model?.available
                ? lang === "kk"
                  ? `Нұсқа: ${model.version ?? "—"}`
                  : lang === "ru"
                    ? `Версия: ${model.version ?? "—"}`
                    : `Version: ${model.version ?? "—"}`
                : texts[lang].modelMissing}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {(model?.labels || []).map((x) => (
                <span
                  key={x}
                  className="rounded-lg bg-turquoise/10 px-3 py-2 text-sm text-turquoise"
                >
                  {x}
                </span>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function DataPage({ lang }: { lang: Lang }) {
  const [message, setMessage] = useState("");
  async function backup() {
    download(
      `oyu-ai-backup-${new Date().toISOString().slice(0, 10)}.json`,
      await exportBackup(),
    );
    setMessage(
      lang === "kk"
        ? "Резервтік көшірме дайын."
        : lang === "ru"
          ? "Резервная копия готова."
          : "Backup is ready.",
    );
  }
  async function restore(file?: File) {
    if (!file) return;
    try {
      await importBackup(await file.text());
      setMessage(
        lang === "kk"
          ? "Деректер қалпына келтірілді."
          : lang === "ru"
            ? "Данные восстановлены."
            : "Data restored.",
      );
    } catch {
      setMessage(
        lang === "kk"
          ? "Файл форматы жарамсыз."
          : lang === "ru"
            ? "Неверный формат файла."
            : "Invalid backup format.",
      );
    }
  }
  async function publication() {
    const bytes = await buildPublicationPackage();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob([bytes], { type: "application/zip" }),
    );
    a.download = `oyu-ai-publication-${new Date().toISOString().slice(0, 10)}.zip`;
    a.click();
    URL.revokeObjectURL(a.href);
    setMessage(
      lang === "kk"
        ? "Жариялау пакеті дайын. ZIP ішіндегі тізімді тексеріңіз."
        : lang === "ru"
          ? "Пакет публикации готов. Проверьте список файлов внутри ZIP."
          : "Publication package is ready. Review the files inside the ZIP.",
    );
  }
  return (
    <div className="page">
      <Header
        kicker="07 · DATA & PUBLICATION"
        title={texts[lang].backup}
        desc={texts[lang].localNote}
      />
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="card rounded-3xl p-7">
          <Download className="text-turquoise" size={32} />
          <h2 className="mt-5 text-2xl font-bold">
            {lang === "kk"
              ? "Толық резервтік көшірме"
              : lang === "ru"
                ? "Полная резервная копия"
                : "Full backup"}
          </h2>
          <p className="mt-3 leading-7 text-slate-400">
            {lang === "kk"
              ? "Барлық жеке суреттерді, тәжірибелерді, күнделік пен есепті сақтайды."
              : lang === "ru"
                ? "Сохраняет все личные изображения, эксперименты, дневник и отчёт."
                : "Saves all private images, experiments, journal, and report."}
          </p>
          <button onClick={backup} className="btn-primary mt-6">
            <Download size={18} />
            {lang === "kk"
              ? "Көшірмені жүктеу"
              : lang === "ru"
                ? "Скачать копию"
                : "Download backup"}
          </button>
        </div>
        <div className="card rounded-3xl p-7">
          <Upload className="text-gold" size={32} />
          <h2 className="mt-5 text-2xl font-bold">
            {lang === "kk"
              ? "Көшірмеден қалпына келтіру"
              : lang === "ru"
                ? "Восстановить из копии"
                : "Restore backup"}
          </h2>
          <p className="mt-3 leading-7 text-slate-400">
            {lang === "kk"
              ? "Импорт осы браузердегі ағымдағы жұмыс деректерін ауыстырады."
              : lang === "ru"
                ? "Импорт заменит текущие рабочие данные в этом браузере."
                : "Import replaces current working data in this browser."}
          </p>
          <label className="btn-secondary mt-6 cursor-pointer">
            <Upload size={18} />
            {lang === "kk"
              ? "Файл таңдау"
              : lang === "ru"
                ? "Выбрать файл"
                : "Choose file"}
            <input
              hidden
              type="file"
              accept="application/json"
              onChange={(e) => restore(e.target.files?.[0])}
            />
          </label>
        </div>
        <div className="card rounded-3xl border-turquoise/30 p-7">
          <PackageCheck className="text-turquoise" size={32} />
          <h2 className="mt-5 text-2xl font-bold">
            {lang === "kk"
              ? "Зерттеу деректерін жариялауға дайындау"
              : lang === "ru"
                ? "Подготовить исследовательские данные к публикации"
                : "Prepare research data for publication"}
          </h2>
          <p className="mt-3 leading-7 text-slate-400">
            {lang === "kk"
              ? "Тек «жариялауға дайын» деп белгіленген нәтижелер, күнделік жазбалары және рұқсаты бар суреттер ZIP пакетіне кіреді."
              : lang === "ru"
                ? "В ZIP войдут только результаты и записи, отмеченные как готовые, а также изображения с разрешением на публикацию."
                : "The ZIP includes only approved results, journal entries, and images with publication permission."}
          </p>
          <button onClick={publication} className="btn-primary mt-6">
            <PackageCheck size={18} />
            {lang === "kk"
              ? "Жариялау пакетін жасау"
              : lang === "ru"
                ? "Создать пакет публикации"
                : "Create publication package"}
          </button>
        </div>
      </div>
      <div className="mt-6 rounded-2xl border border-gold/20 bg-gold/5 p-5 text-sm leading-6 text-gold">
        {lang === "kk"
          ? "Қауіпсіздік: ZIP файлын жобаға қоспас бұрын жеке деректер, мектеп туралы мәліметтер және жабық материалдар жоқ екенін қайта тексеріңіз."
          : lang === "ru"
            ? "Безопасность: перед добавлением ZIP в проект ещё раз проверьте, что в нём нет персональных данных, сведений о школе и закрытых материалов."
            : "Safety: before adding the ZIP to the project, verify again that it contains no personal data, school details, or private materials."}
      </div>
      {message && (
        <p className="mt-5 rounded-xl border border-turquoise/20 bg-turquoise/5 p-4 text-turquoise">
          {message}
        </p>
      )}
    </div>
  );
}

function Header({
  kicker,
  title,
  desc,
  action,
}: {
  kicker: string;
  title: string;
  desc?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        <div className="kicker">{kicker}</div>
        <h1 className="section-title">{title}</h1>
        {desc && (
          <p className="mt-3 max-w-3xl leading-7 text-slate-400">{desc}</p>
        )}
      </div>
      {action}
    </div>
  );
}
function Field({
  name,
  label,
  type = "text",
  required,
  min,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  min?: string;
}) {
  return (
    <label className="mb-4 block">
      <span className="label">{label}</span>
      <input
        name={name}
        type={type}
        min={min}
        required={required}
        className="field"
      />
    </label>
  );
}
export default App;
