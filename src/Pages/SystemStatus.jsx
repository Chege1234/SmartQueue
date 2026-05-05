import React from "react";
import { Link } from "react-router-dom";
import { Activity, CheckCircle2, BookOpen } from "lucide-react";
import { cn, createPageUrl } from "@/utils";
import { SITE } from "@/constants/site";

export default function SystemStatus() {
  const updated = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date());

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <div className="mb-3 flex items-center gap-2 text-primary">
          <Activity className="h-5 w-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">System</span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Service status</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Live snapshot for {SITE.name}. {SITE.supportNote}
        </p>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card/80 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-foreground">Core application</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Web app, authentication, queues, and admin tools
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Operational
          </span>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          Status reflects availability of this deployment when you load the page. If your institution runs separate
          monitoring, refer to their official status channel as well.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">Page generated: {updated}</p>
      </div>

      <div className="rounded-2xl border border-border/80 bg-secondary/15 p-6">
        <h2 className="text-lg font-semibold text-foreground">During an incident</h2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-muted-foreground">
          <li>Retry after a short wait; intermittent errors often clear quickly.</li>
          <li>Use your institution’s IT help channel if login or email delivery fails repeatedly.</li>
          <li>Staff can still serve walk-ins according to local policy if digital queues are unavailable.</li>
        </ul>
      </div>

      <Link
        to={createPageUrl("Documentation")}
        className={cn(
          "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-semibold text-card-foreground transition-all duration-200 hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        )}
      >
        <BookOpen className="h-4 w-4" />
        View documentation
      </Link>
    </div>
  );
}
