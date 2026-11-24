
"use client";

import { useState } from "react";

const links = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  function toggleTheme() {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    document.documentElement.classList.toggle("dark", nextMode);
  }

  return (
    <header className="site-header">
      <nav className="nav-container" aria-label="Main navigation">
        <a
          href="#home"
          className="brand"
          onClick={() => setMenuOpen(false)}
        >
          <span className="brand-mark">ND</span>
          <span>Nyanyoh<span className="brand-accent">.</span></span>
        </a>

        <div className={`nav-links ${menuOpen ? "nav-links-open" : ""}`}>
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="nav-actions">
          <button
            className="theme-button"
            onClick={toggleTheme}
            aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
            title="Toggle colour theme"
          >
            {darkMode ? "☀" : "☾"}
          </button>

          <a href="#contact" className="nav-cta">
            Lets talk <span aria-hidden="true">↗</span>
          </a>

          <button
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>
    </header>
  );
}
