"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/", label: <>Overview<br />Dashboard</> },
  { href: "/analyze", label: <>Analyze<br />Traffic</> },
  { href: "/results", label: <>Detection<br />Results</> },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="topbar">
      <Link className="brand" href="/" aria-label="BotSentinel home"><span className="brand-mark">◯</span><span>Bot<span>Sentinel</span></span></Link>
      <div className="api-status"><span className="status-dot" />API Live <small>(14ms<br />inference)</small></div>
      <nav className="main-nav" aria-label="Primary navigation">
        {navigation.map(({ href, label }) => <Link className={pathname === href ? "active" : ""} href={href} key={href}>{label}</Link>)}
        <a href="#documentation">Documentation</a><a href="#api">API Status<br />Live</a>
      </nav>
      <div className="nav-actions"><button aria-label="Language">◎</button><button aria-label="Messages">✉</button><button aria-label="Help">?</button><Link href="/analyze" className="analyze-now">Analyze<br />Now <b>→</b></Link></div>
    </header>
  );
}
