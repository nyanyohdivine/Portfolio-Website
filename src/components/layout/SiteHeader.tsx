
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const links = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/#about" },
  { label: "Projects", href: "/#projects" },
  { label: "Skills", href: "/#skills" },
  { label: "Contact", href: "/#contact" },
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [hasCertifications, setHasCertifications] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    async function checkCertifications() {
      const { count, error } = await supabase
        .from("certifications")
        .select("id", { count: "exact", head: true })
        .eq("status", "published");

      if (!active) return;

      if (error) {
        console.error("NAVIGATION CERTIFICATION CHECK ERROR:", error);
        setHasCertifications(false);
        return;
      }

      setHasCertifications((count ?? 0) > 0);
    }

    checkCertifications();

    const channel = supabase
      .channel("public-certifications-navigation")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "certifications",
        },
        () => {
          checkCertifications();
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  function toggleTheme() {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    document.documentElement.classList.toggle("dark", nextMode);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  const navigationLinks = hasCertifications
    ? [
        ...links.slice(0, 4),
        { label: "Certifications", href: "/certifications" },
        links[4],
      ]
    : links;

  return (
    <header className="site-header">
      <nav className="nav-container" aria-label="Main navigation">
        <Link
          href="/#home"
          className="brand"
          onClick={closeMenu}
        >
          <span className="brand-mark">ND</span>
          <span>
            Nyanyoh<span className="brand-accent">.</span>
          </span>
        </Link>

        <div className={`nav-links ${menuOpen ? "nav-links-open" : ""}`}>
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              aria-current={
                link.href === "/certifications" &&
                pathname === "/certifications"
                  ? "page"
                  : undefined
              }
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="nav-actions">
          <button
            className="theme-button"
            onClick={toggleTheme}
            aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
            title="Toggle colour theme"
            type="button"
          >
            {darkMode ? "☀" : "◐"}
          </button>

          <Link
            href="/#contact"
            className="nav-cta"
            onClick={closeMenu}
          >
            Lets talk <span aria-hidden="true">↗</span>
          </Link>

          <button
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            type="button"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>
    </header>
  );
}
