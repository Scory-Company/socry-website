import { neon } from "@neondatabase/serverless"
import { NextRequest, NextResponse } from "next/server"

const contactTypes = new Set(["email", "whatsapp"])
const roles = new Set([
  "student",
  "researcher",
  "lecturer",
  "author",
  "reviewer",
  "industry",
  "other",
])

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const whatsappDigitsPattern = /^\d{8,20}$/

interface SubmitRequest {
  contact_type?: unknown
  contact_value?: unknown
  role?: unknown
  full_name?: unknown
  use_case?: unknown
  source?: unknown
}

function apiResponse<T>(status: number, body: {
  success: boolean
  message: string
  data?: T
  errors?: unknown
}) {
  return NextResponse.json(body, { status })
}

function readString(value: unknown) {
  if (typeof value !== "string") {
    return ""
  }

  return value.trim()
}

function normalizeContact(contactType: string, value: string) {
  if (contactType === "email") {
    const email = value.trim().toLowerCase()

    if (!emailPattern.test(email)) {
      return null
    }

    return {
      value: email,
      normalized: email,
    }
  }

  if (contactType === "whatsapp") {
    const compact = value.replace(/[\s().-]/g, "")
    const hasInvalidPlus = compact.includes("+") && !compact.startsWith("+")
    const hasMultiplePlus = compact.split("+").length > 2

    if (hasInvalidPlus || hasMultiplePlus) {
      return null
    }

    const digits = compact.startsWith("+") ? compact.slice(1) : compact

    if (!whatsappDigitsPattern.test(digits)) {
      return null
    }

    return {
      value: compact,
      normalized: digits,
    }
  }

  return null
}

function nilIfBlank(value: string) {
  return value === "" ? null : value
}

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for")

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? null
  }

  return request.headers.get("x-real-ip")
}

function serializeTimestamp(value: unknown) {
  if (value instanceof Date) {
    return value.toISOString()
  }

  return String(value)
}

export async function POST(request: NextRequest) {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    return apiResponse(500, {
      success: false,
      message: "DATABASE_URL is not configured",
    })
  }

  const body = (await request.json().catch(() => null)) as SubmitRequest | null

  if (!body || typeof body !== "object") {
    return apiResponse(400, {
      success: false,
      message: "Input tidak valid",
    })
  }

  const contactType = readString(body.contact_type).toLowerCase()
  const contactValue = readString(body.contact_value)
  const role = readString(body.role).toLowerCase()
  const fullName = readString(body.full_name)
  const useCase = readString(body.use_case)
  const source = readString(body.source)

  if (
    !contactTypes.has(contactType) ||
    !contactValue ||
    contactValue.length > 120 ||
    !roles.has(role) ||
    !fullName ||
    fullName.length > 100 ||
    useCase.length > 500 ||
    source.length > 100
  ) {
    return apiResponse(400, {
      success: false,
      message: "Input tidak valid",
    })
  }

  const contact = normalizeContact(contactType, contactValue)

  if (!contact) {
    return apiResponse(422, {
      success: false,
      message: "Kontak tidak valid",
      errors: [
        {
          field: "contact_value",
          message: "contact_value tidak sesuai dengan contact_type",
        },
      ],
    })
  }

  try {
    const sql = neon(databaseUrl)
    const rows = await sql`
      INSERT INTO early_access_signups (
        contact_type,
        contact_value,
        contact_normalized,
        role,
        full_name,
        use_case,
        source,
        user_agent,
        ip_address
      ) VALUES (
        ${contactType},
        ${contact.value},
        ${contact.normalized},
        ${role},
        ${nilIfBlank(fullName)},
        ${nilIfBlank(useCase)},
        ${nilIfBlank(source)},
        ${nilIfBlank(request.headers.get("user-agent") ?? "")},
        ${nilIfBlank(getClientIp(request) ?? "")}
      )
      ON CONFLICT (contact_type, contact_normalized) DO UPDATE SET
        contact_value = EXCLUDED.contact_value,
        role = EXCLUDED.role,
        full_name = COALESCE(EXCLUDED.full_name, early_access_signups.full_name),
        use_case = COALESCE(EXCLUDED.use_case, early_access_signups.use_case),
        source = COALESCE(EXCLUDED.source, early_access_signups.source),
        user_agent = EXCLUDED.user_agent,
        ip_address = EXCLUDED.ip_address,
        updated_at = NOW()
      RETURNING id::text, created_at, updated_at
    `

    const row = rows[0]

    return apiResponse(201, {
      success: true,
      message: "Early access request diterima",
      data: {
        id: String(row.id),
        status: "received",
        created_at: serializeTimestamp(row.created_at),
        updated_at: serializeTimestamp(row.updated_at),
      },
    })
  } catch (error) {
    console.error("Failed to save early access signup", error)

    return apiResponse(500, {
      success: false,
      message: "Gagal menyimpan early access",
    })
  }
}
