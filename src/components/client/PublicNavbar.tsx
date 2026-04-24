"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import LoginDialog from "@/components/client/LoginDialog"

interface NavItem {
  name: string
  link: string
}

interface PublicNavbarProps {
  navItems?: NavItem[]
  showAuthButtons?: boolean
}

const ease = [0.22, 1, 0.36, 1] as const

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.2M12 19.8V22M4.93 4.93l1.56 1.56M17.51 17.51l1.56 1.56M2 12h2.2M19.8 12H22M4.93 19.07l1.56-1.56M17.51 6.49l1.56-1.56" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

export default function PublicNavbar({
  navItems = [
    { name: "Features",     link: "#features"     },
    { name: "Articles",     link: "/articles"     },
    { name: "Pricing",      link: "#pricing"      },
    { name: "Contacts", link: "#contacts" },
  ],
  showAuthButtons = true,
}: PublicNavbarProps) {
  const router = useRouter()

  const [scrolled,   setScrolled]   = useState(false)
  const [menuOpen,   setMenuOpen]   = useState(false)
  const [loginOpen,  setLoginOpen]  = useState(false)
  const [theme, setTheme] = useState<"dark" | "light">("light")

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Sync theme from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    const stored = localStorage.getItem("theme")
    const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    const initial = (stored === "light" || stored === "dark") ? stored : preferred
    setTheme(initial)
    document.documentElement.classList.toggle("dark", initial === "dark")
  }, [])

  // Apply dark class on toggle
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    localStorage.setItem("theme", theme)
  }, [theme])

  // Close menu on desktop resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [menuOpen])

  const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark")

  return (
    <>
      {/* ── Pill navbar ── */}
      <header className="fixed left-0 right-0 top-4 z-50">
        <div className="flex justify-center px-4">
          <motion.nav
            initial={{ y: -28, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              maxWidth: scrolled ? "820px" : "1280px",
              borderRadius: scrolled ? 9999 : 14,
              paddingTop: scrolled ? 8 : 12,
              paddingBottom: scrolled ? 8 : 12,
              boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)" : "none",
            }}
            transition={{
              y:             { duration: 0.7, ease: "easeOut", delay: 0.1 },
              opacity:       { duration: 0.6, delay: 0.1 },
              maxWidth:      { type: "spring", stiffness: 200, damping: 30 },
              borderRadius:  { type: "spring", stiffness: 200, damping: 30 },
              paddingTop:    { type: "spring", stiffness: 200, damping: 30 },
              paddingBottom: { type: "spring", stiffness: 200, damping: 30 },
              boxShadow:     { duration: 0.35 },
            }}
            className={`flex w-full items-center justify-between gap-3 border px-5 backdrop-blur-xl transition-[background-color,border-color] duration-300 ${
              scrolled || menuOpen
                ? "border-border/90 bg-background/95"
                : "border-border/40 bg-background/15"
            }`}
            style={{ willChange: "max-width, border-radius" }}
          >
            {/* Logo */}
            <Link href="/" className="shrink-0" onClick={() => setMenuOpen(false)}>
              <Image
                src="/logo.png"
                alt="Scory"
                width={32}
                height={32}
                className="h-8 w-auto object-contain"
                priority
              />
            </Link>

            {/* Desktop nav links */}
            <div className="hidden items-center gap-1 md:flex">
              {navItems.map((link, i) => (
                <motion.div
                  key={link.link}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.3 + i * 0.055, ease: "easeOut" }}
                >
                  <Link
                    href={link.link}
                    className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors duration-200 hover:bg-foreground/5 hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Right controls */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex shrink-0 items-center gap-2"
            >

              {showAuthButtons && (
                <>
                  {/* Get Started — desktop only */}
                  <button
                    type="button"
                    onClick={() => router.push("/register")}
                    className="hidden items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary-dark-shade md:flex"
                  >
                    Get Started
                  </button>
              {/* Theme toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-card/40 text-foreground transition-all duration-200 hover:border-border hover:bg-card/70"
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                {theme === "dark" ? <SunIcon /> : <MoonIcon />}
              </button>
                </>
              )}

              {/* Hamburger / Close — mobile only */}
              <button
                type="button"
                onClick={() => setMenuOpen(p => !p)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-card/40 text-foreground transition-all duration-200 hover:border-border hover:bg-card/70 md:hidden"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={menuOpen ? "x" : "menu"}
                    initial={{ opacity: 0, rotate: -45, scale: 0.7 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 45, scale: 0.7 }}
                    transition={{ duration: 0.18 }}
                    className="flex items-center justify-center"
                  >
                    {menuOpen ? <XIcon /> : <MenuIcon />}
                  </motion.span>
                </AnimatePresence>
              </button>
            </motion.div>
          </motion.nav>
        </div>
      </header>

      {/* ── Full-screen mobile overlay ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed inset-0 z-40 flex flex-col bg-background md:hidden"
          >
            {/* Ambient green glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(23,183,75,0.06), transparent 62%)" }}
            />

            {/* Nav links — vertically centered */}
            <div className="relative flex flex-1 flex-col items-center justify-center gap-0 pt-20">
              {navItems.map((link, i) => (
                <motion.div
                  key={link.link}
                  initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                  transition={{ duration: 0.4, delay: 0.06 + i * 0.07, ease }}
                  className="w-full"
                >
                  <Link
                    href={link.link}
                    onClick={() => setMenuOpen(false)}
                    className="group relative flex items-center justify-center px-8 py-3.5"
                  >
                    <motion.span
                      className="absolute left-1/2 h-px w-0 -translate-x-1/2 bg-primary opacity-0 transition-all duration-300 group-hover:w-12 group-hover:opacity-100"
                      style={{ bottom: "6px" }}
                    />
                    <span className="text-[2rem] font-bold leading-tight tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary">
                      {link.name}
                    </span>
                  </Link>
                </motion.div>
              ))}

              {/* Divider */}
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                exit={{ scaleX: 0, opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.38 }}
                className="mx-auto mt-8 h-px w-12 origin-center bg-primary/30"
              />
            </div>

            {/* Bottom bar */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.35, delay: 0.3, ease }}
              className="relative flex items-center justify-between border-t border-border/40 px-6 py-6"
            >
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-card/50 text-foreground"
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                {theme === "dark" ? <SunIcon /> : <MoonIcon />}
              </button>

              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Scory
              </span>

              {showAuthButtons && (
                <button
                  type="button"
                  onClick={() => { setMenuOpen(false); router.push("/register") }}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary-dark-shade"
                >
                  Get Started
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showAuthButtons && (
        <LoginDialog
          open={loginOpen}
          onOpenChange={setLoginOpen}
          onLoginSuccess={() => setLoginOpen(false)}
        />
      )}
    </>
  )
}
