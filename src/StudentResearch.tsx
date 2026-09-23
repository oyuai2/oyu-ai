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
import { asset, loadResearchTests, type ResearchFile } from "./publicData";
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
  const correct = rows.filter((x) => x.actualLabel === x.predictedLabel).length;
  const rate = rows.length ? (correct / rows.length) * 100 : 0;
  const chart = useMemo(
    () =>
      labels.map((name) => {
        const all = rows.filter((x) => x.actualLabel === name);
        return {
          name,
          correct: all.filter((x) => x.actualLabel === x.predictedLabel).length,
          wrong: all.filter((x) => x.actualLabel !== x.predictedLabel).length,
        };
      }),
    [rows],
  );
  const tx =
    lang === "kk"
      ? {
          title: "Менің зерттеуім",
          question:
            "Жасанды интеллект қазақтың төрт ұлттық оюын қаншалықты дұрыс тани алады?",
          total: "Тексерілген сурет",
          correct: "Дұрыс танылды",
          rate: "Дұрыс тану үлесі",
          empty: "Тәжірибе нәтижелері әлі енгізілген жоқ",
          actual: "Дұрыс атауы",
          predicted: "ЖИ жауабы",
          confidence: "Сенімділік",
          status: "Нәтиже",
        }
      : lang === "ru"
        ? {
            title: "Моё исследование",
            question:
              "Насколько правильно искусственный интеллект распознаёт четыре казахских орнамента?",
            total: "Проверено изображений",
            correct: "Распознано правильно",
            rate: "Доля правильных ответов",
            empty: "Результаты эксперимента ещё не введены",
            actual: "Правильное название",
            predicted: "Ответ ИИ",
            confidence: "Уверенность",
            status: "Результат",
          }
        : {
            title: "My research",
            question: "How accurately can AI recognize four Kazakh ornaments?",
            total: "Images tested",
            correct: "Correct answers",
            rate: "Accuracy",
            empty: "Experiment results have not been entered yet",
            actual: "Correct label",
            predicted: "AI answer",
            confidence: "Confidence",
            status: "Result",
          };
  return (
    <div className="page">
      <div className="kicker">4 × 5 = 20 TEST</div>
      <h1 className="section-title">{tx.title}</h1>
      <p className="mt-4 max-w-3xl text-xl leading-8 text-slate-300">
        {tx.question}
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label={tx.total} value={`${rows.length} / 20`} />
        <Stat label={tx.correct} value={String(correct)} />
        <Stat
          label={tx.rate}
          value={rows.length ? `${rate.toFixed(1)}%` : "—"}
        />
      </div>
      {loading ? (
        <div className="empty mt-6">…</div>
      ) : !rows.length ? (
        <div className="empty mt-6">{tx.empty}</div>
      ) : (
        <>
          <div className="card mt-6 rounded-3xl p-6">
            <h2 className="text-xl font-bold">{tx.rate}</h2>
            <div className="mt-4 h-72">
              <ResponsiveContainer>
                <BarChart data={chart}>
                  <CartesianGrid stroke="#ffffff12" />
                  <XAxis dataKey="name" stroke="#7890a8" />
                  <YAxis allowDecimals={false} stroke="#7890a8" />
                  <Tooltip
                    contentStyle={{
                      background: "#0a2342",
                      border: "1px solid #ffffff22",
                      borderRadius: 12,
                    }}
                  />
                  <Bar
                    dataKey="correct"
                    name={
                      lang === "kk"
                        ? "Дұрыс"
                        : lang === "ru"
                          ? "Правильно"
                          : "Correct"
                    }
                    fill="#18c7c8"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="wrong"
                    name={
                      lang === "kk"
                        ? "Қате"
                        : lang === "ru"
                          ? "Ошибка"
                          : "Wrong"
                    }
                    fill="#f2b84b"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-white/[.04] text-slate-400">
                <tr>
                  <th className="p-4">№</th>
                  <th>
                    {lang === "kk"
                      ? "Сурет"
                      : lang === "ru"
                        ? "Изображение"
                        : "Image"}
                  </th>
                  <th>{tx.actual}</th>
                  <th>{tx.predicted}</th>
                  <th>{tx.status}</th>
                  <th>{tx.confidence}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((x, i) => (
                  <tr key={x.id} className="border-t border-white/10">
                    <td className="p-4">{i + 1}</td>
                    <td>
                      {x.imageUrl ? (
                        <img
                          src={asset(x.imageUrl)}
                          alt=""
                          className="h-14 w-14 rounded-lg object-cover"
                        />
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>{x.actualLabel}</td>
                    <td>{x.predictedLabel}</td>
                    <td
                      className={
                        x.actualLabel === x.predictedLabel
                          ? "text-turquoise"
                          : "text-gold"
                      }
                    >
                      {x.actualLabel === x.predictedLabel
                        ? lang === "kk"
                          ? "Дұрыс"
                          : lang === "ru"
                            ? "Верно"
                            : "Correct"
                        : lang === "kk"
                          ? "Қате"
                          : lang === "ru"
                            ? "Ошибка"
                            : "Wrong"}
                    </td>
                    <td>{x.confidence.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {summary &&
        (summary.conclusion?.[lang] || summary.recommendation?.[lang]) && (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {summary.conclusion?.[lang] && (
              <div className="card rounded-2xl p-5">
                <h2 className="font-bold">
                  {lang === "kk"
                    ? "Қорытынды"
                    : lang === "ru"
                      ? "Вывод"
                      : "Conclusion"}
                </h2>
                <p className="mt-3 leading-7 text-slate-300">
                  {summary.conclusion[lang]}
                </p>
              </div>
            )}
            {summary.recommendation?.[lang] && (
              <div className="card rounded-2xl p-5">
                <h2 className="font-bold">
                  {lang === "kk"
                    ? "Ұсыныс"
                    : lang === "ru"
                      ? "Рекомендация"
                      : "Recommendation"}
                </h2>
                <p className="mt-3 leading-7 text-slate-300">
                  {summary.recommendation[lang]}
                </p>
              </div>
            )}
          </div>
        )}
    </div>
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
