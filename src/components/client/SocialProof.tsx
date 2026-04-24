"use client"

import Image, { type StaticImageData } from "next/image"
import { motion } from "framer-motion"
import image21 from "@/assets/social-proof/image 21.png"
import image22 from "@/assets/social-proof/image 22.png"
import image24 from "@/assets/social-proof/image 24.png"
import image25 from "@/assets/social-proof/image 25.png"
import image26 from "@/assets/social-proof/image 26.png"
import image27 from "@/assets/social-proof/image 27.png"

const testimonials = [
  {
    id: 1,
    quote: "Finally, a tool that adapts to me. The personalized reading level helps me understand complex journals without constantly checking a dictionary.",
    name: "Sekar",
    location: "Bogor, Indonesia",
    image: image21,
  },
  {
    id: 2,
    quote: "I used to rely on ChatGPT, but the hallucinations were risky for my thesis. Scory is different — the summaries are accurate and safe to cite.",
    name: "Amgad",
    location: "Yaman",
    image: image22,
  },
  {
    id: 3,
    quote: "Research usually feels draining, but Scory makes it addictive. Building my reading streak keeps me motivated to finish my reading list.",
    name: "Reva",
    location: "Yogyakarta, Indonesia",
    image: image24,
  },
  {
    id: 4,
    quote: "Scory doesn't just simplify text — it preserves the scientific context. I can grasp difficult concepts in minutes rather than hours.",
    name: "Lintang",
    location: "Solo, Indonesia",
    image: image25,
  },
  {
    id: 5,
    quote: "The zero hallucination promise is real. Unlike other AI tools, Scory sticks strictly to the source material. I trust it for my assignments.",
    name: "Dimas",
    location: "Kalimantan, Indonesia",
    image: image26,
  },
  {
    id: 6,
    quote: "As a non-native English speaker, academic jargon was my biggest enemy. Scory transforms dense paragraphs into clear, understandable language.",
    name: "Fasya",
    location: "Yogyakarta, Indonesia",
    image: image27,
  },
]

function StarRating() {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="h-3.5 w-3.5 fill-amber-400" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function TestimonialCard({
  quote,
  name,
  location,
  image,
}: {
  quote: string
  name: string
  location: string
  image: StaticImageData
}) {
  return (
    <div className="w-64 sm:w-72 shrink-0 flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
      <StarRating />
      <p className="flex-1 text-sm text-muted-foreground leading-relaxed">
        &ldquo;{quote}&rdquo;
      </p>
      <div className="flex items-center gap-3 pt-3 border-t border-border">
        <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0">
          <Image src={image} alt={name} fill className="object-cover" />
        </div>
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">{location}</p>
        </div>
      </div>
    </div>
  )
}

const row1 = testimonials
const row2 = [...testimonials].reverse()

export default function SocialProof() {
  return (
    <section className="py-20 sm:py-28 bg-background" id="social-proof">
      <div className="space-y-12">

        {/* Heading */}
        <motion.div
          className="text-center space-y-3 px-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            What researchers{" "}
            <span className="text-primary">say.</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-md mx-auto">
            From students to researchers — real people, real results.
          </p>
        </motion.div>

        {/* Two-row infinite scroll */}
        <div className="relative overflow-hidden">
          {/* Fade edges */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-20 sm:w-32 z-10"
            style={{ background: "linear-gradient(to right, var(--background), transparent)" }}
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-20 sm:w-32 z-10"
            style={{ background: "linear-gradient(to left, var(--background), transparent)" }}
          />

          <div className="flex flex-col gap-4">
            {/* Row 1 — scroll left */}
            <div className="group flex gap-4 overflow-hidden">
              <div className="flex gap-4 animate-scroll-left group-hover:paused">
                {[...row1, ...row1].map((t, i) => (
                  <TestimonialCard key={i} {...t} />
                ))}
              </div>
            </div>

            {/* Row 2 — scroll right */}
            <div className="group flex gap-4 overflow-hidden">
              <div className="flex gap-4 animate-scroll-right group-hover:paused">
                {[...row2, ...row2].map((t, i) => (
                  <TestimonialCard key={i} {...t} />
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
