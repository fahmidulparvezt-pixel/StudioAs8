"use client";
import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

const LIGHT = "studiolight";
const DARK = "studiodark";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(LIGHT);

  useEffect(() => {
    setTheme(document.documentElement.getAttribute("data-theme") || LIGHT);
  }, []);

  function toggle() {
    const next = theme === DARK ? LIGHT : DARK;
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("ss-theme", next); } catch {}
  }

  return (
    <button onClick={toggle} className="btn btn-ghost btn-circle text-neutral-content" aria-label="Toggle light and dark theme">
      {theme === DARK ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
    </button>
  );
}
