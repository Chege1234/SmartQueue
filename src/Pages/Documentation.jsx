import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { SITE } from "@/constants/site";

export default function Documentation() {
  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Documentation</h1>
        <p className="mt-2 text-sm text-muted-foreground">{SITE.shortDescription}</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Students</h2>
        <ol className="list-inside list-decimal space-y-3 text-sm leading-relaxed text-muted-foreground">
          <li>
            From the{" "}
            <Link className="font-medium text-primary hover:underline" to={createPageUrl("Home")}>
              home page
            </Link>
            , enter your student number to join the queue or check an existing ticket.
          </li>
          <li>
            After taking a ticket, keep your ticket screen open or note your queue position and department.
          </li>
          <li>Wait for your number to be called at the service desk.</li>
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Staff</h2>
        <ol className="list-inside list-decimal space-y-3 text-sm leading-relaxed text-muted-foreground">
          <li>
            Sign in via{" "}
            <Link className="font-medium text-primary hover:underline" to={createPageUrl("StaffLogin")}>
              staff login
            </Link>
            . New accounts require admin approval if your institution enabled requests.
          </li>
          <li>
            Open the{" "}
            <Link className="font-medium text-primary hover:underline" to={createPageUrl("StaffDashboard")}>
              staff dashboard
            </Link>{" "}
            and select your department when prompted.
          </li>
          <li>Call or complete tickets in order according to local desk procedures.</li>
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Administrators</h2>
        <ul className="list-inside list-disc space-y-3 text-sm leading-relaxed text-muted-foreground">
          <li>
            Use the{" "}
            <Link className="font-medium text-primary hover:underline" to={createPageUrl("AdminDashboard")}>
              admin dashboard
            </Link>{" "}
            to approve staff access requests, manage departments, and review queue metrics.
          </li>
          <li>
            Analytics are available from{" "}
            <Link className="font-medium text-primary hover:underline" to={createPageUrl("Analytics")}>
              Analytics
            </Link>{" "}
            when your role permits.
          </li>
        </ul>
      </section>

      <p className="text-sm text-muted-foreground">{SITE.supportNote}</p>
    </div>
  );
}
