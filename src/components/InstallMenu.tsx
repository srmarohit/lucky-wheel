import { useEffect, useRef, useState } from "react";
import { usePwaInstall } from "../hooks/usePwaInstall";

/**
 * Three-dot menu fixed at the top-right of the screen with an "Install App"
 * action. The action triggers the deferred PWA install prompt when available,
 * shows a checkmark once installed, and is disabled with a hint otherwise.
 */
export function InstallMenu() {
  const [open, setOpen] = useState(false);
  const { canInstall, isInstalled, install } = usePwaInstall();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the dropdown on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const handleInstall = async () => {
    await install();
    setOpen(false);
  };

  return (
    <div ref={menuRef} className="fixed top-4 right-4 z-50">
      <button
        type="button"
        aria-label="App menu"
        aria-haspopup="menu"
        aria-expanded={open}
        title="App menu"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#333] shadow-[0_4px_12px_rgba(0,0,0,0.25)] backdrop-blur-[2px] transition-all duration-200 hover:scale-110 hover:bg-white"
      >
        {/* Kebab (three vertical dots) icon */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <circle cx="10" cy="4" r="1.8" />
          <circle cx="10" cy="10" r="1.8" />
          <circle cx="10" cy="16" r="1.8" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute top-full right-0 mt-2 min-w-[190px] overflow-hidden rounded-xl border border-[#eee] bg-white py-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
        >
          {isInstalled ? (
            <div
              role="menuitem"
              aria-disabled="true"
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-[#00b894]"
            >
              <span aria-hidden="true">✓</span> App installed
            </div>
          ) : (
            <button
              type="button"
              role="menuitem"
              disabled={!canInstall}
              title={
                canInstall
                  ? "Install Lucky Wheel on this device"
                  : "Install is available in Chrome/Edge once the app is served over HTTPS"
              }
              onClick={handleInstall}
              className="flex w-full cursor-pointer items-center gap-2.5 px-4 py-2.5 text-left text-sm font-semibold text-[#333] transition-colors hover:bg-[#f1f3ff] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span aria-hidden="true">📲</span> Install App
            </button>
          )}
          {!isInstalled && !canInstall && (
            <p className="px-4 pb-1.5 text-[11px] leading-snug text-[#999]">
              Open in Chrome/Edge over HTTPS to enable install.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
