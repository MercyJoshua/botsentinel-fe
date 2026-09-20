"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Sun, Moon, ArrowRight, Activity, Terminal } from "lucide-react";
import { navigation } from "@/data/navigation";
import { Theme } from "@/lib/type";
import { useApiHealth } from "@/hooks/use-api-health";
import Image from "next/image";

export function Header() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<Theme>(Theme.Light);
  const { status, latencyMs } = useApiHealth();

  useEffect(() => {
    const nextTheme = window.localStorage.getItem("theme") === Theme.Dark ? Theme.Dark : Theme.Light;
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === Theme.Dark ? Theme.Light : Theme.Dark;
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("theme", nextTheme);
  };

  return (
    
    <header className="topbar">
      <div className="flex items-center gap-4">
        <Link className="brand" href="/" aria-label="BotSentinel home">
          <span className="brand-mark">
            <Image
              src="/botsentinel.png"
              alt="BotSentinel Logo"
              width={18}
              height={18}
              aria-hidden="true"
            />
          </span>
          <span className="brand-name">
            Bot<span>Sentinel</span>
          </span>
        </Link>

        <div
          className="api-status"
          title={
            status === "online"
              ? `Backend API connected (${latencyMs ?? 14}ms latency)`
              : status === "checking"
              ? "Checking backend connectivity..."
              : "Backend offline — Local Mock ML Engine active"
          }
        >
          <span className={`status-dot ${status === "offline" ? "offline" : ""}`} />
          <span>
            {status === "online"
              ? `API Live (${latencyMs ?? 14}ms)`
              : status === "checking"
              ? "Connecting..."
              : "Local ML Mode"}
          </span>
        </div>
      </div>

      <nav className="main-nav" aria-label="Primary navigation">
        {navigation.map(({ href, label }) => (
          <Link
            className={pathname === href ? "active" : ""}
            href={href}
            key={href}
          >
            {label}
          </Link>
        ))}
        <a href="#documentation" className="hover:text-teal-600">Documentation</a>
      </nav>

      <div className="nav-actions">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === Theme.Dark ? "light" : "dark"} theme`}
          title={`Switch to ${theme === Theme.Dark ? "light" : "dark"} theme`}
        >
          {theme === Theme.Dark ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
        </button>

        <Link href="/analyze" className="analyze-now">
          <span>Analyze Traffic</span>
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </header>
  );
}