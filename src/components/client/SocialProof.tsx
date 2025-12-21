"use client"

import { ArrowLeft, ArrowRight, Quote } from "lucide-react"
import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import image21 from "@/assets/social-proof/image 21.png"
import image22 from "@/assets/social-proof/image 22.png"
import image24 from "@/assets/social-proof/image 24.png"
import image25 from "@/assets/social-proof/image 25.png"
import image26 from "@/assets/social-proof/image 26.png"
import image27 from "@/assets/social-proof/image 27.png"

const testimonials = [
  {
    id: 1,
    quote:
      "Finally, a tool that adapts to ME. The Personal Reading Level feature helps me understand complex international journals without constantly checking a dictionary. It bridges the language gap perfectly.",
    name: "Sekar",
    role: "Student",
    location: "Bogor, Indonesia",
    image: image21,
  },
  {
    id: 2,
    quote:
      "I used to rely on ChatGPT, but the hallucinations were risky for my thesis. Scory is different—it uses RAG technology so I know the summaries are 100% accurate and safe to cite.",
    name: "Amgad",
    role: "Student",
    location: "Yaman",
    image: image22,
  },
  {
    id: 3,
    quote:
      "Research usually feels draining, but Scory makes it addictive. I love the gamification features! Building my reading streak and taking quick quizzes keeps me motivated to finish my reading list.",
    name: "Reva",
    role: "Student",
    location: "Yogyakarta, Indonesia",
    image: image24,
  },
  {
    id: 4,
    quote:
      "Scory doesn't just simplify text; it preserves the scientific context. I can grasp difficult concepts in minutes rather than hours. It's an absolute game-changer for tight deadlines.",
    name: "Lintang",
    role: "Student",
    location: "Solo, Indonesia",
    image: image25,
  },
  {
    id: 5,
    quote:
      "The 'Zero Hallucination' promise is real. Unlike other AI tools that make things up, Scory sticks strictly to the source material. It gives me the confidence to use the insights for my assignments.",
    name: "Dimas",
    role: "Student",
    location: "Kalimantan, Indonesia",
    image: image26,
  },
  {
    id: 6,
    quote:
      "As a non-native English speaker, academic jargon was my biggest enemy. Scory transforms dense paragraphs into clear, understandable language. It actually helps improve my literacy.",
    name: "Fasya",
    role: "Student",
    location: "Yogyakarta, Indonesia",
    image: image27,
  },
]

export default function SocialProof() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 350
      const newScrollLeft =
        direction === "left"
          ? scrollRef.current.scrollLeft - scrollAmount
          : scrollRef.current.scrollLeft + scrollAmount

      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      })
    }
  }

  // Auto-scroll functionality
  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer || isPaused) return

    const autoScroll = setInterval(() => {
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
        scrollContainer.scrollTo({ left: 0, behavior: "smooth" })
      } else {
        scrollContainer.scrollBy({ left: 1, behavior: "auto" })
      }
    }, 30)

    return () => clearInterval(autoScroll)
  }, [isPaused])

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return
    setIsDragging(true)
    setIsPaused(true)
    setStartX(e.pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
    setTimeout(() => setIsPaused(false), 2000)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setTimeout(() => setIsPaused(false), 2000)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 2
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  // Touch drag handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollRef.current) return
    setIsPaused(true)
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }

  const handleTouchEnd = () => {
    setTimeout(() => setIsPaused(false), 2000)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!scrollRef.current) return
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 2
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          {/* Left Side - Title & Navigation */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-5">
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
                Collaborating &<br />
                creating <span className="text-primary-darker">Research Expert</span>
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">What they said about Scory</p>
            </div>

            {/* Navigation Buttons - Hidden on mobile, shown on larger screens */}
            <div className="hidden sm:flex gap-3">
              <button
                onClick={() => {
                  scroll("left")
                  setIsPaused(true)
                  setTimeout(() => setIsPaused(false), 2000)
                }}
                className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-primary hover:bg-primary/20 transition-all active:scale-95"
                aria-label="Scroll left"
              >
                <ArrowLeft className="w-5 h-5 text-primary" />
              </button>
              <button
                onClick={() => {
                  scroll("right")
                  setIsPaused(true)
                  setTimeout(() => setIsPaused(false), 2000)
                }}
                className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-primary hover:bg-primary/20 transition-all active:scale-95"
                aria-label="Scroll right"
              >
                <ArrowRight className="w-5 h-5 text-primary" />
              </button>
            </div>
          </div>

          {/* Right Side - Scrollable Cards */}
          <div className="lg:col-span-8 relative">
            {/* Hint text for mobile users */}
            <p className="text-xs text-muted-foreground mb-3 sm:hidden text-center">
              Swipe to see more testimonials
            </p>

            <div
              ref={scrollRef}
              className="flex gap-3 sm:gap-4 md:gap-5 overflow-x-auto scrollbar-hide scroll-smooth pb-2 cursor-grab active:cursor-grabbing touch-pan-x"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onTouchMove={handleTouchMove}
              onMouseEnter={() => setIsPaused(true)}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="flex-none w-70 sm:w-75 md:w-[320px] bg-card border border-border rounded-xl p-4 sm:p-5 md:p-6 flex flex-col hover:shadow-lg transition-shadow select-none"
                  style={{ minHeight: "280px" }}
                >
                  {/* Quote Icon */}
                  <div className="flex justify-start mb-3">
                    <Quote className="w-10 h-10 sm:w-12 sm:h-12 text-primary-darker fill-primary-darker" />
                  </div>

                  {/* Role Badge */}
                  <div className="mb-3">
                    <span className="px-3 py-1 bg-primary/10 text-primary-darker text-xs font-medium rounded-full">
                      {testimonial.role}
                    </span>
                  </div>

                  {/* Quote Text */}
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-3 sm:mb-4 flex-1 line-clamp-6 sm:line-clamp-5">
                    &quot;{testimonial.quote}&quot;
                  </p>

                  {/* Author Info - Fixed position at bottom */}
                  <div className="flex items-center gap-2 sm:gap-2.5 mt-auto pt-2 sm:pt-3 border-t border-border">
                    <div className="relative w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full overflow-hidden shrink-0">
                      <Image src={testimonial.image} alt={testimonial.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm md:text-base font-bold text-foreground truncate">
                        {testimonial.name}
                      </h4>
                      <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
