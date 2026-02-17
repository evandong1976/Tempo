# NYU "Tempo" – Project Phases & Milestones

Architecture:
- Next.js (App Router) on Vercel
- Google OAuth + Google Calendar API
- Postgres (RDS preferred)
- AWS S3 (uploads)
- AWS Lambda (async processing)
- Amazon Textract (document parsing)

Core UX Principles:
- Clear separation between source calendars and planner calendar
- First user value: today’s timeline + travel/buffer generation

---

# Milestone 1 – Authentication + Calendar Read (User Onboarding Foundation)

## Goal
User can sign in with Google, select calendars, and see today’s timeline from real data.

## What Must Be Built

### 1. Google OAuth Integration
- Configure Google Cloud project
- Enable Calendar API
- Set up OAuth consent screen
- Request minimal scopes (calendar read-only initially)
- Implement sign-in flow in Next.js
- Securely store access + refresh tokens in Postgres
- Handle token refresh logic

### 2. Database Models
Create tables for:
- users
- oauth_tokens
- calendar_sources (selected calendars)
- user_preferences

### 3. Calendar Selection UI
- Fetch all user calendars via Google API
- Allow user to select which calendars to read
- Persist selection in database

### 4. Today Timeline View
- Fetch events for current day
- Normalize event structure
- Display clean timeline UI
- Imported events labeled clearly as “Read-Only”

## Definition of Done
- User can sign in
- User selects calendars
- Today’s timeline renders correctly
- No write access is used yet
- Tokens persist across sessions

---

# Milestone 2 – Dedicated "Tempo" + Write Isolation

## Goal
Create strict separation between imported events and planner-generated events.

## What Must Be Built

### 1. Planner Calendar Creation
- On first run, create a new Google calendar named “"Tempo"”
- Store planner_calendar_id in Postgres
- If already exists, reuse it

### 2. Write Guardrails
- All event creation uses planner_calendar_id only
- Never modify source calendars
- Prevent accidental updates to imported events

### 3. Event CRUD for Planner
- Create event
- Update event
- Delete event
- Store Google event_id in Postgres

### 4. UI Separation
- Imported events: grey badge or read-only indicator
- Planner events: editable, deletable
- Clear labeling in timeline

## Definition of Done
- New planner events appear only in "Tempo"
- Imported events remain untouched
- Deleting a planner event does not affect source calendars

---

# Milestone 3 – Core MVP: Travel + Buffer Block Generator

## Goal
Deliver first real value: automatic schedule enhancement for today.

## What Must Be Built

### 1. Rules Engine v1
- Identify in-person events (manual toggle initially)
- Add configurable buffers:
  - Travel time
  - Prep time
  - Decompression time
- Detect conflicts
- Skip generation if overlap impossible

### 2. Schedule Preview
- Generate a proposed plan
- Show visual preview before writing
- Allow confirm or cancel

### 3. Planner Event Creation
- Write generated buffer/travel blocks into "Tempo"
- Store mapping in Postgres:
  - source_event_id
  - generated_event_ids

### 4. Regeneration Logic
- Delete previously generated blocks for a given day
- Recompute cleanly
- Avoid duplicates

## Definition of Done
- User clicks “Generate Today Plan”
- Travel + buffer blocks appear in planner calendar
- No duplicates on regeneration
- Conflicts handled gracefully

---

# Milestone 4 – Upload Processing Pipeline

## Goal
Implement async document parsing pipeline:
Upload → S3 → Lambda → Textract → Postgres

## What Must Be Built

### 1. Upload System
- Generate signed upload URL
- Upload files directly to S3
- Store upload metadata in Postgres

Tables:
- uploads
- textract_jobs
- extracted_items

### 2. Lambda Trigger
- S3 upload triggers Lambda
- Lambda starts Textract job
- Track job status
- Handle failure cases

### 3. Textract Integration
- Extract text
- Parse structured content
- Store results in extracted_items table

### 4. Processing UI
- Show upload status:
  - Uploaded
  - Processing
  - Complete
  - Failed
- Display extracted text for review

## Definition of Done
- Uploading a PDF triggers processing automatically
- Extracted data appears in database
- UI reflects status updates
- Errors are logged

---

# Milestone 5 – Assignment Confirmation + Scheduling

## Goal
Turn extracted text into actionable calendar items.

## What Must Be Built

### 1. Candidate Detection
- Identify likely assignments:
  - Due dates
  - Titles
  - Course names
- Use heuristic parsing first

### 2. Human-in-the-Loop Review
- Show detected assignments
- Allow user to:
  - Edit title
  - Edit date/time
  - Set estimated duration
- Confirm before scheduling

### 3. Calendar Creation
- Create due-date event in "Tempo"
- Optionally create work blocks before due date
- Store event mapping in Postgres

### 4. Provenance Tracking
Link:
- upload_id
- extracted_item_id
- calendar_event_id

## Definition of Done
- One upload can produce multiple confirmed assignments
- Confirmed items appear in planner calendar
- All links traceable in DB

---

# Milestone 6 – Reliability, Observability, and Beta Readiness

## Goal
Make the system stable, secure, and demo-ready.

## What Must Be Built

### 1. Error Handling
- OAuth failure recovery
- Expired token refresh
- Textract failure retry
- S3 upload errors surfaced to UI

### 2. Observability
- Structured logging
- CloudWatch logs for Lambda
- Basic error alerts
- Track:
  - Upload success rate
  - Generation success rate
  - API failures

### 3. Performance Optimization
- Optimize today timeline query
- Add indexes on:
  - user_id
  - event_date
  - upload_id
- Reduce redundant Google API calls

### 4. Security Review
- Minimize OAuth scopes
- Ensure write isolation
- Protect secrets
- Verify IAM policies least-privilege

### 5. UX Polish
- Mobile-friendly layout
- Clear onboarding flow
- Clear separation between imported vs planner events
- Empty states handled

## Definition of Done
- New user reaches first value in under 2 minutes
- No silent failures
- Logs provide traceability
- Stable enough for real beta users

---

# Final Outcome

At completion of all 6 milestones:

- Users sign in with Google
- Read existing calendars safely
- Generate travel + buffer blocks
- Upload syllabi or PDFs
- Extract assignments automatically
- Confirm and schedule them into a dedicated "Tempo"
- System runs asynchronously and reliably on Vercel + AWS

This creates a clean separation of concerns:
- Vercel: frontend + API routes
- Postgres: system of record
- S3: file storage
- Lambda: background processing
- Textract: document intelligence
- Google Calendar: external scheduling surface