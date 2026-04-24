import type { Metadata } from "next";
import "./globals.css";
import { Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Scory - Research Made Easy",
    template: "%s | Scory",
  },
  description: "Scory uses advanced RAG technology to transform complex scientific articles into accurate, easy-to-understand summaries personalized to your reading level. Get reliable insights without AI hallucination.",
  keywords: [
    "scientific research",
    "article simplifier",
    "AI summary",
    "RAG technology",
    "academic research",
    "science simplified",
    "research papers",
    "Scory",
  ],
  authors: [
    {
      name: "Scory Team",
      url: "https://scory.site",
    },
  ],
  creator: "Scory Team",
  publisher: "Scory Inc.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Scory - Research Made Easy",
    description: "Transform complex scientific articles into accurate, easy-to-understand summaries with AI.",
    url: "https://scory.site",
    siteName: "Scory",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Scory - Research Made Easy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Scory - Research Made Easy",
    description: "Transform complex scientific articles into accurate, easy-to-understand summaries with AI.",
    creator: "@scory",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const theme = savedTheme || (prefersDark ? 'dark' : 'light');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${spaceGrotesk.variable} antialiased`}>
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
