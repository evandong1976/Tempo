"use client"
import React, { useState } from "react";


// ─── Data ────────────────────────────────────────────────────────────────────

const milestones = [
  {
    id: 1,
    label: "Milestone 1",
    title: "Auth + Calendar Read",
    subtitle: "User Onboarding Foundation",
    duration: "Weeks 1–2",
    color: "#4F8EF7",
    goal: "User can sign in with Google, select calendars, and see today's timeline from real data.",
    tasks: [
      { section: "Google OAuth", items: ["Configure Google Cloud project & enable Calendar API", "OAuth consent screen + read-only scopes", "Sign-in flow in Next.js", "Securely store access + refresh tokens in Postgres", "Handle token refresh logic"] },
      { section: "Database Models", items: ["users table", "oauth_tokens table", "calendar_sources table", "user_preferences table"] },
      { section: "Calendar Selection UI", items: ["Fetch all user calendars via Google API", "Allow user to select which calendars to read", "Persist selection in database"] },
      { section: "Today Timeline View", items: ["Fetch events for current day", "Normalize event structure", "Display clean timeline UI", "Imported events labeled as Read-Only"] },
    ],
    dod: ["User can sign in", "User selects calendars", "Today's timeline renders correctly", "No write access used yet", "Tokens persist across sessions"],
  },
  {
    id: 2,
    label: "Milestone 2",
    title: "Dedicated Mobility Calendar",
    subtitle: "Write Isolation",
    duration: "Weeks 3–4",
    color: "#A78BFA",
    goal: "Create strict separation between imported events and planner-generated events.",
    tasks: [
      { section: "Planner Calendar Creation", items: ["On first run, create 'Mobility Calendar' in Google", "Store planner_calendar_id in Postgres", "If already exists, reuse it"] },
      { section: "Write Guardrails", items: ["All event creation uses planner_calendar_id only", "Never modify source calendars", "Prevent accidental updates to imported events"] },
      { section: "Event CRUD for Planner", items: ["Create event", "Update event", "Delete event", "Store Google event_id in Postgres"] },
      { section: "UI Separation", items: ["Imported events: grey badge / read-only indicator", "Planner events: editable, deletable", "Clear labeling in timeline"] },
    ],
    dod: ["New planner events appear only in Mobility Calendar", "Imported events remain untouched", "Deleting a planner event does not affect source calendars"],
  },
  {
    id: 3,
    label: "Milestone 3",
    title: "Travel + Buffer Block Generator",
    subtitle: "Core MVP",
    duration: "Weeks 5–6",
    color: "#34D399",
    goal: "Deliver first real value: automatic schedule enhancement for today.",
    tasks: [
      { section: "Rules Engine v1", items: ["Identify in-person events (manual toggle initially)", "Add configurable buffers: travel, prep, decompression", "Detect conflicts", "Skip generation if overlap impossible"] },
      { section: "Schedule Preview", items: ["Generate proposed plan", "Show visual preview before writing", "Allow confirm or cancel"] },
      { section: "Planner Event Creation", items: ["Write generated buffer/travel blocks into Mobility Calendar", "Store source_event_id to generated_event_ids mapping in Postgres"] },
      { section: "Regeneration Logic", items: ["Delete previously generated blocks for a given day", "Recompute cleanly", "Avoid duplicates"] },
    ],
    dod: ["User clicks 'Generate Today Plan'", "Travel + buffer blocks appear in planner calendar", "No duplicates on regeneration", "Conflicts handled gracefully"],
  },
  {
    id: 4,
    label: "Milestone 4",
    title: "Upload Processing Pipeline",
    subtitle: "Upload → S3 → Lambda → Textract → Postgres",
    duration: "Weeks 7–8",
    color: "#FB923C",
    goal: "Implement async document parsing pipeline.",
    tasks: [
      { section: "Upload System", items: ["Generate signed upload URL", "Upload files directly to S3", "Store upload metadata in Postgres", "Tables: uploads, textract_jobs, extracted_items"] },
      { section: "Lambda Trigger", items: ["S3 upload triggers Lambda", "Lambda starts Textract job", "Track job status", "Handle failure cases"] },
      { section: "Textract Integration", items: ["Extract text from documents", "Parse structured content", "Store results in extracted_items table"] },
      { section: "Processing UI", items: ["Status: Uploaded → Processing → Complete → Failed", "Display extracted text for review", "Log errors with CloudWatch"] },
    ],
    dod: ["Uploading a PDF triggers processing automatically", "Extracted data appears in database", "UI reflects status updates", "Errors are logged"],
  },
  {
    id: 5,
    label: "Milestone 5",
    title: "Assignment Confirmation + Scheduling",
    subtitle: "Extracted Text → Calendar Events",
    duration: "Weeks 9–10",
    color: "#F472B6",
    goal: "Turn extracted text into actionable calendar items.",
    tasks: [
      { section: "Candidate Detection", items: ["Identify likely assignments: due dates, titles, course names", "Heuristic parsing first", "LLM post-processing for deadline extraction (e.g. 'HW3 due Friday')"] },
      { section: "Human-in-the-Loop Review", items: ["Show detected assignments", "Allow edit: title, date/time, estimated duration", "Confirm before scheduling"] },
      { section: "Calendar Creation", items: ["Create due-date event in Mobility Calendar", "Optionally create work blocks before due date", "Store event mapping in Postgres"] },
      { section: "Provenance Tracking", items: ["Link upload_id to extracted_item_id", "Link extracted_item_id to calendar_event_id", "Full traceability in DB"] },
    ],
    dod: ["One upload can produce multiple confirmed assignments", "Confirmed items appear in planner calendar", "All links traceable in DB"],
  },
  {
    id: 6,
    label: "Milestone 6",
    title: "Reliability + Beta Readiness",
    subtitle: "Observability & Polish",
    duration: "Weeks 11–12",
    color: "#FBBF24",
    goal: "Make the system stable, secure, and demo-ready.",
    tasks: [
      { section: "Error Handling", items: ["OAuth failure recovery", "Expired token refresh", "Textract failure retry", "S3 upload errors surfaced to UI"] },
      { section: "Observability", items: ["Structured logging", "CloudWatch logs for Lambda", "Basic error alerts", "Track upload/generation success rates"] },
      { section: "Performance", items: ["Optimize today timeline query", "Indexes on user_id, event_date, upload_id", "Reduce redundant Google API calls"] },
      { section: "Security + UX Polish", items: ["Minimize OAuth scopes", "Verify IAM least-privilege", "Mobile-friendly layout", "Empty states handled", "Clear onboarding flow"] },
    ],
    dod: ["New user reaches first value in under 2 minutes", "No silent failures", "Logs provide traceability", "Stable for real beta users"],
  },
  {
    id: 7,
    label: "Milestone 7",
    title: "Steps Goal & Walking Nudges",
    subtitle: "10,000 Steps/Day, Baked Into Your Schedule",
    duration: "Weeks 13–14",
    color: "#22D3EE",
    goal: "Estimate walking steps from scheduled travel and nudge users to hit their daily 10,000-step goal.",
    tasks: [
      { section: "Step Estimation Engine", items: ["Use Directions API walking distance for each travel block", "Convert to steps (avg 1,300 steps/mile)", "Aggregate estimated steps across full day's schedule"] },
      { section: "Smart Nudges", items: ["Compare estimated steps to 10,000-step goal", "Suggest walking when transit + walking are comparable in time", "Example: 'Walk to Bobst — adds 1,800 steps, only 8 min longer'", "Trigger nudge when projected steps are below threshold"] },
      { section: "Progress UI", items: ["Daily step progress bar on timeline view", "Estimated vs goal visualization", "Weekly bar chart + personal bests", "Streak tracking stored in Postgres per user"] },
      { section: "Calendar Integration", items: ["Mark walking travel blocks differently in Mobility Calendar", "Show step contribution on travel block tooltip", "Weekly summary surfaced in app"] },
    ],
    dod: ["Day's scheduled travel produces a steps estimate", "Nudges appear when user is below goal", "Progress visible on timeline", "Weekly history persists in Postgres"],
  },
];

const features = [
  {
    icon: "🗺️",
    title: "Transportation Calculator",
    subtitle: "Google Maps-style departure planner",
    milestone: "Milestone 3",
    color: "#34D399",
    bg: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.25)",
    details: [
      { label: "Core idea", text: "Given two calendar events with locations, compute exactly when you need to leave to arrive on time — with multi-modal options side by side." },
      { label: "API", text: "Google Maps Directions API — fetch drive, transit, walk, and bike durations in parallel for the same trip." },
      { label: "UX", text: "Departure options: 'Leave at 2:05 by subway, 1:50 by walking.' Auto-insert a travel block into the Mobility Calendar on confirm." },
      { label: "Edge cases", text: "Events without locations prompt the user. Back-to-back meetings trigger a conflict warning. Regeneration deletes old blocks cleanly." },
    ],
    tech: ["Google Maps Directions API", "Next.js API Route", "Postgres (cache routes)", "Google Calendar write (Mobility Cal only)"],
  },
  {
    icon: "📋",
    title: "To-Do List Parser",
    subtitle: "Upload a photo, get calendar tasks",
    milestone: "Milestones 4 & 5",
    color: "#FB923C",
    bg: "rgba(251,146,60,0.08)",
    border: "rgba(251,146,60,0.25)",
    details: [
      { label: "Core idea", text: "User uploads a PNG (handwritten list, syllabus, whiteboard). System extracts tasks and presents them for human review before scheduling." },
      { label: "Pipeline", text: "PNG to S3, Lambda trigger, Amazon Textract DOCUMENT_TEXT_DETECTION, structured task list in Postgres, then review UI." },
      { label: "UX", text: "Review screen with checkboxes per task, editable text, date/time picker per item. One tap to push checked tasks into the Mobility Calendar." },
      { label: "Smart parsing", text: "Heuristic regex plus optional LLM post-processing to detect deadlines (e.g. 'HW3 due Friday') and auto-set due dates." },
    ],
    tech: ["AWS S3", "AWS Lambda", "Amazon Textract", "Postgres", "Google Calendar write"],
  },
  {
    icon: "👟",
    title: "Steps Goal & Nudges",
    subtitle: "10,000 steps/day, baked into your schedule",
    milestone: "Milestone 7",
    color: "#22D3EE",
    bg: "rgba(34,211,238,0.08)",
    border: "rgba(34,211,238,0.25)",
    details: [
      { label: "Core idea", text: "Estimate walking steps from today's travel blocks. Nudge the user to walk certain legs when they're falling short of their daily step goal." },
      { label: "Calculation", text: "Directions API walking distance converted to steps at ~1,300 steps/mile, aggregated across all travel blocks in the day." },
      { label: "Nudges", text: "'You're 2,400 steps short today — walk to Bobst Library instead of the shuttle (8 min longer, adds 1,800 steps).' Triggered when projected total is below threshold." },
      { label: "Gamification", text: "Daily progress bar, weekly bar chart, personal bests, and streaks — all stored per user in Postgres." },
    ],
    tech: ["Google Maps (walking distance)", "Postgres (step history)", "Next.js notifications", "Timeline UI integration"],
  },
];

const stack = [
  { layer: "Frontend", items: ["Next.js App Router (Vercel)", "React + Tailwind CSS", "NextAuth.js"], color: "#4F8EF7" },
  { layer: "Auth & Calendar", items: ["Google OAuth 2.0", "Google Calendar API v3", "Token refresh via Postgres"], color: "#A78BFA" },
  { layer: "Storage", items: ["AWS S3 (file uploads)", "PostgreSQL on RDS", "Vercel Edge Cache"], color: "#34D399" },
  { layer: "Processing", items: ["AWS Lambda (async)", "Amazon Textract (OCR)", "Google Maps Directions API"], color: "#FB923C" },
  { layer: "Infra & Deploy", items: ["Vercel (frontend + API routes)", "AWS IAM least-privilege", "GitHub Actions CI/CD"], color: "#FBBF24" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Process() {
  const [activeMilestone, setActiveMilestone] = useState<number | null>(null);
  const [activeFeature, setActiveFeature] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>("milestones");

  return (
    <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", background: "#0A0E1A", color: "#E2E8F0", minHeight: "100vh", overflowX: "hidden" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%)", borderBottom: "1px solid rgba(99,102,241,0.3)", padding: "44px 40px 36px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-60px", right: "8%", width: "280px", height: "280px", borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-80px", left: "4%", width: "200px", height: "200px", borderRadius: "50%", background: "radial-gradient(circle, rgba(34,211,238,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "12px" }}>
          <div style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)", borderRadius: "14px", width: "52px", height: "52px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", boxShadow: "0 0 24px rgba(99,102,241,0.4)", flexShrink: 0 }}>📅</div>
          <div>
            <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#6366F1", fontWeight: 700, textTransform: "uppercase" }}>NYU · Product Spec</div>
            <h1 style={{ margin: 0, fontSize: "30px", fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1.1 }}>Mobility Calendar</h1>
          </div>
        </div>

        <p style={{ margin: "0 0 0 68px", color: "#94A3B8", fontSize: "14px", maxWidth: "560px", lineHeight: 1.6 }}>
          A smart calendar connecting your schedule, commute, and wellness goals. 7 milestones, ~14 weeks, built on Next.js + Vercel + AWS.
        </p>

        <div style={{ display: "flex", gap: "8px", marginTop: "20px", flexWrap: "wrap" }}>
          {["Next.js", "Google OAuth", "Google Calendar API", "AWS Lambda", "Textract", "RDS Postgres", "Google Maps"].map(t => (
            <span key={t} style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "20px", padding: "3px 10px", fontSize: "11px", color: "#A5B4FC", fontWeight: 500 }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Nav Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(15,23,42,0.9)", position: "sticky", top: 0, zIndex: 10 }}>
        {[
          { id: "milestones", label: "📍 Milestones" },
          { id: "features", label: "✨ Features" },
          { id: "stack", label: "🏗️ Architecture" },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            padding: "14px 22px", background: "transparent", border: "none",
            borderBottom: activeTab === tab.id ? "2px solid #6366F1" : "2px solid transparent",
            color: activeTab === tab.id ? "#A5B4FC" : "#64748B",
            fontWeight: activeTab === tab.id ? 700 : 500,
            fontSize: "13px", cursor: "pointer", transition: "all 0.15s", letterSpacing: "0.3px",
          }}>{tab.label}</button>
        ))}
      </div>

      <div style={{ maxWidth: "1060px", margin: "0 auto", padding: "36px 24px 60px" }}>

        {/* MILESTONES TAB */}
        {activeTab === "milestones" && (
          <section>
            <SectionLabel>7-Milestone Roadmap</SectionLabel>
            <h2 style={{ fontSize: "22px", fontWeight: 800, margin: "4px 0 6px", letterSpacing: "-0.3px" }}>Build Order</h2>
            <p style={{ fontSize: "13px", color: "#64748B", marginBottom: "24px" }}>Click any milestone to expand tasks and definition of done.</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {milestones.map((m, i) => (
                <div key={i} onClick={() => setActiveMilestone(activeMilestone === i ? null : i)} style={{
                  background: activeMilestone === i ? "rgba(15,23,42,0.95)" : "rgba(15,23,42,0.5)",
                  border: `1px solid ${activeMilestone === i ? m.color + "55" : "rgba(255,255,255,0.07)"}`,
                  borderLeft: `4px solid ${m.color}`,
                  borderRadius: "14px", padding: "18px 20px", cursor: "pointer", transition: "all 0.2s",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                      <span style={{ background: m.color + "20", color: m.color, border: `1px solid ${m.color}40`, borderRadius: "6px", padding: "2px 9px", fontSize: "10px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", flexShrink: 0 }}>{m.label}</span>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: "15px", lineHeight: 1.2 }}>{m.title}</div>
                        <div style={{ fontSize: "12px", color: "#64748B", marginTop: "2px" }}>{m.subtitle}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0, marginLeft: "12px" }}>
                      <span style={{ fontSize: "11px", color: "#475569", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "6px", padding: "2px 8px" }}>{m.duration}</span>
                      <span style={{ color: m.color, fontSize: "20px", transition: "transform 0.2s", display: "inline-block", transform: activeMilestone === i ? "rotate(90deg)" : "rotate(0deg)" }}>›</span>
                    </div>
                  </div>

                  {activeMilestone !== i && (
                    <div style={{ marginTop: "8px", fontSize: "13px", color: "#475569" }}>{m.goal}</div>
                  )}

                  {activeMilestone === i && (
                    <div style={{ marginTop: "18px", paddingTop: "18px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                      <div style={{ marginBottom: "18px", background: m.color + "12", border: `1px solid ${m.color}25`, borderRadius: "10px", padding: "12px 14px" }}>
                        <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "2px", color: m.color, textTransform: "uppercase" }}>Goal · </span>
                        <span style={{ fontSize: "13px", color: "#CBD5E1" }}>{m.goal}</span>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "10px", marginBottom: "18px" }}>
                        {m.tasks.map((section, j) => (
                          <div key={j} style={{ background: "rgba(0,0,0,0.25)", borderRadius: "10px", padding: "12px 14px" }}>
                            <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", color: m.color, textTransform: "uppercase", marginBottom: "8px" }}>{section.section}</div>
                            {section.items.map((item, k) => (
                              <div key={k} style={{ fontSize: "12px", color: "#94A3B8", display: "flex", gap: "6px", alignItems: "flex-start", marginBottom: "4px", lineHeight: 1.5 }}>
                                <span style={{ color: m.color, marginTop: "4px", flexShrink: 0, fontSize: "7px" }}>◆</span>{item}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>

                      <div>
                        <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "2px", color: "#64748B", textTransform: "uppercase", marginBottom: "8px" }}>Definition of Done</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                          {m.dod.map((d, k) => (
                            <span key={k} style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: "20px", padding: "4px 12px", fontSize: "12px", color: "#6EE7B7", display: "flex", alignItems: "center", gap: "5px" }}>
                              <span style={{ fontSize: "9px" }}>✓</span>{d}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Timeline bar */}
            <div style={{ marginTop: "32px", background: "rgba(15,23,42,0.6)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "20px 24px" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "2px", color: "#64748B", textTransform: "uppercase", marginBottom: "14px" }}>14-Week Overview</div>
              <div style={{ display: "flex", gap: "3px", borderRadius: "8px", overflow: "hidden" }}>
                {milestones.map((m, i) => (
                  <div key={i} style={{ flex: 2, background: m.color + "25", borderTop: `3px solid ${m.color}`, padding: "8px 6px 6px", textAlign: "center", cursor: "pointer" }}
                    onClick={() => { setActiveMilestone(i); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                    <div style={{ fontSize: "12px", fontWeight: 800, color: m.color }}>{m.id}</div>
                    <div style={{ fontSize: "9px", color: "#64748B", marginTop: "2px", lineHeight: 1.3 }}>{m.duration}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: "3px", marginTop: "6px" }}>
                {milestones.map((m, i) => (
                  <div key={i} style={{ flex: 2, fontSize: "9px", color: "#475569", textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingInline: "2px" }}>{m.title}</div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FEATURES TAB */}
        {activeTab === "features" && (
          <section>
            <SectionLabel>Signature Features</SectionLabel>
            <h2 style={{ fontSize: "22px", fontWeight: 800, margin: "4px 0 6px", letterSpacing: "-0.3px" }}>Three Core Capabilities</h2>
            <p style={{ fontSize: "13px", color: "#64748B", marginBottom: "24px" }}>Beyond the calendar foundation — what makes this product distinctive.</p>

            <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
              {features.map((f, i) => (
                <button key={i} onClick={() => setActiveFeature(i)} style={{
                  padding: "8px 18px", borderRadius: "30px",
                  border: `1.5px solid ${activeFeature === i ? f.color : "rgba(255,255,255,0.1)"}`,
                  background: activeFeature === i ? f.bg : "transparent",
                  color: activeFeature === i ? f.color : "#94A3B8",
                  cursor: "pointer", fontWeight: 600, fontSize: "13px", transition: "all 0.2s",
                  display: "flex", alignItems: "center", gap: "6px",
                }}>
                  <span>{f.icon}</span>{f.title.split(" ").slice(0, 2).join(" ")}
                </button>
              ))}
            </div>

            {features.map((f, i) => i === activeFeature && (
              <div key={i} style={{ background: f.bg, border: `1px solid ${f.border}`, borderRadius: "20px", padding: "28px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "8px" }}>
                  <div style={{ fontSize: "36px", background: "rgba(0,0,0,0.3)", borderRadius: "14px", width: "60px", height: "60px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{f.icon}</div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "20px", fontWeight: 800, color: f.color }}>{f.title}</h3>
                    <p style={{ margin: "3px 0 0", color: "#94A3B8", fontSize: "13px" }}>{f.subtitle}</p>
                    <span style={{ display: "inline-block", marginTop: "6px", background: f.color + "20", border: `1px solid ${f.color}40`, borderRadius: "6px", padding: "2px 8px", fontSize: "10px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: f.color }}>{f.milestone}</span>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", margin: "20px 0" }}>
                  {f.details.map((d, j) => (
                    <div key={j} style={{ background: "rgba(0,0,0,0.25)", borderRadius: "12px", padding: "14px 16px", borderLeft: `3px solid ${f.color}` }}>
                      <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "2px", color: f.color, textTransform: "uppercase", marginBottom: "6px" }}>{d.label}</div>
                      <div style={{ fontSize: "13px", color: "#CBD5E1", lineHeight: 1.6 }}>{d.text}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "10px", color: "#64748B", letterSpacing: "1px", textTransform: "uppercase" }}>Tech:</span>
                  {f.tech.map(t => (
                    <span key={t} style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${f.border}`, borderRadius: "6px", padding: "3px 10px", fontSize: "12px", color: f.color, fontWeight: 500 }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}

            <div style={{ marginTop: "40px" }}>
              <SectionLabel>Data Flows</SectionLabel>
              <h3 style={{ fontSize: "18px", fontWeight: 800, margin: "4px 0 20px", letterSpacing: "-0.3px" }}>Key Pipelines</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px", background: "rgba(15,23,42,0.7)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: "18px", padding: "24px" }}>
                {[
                  { label: "Upload Pipeline", color: "#FB923C", steps: [{ icon: "📤", label: "User Upload", sub: "PNG/PDF" }, { icon: "🗄️", label: "AWS S3", sub: "Object store" }, { icon: "⚡", label: "Lambda", sub: "Trigger" }, { icon: "🔍", label: "Textract", sub: "OCR parse" }, { icon: "🐘", label: "Postgres", sub: "Store" }, { icon: "📅", label: "Calendar", sub: "Write" }] },
                  { label: "Auth & Calendar Sync", color: "#A78BFA", steps: [{ icon: "🔐", label: "Google OAuth", sub: "Sign in" }, { icon: "📆", label: "Calendar API", sub: "Read events" }, { icon: "🐘", label: "Postgres", sub: "Cache" }, { icon: "🗓️", label: "Timeline", sub: "Today view" }] },
                  { label: "Travel Calculator", color: "#34D399", steps: [{ icon: "📍", label: "Event Locs", sub: "From cal" }, { icon: "🗺️", label: "Maps API", sub: "Directions" }, { icon: "🧮", label: "Depart Calc", sub: "Buffer logic" }, { icon: "✅", label: "Travel Block", sub: "Write to cal" }] },
                  { label: "Steps Estimator", color: "#22D3EE", steps: [{ icon: "🚶", label: "Walk Legs", sub: "From travel" }, { icon: "📏", label: "Distance", sub: "Maps API" }, { icon: "👟", label: "Step Count", sub: "Convert" }, { icon: "🔔", label: "Nudge", sub: "If below goal" }] },
                ].map((flow, i) => (
                  <div key={i}>
                    <div style={{ fontSize: "10px", letterSpacing: "2px", color: flow.color, fontWeight: 700, textTransform: "uppercase", marginBottom: "10px" }}>{flow.label}</div>
                    <FlowRow steps={flow.steps} color={flow.color} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* STACK TAB */}
        {activeTab === "stack" && (
          <section>
            <SectionLabel>Infrastructure</SectionLabel>
            <h2 style={{ fontSize: "22px", fontWeight: 800, margin: "4px 0 6px", letterSpacing: "-0.3px" }}>Tech Stack</h2>
            <p style={{ fontSize: "13px", color: "#64748B", marginBottom: "24px" }}>Vercel for the frontend, AWS for async processing, Google APIs as the scheduling surface.</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginBottom: "40px" }}>
              {stack.map((s, i) => (
                <div key={i} style={{ background: "rgba(15,23,42,0.6)", border: `1px solid ${s.color}25`, borderTop: `3px solid ${s.color}`, borderRadius: "14px", padding: "18px" }}>
                  <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "2px", color: s.color, textTransform: "uppercase", marginBottom: "12px" }}>{s.layer}</div>
                  {s.items.map((item, j) => (
                    <div key={j} style={{ fontSize: "13px", color: "#CBD5E1", padding: "5px 0", borderBottom: j < s.items.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", display: "flex", alignItems: "center", gap: "7px" }}>
                      <span style={{ color: s.color, fontSize: "7px", flexShrink: 0 }}>▶</span>{item}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <SectionLabel>System Architecture</SectionLabel>
            <h3 style={{ fontSize: "18px", fontWeight: 800, margin: "4px 0 20px" }}>How It All Connects</h3>
            <div style={{ background: "rgba(15,23,42,0.7)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: "18px", padding: "28px" }}>
              <ArchRow label="User Layer" color="#4F8EF7" nodes={[{ name: "Browser / Mobile", desc: "Next.js App Router on Vercel" }]} />
              <ArchArrow />
              <ArchRow label="API Layer" color="#A78BFA" nodes={[{ name: "Next.js API Routes", desc: "Auth, calendar, upload endpoints" }, { name: "Google OAuth 2.0", desc: "Access + refresh tokens" }]} />
              <ArchArrow />
              <ArchRow label="Data Layer" color="#34D399" nodes={[{ name: "PostgreSQL (RDS)", desc: "Users, events, uploads, steps" }, { name: "AWS S3", desc: "File uploads (PDF, PNG)" }]} />
              <ArchArrow />
              <ArchRow label="Processing Layer" color="#FB923C" nodes={[{ name: "AWS Lambda", desc: "S3-triggered async processor" }, { name: "Amazon Textract", desc: "OCR + document intelligence" }]} />
              <ArchArrow />
              <ArchRow label="External APIs" color="#FBBF24" nodes={[{ name: "Google Calendar API", desc: "Read + write (Mobility Cal only)" }, { name: "Google Maps API", desc: "Directions + distances + steps" }]} />
            </div>

            <div style={{ marginTop: "40px" }}>
              <SectionLabel>UX</SectionLabel>
              <h3 style={{ fontSize: "18px", fontWeight: 800, margin: "4px 0 20px" }}>Product Principles</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {[
                  { icon: "👁️", title: "Visual separation", text: "Imported events in muted gray with a read-only badge. Mobility Calendar events colored and editable. Zero ambiguity between sources." },
                  { icon: "⚡", title: "First value fast", text: "Within 60 seconds of sign-in, users see today's timeline and at least one travel buffer suggestion." },
                  { icon: "🔒", title: "Write isolation", text: "All writes scoped exclusively to the dedicated Mobility Calendar. Source calendars are never modified." },
                  { icon: "📱", title: "Mobile-first", text: "Students check their phone between classes. Every core action reachable in 2 taps." },
                ].map((p, i) => (
                  <div key={i} style={{ background: "rgba(15,23,42,0.6)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "18px", display: "flex", gap: "12px" }}>
                    <span style={{ fontSize: "24px", flexShrink: 0 }}>{p.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "14px", marginBottom: "4px" }}>{p.title}</div>
                      <div style={{ fontSize: "13px", color: "#64748B", lineHeight: 1.6 }}>{p.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      <div style={{ textAlign: "center", padding: "20px 24px 32px", borderTop: "1px solid rgba(255,255,255,0.06)", color: "#334155", fontSize: "12px" }}>
        NYU Mobility Calendar · Product Spec · 7 Milestones · ~14 Weeks · Vercel + AWS
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#6366F1", fontWeight: 800, textTransform: "uppercase", marginBottom: "4px" }}>
      {children}
    </div>
  );
}

type FlowStep = { icon: string; label: string; sub: string };
function FlowRow({ steps, color }: { steps: FlowStep[]; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px", flexWrap: "wrap" }}>
      {steps.map((step, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <div style={{ background: color + "15", border: `1px solid ${color}30`, borderRadius: "10px", padding: "8px 10px", textAlign: "center", minWidth: "72px" }}>
            <div style={{ fontSize: "17px", marginBottom: "2px" }}>{step.icon}</div>
            <div style={{ fontSize: "10px", fontWeight: 700, color }}>{step.label}</div>
            <div style={{ fontSize: "9px", color: "#64748B" }}>{step.sub}</div>
          </div>
          {i < steps.length - 1 && <span style={{ color, fontSize: "14px", flexShrink: 0 }}>→</span>}
        </div>
      ))}
    </div>
  );
}

type ArchNode = { name: string; desc: string };
function ArchRow({ label, color, nodes }: { label: string; color: string; nodes: ArchNode[] }) {
  return (
    <div style={{ marginBottom: "4px" }}>
      <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "2px", color, textTransform: "uppercase", marginBottom: "6px" }}>{label}</div>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {nodes.map((n, i) => (
          <div key={i} style={{ background: color + "10", border: `1px solid ${color}25`, borderRadius: "10px", padding: "10px 16px", flex: 1, minWidth: "160px" }}>
            <div style={{ fontWeight: 700, fontSize: "13px", color }}>{n.name}</div>
            <div style={{ fontSize: "11px", color: "#64748B", marginTop: "2px" }}>{n.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ArchArrow() {
  return <div style={{ textAlign: "center", color: "#334155", fontSize: "20px", margin: "4px 0" }}>↕</div>;
}
