import React, { useState, useEffect } from "react";
import { api } from "@/api/apiClient";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import {
  Users,
  Building2,
  Ticket,
  BarChart3,
  Loader2,
  Shield,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import DepartmentManager from "../Components/admin/DepartmentManager";
import SystemStats from "../Components/admin/SystemStats";
import StaffRequestManager from "../Components/admin/StaffRequestManager";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const authenticated = await api.auth.isAuthenticated();
        if (!authenticated) {
          api.auth.redirectToLogin(createPageUrl("AdminDashboard"));
          return;
        }
        const currentUser = await api.auth.me();
        if (currentUser.role !== "admin") {
          navigate(createPageUrl("Home"));
          return;
        }
        setUser(currentUser);
      } catch (error) {
        api.auth.redirectToLogin(createPageUrl("AdminDashboard"));
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: () => api.entities.Department.list(),
    enabled: !!user,
  });

  const { data: allTickets = [] } = useQuery({
    queryKey: ["allTickets"],
    queryFn: () => api.entities.QueueTicket.list(),
    refetchInterval: 5000,
    enabled: !!user,
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => api.entities.User.list(),
    enabled: !!user,
  });

  const { data: staffRequests = [] } = useQuery({
    queryKey: ["staffRequests"],
    queryFn: () => api.entities.StaffRequest.list("-created_date"),
    enabled: !!user,
  });

  const pendingStaffCount = staffRequests.filter((r) => r.status === "pending").length;

  const todayTickets = allTickets.filter(
    (t) => new Date(t.created_date).toDateString() === new Date().toDateString()
  );

  const stats = [
    {
      title: "Departments",
      value: departments.length,
      icon: Building2,
      iconClass: "text-primary bg-primary/15 border-primary/25",
    },
    {
      title: "Tickets today",
      value: todayTickets.length,
      icon: Ticket,
      iconClass: "text-accent bg-accent/10 border-accent/25",
    },
    {
      title: "Users",
      value: users.length,
      icon: Users,
      iconClass: "text-foreground/90 bg-muted border-border",
    },
    {
      title: "Pending access",
      value: pendingStaffCount,
      icon: Shield,
      iconClass:
        pendingStaffCount > 0
          ? "text-amber-300 bg-amber-500/15 border-amber-400/30"
          : "text-muted-foreground bg-muted border-border",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-9 w-9 animate-spin text-primary" aria-hidden />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const motionProps = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { type: "spring", stiffness: 380, damping: 28 },
      };

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 border-b border-border/80 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Administration
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Dashboard
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Review staff access, configure departments, and monitor queue activity in one place.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => navigate(createPageUrl("StaffDashboard"))}>
            <Users className="h-4 w-4" />
            Staff view
          </Button>
          <Button onClick={() => navigate(createPageUrl("Analytics"))}>
            <BarChart3 className="h-4 w-4" />
            Analytics
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            {...motionProps}
            transition={
              shouldReduceMotion
                ? undefined
                : { type: "spring", stiffness: 380, damping: 28, delay: index * 0.04 }
            }
          >
            <Card className="overflow-hidden border-border/80 bg-card/90 shadow-none">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">{stat.title}</p>
                    <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-foreground">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${stat.iconClass}`}
                  >
                    <stat.icon className="h-5 w-5" strokeWidth={2} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-10 xl:grid-cols-12 xl:items-start">
        <div className="space-y-10 xl:col-span-7">
          <section className="space-y-3">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Staff access</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Approve or reject requests for the staff dashboard.
              </p>
            </div>
            <StaffRequestManager requests={staffRequests} />
          </section>

          <section className="space-y-3">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Departments</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Control service desks, descriptions, and average handling time.
              </p>
            </div>
            <DepartmentManager departments={departments} />
          </section>
        </div>

        <aside className="space-y-3 xl:col-span-5 xl:sticky xl:top-24">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Queue activity</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Ticket volume and completions by department.
            </p>
          </div>
          <SystemStats tickets={allTickets} departments={departments} />
        </aside>
      </div>
    </div>
  );
}
