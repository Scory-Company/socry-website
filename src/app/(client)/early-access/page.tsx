import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import EarlyAccessForm from "@/components/client/EarlyAccessForm"
import LaunchCountdown from "@/components/client/LaunchCountdown"

export const metadata: Metadata = {
  title: "Early Access",
  description: "Scory is under development. Join the list for updates on the newest version.",
}

interface EarlyAccessPageProps {
  searchParams?: Promise<{
    intent?: string | string[]
  }>
}

export default async function EarlyAccessPage({ searchParams }: EarlyAccessPageProps) {
  const params = await searchParams
  const rawIntent = params?.intent
  const initialUseCase = Array.isArray(rawIntent) ? rawIntent[0] : rawIntent

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#f7faf8] text-foreground">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(8,18,10,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(8,18,10,0.05)_1px,transparent_1px)] bg-[size:44px_44px]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-44 bg-[linear-gradient(180deg,rgba(23,183,75,0.12),rgba(247,250,248,0))]"
      />

      <main className="relative flex min-h-screen items-center px-4 py-4 sm:px-6 lg:px-8">
        <section className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-2 lg:items-stretch">
          <div className="relative overflow-hidden rounded-lg bg-[#07120a] p-5 text-white shadow-[0_24px_80px_rgba(7,18,10,0.24)] sm:p-7 lg:min-h-[580px]">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0_1px,transparent_1px_18px)] opacity-40"
            />
            <div
              aria-hidden="true"
              className="absolute right-0 top-0 h-full w-3/5 bg-[linear-gradient(140deg,transparent_0%,rgba(23,183,75,0.16)_48%,transparent_49%)]"
            />
            <div aria-hidden="true" className="absolute -bottom-7 left-6 text-7xl font-bold text-white/[0.04]">
              SCORY
            </div>

            <div className="relative flex h-full flex-col justify-between gap-6">
              <div className="space-y-7">
                <Link
                  href="/"
                  className="inline-flex h-9 items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 text-sm font-medium text-white/72 transition-colors hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Scory
                </Link>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-md border border-white/10 bg-black/30">
                      <Image src="/logo.png" alt="Scory" width={34} height={25} priority />
                    </div>
                    <span className="inline-flex rounded-full border border-primary/30 bg-primary/15 px-3 py-1 text-xs font-semibold uppercase text-primary-light">
                      Under Development
                    </span>
                  </div>

                  <div className="space-y-3">
                    <h1 className="max-w-xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                      Scory is under development.
                    </h1>
                    <p className="max-w-lg text-sm leading-7 text-white/68 sm:text-base">
                      We are preparing a newer Scory experience for launch. Join the update list and we will contact you when it is ready.
                    </p>
                  </div>
                </div>
              </div>

              <LaunchCountdown tone="dark" />
            </div>
          </div>

          <div className="flex items-center justify-center lg:items-stretch">
            <EarlyAccessForm
              initialUseCase={initialUseCase ?? ""}
              className="lg:h-full lg:max-w-none lg:min-h-[580px]"
            />
          </div>
        </section>
      </main>
    </div>
  )
}
