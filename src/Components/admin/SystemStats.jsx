import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function SystemStats({ tickets, departments }) {
  const departmentData = departments.map((dept) => {
    const deptTickets = tickets.filter((t) => t.department_id === dept.id);
    return {
      name: dept.name.length > 12 ? `${dept.name.slice(0, 11)}…` : dept.name,
      total: deptTickets.length,
      completed: deptTickets.filter((t) => t.status === "completed").length,
      waiting: deptTickets.filter((t) => t.status === "waiting").length,
    };
  });

  const empty = departments.length === 0;

  return (
    <Card className="border-border/80 bg-card/90 shadow-none">
      <CardHeader className="border-b border-border/60 pb-4">
        <CardTitle className="text-base font-semibold">By department</CardTitle>
        <p className="text-sm font-normal text-muted-foreground">
          Total tickets compared to completed for each desk.
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        {empty ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            Add departments to see queue distribution here.
          </p>
        ) : (
          <div className="h-[300px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
                <defs>
                  <linearGradient id="barTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0e74ff" stopOpacity={0.85} />
                    <stop offset="100%" stopColor="#0e74ff" stopOpacity={0.2} />
                  </linearGradient>
                  <linearGradient id="barDone" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f9cff" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#4f9cff" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" vertical={false} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#90a1bb", fontSize: 11 }}
                  interval={0}
                  angle={-18}
                  textAnchor="end"
                  height={56}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#90a1bb", fontSize: 11 }}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(14, 116, 255, 0.06)" }}
                  contentStyle={{
                    backgroundColor: "#0e1729",
                    border: "1px solid #243147",
                    borderRadius: "12px",
                    fontSize: "12px",
                    color: "#e6edf8",
                  }}
                  labelStyle={{ color: "#90a1bb", marginBottom: 4 }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "12px", paddingTop: 16 }}
                  formatter={(value) => <span className="text-muted-foreground">{value}</span>}
                />
                <Bar dataKey="total" name="All tickets" fill="url(#barTotal)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="completed" name="Completed" fill="url(#barDone)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
