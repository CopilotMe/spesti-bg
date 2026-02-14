import { PiggyBank } from "lucide-react";
import messages from "@/messages/bg.json";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <PiggyBank className="h-5 w-5 text-primary" />
            <span className="font-bold text-text">{messages.site.name}</span>
          </div>
          <p className="max-w-md text-sm text-muted">
            {messages.footer.description}
          </p>
          <p className="text-xs text-muted">{messages.footer.dataSource}</p>
          <p className="text-xs text-muted">{messages.footer.lastUpdate}</p>
          <p className="text-xs text-muted/70">
            {messages.footer.disclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
}
