"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-background font-sans overflow-hidden">
      {/* Background Giant 404 */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute inset-0 flex items-start justify-center pt-20 sm:pt-24 md:pt-32 z-0 select-none pointer-events-none"
      >
        <h1 className="text-[12rem] sm:text-[18rem] md:text-[24rem] font-bold text-primary tracking-tighter leading-none opacity-80 mix-blend-screen dark:mix-blend-normal blur-sm">
          404
        </h1>
      </motion.div>

      {/* Glassmorphism Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg mx-4"
      >
        {/* The card itself */}
        <div className="bg-background/10 dark:bg-black/40 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-2xl rounded-[2.5rem] p-8 sm:p-12 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl sm:text-3xl font-bold text-foreground mb-4"
          >
            Oops, page not found
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-8 max-w-sm mx-auto"
          >
            It seems the page you're looking for doesn't exist or has been moved. Don't worry, let's get you back on track!
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ delay: 0.5 }}
          >
            <Button asChild className=" h-12 px-8 text-base font-medium bg-primary hover:bg-primary-dark-shade text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300">
              <Link href="/">
                Back to homepage
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
    </div>
  )
}
