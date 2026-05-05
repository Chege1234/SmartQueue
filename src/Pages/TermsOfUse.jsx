import React from "react";
import { SITE } from "@/constants/site";

export default function TermsOfUse() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Terms of use</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          By accessing {SITE.name}, you agree to these terms for this deployment. Your institution may impose additional
          policies (acceptable use, conduct codes, etc.).
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Permitted use</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          The service is provided for legitimate university administrative queues and related workflows. Use your own
          credentials only; do not misrepresent identity or department.
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          When you enter your student number on the home page and request or view a queue ticket, you agree to these terms
          for that session and any tickets issued under your number until they are completed or cancelled according to
          desk policy.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Prohibited conduct</h2>
        <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed text-muted-foreground">
          <li>Attempting to disrupt queues, spoof tickets, or gain unauthorized access.</li>
          <li>Harassment of staff or students via notes, impersonation, or abuse of contact fields.</li>
          <li>Scraping, excessive automated requests, or reverse-engineering beyond ordinary browsing.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Service availability</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          The application may be unavailable during maintenance or outages. Queue positions and notifications are provided
          as-is; institutions remain responsible for in-person service continuity.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Disclaimer</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          To the extent permitted by law, {SITE.name} is provided without warranties of uninterrupted operation or fitness
          for a particular purpose. Liability is limited as governed by your institution’s agreements and applicable
          law.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Changes</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Administrators may update features or these terms for operational reasons. Continued use after notice
          constitutes acceptance of reasonable updates.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Contact</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">{SITE.supportNote}</p>
      </section>
    </div>
  );
}
