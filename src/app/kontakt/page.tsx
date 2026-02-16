"use client";

import { useState } from "react";
import { MessageSquare, Send, CheckCircle, AlertCircle } from "lucide-react";

// Obfuscated to prevent scraping from source
const _p = ["sg", "ace", "11"].join(".");
const CONTACT_EMAIL = `${_p}@${"gmail"}.com`;

const TOPIC_OPTIONS = [
  { value: "error", label: "Неточни данни / грешка" },
  { value: "suggestion", label: "Предложение за подобрение" },
  { value: "question", label: "Въпрос" },
  { value: "privacy", label: "Поверителност / GDPR" },
  { value: "other", label: "Друго" },
];

export default function ContactPage() {
  const [topic, setTopic] = useState("question");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!subject.trim() || !message.trim()) {
      setError(true);
      return;
    }

    const topicLabel =
      TOPIC_OPTIONS.find((t) => t.value === topic)?.label ?? topic;
    const fullSubject = `[Спести] ${topicLabel}: ${subject}`;
    const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(fullSubject)}&body=${encodeURIComponent(message)}`;

    window.location.href = mailtoUrl;
    setSent(true);
    setError(false);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-text md:text-3xl">
        Обратна връзка
      </h1>
      <p className="mb-8 text-sm text-muted">
        Забелязахте грешка, имате предложение или въпрос? Пишете ни.
      </p>

      {sent ? (
        <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
          <CheckCircle className="mx-auto mb-3 h-10 w-10 text-green-500" />
          <h2 className="mb-2 text-lg font-semibold text-text">
            Благодарим ви!
          </h2>
          <p className="text-sm text-muted">
            Вашият имейл клиент трябва да се е отворил с попълнено съобщение.
            Ако не се е отворил,{" "}
            <button
              onClick={() => setSent(false)}
              className="text-primary underline"
            >
              опитайте отново
            </button>
            .
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Topic */}
          <div>
            <label
              htmlFor="topic"
              className="mb-1.5 block text-sm font-medium text-text"
            >
              Тип на запитването
            </label>
            <select
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {TOPIC_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label
              htmlFor="subject"
              className="mb-1.5 block text-sm font-medium text-text"
            >
              Тема
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                setError(false);
              }}
              placeholder="Напр. Грешна цена на водата в Пловдив"
              className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text placeholder:text-muted/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="message"
              className="mb-1.5 block text-sm font-medium text-text"
            >
              Съобщение
            </label>
            <textarea
              id="message"
              rows={5}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setError(false);
              }}
              placeholder="Опишете какво забелязахте или какво предлагате..."
              className="w-full resize-y rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text placeholder:text-muted/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              Моля, попълнете тема и съобщение.
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
          >
            <Send className="h-4 w-4" />
            Изпрати
          </button>

          <p className="text-xs text-muted">
            Натискането на &quot;Изпрати&quot; ще отвори вашия имейл клиент с
            попълнено съобщение. Не съхраняваме никакви данни от тази форма.
          </p>
        </form>
      )}

      {/* Info card */}
      <div className="mt-8 rounded-xl border border-border bg-surface p-5">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-text">Какво можете да ни пишете</h2>
        </div>
        <ul className="space-y-1.5 text-sm text-muted">
          <li>
            <strong className="text-text">Неточни данни</strong> — ако
            забележите остаряла цена или грешна тарифа
          </li>
          <li>
            <strong className="text-text">Предложения</strong> — нови
            калкулатори, функции или подобрения
          </li>
          <li>
            <strong className="text-text">Въпроси</strong> — за методологията,
            данните или платформата
          </li>
          <li>
            <strong className="text-text">Поверителност</strong> — въпроси
            относно GDPR и личните данни
          </li>
        </ul>
      </div>
    </div>
  );
}
