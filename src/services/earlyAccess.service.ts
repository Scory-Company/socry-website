export type EarlyAccessContactType = "email" | "whatsapp"

export type EarlyAccessRole =
  | "student"
  | "researcher"
  | "lecturer"
  | "author"
  | "reviewer"
  | "industry"
  | "other"

export const earlyAccessRoleOptions: Array<{
  value: EarlyAccessRole
  label: string
  description: string
}> = [
  {
    value: "student",
    label: "Student",
    description: "Undergraduate, graduate, or independent learner",
  },
  {
    value: "researcher",
    label: "Researcher",
    description: "Researcher, scientist, or lab member",
  },
  {
    value: "lecturer",
    label: "Lecturer",
    description: "Lecturer, teacher, or academic mentor",
  },
  {
    value: "author",
    label: "Author",
    description: "Paper author or academic writer",
  },
  {
    value: "reviewer",
    label: "Reviewer",
    description: "Reviewer, editor, or academic evaluator",
  },
  {
    value: "industry",
    label: "Industry",
    description: "Professional, founder, or product team",
  },
  {
    value: "other",
    label: "Other",
    description: "Another role related to research",
  },
]

export interface EarlyAccessSignupInput {
  contactType: EarlyAccessContactType
  contactValue: string
  role: EarlyAccessRole
  fullName: string
  useCase?: string
  source?: string
}

export interface EarlyAccessSignupResponse {
  id: string
  status: string
  created_at: string
  updated_at: string
}

interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  errors?: unknown
}

export async function submitEarlyAccessSignup(
  input: EarlyAccessSignupInput
): Promise<EarlyAccessSignupResponse> {
  const response = await fetch("/api/early-access", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contact_type: input.contactType,
      contact_value: input.contactValue,
      role: input.role,
      full_name: input.fullName,
      use_case: input.useCase,
      source: input.source ?? "landing_early_access",
    }),
  })

  const payload = (await response.json().catch(() => null)) as ApiResponse<EarlyAccessSignupResponse> | null

  if (!response.ok || !payload?.success || !payload.data) {
    throw new Error(payload?.message ?? "Early access request could not be submitted")
  }

  return payload.data
}
