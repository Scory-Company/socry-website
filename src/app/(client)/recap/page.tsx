import { neon } from "@neondatabase/serverless"
import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ClipboardList, Mail, Phone, UsersRound } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { earlyAccessRoleOptions } from "@/services/earlyAccess.service"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Early Access Recap",
  description: "Internal recap of Scory early access submissions.",
  robots: {
    index: false,
    follow: false,
  },
}

interface EarlyAccessSignupRow {
  id: string
  contact_type: "email" | "whatsapp"
  contact_value: string
  role: string
  full_name: string | null
  use_case: string | null
  source: string | null
  created_at: string | Date
  updated_at: string | Date
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Jakarta",
})

const roleLabelMap = new Map(
  earlyAccessRoleOptions.map((item) => [item.value, item.label])
)

function formatDate(value: string | Date) {
  return dateFormatter.format(new Date(value))
}

function getRoleLabel(role: string) {
  return roleLabelMap.get(role as never) ?? role
}

function getRoleCounts(rows: EarlyAccessSignupRow[]) {
  return rows.reduce<Record<string, number>>((acc, row) => {
    acc[row.role] = (acc[row.role] ?? 0) + 1
    return acc
  }, {})
}

async function getSignups() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    return {
      rows: [],
      error: "DATABASE_URL is not configured.",
    }
  }

  try {
    const sql = neon(databaseUrl)
    const rows = await sql`
      SELECT
        id::text,
        contact_type,
        contact_value,
        role,
        full_name,
        use_case,
        source,
        created_at,
        updated_at
      FROM early_access_signups
      ORDER BY created_at DESC
    `

    return {
      rows: rows as EarlyAccessSignupRow[],
      error: null,
    }
  } catch (error) {
    console.error("Failed to load early access recap", error)

    return {
      rows: [],
      error: "Could not load early access submissions.",
    }
  }
}

export default async function RecapPage() {
  const { rows, error } = await getSignups()
  const roleCounts = getRoleCounts(rows)

  return (
    <div className="min-h-screen bg-[#f7faf8] text-foreground">
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <Link
              href="/early-access"
              className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-white px-3 text-sm font-medium text-muted-foreground shadow-sm transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to early access
            </Link>

            <div>
              <Badge className="mb-3 bg-primary/10 text-primary hover:bg-primary/10">
                Internal Recap
              </Badge>
              <h1 className="text-3xl font-bold sm:text-4xl">Early access submissions</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Simple recap of everyone who submitted the Scory update list form.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                <UsersRound className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Total submissions</p>
                <p className="text-2xl font-bold">{rows.length}</p>
              </div>
            </div>
          </div>
        </div>

        {error ? (
          <div className="rounded-lg border border-border bg-white p-6 text-sm text-muted-foreground shadow-sm">
            {error}
          </div>
        ) : (
          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-[repeat(auto-fit,minmax(140px,1fr))]">
              {Object.entries(roleCounts).map(([role, count]) => (
                <div key={role} className="rounded-lg border border-border bg-white p-4 shadow-sm">
                  <p className="text-xs font-medium text-muted-foreground">{getRoleLabel(role)}</p>
                  <p className="mt-1 text-2xl font-bold">{count}</p>
                </div>
              ))}
            </div>

            <section className="overflow-hidden rounded-lg border border-border bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-primary" />
                  <h2 className="text-sm font-semibold">Submission list</h2>
                </div>
                <p className="text-xs text-muted-foreground">Newest first</p>
              </div>

              {rows.length === 0 ? (
                <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No early access submissions yet.
                </div>
              ) : (
                <>
                  <div className="hidden overflow-x-auto md:block">
                    <table className="w-full min-w-[860px] text-left text-sm">
                      <thead className="border-b border-border bg-muted/50 text-xs text-muted-foreground">
                        <tr>
                          <th className="px-4 py-3 font-medium">Name</th>
                          <th className="px-4 py-3 font-medium">Contact</th>
                          <th className="px-4 py-3 font-medium">Role</th>
                          <th className="px-4 py-3 font-medium">Use case</th>
                          <th className="px-4 py-3 font-medium">Submitted</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {rows.map((row) => (
                          <tr key={row.id} className="align-top">
                            <td className="px-4 py-3 font-medium">{row.full_name ?? "-"}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                {row.contact_type === "email" ? (
                                  <Mail className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                )}
                                <span>{row.contact_value}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant="secondary">{getRoleLabel(row.role)}</Badge>
                            </td>
                            <td className="max-w-xs px-4 py-3 text-muted-foreground">
                              {row.use_case || "-"}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                              {formatDate(row.created_at)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="divide-y divide-border md:hidden">
                    {rows.map((row) => (
                      <article key={row.id} className="space-y-3 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h2 className="font-semibold">{row.full_name ?? "-"}</h2>
                            <p className="text-xs text-muted-foreground">{formatDate(row.created_at)}</p>
                          </div>
                          <Badge variant="secondary">{getRoleLabel(row.role)}</Badge>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          {row.contact_type === "email" ? (
                            <Mail className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Phone className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span>{row.contact_value}</span>
                        </div>

                        {row.use_case && (
                          <p className="text-sm leading-6 text-muted-foreground">{row.use_case}</p>
                        )}
                      </article>
                    ))}
                  </div>
                </>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  )
}
