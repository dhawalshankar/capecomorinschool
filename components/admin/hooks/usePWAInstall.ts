"use client";
import { useEffect, useState, useCallback } from "react";
import {
  getCapturedPrompt,
  onPromptCaptured,
  clearCapturedPrompt,
  type BeforeInstallPromptEvent,
} from "@/lib/pwaInstallCapture";

function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(
    () => getCapturedPrompt() // pick up event even if it already fired earlier
  );
  const [installed, setInstalled] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    setInstalled(isStandalone());
    setIos(isIOS());

    const unsubscribe = onPromptCaptured((e) => {
      setDeferredPrompt(e);
    });

    function handleAppInstalled() {
      setInstalled(true);
      setDeferredPrompt(null);
      clearCapturedPrompt();
    }

    window.addEventListener("appinstalled", handleAppInstalled);
    return () => {
      unsubscribe();
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return "unavailable" as const;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    clearCapturedPrompt();
    return outcome;
  }, [deferredPrompt]);

  console.log({ installed, deferredPrompt, ios });
  const canShow = !installed && (!!deferredPrompt || ios);

  return { canShow, installed, isIOS: ios, canPromptNatively: !!deferredPrompt, promptInstall };
}