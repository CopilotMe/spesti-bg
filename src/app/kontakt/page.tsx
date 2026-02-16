"use client";

import { useState } from "react";
import {
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

// Web3Forms access key — public-safe alias for the recipient email.
// Set NEXT_PUBLIC_WEB3FORMS_KEY in Vercel / .env.local
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "";

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
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!subject.trim() || !message.trim()) {
      setStatus("error");
      setErrorMsg("Моля, попълнете тема и съобщение.");
      return;
    }

    if (!WEB3FORMS_KEY) {
      setStatus("error");
      setErrorMsg("Формата не е конфигурирана. Моля, опитайте по-късно.");
      return;
    }

    setStatus("sending");

    const topicLabel =
      TOPIC_OPTIONS.find((t) => t.value === topic)?.label ?? topic;

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `[Спести] ${topicLabel}: ${subject}`,
          from_name: "Спести – Обратна връзка",
          ...(email.trim() && { email: email.trim(), replyto: email.trim() }),
          topic: topicLabel,
          message,
          // Honeypot anti-spam
          botcheck: "",
        }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("sent");
        setSubject("");
        setEmail("");
        setMessage("");
        setTopic("question");
      } else {
        setStatus("error");
        setErrorMsg(data.message || "Грешка при изпращане. Опитайте отново.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Няма връзка. Проверете интернета и опитайте отново.");
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-text md:text-3xl">
        Обратна връзка
      </h1>
      <p className="mb-8 text-sm text-muted">
        Забелязахте грешка, имате предложение или въпрос? Пишете ни.
      </p>

      {status === "sent" ? (
        <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
          <CheckCircle className="mx-auto mb-3 h-10 w-10 text-green-500" />
          <h2 className="mb-2 text-lg font-semibold text-text">
            Съобщението е изпратено!
          </h2>
          <p className="text-sm text-muted">
            Благодарим ви за обратната връзка. Ще отговорим възможно най-бързо.
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="mt-4 text-sm text-primary underline"
          >
            Изпрати ново съобщение
          </button>
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
              Тема <span className="text-red-400">*</span>
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              placeholder="Напр. Грешна цена на водата в Пловдив"
              className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text placeholder:text-muted/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Email (optional) */}
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-text"
            >
              Вашият имейл{" "}
              <span className="font-normal text-muted">(по желание, за отговор)</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ime@example.com"
              className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text placeholder:text-muted/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="message"
              className="mb-1.5 block text-sm font-medium text-text"
            >
              Съобщение <span className="text-red-400">*</span>
            </label>
            <textarea
              id="message"
              rows={5}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              placeholder="Опишете какво забелязахте или какво предлагате..."
              className="w-full resize-y rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text placeholder:text-muted/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Honeypot — hidden from users, catches bots */}
          <input
            type="checkbox"
            name="botcheck"
            className="hidden"
            style={{ display: "none" }}
            tabIndex={-1}
            autoComplete="off"
          />

          {status === "error" && errorMsg && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {errorMsg}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {status === "sending" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Изпращане...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Изпрати
              </>
            )}
          </button>

          <p className="text-xs text-muted">
            Съобщението се изпраща директно до екипа на Спести.
            Не съхраняваме данни от тази форма.
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
