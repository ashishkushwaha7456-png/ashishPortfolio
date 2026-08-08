"use client";

import * as React from "react";

/* ── Mount guard ───────────────────────────────────────────
   Anything that reads window/localStorage must wait for this
   or the server and client markup disagree.
   ──────────────────────────────────────────────────────────── */
export function useMounted() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return mounted;
}

/* ── Media query ──────────────────────────────────────────── */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const list = window.matchMedia(query);
    setMatches(list.matches);
    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    list.addEventListener("change", onChange);
    return () => list.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

export const useIsMobile = () => useMediaQuery("(max-width: 767px)");
export const useIsTablet = () => useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)");
export const usePrefersReducedMotion = () =>
  useMediaQuery("(prefers-reduced-motion: reduce)");
export const useHasPointer = () => useMediaQuery("(pointer: fine)");

/* ── Scroll position / direction ──────────────────────────── */
export function useScrollPosition(threshold = 12) {
  const [state, setState] = React.useState({
    y: 0,
    scrolled: false,
    direction: "up" as "up" | "down",
    atTop: true,
  });

  React.useEffect(() => {
    let last = window.scrollY;
    let frame = 0;

    const update = () => {
      const y = window.scrollY;
      setState({
        y,
        scrolled: y > threshold,
        direction: y > last && y > 80 ? "down" : "up",
        atTop: y < 4,
      });
      last = y;
      frame = 0;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [threshold]);

  return state;
}

/* ── Mouse position (viewport + normalised) ───────────────── */
export function useMousePosition() {
  const [position, setPosition] = React.useState({ x: 0, y: 0, nx: 0, ny: 0 });

  React.useEffect(() => {
    let frame = 0;
    const onMove = (event: MouseEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        setPosition({
          x: event.clientX,
          y: event.clientY,
          nx: event.clientX / window.innerWidth - 0.5,
          ny: event.clientY / window.innerHeight - 0.5,
        });
        frame = 0;
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return position;
}

/* ── Scroll spy for section navigation ────────────────────── */
export function useScrollSpy(ids: readonly string[], offset = 0.4) {
  const [active, setActive] = React.useState(ids[0] ?? "");

  React.useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: `-${offset * 100}% 0px -${(1 - offset) * 100}% 0px`, threshold: [0, 0.25, 0.5, 1] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids, offset]);

  return active;
}

/* ── Local storage (SSR safe) ─────────────────────────────── */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = React.useState<T>(initial);

  React.useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored) setValue(JSON.parse(stored) as T);
    } catch {
      /* corrupt or unavailable storage — keep the initial value */
    }
  }, [key]);

  const update = React.useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = next instanceof Function ? next(prev) : next;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          /* quota or private mode */
        }
        return resolved;
      });
    },
    [key],
  );

  return [value, update] as const;
}

/* ── Debounce ─────────────────────────────────────────────── */
export function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

/* ── Copy to clipboard ────────────────────────────────────── */
export function useCopyToClipboard(resetAfter = 2000) {
  const [copied, setCopied] = React.useState(false);

  const copy = React.useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), resetAfter);
        return true;
      } catch {
        return false;
      }
    },
    [resetAfter],
  );

  return { copied, copy };
}

/* ── Click outside ────────────────────────────────────────── */
export function useClickOutside<T extends HTMLElement>(
  handler: () => void,
  enabled = true,
) {
  const ref = React.useRef<T>(null);

  React.useEffect(() => {
    if (!enabled) return;
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) handler();
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [handler, enabled]);

  return ref;
}

/* ── Escape key ───────────────────────────────────────────── */
export function useEscapeKey(handler: () => void, enabled = true) {
  React.useEffect(() => {
    if (!enabled) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") handler();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [handler, enabled]);
}

/* ── Lock body scroll (modals, mobile nav) ────────────────── */
export function useLockBodyScroll(locked: boolean) {
  React.useEffect(() => {
    if (!locked) return;
    const original = document.body.style.overflow;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    return () => {
      document.body.style.overflow = original;
      document.body.style.paddingRight = "";
    };
  }, [locked]);
}

/* ── Live clock (footer / contact "current time") ─────────── */
export function useCurrentTime(timeZone = "Asia/Kolkata") {
  const [time, setTime] = React.useState<string | null>(null);

  React.useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("en-US", {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(new Date());

    setTime(format());
    const timer = setInterval(() => setTime(format()), 1000);
    return () => clearInterval(timer);
  }, [timeZone]);

  return time;
}

/* ── Keyboard shortcut ────────────────────────────────────── */
export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  { meta = false, shift = false } = {},
) {
  React.useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;
      if (typing) return;

      const metaOk = meta ? event.metaKey || event.ctrlKey : !event.metaKey && !event.ctrlKey;
      const shiftOk = shift ? event.shiftKey : true;

      if (event.key.toLowerCase() === key.toLowerCase() && metaOk && shiftOk) {
        event.preventDefault();
        callback();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [key, callback, meta, shift]);
}

/* ── Element size ─────────────────────────────────────────── */
export function useElementSize<T extends HTMLElement>() {
  const ref = React.useRef<T>(null);
  const [size, setSize] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      setSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, size] as const;
}
