import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { loadResearchTests, type ResearchFile } from "./publicData";
import type { Lang, ResearchTest } from "./types";

const labels = ["Қошқармүйіз", "Түйетабан", "Құсқанат", "Сыңарөкше"];

export default function StudentResearch({ lang }: { lang: Lang }) {
  const [rows, setRows] = useState<ResearchTest[]>([]);
  const [summary, setSummary] = useState<ResearchFile["summary"] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResearchTests()
      .then((data) => {
        setRows(data.tests || []);
        setSummary(data.summary);
      })
      .finally(() => setLoading(false));
  }, []);

  const correct = rows.filter(
    (row) => row.actualLabel === row.predictedLabel,
  ).length;
  const rate = rows.length ? (correct / rows.length) * 100 : 0;
  const chart = useMemo(
    () =>
      labels.map((name) => {
        const tests = rows.filter((row) => row.actualLabel === name);
        return {
          name,
          correct: tests.filter((row) => row.actualLabel === row.predictedLabel)
            .length,
          wrong: tests.filter((row) => row.actualLabel !== row.predictedLabel)
            .length,
        };
      }),
    [rows],
  );

  const tx =
    lang === "kk"
      ? {
          title: "Менің зерттеуім",
          inProgress: "Тәжірибе жүргізілуде",
          questionTitle: "Зерттеу сұрағы",
          question:
            "Жасанды интеллект қазақтың төрт ұлттық оюын қаншалықты дұрыс тани алады?",
          goalTitle: "Мақсат",
          goal: "ЖИ моделінің төрт ұлттық оюды тануын тәжірибе арқылы тексеру.",
          experimentTitle: "Тәжірибе",
          experiment:
            "Қошқармүйіз, Түйетабан, Құсқанат және Сыңарөкше оюларының әрқайсысынан модель бұрын көрмеген 5 сурет таңдалады. Барлығы — 20 сурет.",
          resultsTitle: "Нәтиже",
          tableTitle: "Тәжірибе кестесі",
          total: "Тексерілген сурет",
          correct: "Дұрыс танылды",
          rate: "Дұрыс тану үлесі",
          actual: "Оюдың дұрыс атауы",
          predicted: "ЖИ таныған атауы",
          status: "Дұрыс / қате",
          empty: "Нақты нәтижелер тәжірибеден кейін енгізіледі.",
          right: "Дұрыс",
          wrong: "Қате",
          conclusion: "Қорытынды",
          recommendation: "Ұсыныс",
          conclusionHint:
            "Оқушы тәжірибеден кейін қорытындысын өз сөзімен жазады.",
          recommendationHint:
            "Оқушы тәжірибеден кейін ұсынысын өз сөзімен жазады.",
        }
      : lang === "ru"
        ? {
            title: "Моё исследование",
            inProgress: "Эксперимент проводится",
            questionTitle: "Исследовательский вопрос",
            question:
              "Насколько правильно искусственный интеллект распознаёт четыре казахских орнамента?",
            goalTitle: "Цель",
            goal: "Проверить распознавание четырёх национальных орнаментов моделью ИИ с помощью эксперимента.",
            experimentTitle: "Эксперимент",
            experiment:
              "Для каждого орнамента — Қошқармүйіз, Түйетабан, Құсқанат и Сыңарөкше — выбирается по 5 ранее не виденных моделью изображений. Всего — 20 изображений.",
            resultsTitle: "Результат",
            tableTitle: "Таблица эксперимента",
            total: "Проверено изображений",
            correct: "Распознано правильно",
            rate: "Доля правильных ответов",
            actual: "Правильное название",
            predicted: "Ответ ИИ",
            status: "Верно / ошибка",
            empty: "Фактические результаты будут внесены после эксперимента.",
            right: "Верно",
            wrong: "Ошибка",
            conclusion: "Вывод",
            recommendation: "Рекомендация",
            conclusionHint:
              "После эксперимента ученик напишет вывод своими словами.",
            recommendationHint:
              "После эксперимента ученик напишет рекомендацию своими словами.",
          }
        : {
            title: "My research",
            inProgress: "Experiment in progress",
            questionTitle: "Research question",
            question: "How accurately can AI recognize four Kazakh ornaments?",
            goalTitle: "Goal",
            goal: "Test how the AI model recognizes four national ornaments through an experiment.",
            experimentTitle: "Experiment",
            experiment:
              "Five images not previously seen by the model are selected for each ornament: Қошқармүйіз, Түйетабан, Құсқанат and Сыңарөкше. There are 20 images in total.",
            resultsTitle: "Result",
            tableTitle: "Experiment table",
            total: "Images tested",
            correct: "Recognized correctly",
            rate: "Accuracy",
            actual: "Correct name",
            predicted: "AI answer",
            status: "Correct / wrong",
            empty: "Actual results will be added after the experiment.",
            right: "Correct",
            wrong: "Wrong",
            conclusion: "Conclusion",
            recommendation: "Recommendation",
            conclusionHint:
              "The student will write a conclusion after the experiment.",
            recommendationHint:
              "The student will write a recommendation after the experiment.",
          };

  return (
    <div className="page">
      <div className="kicker">4 × 5 = 20 TEST</div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
        <h1 className="section-title">{tx.title}</h1>
        <span className="rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-sm font-bold text-gold">
          {tx.inProgress}
        </span>
      </div>

      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        <InfoCard number="01" title={tx.questionTitle} text={tx.question} />
        <InfoCard number="02" title={tx.goalTitle} text={tx.goal} />
        <InfoCard number="03" title={tx.experimentTitle} text={tx.experiment} />
      </section>

      <section className="mt-10">
        <div className="kicker">04 · {tx.resultsTitle}</div>
        <h2 className="mt-2 text-3xl font-bold">{tx.resultsTitle}</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <Stat label={tx.total} value={`${rows.length} / 20`} />
          <Stat
            label={tx.correct}
            value={rows.length ? String(correct) : "—"}
          />
          <Stat
            label={tx.rate}
            value={rows.length ? `${rate.toFixed(1)}%` : "—"}
          />
        </div>
      </section>

      <section className="card mt-6 rounded-3xl p-5 sm:p-6">
        <h2 className="text-xl font-bold">{tx.rate}</h2>
        <p className="mt-2 text-sm text-slate-400">
          {rows.length ? `${correct} / ${rows.length}` : tx.empty}
        </p>
        <div className="mt-4 h-72">
          <ResponsiveContainer>
            <BarChart data={chart}>
              <CartesianGrid stroke="#ffffff12" />
              <XAxis dataKey="name" stroke="#7890a8" fontSize={12} />
              <YAxis allowDecimals={false} domain={[0, 5]} stroke="#7890a8" />
              <Tooltip
                contentStyle={{
                  background: "#0a2342",
                  border: "1px solid #ffffff22",
                  borderRadius: 12,
                }}
              />
              <Bar
                dataKey="correct"
                name={tx.right}
                fill="#18c7c8"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="wrong"
                name={tx.wrong}
                fill="#f2b84b"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold">{tx.tableTitle}</h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-white/[.04] text-slate-400">
              <tr>
                <th className="p-4">№</th>
                <th className="p-4">{tx.actual}</th>
                <th className="p-4">{tx.predicted}</th>
                <th className="p-4">{tx.status}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="p-5 text-slate-400" colSpan={4}>
                    …
                  </td>
                </tr>
              ) : rows.length ? (
                rows.map((row, index) => {
                  const isCorrect = row.actualLabel === row.predictedLabel;
                  return (
                    <tr key={row.id} className="border-t border-white/10">
                      <td className="p-4">{index + 1}</td>
                      <td className="p-4">{row.actualLabel}</td>
                      <td className="p-4">{row.predictedLabel}</td>
                      <td
                        className={`p-4 font-bold ${isCorrect ? "text-turquoise" : "text-gold"}`}
                      >
                        {isCorrect ? tx.right : tx.wrong}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="p-6 text-center text-slate-400" colSpan={4}>
                    {tx.empty}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <TextResult
          title={tx.conclusion}
          text={summary?.conclusion?.[lang] || tx.conclusionHint}
          empty={!summary?.conclusion?.[lang]}
        />
        <TextResult
          title={tx.recommendation}
          text={summary?.recommendation?.[lang] || tx.recommendationHint}
          empty={!summary?.recommendation?.[lang]}
        />
      </section>
    </div>
  );
}

function InfoCard({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <article className="card rounded-2xl p-5">
      <span className="text-xs font-black tracking-widest text-gold">
        {number}
      </span>
      <h2 className="mt-4 text-xl font-bold">{title}</h2>
      <p className="mt-3 leading-7 text-slate-300">{text}</p>
    </article>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card rounded-2xl p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-black text-white">{value}</p>
    </div>
  );
}

function TextResult({
  title,
  text,
  empty,
}: {
  title: string;
  text: string;
  empty: boolean;
}) {
  return (
    <article className="card rounded-2xl p-5">
      <h2 className="text-xl font-bold">{title}</h2>
      <p
        className={`mt-3 min-h-16 leading-7 ${empty ? "italic text-slate-500" : "text-slate-300"}`}
      >
        {text}
      </p>
    </article>
  );
}
