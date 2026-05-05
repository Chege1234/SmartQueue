import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/Components/ui/button";
import { Download, Share, X } from "lucide-react";

const DISMISSED_KEY = "smartqueue-pwa-install-dismissed";

function isStandaloneDisplay() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    window.matchMedia("(display-mode: minimal-ui)").matches ||
    window.navigator.standalone === true
  );
}

function isIosDevice() {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

/**
 * Prompts eligible users to install SmartQueue as a PWA on the home page.
 * Android/Chrome/Desktop: native beforeinstallprompt when available.
 * iOS Safari: short instructions (no programmatic install).
 */
export default function InstallAppBanner() {
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(DISMISSED_KEY) === "1");
  const [standalone, setStandalone] = useState(isStandaloneDisplay);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    setStandalone(isStandaloneDisplay());
    const mq = window.matchMedia("(display-mode: standalone)");
    const onChange = () => setStandalone(isStandaloneDisplay());
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    const onBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  useEffect(() => {
    const onInstalled = () => {
      localStorage.setItem(DISMISSED_KEY, "1");
      setDismissed(true);
      setDeferredPrompt(null);
    };
    window.addEventListener("appinstalled", onInstalled);
    return () => window.removeEventListener("appinstalled", onInstalled);
  }, []);


  const dismiss = useCallback(() => {
    localStorage.setItem(DISMISSED_KEY, "1");
    setDismissed(true);
    setDeferredPrompt(null);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    setInstalling(true);
    try {
      await deferredPrompt.prompt();
      await deferredPrompt.userChoice;
    } catch {
      /* user dismissed browser UI */
    } finally {
      setDeferredPrompt(null);
      setInstalling(false);
    }
  };

  if (standalone || dismissed) return null;

  const showChromeStyle = deferredPrompt != null;
  const showIosHint = isIosDevice() && !showChromeStyle;

  if (!showChromeStyle && !showIosHint) return null;

  return (
    <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4 text-left shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
      <div className="flex gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/35 bg-background/80 text-primary overflow-hidden">
          <img src="/logo-mark.svg" alt="" width={44} height={44} className="rounded-md" />
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-foreground">Install SmartQueue</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                {showChromeStyle
                  ? "Add this app to your home screen or taskbar for faster access next time."
                  : "Use Safari: tap Share, then “Add to Home Screen” to pin the same grid icon as on this page."}
              </p>
            </div>
            <button
              type="button"
              onClick={dismiss}
              className="shrink-0 rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
              aria-label="Dismiss install suggestion"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {showChromeStyle ? (
            <div className="flex flex-wrap gap-2 pt-1">
              <Button type="button" size="sm" onClick={handleInstallClick} disabled={installing} className="gap-1.5">
                <Download className="h-3.5 w-3.5" />
                {installing ? "Opening…" : "Install app"}
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={dismiss}>
                Not now
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
              <Share className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
              <span>Share → Add to Home Screen</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
