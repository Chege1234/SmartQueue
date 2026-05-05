import React from "react";
import { SITE } from "@/constants/site";

export default function PrivacyPolicy() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Privacy policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          How {SITE.name} handles information in this deployment. Your institution may publish additional notices that
          apply alongside this summary.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Information collected</h2>
        <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed text-muted-foreground">
          <li>
            <strong className="text-foreground">Account and profile:</strong> Name, role, department affiliation, and
            identifiers needed for sign-in (handled by your institution’s authentication provider).
          </li>
          <li>
            <strong className="text-foreground">Queue activity:</strong> Ticket numbers, department, timestamps, status,
            and optional notes tied to service interactions.
          </li>
          <li>
            <strong className="text-foreground">Staff access requests:</strong> Contact details and requested department
            submitted through the access-request flow for administrator review.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">How we use information</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Data is used to operate queues (calling tickets, reporting wait times), authorize staff and admins, audit
          access approvals, and improve reliability and security. Automated decisions are limited to queue state
          transitions defined in the application; human staff apply local policy at the desk.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Retention and security</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Records are retained according to your institution’s records-management and IT policies. Technical safeguards
          include encrypted transport (HTTPS), role-based access, and hosted infrastructure configured by your
          administrators.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Your choices</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Subject to institutional policy, you may request access, correction, export, or deletion of personal data by
          contacting your administrator or data-protection office.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Contact</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">{SITE.supportNote}</p>
      </section>

      <p className="text-xs text-muted-foreground">
        Last updated {new Intl.DateTimeFormat(undefined, { dateStyle: "long" }).format(new Date())}.
      </p>
    </div>
  );
}
