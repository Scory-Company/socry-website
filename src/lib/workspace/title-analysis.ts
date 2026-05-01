export type TitleAnalysisVerdict = "Good to Continue" | "Needs Refinement" | "Consider Pivoting"

export type TitleAnalysisSectionKey = "about" | "weaknesses" | "gaps" | "nextSteps"

export type TitleAnalysisNode = {
  id: "topic" | "variables" | "context" | "method" | "gap" | "positioning"
  label: string
  value: string
  tone: "neutral" | "positive" | "warning"
  section: TitleAnalysisSectionKey
}

export type TitleAnalysisSection = {
  key: TitleAnalysisSectionKey
  title: string
  points: string[]
}

export type TitleAnalysisMetric = {
  label: string
  value: number
  helper: string
  tone: "neutral" | "positive" | "warning"
}

export type TitleAnalysisScopeSuggestion = {
  label: string
  value: string
}

export type TitleAnalysisResult = {
  title: string
  summary: string
  verdict: TitleAnalysisVerdict
  verdictReason: string
  confidenceScore: number
  refinedTitleSuggestion: string
  keyTakeaway: string
  metrics: TitleAnalysisMetric[]
  nodes: TitleAnalysisNode[]
  keywords: string[]
  researchQuestions: string[]
  searchQueries: string[]
  scopeSuggestions: TitleAnalysisScopeSuggestion[]
  sections: TitleAnalysisSection[]
  suggestedActions: string[]
  historyLabel: string
}

const stopWords = new Set([
  "a",
  "an",
  "and",
  "as",
  "at",
  "by",
  "for",
  "from",
  "in",
  "of",
  "on",
  "or",
  "the",
  "to",
  "with",
])

function toTitleCase(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function extractCoreTerms(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word))
}

function pickTopic(terms: string[]) {
  const meaningfulTerms = terms.filter((word) => !["impact", "effect", "analysis", "study"].includes(word))
  const topic = meaningfulTerms.slice(0, 3).join(" ")
  return topic ? toTitleCase(topic) : "Research topic still needs clarification"
}

function pickVariables(title: string, terms: string[]) {
  const lowered = title.toLowerCase()

  if (lowered.includes("impact of") || lowered.includes("effect of")) {
    const chunks = title.split(/\bon\b/i)
    if (chunks.length > 1) {
      return chunks[0].replace(/^(the\s+)?(impact|effect)\s+of\s+/i, "").trim() + " -> " + chunks[1].trim()
    }
  }

  return terms.slice(0, 4).map(toTitleCase).join(", ") || "Variables are not explicit yet"
}

function pickContext(title: string) {
  const lowered = title.toLowerCase()

  if (lowered.includes("higher education")) return "Higher education setting"
  if (lowered.includes("university")) return "University context"
  if (lowered.includes("college")) return "College context"
  if (lowered.includes("school")) return "School context"
  if (lowered.includes("healthcare")) return "Healthcare context"
  if (lowered.includes("indonesia")) return "Indonesia-specific context"

  const parts = title.split(/\bin\b/i)
  if (parts.length > 1) {
    return parts[1].trim()
  }

  return "Context is still broad"
}

function pickMethod(title: string) {
  const lowered = title.toLowerCase()

  if (lowered.includes("perception") || lowered.includes("attitude")) {
    return "Survey or mixed methods could fit"
  }
  if (lowered.includes("impact") || lowered.includes("effect")) {
    return "Comparative, survey, or quasi-experimental design"
  }
  if (lowered.includes("implementation")) {
    return "Case study or mixed methods could fit"
  }

  return "Method should follow the exact research question"
}

function pickOutcome(title: string, terms: string[]) {
  const lowered = title.toLowerCase()

  if (lowered.includes("learning")) return "learning outcomes"
  if (lowered.includes("performance")) return "performance improvement"
  if (lowered.includes("satisfaction")) return "user satisfaction"
  if (lowered.includes("adoption")) return "adoption behavior"
  if (lowered.includes("perception")) return "user perception"
  if (lowered.includes("effectiveness")) return "effectiveness"

  return terms[3] ? toTitleCase(terms[3]).toLowerCase() : "the main outcome"
}

function buildMetricScores(title: string, terms: string[], context: string, verdict: TitleAnalysisVerdict) {
  const lowered = title.toLowerCase()
  const hasExplicitContext = context !== "Context is still broad"
  const hasCausalClaim = lowered.includes("impact") || lowered.includes("effect")
  const hasMethodCue =
    lowered.includes("survey") ||
    lowered.includes("case study") ||
    lowered.includes("qualitative") ||
    lowered.includes("quantitative") ||
    lowered.includes("mixed")

  const specificity = Math.min(94, 38 + terms.length * 8 + (hasExplicitContext ? 14 : 0) + (hasMethodCue ? 8 : 0))
  const feasibility = Math.max(42, 84 - (hasCausalClaim ? 16 : 0) - (title.length > 110 ? 10 : 0) + (hasExplicitContext ? 6 : 0))
  const literatureFit = Math.min(92, 56 + terms.length * 5 + (hasExplicitContext ? 7 : 0))
  const readiness =
    verdict === "Good to Continue" ? 82 : verdict === "Needs Refinement" ? 64 : 45

  return {
    specificity,
    feasibility,
    literatureFit,
    readiness,
  }
}

function scoreTone(value: number): TitleAnalysisMetric["tone"] {
  if (value >= 75) return "positive"
  if (value >= 55) return "neutral"
  return "warning"
}

function assessVerdict(title: string, terms: string[]): {
  verdict: TitleAnalysisVerdict
  reason: string
} {
  const lowered = title.toLowerCase()
  const isBroad =
    lowered.includes("impact of") ||
    lowered.includes("effect of") ||
    lowered.includes("role of") ||
    lowered.includes("artificial intelligence")
  const tooShort = terms.length < 4
  const tooLong = title.length > 110

  if (tooShort) {
    return {
      verdict: "Consider Pivoting",
      reason: "The title is still too generic to show a clear research position, variable, and context.",
    }
  }

  if (isBroad || tooLong) {
    return {
      verdict: "Needs Refinement",
      reason: "The topic is promising, but the title still feels broad and needs sharper research positioning.",
    }
  }

  return {
    verdict: "Good to Continue",
    reason: "The title already has a visible focus and can move forward with targeted literature checking.",
  }
}

function buildWeaknesses(verdict: TitleAnalysisVerdict, title: string) {
  const points = [
    "The current framing may still be too broad to produce a sharp and memorable study.",
    "The title does not yet show which outcome or research problem matters most.",
  ]

  if (title.toLowerCase().includes("impact") || title.toLowerCase().includes("effect")) {
    points.push("Cause-and-effect language may be too ambitious unless the method and data support it.")
  }

  if (verdict === "Consider Pivoting") {
    points.push("The current title is too generic, so the topic may need to be narrowed or re-framed before moving on.")
  }

  return points
}

function buildGaps(title: string) {
  const lowered = title.toLowerCase()
  const points = [
    "A narrower population or use case may still be underexplored.",
    "There may be room to compare outcomes, settings, or implementation strategies more clearly.",
  ]

  if (lowered.includes("higher education")) {
    points.push("Recent evidence may still be limited for specific departments, courses, or student profiles.")
  }

  return points
}

function buildNextSteps(verdict: TitleAnalysisVerdict) {
  const points = [
    "Narrow the title to one clearer outcome, context, or target group.",
    "Use the mapped keywords to check review papers and recent journal articles first.",
    "Test whether the title can be turned into one focused research question without forcing it.",
  ]

  if (verdict !== "Good to Continue") {
    points.unshift("Refine the wording before committing to a full literature search.")
  }

  return points
}

function buildKeywords(topic: string, context: string, terms: string[]) {
  const normalizedTerms = terms
    .filter((term, index, list) => list.indexOf(term) === index)
    .slice(0, 6)
    .map(toTitleCase)

  const contextKeyword = context === "Context is still broad" ? null : context
  return [topic, ...normalizedTerms, contextKeyword, "Research Gap", "Literature Review"]
    .filter(Boolean)
    .filter((item, index, list) => list.indexOf(item) === index) as string[]
}

function buildResearchQuestions(topic: string, context: string, outcome: string) {
  const contextPhrase = context === "Context is still broad" ? "the selected research context" : context.toLowerCase()

  return [
    `How is ${topic.toLowerCase()} currently understood in ${contextPhrase}?`,
    `What factors connect ${topic.toLowerCase()} with ${outcome} in ${contextPhrase}?`,
    `What gap remains in recent studies about ${topic.toLowerCase()} within ${contextPhrase}?`,
  ]
}

function buildSearchQueries(topic: string, context: string, outcome: string) {
  const contextPhrase = context === "Context is still broad" ? "" : ` ${context.toLowerCase()}`

  return [
    `"${topic}"${contextPhrase} systematic review`,
    `"${topic}" ${outcome} recent journal articles`,
    `"${topic}" research gap${contextPhrase}`,
  ].map((query) => query.replace(/\s+/g, " ").trim())
}

function buildScopeSuggestions(topic: string, context: string, method: string, outcome: string) {
  return [
    {
      label: "Focus",
      value: topic,
    },
    {
      label: "Context",
      value: context,
    },
    {
      label: "Outcome",
      value: toTitleCase(outcome),
    },
    {
      label: "Possible Method",
      value: method,
    },
  ]
}

function buildRefinedTitle(topic: string, context: string, outcome: string) {
  const contextPhrase = context === "Context is still broad" ? "a Specific Research Context" : context
  return `${topic} and ${toTitleCase(outcome)} in ${contextPhrase}: A Focused Research Mapping`
}

function buildKeyTakeaway(verdict: TitleAnalysisVerdict, topic: string, context: string) {
  if (verdict === "Good to Continue") {
    return `The title is workable. Keep ${topic.toLowerCase()} as the main anchor, then validate the gap with recent literature in ${context.toLowerCase()}.`
  }

  if (verdict === "Needs Refinement") {
    return `The idea is promising, but it needs a sharper scope before literature search. Start by narrowing the population, outcome, or context.`
  }

  return "The title still reads too generic. Rebuild it around one topic, one context, and one measurable outcome before moving deeper."
}

function shortenHistoryLabel(title: string) {
  const clean = title.replace(/\s+/g, " ").trim()
  if (clean.length <= 42) return `Title Analysis: ${clean}`
  return `Title Analysis: ${clean.slice(0, 39).trimEnd()}...`
}

export function buildTitleAnalysis(title: string): TitleAnalysisResult {
  const cleanTitle = title.replace(/\s+/g, " ").trim()
  const terms = extractCoreTerms(cleanTitle)
  const topic = pickTopic(terms)
  const variables = pickVariables(cleanTitle, terms)
  const context = pickContext(cleanTitle)
  const method = pickMethod(cleanTitle)
  const outcome = pickOutcome(cleanTitle, terms)
  const { verdict, reason } = assessVerdict(cleanTitle, terms)
  const scores = buildMetricScores(cleanTitle, terms, context, verdict)
  const gapValue =
    verdict === "Good to Continue"
      ? "There is room to sharpen the angle with more specific recent evidence"
      : "A narrower scope could reveal a stronger and more defendable research gap"
  const positioningValue =
    verdict === "Good to Continue"
      ? "Focused enough to continue with validation"
      : verdict === "Needs Refinement"
        ? "Relevant topic, but still too broad in its current framing"
        : "Too generic right now and likely needs a clearer pivot"

  return {
    title: cleanTitle,
    summary: `Scory reads this as a study about ${topic.toLowerCase()} with a focus on ${context.toLowerCase()}.`,
    verdict,
    verdictReason: reason,
    confidenceScore: Math.round((scores.specificity + scores.feasibility + scores.literatureFit + scores.readiness) / 4),
    refinedTitleSuggestion: buildRefinedTitle(topic, context, outcome),
    keyTakeaway: buildKeyTakeaway(verdict, topic, context),
    metrics: [
      {
        label: "Readiness",
        value: scores.readiness,
        helper: "How ready the title is to move into literature checking.",
        tone: scoreTone(scores.readiness),
      },
      {
        label: "Specificity",
        value: scores.specificity,
        helper: "How clearly the title shows focus, variables, and context.",
        tone: scoreTone(scores.specificity),
      },
      {
        label: "Feasibility",
        value: scores.feasibility,
        helper: "How realistic the claim looks for a student research workflow.",
        tone: scoreTone(scores.feasibility),
      },
      {
        label: "Literature Fit",
        value: scores.literatureFit,
        helper: "How searchable the topic looks for related papers.",
        tone: scoreTone(scores.literatureFit),
      },
    ],
    nodes: [
      { id: "topic", label: "Topic", value: topic, tone: "neutral", section: "about" },
      { id: "variables", label: "Variables", value: variables, tone: "neutral", section: "about" },
      { id: "context", label: "Context", value: context, tone: "neutral", section: "about" },
      { id: "method", label: "Method", value: method, tone: "positive", section: "nextSteps" },
      { id: "gap", label: "Gap", value: gapValue, tone: "positive", section: "gaps" },
      { id: "positioning", label: "Positioning", value: positioningValue, tone: "warning", section: "weaknesses" },
    ],
    keywords: buildKeywords(topic, context, terms),
    researchQuestions: buildResearchQuestions(topic, context, outcome),
    searchQueries: buildSearchQueries(topic, context, outcome),
    scopeSuggestions: buildScopeSuggestions(topic, context, method, outcome),
    sections: [
      {
        key: "about",
        title: "What This Title Is About",
        points: [
          `The title points to ${topic.toLowerCase()} as the central theme.`,
          `Its current scope suggests attention to ${context.toLowerCase()}.`,
          "This is a good starting point for mapping literature, but the exact research angle still needs to be made more explicit.",
        ],
      },
      {
        key: "weaknesses",
        title: "Weak Points",
        points: buildWeaknesses(verdict, cleanTitle),
      },
      {
        key: "gaps",
        title: "Possible Research Gap",
        points: buildGaps(cleanTitle),
      },
      {
        key: "nextSteps",
        title: "What You Should Do Next",
        points: buildNextSteps(verdict),
      },
    ],
    suggestedActions: ["Refine This Title", "Find Related Papers", "Explore Gaps", "Start Over"],
    historyLabel: shortenHistoryLabel(cleanTitle),
  }
}
