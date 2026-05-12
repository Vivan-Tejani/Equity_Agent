# Frontend Specification

This document describes the purpose, data, layout, and interactions for each page and component in the frontend.

## App Shell

- Layout and routing live in [src/App.jsx](src/App.jsx)
- Desktop layout
  - Left sidebar navigation
  - Top bar with section labels and static company pills
  - Main content area with routed pages
- Mobile layout
  - Fixed bottom tab bar with icon tabs

### Top Bar

- Labels: "equity-research / indian-it"
- Static company pills: TCS, INFY, WIPRO, HCL, TM
- No interactivity (display only)

### Navigation

- Desktop sidebar: [src/components/Sidebar.jsx](src/components/Sidebar.jsx)
  - Links: Q&A, Scorecard, Guidance Tracker, Comparison
  - Badge on Q&A: "RAG"
  - Footer status: "Backend connected" and version string
- Mobile bottom tabs (from App shell)
  - Tabs: Q&A, Scorecard, Guidance, Comparison
  - Icon-only buttons with labels

## Pages

### Q&A Page

- File: [src/pages/QAPage.jsx](src/pages/QAPage.jsx)
- Purpose: conversational Q&A over the RAG corpus with sources and explainability
- Data source: POST /ask with { question, company }
- Page regions
  - Header: "Natural Language Q&A" + title "Ask the corpus"
  - Empty state: example question list
  - Message thread: user and assistant bubbles
  - Input bar (pinned bottom): company filter + textarea + send button

#### User Interactions

- Example question button
  - Action: fills textarea and focuses input
- Company selector pills
  - Action: sets company filter (All, TCS, Infosys, Wipro, HCLTech, TechMahindra)
- Send button
  - Action: submits question
  - Disabled when loading or empty
- Keyboard
  - Enter: submit
  - Shift+Enter: newline

#### Assistant Response Blocks

- Answer section
- Sources section (scrollable row of cards)
- Explainability panel (collapsible)

### Scorecard Page

- File: [src/pages/ScorecardPage.jsx](src/pages/ScorecardPage.jsx)
- Purpose: single-company financial metrics and overall score
- Data source: GET /scorecard/{company}
- Page regions
  - Header: "Financial Scorecard" + subtitle
  - Company selector pills
  - Company strip: company label + financial score
  - 2x2 metric grid
  - Score bar with strength label and ticks

#### Metrics Displayed

- Revenue Growth (percent)
- Net Profit Margin (percent)
- Return on Equity (percent)
- Debt / Equity (x)
- Overall Financial Score (0-100)

#### User Interactions

- Company selector pills
  - Action: fetch scorecard for selected company

### Guidance Page

- File: [src/pages/GuidancePage.jsx](src/pages/GuidancePage.jsx)
- Purpose: show management promises vs actual delivery
- Data source: GET /guidance/{company}
- Page regions
  - Header: "Management Guidance Tracker" + subtitle
  - Company selector pills
  - Two-column layout
    - "What Was Promised"
    - "What Was Delivered"

#### Card Content

- Quote text (truncated with show more / show less)
- Citation footer: company badge, doc type, year, page number

#### User Interactions

- Company selector pills
  - Action: fetch guidance for selected company
- Show more / show less button on long quotes

### Comparison Page

- File: [src/pages/ComparisonPage.jsx](src/pages/ComparisonPage.jsx)
- Purpose: cross-company comparison table with best-in-class marking
- Data source: GET /comparison
- Page regions
  - Header: "Cross-Company Comparison" + subtitle
  - Table with columns
  - Legend for performance colors and best-in-class

#### Table Columns

- Company
- Revenue Growth (%)
- Net Margin (%)
- ROE (%)
- D / E (x)
- Score

#### User Interactions

- None (read-only table)

## Components

### Sidebar

- File: [src/components/Sidebar.jsx](src/components/Sidebar.jsx)
- Displays app identity, navigation, and backend status

### Source Card

- File: [src/components/SourceCard.jsx](src/components/SourceCard.jsx)
- Displays citation metadata for retrieved sources
- Fields: company, doc type, year, page number

### Explainability Panel

- File: [src/components/ExplainPanel.jsx](src/components/ExplainPanel.jsx)
- Collapsible details on how answers are generated
- Sections
  - Confidence badge
  - Average similarity score
  - Source contributions bar + legend
  - Top retrieved chunks list (with show more / show less)

### Error Banner

- File: [src/components/ErrorBanner.jsx](src/components/ErrorBanner.jsx)
- Shows error text with optional Retry button

### Skeleton Card

- File: [src/components/SkeletonCard.jsx](src/components/SkeletonCard.jsx)
- Loading placeholder block

### Unused (Available, not currently wired)

- Question form: [src/components/QuestionForm.jsx](src/components/QuestionForm.jsx)
- Answer block: [src/components/AnswerBlock.jsx](src/components/AnswerBlock.jsx)

## Styles and Design Tokens

- Global styles and tokens: [src/index.css](src/index.css)
  - Dark theme with amber accent
  - IBM Plex Sans + IBM Plex Mono
  - Buttons, badges, form controls, skeletons, fade-in animation
- Legacy template styles (likely unused): [src/App.css](src/App.css)
