import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/api/supabaseClient";
import { CheckCircle2, Mail, Phone, Clock, AlertCircle, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/Components/ui/dialog";
import { cn } from "@/utils";

export default function StaffRequestManager({ requests }) {
  const queryClient = useQueryClient();
  const [selectedRequest, setSelectedRequest] = React.useState(null);
  const [actionType, setActionType] = React.useState(null);
  const [approveError, setApproveError] = React.useState("");
  const [expandedRequestId, setExpandedRequestId] = React.useState(null);

  const approveMutation = useMutation({
    mutationFn: async (requestId) => {
      const { data, error } = await supabase.functions.invoke("approve-staff", {
        body: { request_id: requestId },
      });
      if (error) throw new Error(error.message || "Edge function error");
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["staffRequests"]);
      setSelectedRequest(null);
      setActionType(null);
      setApproveError("");
      setExpandedRequestId(null);
    },
    onError: (err) => {
      setApproveError(err.message || "Failed to approve request. Please try again.");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ id }) => {
      const { data, error } = await supabase.functions.invoke("reject-staff", {
        body: { request_id: id },
      });
      if (error) throw new Error(error.message || "Edge function error");
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["staffRequests"]);
      setSelectedRequest(null);
      setActionType(null);
      setExpandedRequestId(null);
    },
  });

  const handleApprove = (request) => {
    setSelectedRequest(request);
    setActionType("approve");
    setApproveError("");
  };

  const handleReject = (request) => {
    setSelectedRequest(request);
    setActionType("reject");
    setApproveError("");
  };

  const confirmAction = () => {
    if (!selectedRequest || !actionType) return;
    if (actionType === "approve") {
      approveMutation.mutate(selectedRequest.id);
    } else {
      rejectMutation.mutate({ id: selectedRequest.id });
    }
  };

  const toggleRow = (id) => {
    setExpandedRequestId((prev) => (prev === id ? null : id));
  };

  const isPending = approveMutation.isPending || rejectMutation.isPending;

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const processedRequests = requests.filter((r) => r.status !== "pending");

  return (
    <>
      <Card className="border-border/80 bg-card/90 shadow-none">
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
          <CardTitle className="text-base font-semibold">Requests</CardTitle>
          <Badge
            className={
              pendingRequests.length
                ? "border-amber-400/35 bg-amber-500/12 text-amber-100"
                : "border-border bg-muted text-muted-foreground"
            }
          >
            {pendingRequests.length} pending
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          {pendingRequests.length === 0 && processedRequests.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted-foreground">No staff access requests yet.</p>
          ) : (
            <div>
              {pendingRequests.length > 0 && (
                <ul className="divide-y divide-border/60">
                  {pendingRequests.map((request) => {
                    const open = expandedRequestId === request.id;
                    return (
                      <li key={request.id}>
                        <button
                          type="button"
                          onClick={() => toggleRow(request.id)}
                          className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/25 sm:px-5"
                          aria-expanded={open}
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-sm font-semibold text-primary">
                            {request.full_name?.[0]?.toUpperCase() ?? "?"}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold text-foreground">{request.full_name}</p>
                            <p className="truncate text-sm text-muted-foreground">
                              {request.department}
                              <span className="text-muted-foreground/70">
                                {" · "}
                                {format(new Date(request.created_date), "MMM d, h:mm a")}
                              </span>
                            </p>
                          </div>
                          <ChevronDown
                            className={cn(
                              "h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200",
                              open && "rotate-180"
                            )}
                            aria-hidden
                          />
                        </button>

                        {open ? (
                          <div className="border-t border-border/60 bg-secondary/10 px-4 py-4 sm:px-5">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                              <div className="min-w-0 flex-1 space-y-3">
                                <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground sm:grid-cols-3">
                                  <div className="flex min-w-0 items-center gap-2">
                                    <Mail className="h-4 w-4 shrink-0 opacity-70" />
                                    <span className="truncate">{request.email}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 shrink-0 opacity-70" />
                                    <span>{request.phone}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 shrink-0 opacity-70" />
                                    <span>{format(new Date(request.created_date), "MMM d, yyyy · h:mm a")}</span>
                                  </div>
                                </div>
                                {request.notes ? (
                                  <blockquote className="rounded-xl border border-border/60 bg-secondary/25 px-3 py-2 text-sm text-muted-foreground italic">
                                    “{request.notes}”
                                  </blockquote>
                                ) : null}
                              </div>
                              <div className="flex shrink-0 flex-wrap gap-2 lg:flex-col lg:items-stretch">
                                <Button size="sm" className="lg:w-full" onClick={() => handleApprove(request)}>
                                  <CheckCircle2 className="h-4 w-4" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-destructive/40 text-destructive hover:bg-destructive/10 lg:w-full"
                                  onClick={() => handleReject(request)}
                                >
                                  Reject
                                </Button>
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              )}

              {processedRequests.length > 0 && (
                <details className="group border-t border-border/60">
                  <summary className="cursor-pointer list-none px-4 py-4 text-sm font-semibold text-foreground marker:content-none sm:px-5 [&::-webkit-details-marker]:hidden">
                    <span className="flex items-center justify-between gap-3">
                      <span>
                        Recent decisions
                        <span className="ml-2 font-normal text-muted-foreground">
                          ({processedRequests.length})
                        </span>
                      </span>
                      <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                    </span>
                  </summary>
                  <div className="border-t border-border/60 px-4 pb-5 pt-2 sm:px-5">
                    <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      {processedRequests.slice(0, 12).map((request) => (
                        <li
                          key={request.id}
                          className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-secondary/15 px-3 py-2.5"
                        >
                          <div className="flex min-w-0 items-center gap-2">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-medium text-foreground">
                              {request.full_name?.[0]?.toUpperCase() ?? "?"}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-foreground">{request.full_name}</p>
                              <p className="truncate text-xs text-muted-foreground">{request.department}</p>
                            </div>
                          </div>
                          <Badge
                            className={
                              request.status === "approved"
                                ? "shrink-0 border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                                : "shrink-0 border-destructive/30 bg-destructive/10 text-red-200"
                            }
                          >
                            {request.status}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  </div>
                </details>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={!!selectedRequest}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedRequest(null);
            setApproveError("");
            setActionType(null);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{actionType === "approve" ? "Approve access" : "Reject request"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {selectedRequest && (
              <div className="rounded-xl border border-border/60 bg-secondary/20 p-4 text-sm">
                <p className="font-semibold text-foreground">{selectedRequest.full_name}</p>
                <p className="mt-1 text-muted-foreground">{selectedRequest.email}</p>
                <Badge className="mt-3 border-primary/30 bg-primary/10 text-primary-foreground/90">
                  {selectedRequest.department}
                </Badge>
              </div>
            )}

            <div
              className={`rounded-xl border p-3 text-sm ${
                actionType === "approve"
                  ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-100"
                  : "border-destructive/25 bg-destructive/10 text-red-100"
              }`}
            >
              {actionType === "approve"
                ? "This will grant staff dashboard access for the department they requested."
                : "This will reject the request. The applicant can submit again if needed."}
            </div>

            {approveError ? (
              <Alert className="flex gap-2 border-destructive/40 bg-destructive/10">
                <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
                <AlertDescription className="text-destructive-foreground">{approveError}</AlertDescription>
              </Alert>
            ) : null}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedRequest(null);
                setApproveError("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant={actionType === "approve" ? "default" : "destructive"}
              onClick={confirmAction}
              disabled={isPending}
            >
              {isPending ? "Working…" : actionType === "approve" ? "Confirm approval" : "Confirm rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
