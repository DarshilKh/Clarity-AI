"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LayoutDashboard, BookOpen, Plus, LogOut, Menu, X, ChevronDown } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/journal", label: "Journal", icon: BookOpen },
];

function Logo({ href }: { href: string }) {
  return (
    <Link
      href={href}
      style={{ display: "flex", alignItems: "center", gap: "0.45rem", textDecoration: "none" }}
    >
      <span style={{ width: 30, height: 30, position: "relative", flexShrink: 0 }}>
        <Image src="/logo-mark.png" alt="" fill priority sizes="30px" style={{ objectFit: "contain" }} />
      </span>
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.15rem",
          fontWeight: 500,
          letterSpacing: "-0.02em",
          color: "var(--color-ink)",
          lineHeight: 1,
        }}
      >
        Clarity
      </span>
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();

  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setUserOpen(false);
  }, [pathname]);

  // Close the account menu on Escape for keyboard users.
  useEffect(() => {
    if (!userOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setUserOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [userOpen]);

  async function signOut() {
    setSigningOut(true);
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const displayName = (user?.user_metadata?.full_name as string | undefined) ?? null;
  const initials = displayName
    ? displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? "";

  const isNewDecision = pathname === "/decision/new";

  return (
    <>
      <header
        style={{
          background: "var(--color-surface-raised)",
          borderBottom: "1px solid var(--color-border)",
          position: "sticky",
          top: 0,
          zIndex: 60,
          height: "var(--header-height)",
        }}
      >
        <div
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            padding: "0 clamp(1rem, 4vw, 2rem)",
            height: "100%",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <Logo href={user ? "/dashboard" : "/"} />

          {/* Primary nav */}
          {user && (
            <nav className="app-nav" style={{ display: "flex", alignItems: "center", gap: "0.15rem", marginLeft: "0.75rem" }}>
              {NAV_LINKS.map(({ href, label, icon: Icon }) => {
                const active = pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      padding: "0.45rem 0.75rem",
                      borderRadius: "var(--radius-md)",
                      fontSize: "var(--text-sm)",
                      fontWeight: active ? 600 : 500,
                      textDecoration: "none",
                      color: active ? "var(--color-ink)" : "var(--color-ink-muted)",
                      background: active ? "var(--color-surface-alt)" : "transparent",
                      transition: "background-color 0.14s ease, color 0.14s ease",
                    }}
                  >
                    <Icon size={15} strokeWidth={1.9} />
                    {label}
                  </Link>
                );
              })}
            </nav>
          )}

          <div style={{ flex: 1 }} />

          {/* Right cluster */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {user ? (
              <>
                {!isNewDecision && (
                  <Link href="/decision/new" className="btn btn-primary btn-sm">
                    <Plus size={14} strokeWidth={2.5} />
                    <span className="hide-mobile">New decision</span>
                    <span className="hide-desktop">New</span>
                  </Link>
                )}

                <div style={{ position: "relative" }} ref={menuRef}>
                  <button
                    onClick={() => setUserOpen((v) => !v)}
                    aria-haspopup="menu"
                    aria-expanded={userOpen}
                    aria-label="Account menu"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      padding: "0.2rem 0.4rem 0.2rem 0.2rem",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--color-border)",
                      background: "transparent",
                      cursor: "pointer",
                    }}
                  >
                    <span
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: "var(--radius-full)",
                        background: "var(--color-ink)",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.64rem",
                        fontWeight: 600,
                        letterSpacing: "0.02em",
                      }}
                    >
                      {initials}
                    </span>
                    <ChevronDown size={13} color="var(--color-ink-faint)" />
                  </button>

                  {userOpen && (
                    <div
                      role="menu"
                      style={{
                        position: "absolute",
                        top: "calc(100% + 8px)",
                        right: 0,
                        background: "var(--color-surface-raised)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "var(--radius-lg)",
                        boxShadow: "var(--shadow-md)",
                        minWidth: 230,
                        overflow: "hidden",
                        zIndex: 100,
                      }}
                    >
                      <div style={{ padding: "0.85rem 1rem", borderBottom: "1px solid var(--color-border)" }}>
                        {displayName && (
                          <p style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-ink)", marginBottom: "0.15rem" }}>
                            {displayName}
                          </p>
                        )}
                        <p className="meta" style={{ wordBreak: "break-all" }}>{user.email}</p>
                      </div>
                      <div style={{ padding: "0.3rem" }}>
                        <button
                          role="menuitem"
                          onClick={signOut}
                          disabled={signingOut}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.6rem",
                            width: "100%",
                            padding: "0.55rem 0.7rem",
                            borderRadius: "var(--radius-md)",
                            border: "none",
                            background: "transparent",
                            color: "var(--color-ink-muted)",
                            fontSize: "var(--text-sm)",
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
                <Link href="/auth/login" className="link-quiet hide-mobile" style={{ fontSize: "var(--text-sm)", padding: "0.4rem 0.6rem" }}>
                  Sign in
                </Link>
                <Link href="/decision/new" className="btn btn-primary btn-sm">
                  Analyze a decision
                </Link>
              </>
            )}

            {user && (
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="app-menu-btn"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
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
                {menuOpen ? <X size={17} /> : <Menu size={17} />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile nav */}
        {menuOpen && user && (
          <div
            style={{
              borderTop: "1px solid var(--color-border)",
              background: "var(--color-surface-raised)",
              padding: "0.6rem 1rem 0.9rem",
            }}
          >
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    padding: "0.7rem 0.8rem",
                    borderRadius: "var(--radius-md)",
                    fontSize: "var(--text-body)",
                    fontWeight: active ? 600 : 500,
                    textDecoration: "none",
                    color: active ? "var(--color-ink)" : "var(--color-ink-muted)",
                    background: active ? "var(--color-surface-alt)" : "transparent",
                  }}
                >
                  <Icon size={16} strokeWidth={1.9} />
                  {label}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {userOpen && (
        <div onClick={() => setUserOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 55 }} aria-hidden />
      )}

      <style>{`
        @media (max-width: 720px) {
          .app-nav { display: none !important; }
          .app-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
