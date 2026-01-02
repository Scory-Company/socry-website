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

interface NavItem {
  name: string;
  link: string;
}

interface PublicNavbarProps {
  navItems?: NavItem[];
  showAuthButtons?: boolean;
}

export default function PublicNavbar({ 
  navItems = [
    { name: "Home", link: "/" },
    { name: "Articles", link: "/articles" },
    { name: "How It Works", link: "/#how-it-works" },
  ],
  showAuthButtons = true 
}: PublicNavbarProps) {
  const [loginOpen, setLoginOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLoginClick = () => {
    setLoginOpen(true);
    setMobileMenuOpen(false);
  };

  const handleRegisterClick = () => {
    setLoginOpen(true);
    setMobileMenuOpen(false);
  };

  return (
    <>
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
              {showAuthButtons && (
                <>
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
                </>
              )}
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
              {showAuthButtons && (
                <>
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
                </>
              )}
            </div>
          </MobileNavMenu>
        </Navbar>
      </div>

      {/* Login Dialog */}
      {showAuthButtons && (
        <LoginDialog 
          open={loginOpen} 
          onOpenChange={setLoginOpen} 
          onLoginSuccess={() => setLoginOpen(false)}
        />
      )}
    </>
  );
}
