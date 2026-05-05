import React from "react";
import { cn } from "@/utils";

const DialogCtx = React.createContext(null);

export const Dialog = ({ open, onOpenChange, children }) => (
  <DialogCtx.Provider value={{ open: !!open, onOpenChange }}>
    {children}
  </DialogCtx.Provider>
);

export const DialogTrigger = React.forwardRef(({ asChild, children, ...props }, ref) => {
  const ctx = React.useContext(DialogCtx);
  const open = () => ctx?.onOpenChange?.(true);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      ref,
      onClick: (e) => {
        children.props.onClick?.(e);
        if (!e.defaultPrevented) open();
      },
    });
  }

  return (
    <button ref={ref} type="button" onClick={open} {...props}>
      {children}
    </button>
  );
});
DialogTrigger.displayName = "DialogTrigger";

export const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => {
  const ctx = React.useContext(DialogCtx);
  if (!ctx?.open) return null;

  const close = () => ctx.onOpenChange?.(false);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-background/75 backdrop-blur-sm"
        aria-label="Close dialog"
        onClick={close}
      />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative z-[101] max-h-[min(90vh,800px)] w-full overflow-y-auto rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-[0_24px_64px_-24px_rgba(0,0,0,0.85)]",
          className
        )}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {children}
      </div>
    </div>
  );
});
DialogContent.displayName = "DialogContent";

export const DialogHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("mb-4 space-y-1.5", className)} {...props} />
));
DialogHeader.displayName = "DialogHeader";

export const DialogFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
    {...props}
  />
));
DialogFooter.displayName = "DialogFooter";

export const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-lg font-semibold tracking-tight text-foreground", className)} {...props} />
));
DialogTitle.displayName = "DialogTitle";

export const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
DialogDescription.displayName = "DialogDescription";
