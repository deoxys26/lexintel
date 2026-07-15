const SECTION_PATTERNS = [
  ["summary", /^(?:\d+[.)]\s*)?(?:\*\*)?short summary(?:\*\*)?:?$/i],
  [
    "importantPoints",
    /^(?:\d+[.)]\s*)?(?:\*\*)?important points(?: found)?(?:\*\*)?:?$/i,
  ],
  [
    "risks",
    /^(?:\d+[.)]\s*)?(?:\*\*)?risks?(?: or concerns)?(?:\*\*)?:?$/i,
  ],
  [
    "recommendations",
    /^(?:\d+[.)]\s*)?(?:\*\*)?recommendations?(?:\*\*)?:?$/i,
  ],
  [
    "sources",
    /^(?:\d+[.)]\s*)?(?:\*\*)?sources? used(?:\*\*)?:?$/i,
  ],
];

const stripListMarker = (value = "") =>
  value
    .replace(/^[-*•]\s+/, "")
    .replace(/^\d+[.)]\s+/, "")
    .replace(/^\*\*(.*?)\*\*$/, "$1")
    .trim();

export const parseAnalysisSections = (analysis = "") => {
  const sections = {
    summary: [],
    importantPoints: [],
    risks: [],
    recommendations: [],
    sources: [],
  };

  if (!analysis.trim()) return sections;

  let activeSection = "summary";

  analysis.split(/\r?\n/).forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line) return;

    const matchedSection = SECTION_PATTERNS.find(([, pattern]) =>
      pattern.test(line),
    );

    if (matchedSection) {
      activeSection = matchedSection[0];
      return;
    }

    const cleaned = stripListMarker(line);
    if (cleaned) sections[activeSection].push(cleaned);
  });

  return sections;
};

export const getSectionText = (lines = []) => lines.join(" ").trim();

export const getRiskSeverity = (text = "") => {
  const normalized = text.toLowerCase();

  if (/\bcritical\b/.test(normalized)) return "Critical";
  if (/\bhigh(?:[-\s]risk)?\b/.test(normalized)) return "High";
  if (/\blow(?:[-\s]risk)?\b/.test(normalized)) return "Low";
  if (/\bmedium\b|\bmoderate\b/.test(normalized)) return "Medium";

  return "Medium";
};

export const buildRiskFindings = (analysisHistory = []) =>
  analysisHistory.flatMap((entry) =>
    (entry.sections?.risks || []).map((risk, index) => {
      const source = entry.sources?.[index] || entry.sources?.[0] || null;

      return {
        id: `${entry.id}-risk-${index}`,
        title: risk,
        severity: getRiskSeverity(risk),
        clause: "AI-identified concern",
        document: source?.filename || entry.documentName || "Indexed document",
        page: source?.page ?? "—",
        status: "Needs Review",
        source,
        query: entry.query,
        analysis: entry.analysis,
        recommendations: entry.sections?.recommendations || [],
        createdAt: entry.createdAt,
      };
    }),
  );

export const uniquePages = (sources = []) =>
  [...new Set(sources.map((source) => source.page).filter(Boolean))];
