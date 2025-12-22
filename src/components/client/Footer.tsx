"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.png";
import { 
  IconBrandInstagram, 
  IconBrandTwitter, 
  IconBrandLinkedin, 
  IconBrandYoutube 
} from "@tabler/icons-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#" },
        { name: "Pricing", href: "#" },
        { name: "Testimonials", href: "#" },
        { name: "Integration", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Blog", href: "#" },
        { name: "Contact", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
        { name: "Cookie Policy", href: "#" },
      ],
    },
  ];

  const socialLinks = [
    { icon: <IconBrandTwitter className="w-5 h-5" />, href: "#" },
    { icon: <IconBrandInstagram className="w-5 h-5" />, href: "#" },
    { icon: <IconBrandLinkedin className="w-5 h-5" />, href: "#" },
    { icon: <IconBrandYoutube className="w-5 h-5" />, href: "#" },
  ];

  return (
    <footer className="relative bg-background pt-20 pb-10 border-t border-border font-sans">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-16">
          
          {/* Brand Section */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src={logo}
                alt="Scory Logo"
                width={32}
                height={32}
                className="object-contain"
              />
              <span className="text-xl font-bold text-foreground">Scory</span>
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-sm">
              Making research accessible for everyone. We use RAG technology to transform complex scientific articles into easy-to-understand summaries.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Section */}
          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {footerLinks.map((column, idx) => (
              <div key={idx} className="space-y-4">
                <h4 className="font-semibold text-foreground tracking-wide">
                  {column.title}
                </h4>
                <ul className="space-y-3">
                  {column.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <Link
                        href={link.href}
                        className="text-muted-foreground hover:text-primary transition-colors text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter Section */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="font-semibold text-foreground tracking-wide">
              Stay Updated
            </h4>
            <p className="text-muted-foreground text-sm">
              Subscribe to our newsletter to get the latest research insights delivered to your inbox.
            </p>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/60 text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary-dark-shade transition-colors shadow-[0_4px_14px_0_rgba(38,238,90,0.39)]"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            &copy; {currentYear} Scory. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
             <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
             <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
             <Link href="#" className="hover:text-primary transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
