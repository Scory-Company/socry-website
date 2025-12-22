"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import cogniferaLogo from "@/assets/cognifera-education-academy.jpg"

export default function StrategicPartners() {
  return (
    <section className="py-16 sm:py-24 bg-background font-sans relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-32 bg-primary/5 blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6"
                >
                    Strategic <span className="text-primary">Partners</span>
                </motion.h2>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-muted-foreground text-sm sm:text-base leading-relaxed"
                >
                    Collaborating with strategic partners, both national and international, 
                    to drive innovation in Scory helping to solve research problems in Indonesia.
                </motion.p>
            </div>

            {/* Partners Grid */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-wrap justify-center gap-6"
            >
                {/* Telkom University Card */}
                <div className="group relative flex items-center justify-center w-full sm:w-64 h-24 sm:h-28 bg-card border border-border rounded-xl shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300">
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 rounded-xl transition-colors duration-300" />
                    
                    <div className="flex items-center justify-center p-6 z-10 w-full h-full">
                        <Image 
                            src={cogniferaLogo} 
                            alt="Cognifera Education Academy" 
                            className="w-auto h-16 object-contain transition-all duration-300"
                            width={200}
                            height={80}
                        />
                    </div>
                </div>
            </motion.div>
        </div>
    </section>
  )
}
