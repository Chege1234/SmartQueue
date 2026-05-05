import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Switch } from "@/Components/ui/switch";
import { Badge } from "@/Components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { Plus, Edit2, Trash2, Save, X, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/Components/ui/dialog";

export default function DepartmentManager({ departments }) {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    average_service_time: 15,
    color: "blue",
    is_active: true,
  });

  const createMutation = useMutation({
    mutationFn: (data) => api.entities.Department.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["departments"]);
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.entities.Department.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["departments"]);
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.entities.Department.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["departments"]);
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      average_service_time: 15,
      color: "blue",
      is_active: true,
    });
    setEditingDept(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingDept) {
      updateMutation.mutate({ id: editingDept.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const openCreate = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEdit = (dept) => {
    setEditingDept(dept);
    setFormData({
      name: dept.name,
      description: dept.description ?? "",
      average_service_time: dept.average_service_time ?? 15,
      color: dept.color ?? "blue",
      is_active: dept.is_active !== false,
    });
    setIsDialogOpen(true);
  };

  const dialogBusy = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <Card className="border-border/80 bg-card/90 shadow-none">
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div>
            <CardTitle className="text-base font-semibold">Directory</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {departments.length} department{departments.length === 1 ? "" : "s"} configured
            </p>
          </div>
          <Button type="button" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add department
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {departments.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted-foreground">
              No departments yet. Create one to start accepting queue tickets.
            </p>
          ) : (
            <ul className="divide-y divide-border/60">
              {departments.map((dept) => (
                <li
                  key={dept.id}
                  className="flex flex-col gap-4 p-5 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 flex-1 items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-base font-semibold text-primary">
                      {dept.name?.[0]?.toUpperCase() ?? "—"}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-foreground">{dept.name}</h3>
                        <Badge
                          className={
                            dept.is_active
                              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                              : "border-border bg-muted text-muted-foreground"
                          }
                        >
                          {dept.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      {dept.description ? (
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{dept.description}</p>
                      ) : null}
                      <p className="mt-2 text-xs text-muted-foreground">
                        Avg. service time:{" "}
                        <span className="font-medium text-foreground">{dept.average_service_time} min</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      title={dept.is_active ? "Deactivate" : "Activate"}
                      onClick={() =>
                        updateMutation.mutate({
                          id: dept.id,
                          data: { ...dept, is_active: !dept.is_active },
                        })
                      }
                    >
                      {dept.is_active ? <X className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                    </Button>
                    <Button type="button" variant="outline" size="icon" title="Edit" onClick={() => openEdit(dept)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      title="Delete"
                      onClick={() => deleteMutation.mutate(dept.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className="max-w-lg p-0">
          <form onSubmit={handleSubmit} className="p-6">
            <DialogHeader>
              <DialogTitle>{editingDept ? "Edit department" : "New department"}</DialogTitle>
              <p className="text-sm text-muted-foreground">
                {editingDept
                  ? "Update how this desk appears to staff and students."
                  : "Add a desk or office that can receive queue tickets."}
              </p>
            </DialogHeader>

            <div className="mt-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="dept-name">Name</Label>
                <Input
                  id="dept-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g. Admissions"
                  className="bg-secondary/40"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dept-desc">Description</Label>
                <Textarea
                  id="dept-desc"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short summary for staff and students"
                  className="min-h-[100px] resize-none bg-secondary/40"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dept-time">Average service time (minutes)</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="dept-time"
                    type="number"
                    min={1}
                    value={formData.average_service_time}
                    onChange={(e) =>
                      setFormData({ ...formData, average_service_time: parseInt(e.target.value, 10) || 0 })
                    }
                    className="bg-secondary/40 pl-10"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border/80 bg-secondary/20 px-4 py-3">
                <div>
                  <Label htmlFor="dept-active" className="text-foreground">
                    Department active
                  </Label>
                  <p className="text-xs text-muted-foreground">Inactive desks are hidden from new tickets.</p>
                </div>
                <Switch
                  id="dept-active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>
            </div>

            <DialogFooter className="mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={dialogBusy}>
                {dialogBusy ? "Saving…" : editingDept ? "Save changes" : "Create department"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
