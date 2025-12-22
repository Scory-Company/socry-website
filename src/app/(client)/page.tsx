"use client";

import React, { useState } from "react";
import {
  Navbar,
  NavBody,
  NavItems,
  NavbarLogo,
  NavbarButton,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
  NavbarThemeToggle,
} from "@/components/ui/resizable-navbar";
import LoginDialog from "@/components/client/LoginDialog";
import HeroSection from "@/components/client/HeroSection";
import HowItWorks from "@/components/client/HowItWorks";
import SocialProof from "@/components/client/SocialProof";
import TrendingArticles from "@/components/client/TrendingArticles";
import Footer from "@/components/client/Footer";
import { getMostPopularArticles } from "@/data/mock/articles";

export default function Home() {
  const trendingArticles = getMostPopularArticles();
  const [loginOpen, setLoginOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("login"); // 'login' or 'register' for dialog
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", link: "#hero" },
    { name: "Articles", link: "#trending" },
    { name: "How It Works", link: "#how-it-works" },
  ];

  const handleLoginClick = () => {
    // We could pass a prop to LoginDialog to set initial mode if it supported it
    // For now, just open it. The dialog handles its own switching.
    setLoginOpen(true);
    setMobileMenuOpen(false);
  };

  const handleRegisterClick = () => {
    setLoginOpen(true);
    // Ideally we would set the initial state of the dialog to Register
    // Since LoginDialog manages its own state (isLogin), we might rely on the user switching tab
    // Or we could update LoginDialog to accept an `initialMode` prop.
    // For now, just open.
    setMobileMenuOpen(false);
  };

  return (
    <div className="relative min-h-screen w-full bg-white dark:bg-neutral-950">
      {/* Navbar Container */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4">
        <Navbar>
          {/* Desktop Nav */}
          <NavBody>
            <div className="flex items-center gap-4">
              <NavbarLogo />
              <NavItems items={navItems} />
            </div>
            <div className="relative z-50 flex items-center gap-2">
              <NavbarButton
                variant="secondary"
                onClick={handleLoginClick}
                className="hidden sm:inline-block"
              >
                Sign In
              </NavbarButton>
              <NavbarButton
                variant="primary"
                onClick={handleRegisterClick}
                className="hidden sm:inline-block"
              >
                Get Started
              </NavbarButton>
              <NavbarThemeToggle />
            </div>
          </NavBody>

          {/* Mobile Nav Bar (Visible on small screens) */}
          <MobileNav>
            <MobileNavHeader>
              <NavbarLogo />
              <MobileNavToggle
                isOpen={mobileMenuOpen}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              />
            </MobileNavHeader>
          </MobileNav>

          {/* Mobile Menu Dropdown */}
          <MobileNavMenu
            isOpen={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
          >
            <div className="flex flex-col gap-4 p-4 w-full">
               {navItems.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.link}
                    className="text-lg font-medium text-neutral-700 dark:text-neutral-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
                <div className="w-full h-px bg-neutral-200 dark:bg-neutral-800 my-2"></div>
                <NavbarButton
                  variant="secondary"
                  onClick={handleLoginClick}
                  className="w-full text-center"
                >
                  Sign In
                </NavbarButton>
                <NavbarButton
                  variant="primary"
                  onClick={handleRegisterClick}
                  className="w-full text-center"
                >
                  Get Started
                </NavbarButton>
            </div>
          </MobileNavMenu>
        </Navbar>
      </div>

      {/* Main Content */}
      <main className="relative pt-20"> {/* Add padding for fixed navbar */}
        <div id="hero">
          <HeroSection />
        </div>
        
        <div id="trending" className="scroll-mt-24">
           {/* scroll-mt-24 adds margin top when scrolling to this id so it's not hidden by navbar */}
          <TrendingArticles articles={trendingArticles} />
        </div>

        <div id="how-it-works" className="scroll-mt-24">
           <HowItWorks/>
        </div>

        <div id="social-proof">
           <SocialProof/>
        </div>
      </main>

      <Footer />

      <LoginDialog 
        open={loginOpen} 
        onOpenChange={setLoginOpen} 
        onLoginSuccess={() => setLoginOpen(false)}
      />
    </div>
  );
}
