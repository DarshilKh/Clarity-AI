"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Brain, LayoutDashboard, BookOpen, Plus, LogOut, User, Menu, X, ChevronDown } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { cn } from "@/lib/utils";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/journal",   label: "Journal",   icon: BookOpen },
];

export default function Navbar() {
  const pathname  = usePathname();
  const router    = useRouter();
  const supabase  = createBrowserSupabaseClient();

  const [user, setUser]             = useState<SupabaseUser | null>(null);
  const [menuOpen, setMenuOpen]     = useState(false);
  const [userOpen, setUserOpen]     = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setUserOpen(false);
  }, [pathname]);

  async function signOut() {
    setSigningOut(true);
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? "?";

  return (
    <>
      <nav
        style={{
          backgroundColor: "var(--color-surface-raised)",
          borderBottom: "1px solid var(--color-border)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 1rem",
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Link href={user ? "/dashboard" : "/"} style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
            <div
              style={{
                width: 30,
                height: 30,
                background: "var(--color-ink)",
                borderRadius: "var(--radius-sm)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Brain size={16} color="white" strokeWidth={1.8} />
            </div>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.15rem",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "var(--color-ink)",
              }}
            >
              Clarity
            </span>
          </Link>

          {/* Desktop nav */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }} className="desktop-nav">
            {user && NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.375rem",
                    padding: "0.45rem 0.875rem",
                    borderRadius: "var(--radius-md)",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    textDecoration: "none",
                    color: active ? "var(--color-amber)" : "var(--color-ink-muted)",
                    background: active ? "var(--color-amber-pale)" : "transparent",
                    transition: "all 0.15s ease",
                  }}
                >
                  <Icon size={15} strokeWidth={2} />
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            {user ? (
              <>
                {/* New decision CTA */}
                <Link
                  href="/decision/new"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.375rem",
                    padding: "0.45rem 1rem",
                    background: "var(--color-ink)",
                    color: "white",
                    borderRadius: "var(--radius-md)",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Plus size={14} strokeWidth={2.5} />
                  <span className="hide-xs">New Decision</span>
                  <span className="show-xs">New</span>
                </Link>

                {/* User avatar dropdown */}
                <div style={{ position: "relative" }}>
                  <button
                    onClick={() => setUserOpen((v) => !v)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.375rem",
                      padding: "0.25rem 0.5rem 0.25rem 0.25rem",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--color-border)",
                      background: "transparent",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "var(--radius-full)",
                        background: "var(--color-amber-pale)",
                        border: "1px solid var(--color-amber-border)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        color: "var(--color-amber)",
                        flexShrink: 0,
                      }}
                    >
                      {initials}
                    </div>
                    <ChevronDown size={13} color="var(--color-ink-faint)" />
                  </button>

                  {/* Dropdown */}
                  {userOpen && (
                    <div
                      style={{
                        position: "absolute",
                        top: "calc(100% + 8px)",
                        right: 0,
                        background: "var(--color-surface-raised)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "var(--radius-lg)",
                        boxShadow: "0 8px 32px rgba(13,13,13,0.12)",
                        minWidth: 220,
                        overflow: "hidden",
                        zIndex: 100,
                      }}
                    >
                      <div style={{ padding: "0.875rem 1rem", borderBottom: "1px solid var(--color-border)" }}>
                        <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--color-ink)", marginBottom: "0.2rem" }}>
                          {user.user_metadata?.full_name ?? "Your account"}
                        </p>
                        <p style={{ fontSize: "0.75rem", color: "var(--color-ink-faint)" }}>
                          {user.email}
                        </p>
                      </div>
                      <div style={{ padding: "0.375rem" }}>
                        <button
                          onClick={signOut}
                          disabled={signingOut}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.625rem",
                            width: "100%",
                            padding: "0.6rem 0.75rem",
                            borderRadius: "var(--radius-md)",
                            border: "none",
                            background: "transparent",
                            color: "var(--color-rose)",
                            fontSize: "0.875rem",
                            fontWeight: 500,
                            cursor: "pointer",
                            textAlign: "left",
                          }}
                        >
                          <LogOut size={15} />
                          {signingOut ? "Signing out…" : "Sign out"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "var(--color-ink-muted)",
                    textDecoration: "none",
                    padding: "0.45rem 0.75rem",
                  }}
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.375rem",
                    padding: "0.45rem 1rem",
                    background: "var(--color-amber)",
                    color: "white",
                    borderRadius: "var(--radius-md)",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Get started free
                </Link>
              </>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="mobile-menu-btn"
              style={{
                display: "none",
                padding: "0.4rem",
                background: "none",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                color: "var(--color-ink-muted)",
              }}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            style={{
              borderTop: "1px solid var(--color-border)",
              background: "var(--color-surface-raised)",
              padding: "0.75rem 1rem 1rem",
            }}
          >
            {user && NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.625rem",
                  padding: "0.75rem 0.875rem",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  textDecoration: "none",
                  color: pathname.startsWith(href) ? "var(--color-amber)" : "var(--color-ink-muted)",
                  background: pathname.startsWith(href) ? "var(--color-amber-pale)" : "transparent",
                  marginBottom: "0.25rem",
                }}
              >
                <Icon size={16} strokeWidth={2} />
                {label}
              </Link>
            ))}
            {user && (
              <>
                <div style={{ height: 1, background: "var(--color-border)", margin: "0.5rem 0" }} />
                <div style={{ padding: "0.5rem 0.875rem", fontSize: "0.78rem", color: "var(--color-ink-faint)" }}>
                  {user.email}
                </div>
                <button
                  onClick={signOut}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.625rem",
                    width: "100%",
                    padding: "0.75rem 0.875rem",
                    borderRadius: "var(--radius-md)",
                    border: "none",
                    background: "transparent",
                    color: "var(--color-rose)",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Close dropdown on outside click */}
      {userOpen && (
        <div
          onClick={() => setUserOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 49 }}
        />
      )}

      <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .hide-xs { display: none !important; }
        }
        @media (min-width: 641px) {
          .show-xs { display: none !important; }
        }
      `}</style>
    </>
  );
}
