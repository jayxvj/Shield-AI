# FRONTEND PRODUCT REQUIREMENTS DOCUMENT (PRD)
**Product Name:** Shield-AI
**Focus:** Frontend Implementation for AI-Powered Cyber Threat Detection & Response

## 1. PRODUCT CONTEXT
*   **Product Overview:** Shield-AI is an intelligent cybersecurity frontend interface designed to visualize network traffic analysis, detect anomalies, classify attacks, and provide explainable AI insights with actionable recommendations.
*   **Problem Being Solved:** Traditional rule-based intrusion detection systems overwhelm security teams with false positives and lack transparency. Analysts need a single pane of glass to instantly understand if traffic is malicious, what type of attack it is, why the AI flagged it, and how to stop it.
*   **Target Users:** Tier 1 and Tier 2 Security Operations Center (SOC) Analysts.
*   **Core Product Functionality:** A real-time monitoring dashboard that visualizes normal vs. malicious activity, predicts attack types (DoS, Botnet, etc.), assigns risk scores, explains AI decisions visually, and recommends defensive actions.
*   **MVP Scope:** A fully responsive, static/mock-data-driven frontend dashboard that accurately demonstrates the six required outcomes (Detect, Classify, Score, Explain, Recommend, Visualize) using the specified visual architecture and color palette.

## 2. REFERENCE IMAGE ANALYSIS
**Reference 1: "WhatsApp Image 2026-09-12 at 5.04.36PM.jpeg" (Layout & Architecture)**
*   **OBSERVED:**
    *   Dark mode UI with a distinct left navigation sidebar.
    *   Top header with user profile and global search.
    *   Grid-based widget layout.
    *   Top row: Four KPI metric cards.
    *   Top right: A semi-circular gauge chart indicating overall Risk Score.
    *   Middle center: A time-series line chart (Threat Summary).
    *   Middle right: A donut chart categorizing data (Threats By Virus/Type).
    *   Bottom center: A detailed data table with columns and icons.
    *   Bottom right: A list of specific devices/endpoints with status indicators.
    *   Deep navy/charcoal background surface colors for cards.

**Reference 2: "WhatsApp Image 2026-09-12 at 5.04.35 PM.jpeg" (Color Palette)**
*   **OBSERVED:**
    *   A pastel, muted color palette consisting of 6 distinct hex codes: `#9EABA2`, `#BDD1C5`, `#EECC8C`, `#E8B298`, `#D3A29D`, `#A36361`.
*   **INFERRED (Integration Strategy):**
    *   The neon colors from the Layout image must be stripped out.
    *   The pastel palette will map directly to threat severity to create a sophisticated, modern, and less fatiguing dark-mode dashboard.

## 3. FRONTEND DESIGN SYSTEM
### Colors
*   **Background (App Shell):** `#0B0F19` (Estimated dark navy from Layout image)
*   **Surface/Cards:** `#1A1F2B` (Estimated slightly lighter navy from Layout image)
*   **Text (Primary):** `#FFFFFF` (White)
*   **Text (Muted):** `#9CA3AF` (Gray-400 for table headers and secondary labels)
*   **Severity - Critical/High Risk:** `#A36361` (Muted Red)
*   **Severity - Medium/Warning:** `#D3A29D` & `#E8B298` (Dusty Pink & Peach)
*   **Severity - Low/Safe/Normal:** `#9EABA2` & `#BDD1C5` (Sage & Mint Green)
*   **Accent/Interactive:** `#EECC8C` (Soft Yellow)
*   **Borders:** `rgba(255, 255, 255, 0.05)` (Subtle white transparency)

### Typography
*   **Font Family:** Inter or Roboto (Clean, modern sans-serif).
*   **Heading Hierarchy:**
    *   H1: 24px, Semi-Bold (Dashboard Title)
    *   H2: 18px, Medium (Card/Widget Titles)
    *   H3: 14px, Medium (Table Headers)
*   **Body Text:** 13px - 14px, Regular.
*   **Numbers/Scores:** 32px - 48px, Bold (For KPI cards and Risk Gauge).

### Components & Spacing
*   **Spacing System:** 8px base grid (8, 16, 24, 32). Grid gaps between cards should be 16px or 24px.
*   **Border Radius:** 12px for all primary widget cards, 8px for inner elements (buttons, badges).
*   **Shadows:** None or extremely subtle drop shadows; the design relies on flat surface color differences.
*   **Badges:** Pill-shaped, using the severity color as the background with 20% opacity, and the solid severity color for the text.

## 4. FRONTEND INFORMATION ARCHITECTURE
The MVP requires one primary screen containing modular widgets, plus an overlay for deep dives.

*   **Screen 1: Security Dashboard (Main)**
    *   *Route:* `/`
    *   *Purpose:* Single-pane view of network health, active threats, and classifications.
    *   *Components:* Sidebar, Header, KPI Row, Risk Gauge, Timeline Chart, Classification Donut, Threat Table, Targeted Assets List.
*   **Screen 2: Threat Explanation & Mitigation (Modal/Drawer)**
    *   *Route:* Overlays on `/` (e.g., `?threatId=123`)
    *   *Purpose:* Satisfies the "Explain" and "Recommend" requirements. Opens when a user clicks a row in the Threat Table.
    *   *Components:* SHAP Feature Waterfall chart, Attack Details, Mitigation Playbook button.

## 5. SCREEN-BY-SCREEN UI SPECIFICATION

### [SECURITY DASHBOARD]
**Route:** `/`
**Purpose:** Global view of network traffic, AI detections, classifications, and risk.
**Layout:**
*   **Sidebar (Fixed Left):** Logo (Shield-AI). Navigation items: Overview (Active), Network Logs, Threat Intelligence, Settings.
*   **Header (Fixed Top):** User Profile, Global Search, Notification Icon.
*   **Main Content (Scrollable Grid):**
    *   *Section 1 (Top):* 4 KPI Cards + 1 Risk Gauge Card.
    *   *Section 2 (Middle):* Threat Summary Line Chart (Spans 2/3 width) + Attack Classification Donut Chart (Spans 1/3 width).
    *   *Section 3 (Bottom):* Active Threat Details Table (Spans 2/3 width) + Targeted Devices List (Spans 1/3 width).

**Components & Data Mapping:**
*   **KPI Cards:** Total Packets, Anomalies Detected, High-Risk Alerts, Auto-Mitigated.
*   **Risk Score Gauge:** Semi-circle gauge. Uses `#9EABA2` (Low) to `#A36361` (High). Large centered text displaying current score (0-100).
*   **Threat Summary (Detect):** Multi-line chart showing "Normal" vs "Malicious" traffic over time.
*   **Threats By Class (Classify):** Donut chart showing DoS, Reconnaissance, Exploitation, etc. Colored using the pastel palette.
*   **Threat Details Table:** Columns: Timestamp, Source IP, Attack Type, Severity Badge, Confidence Score. 
*   **Interactive Row:** Hovering over a table row changes its background. Clicking opens the Explanation Modal.

### [EXPLANATION & MITIGATION MODAL]
**Route:** Overlay Triggered
**Purpose:** Explains *why* the AI flagged the event and provides the response action.
**Layout:** Right-aligned slide-out drawer or centered modal.
**Components:**
*   **Header:** Attack Type, Source IP, Timestamp.
*   **AI Explanation (Explain):** A horizontal bar chart mimicking SHAP values (e.g., "Feature: Flow Duration (+40%)", "Feature: Destination Port (+30%)"). Highlighted with `#EECC8C`.
*   **Recommendation Card (Recommend):** A distinct visual block detailing the automated playbook (e.g., "Block IP on Port 22").
*   **Primary Action:** Button -> "Apply Mitigation" (Color: `#A36361`).

## 6. USER FLOWS
**Flow: Triage and Mitigate**
1.  **Starting Point:** User views the Dashboard. Risk Gauge is High (`#A36361`).
2.  **User Action:** User scrolls to the Threat Details Table to see the latest High-severity entry.
3.  **UI Response:** User clicks the row. The UI darkens slightly and slides out the Explanation Modal.
4.  **User Action:** User reviews the SHAP explanation chart to verify the AI's logic, then reads the recommended action.
5.  **User Action:** User clicks "Apply Mitigation".
6.  **Success State:** Button changes to a loading spinner briefly, then shows a checkmark. Modal closes, and a success toast notification appears: "Mitigation Applied Successfully".

## 7. COMPONENT ARCHITECTURE
*   **Global Components:** `AppLayout`, `Sidebar`, `TopBar`.
*   **UI Primitives (Reusable):**
    *   `Card` (Base container with surface color and border radius).
    *   `SeverityBadge` (Accepts props: 'low', 'medium', 'high', colors dynamically).
    *   `ActionBtn` (Primary/Secondary variants).
    *   `DataTable` (Generic table component).
*   **Feature Components (Specific):**
    *   `RiskGaugeChart` (Implementation of the top-right widget).
    *   `TrafficTimelineChart` (Middle line chart).
    *   `ClassificationDonutChart` (Middle-right widget).
    *   `ExplainabilityChart` (SHAP visualization inside the modal).
    *   `ThreatPlaybookCard` (Recommendation UI inside the modal).

## 8. FRONTEND TECHNICAL ARCHITECTURE
*   **Framework:** React (Next.js App Router recommended for layout handling, though plain React is fine).
*   **Language:** TypeScript.
*   **Styling:** Tailwind CSS (Perfect for mapping the custom hex codes into `tailwind.config.js`).
*   **Charts:** Recharts or Chart.js (Both can easily implement line, donut, and gauge charts).
*   **Icons:** Lucide React (Clean, matches the reference image style).
*   **State Management:** React `useState` and `useContext` (sufficient for MVP mockup).
*   **Folder Structure:**
    *   `/components/ui` (Primitives)
    *   `/components/widgets` (Dashboard charts/tables)
    *   `/components/layout` (Sidebar, Header)
    *   `/mock-data` (JSON files representing the ML model outputs).

## 9. DATA / API BOUNDARY
The frontend requires the following mock data structures to simulate the backend AI engine:

*   **`NetworkLog`:** `{ id, timestamp, sourceIp, destIp, protocol, bytes }`
*   **`ThreatAlert`:** `{ alertId, timestamp, sourceIp, classification (e.g., 'DDoS'), severityScore (0-100), confidencePct, status }`
*   **`AIExplanation`:** `{ alertId, topFeatures: [{ name: 'flow_duration', impact: 0.8 }, { name: 'packet_size', impact: 0.4 }] }`
*   **`MitigationPlaybook`:** `{ classification, recommendedAction, commandToExecute }`

## 10. INTERACTIONS & UI BEHAVIOR
*   **Hover States:** Buttons lighten by 10%; table rows highlight slightly (`#1e2532`); chart data points show tooltips on hover.
*   **Modals:** Clicking outside the Explanation Modal closes it. Background blur is applied to the main dashboard.
*   **Notifications:** Transient toasts appear in the bottom right for system actions (e.g., "Rules updated").
*   **Loading:** When first mounting, charts should display a subtle pulsing skeleton state using the surface color.

## 11. RESPONSIVE DESIGN
*   **Desktop (1024px+):** Exact layout as "WhatsApp Image 2026-09-12 at 5.04.36PM.jpeg". Left sidebar, grid layout.
*   **Tablet (768px - 1023px):** Sidebar collapses to icons only. Grid shifts from 3 columns to 2 columns (e.g., Threat Summary takes full width, Donut chart drops below).
*   **Mobile (< 768px):** All components stack vertically into a single column. Sidebar moves to a top-header hamburger menu. Tables become horizontally scrollable.

## 12. ACCESSIBILITY
*   **Semantic HTML:** Use proper `<nav>`, `<main>`, `<section>`, and `<header>` tags.
*   **Contrast:** Ensure text against the `#1A1F2B` surface meets WCAG AA standards. The pastel colors on dark backgrounds must be checked; use pastel colors for borders/icons/badges, and keep primary text white.
*   **Screen Readers:** Add `aria-label` to all charts (e.g., `aria-label="Line chart showing normal vs malicious traffic"`).
*   **Focus:** All interactive elements (table rows, buttons) must have a visible `:focus-visible` outline.

## 13. FRONTEND STATES & EDGE CASES
*   **Empty State:** If no threats are detected, the Threat Table should display an illustration or text: "No active threats detected in the selected timeframe."
*   **Loading State:** Provide a skeleton loader for the Risk Gauge while mock data is "fetching."
*   **Long Text:** If a recommended action string is too long, it should wrap appropriately within the modal without breaking the container layout.

## 14. FUNCTIONAL FRONTEND REQUIREMENTS
*   **FR-FE-001:** The dashboard must render a risk gauge visualization that updates based on the aggregate `severityScore` of active alerts.
*   **FR-FE-002:** The dashboard must render a time-series chart clearly delineating `Normal` vs `Malicious` mock data.
*   **FR-FE-003:** The threat table must render dynamic severity badges mapped to the pastel color palette based on risk level.
*   **FR-FE-004:** Clicking a row in the threat table must successfully mount and display the Explanation Modal.
*   **FR-FE-005:** The Explanation Modal must visually render a chart or list of AI feature importances (SHAP values).

## 15. VISUAL FIDELITY REQUIREMENTS
*   The UI must closely replicate the widget placement, padding, and corner rounding of "WhatsApp Image 2026-09-12 at 5.04.36PM.jpeg".
*   The UI must strictly reject the neon purple/blue colors in the reference image and instead apply the custom pastel palette from "WhatsApp Image 2026-09-12 at 5.04.35 PM.jpeg".
*   The overall mood should be analytical, professional, and modern.

## 16. FRONTEND PERFORMANCE
*   Chart libraries (Recharts) must be responsive and not cause lag when resizing the browser window.
*   The data table should utilize pagination or virtual scrolling if rendering more than 50 rows of mock data.
*   Avoid unnecessary re-renders of the charts when the user interacts with the sidebar.

## 17. ACCEPTANCE CRITERIA
*   **AC-FE-001:** Given the user views the dashboard, when the page loads, then the Risk Gauge, Timeline, and Donut charts render within 2 seconds using mock data.
*   **AC-FE-002:** Given the user views the Threat Details table, when the data contains a High-risk threat, then the row displays a badge utilizing the `#A36361` hex color.
*   **AC-FE-003:** Given the user clicks a threat row, when the modal opens, then the modal displays an AI Explanation section and a Recommended Action section.

## 18. MVP FRONTEND SCOPE
*   **Must Have:** Main Dashboard layout, Theme mapping (Pastels + Dark Mode), Risk Gauge, Timeline Chart, Donut Chart, Threat Table, Threat Modal (Explanation & Playbook).
*   **Should Have:** Responsive behavior for tablet/mobile, hover effects, toast notifications.
*   **Nice to Have:** Real-time data simulation (using `setInterval` to add new rows dynamically).
*   **Future:** Actual backend integration, user login, settings configuration.

## 19. IMPLEMENTATION ORDER
1.  **Project Setup:** Init React/Next.js and install TailwindCSS & Recharts.
2.  **Design Tokens:** Configure `tailwind.config.js` with the dark background colors and the 6 pastel hex codes.
3.  **Global Layout:** Build the `Sidebar`, `Header`, and `AppLayout` wrapper.
4.  **Mock Data Creation:** Write the mock JSON payloads for alerts and explanations.
5.  **UI Primitives:** Build `Card`, `Badge`, and `Button` components.
6.  **Charts Integration:** Implement Recharts for the Gauge, Timeline, and Donut widgets.
7.  **Data Table:** Build the Threat Details table and map it to the mock data.
8.  **Modal Implementation:** Build the slide-out/modal for the SHAP explanations.
9.  **Refinement:** Apply responsive rules, polish spacing, and verify accessibility.

---

## 20. FINAL ANTIGRAVITY DIRECTIVE

**To the Gemini/Antigravity Implementation Agent:**
*   **Context:** Build the frontend for "Shield-AI", a cybersecurity threat detection dashboard. Use the problem statement and requirements detailed in this PRD.
*   **Visual Source of Truth:** Use the layout, grid, and widget structure from the provided reference image ("WhatsApp Image 2026-09-12 at 5.04.36PM.jpeg"). 
*   **Color Palette Override:** Do **NOT** use the neon colors from the layout image. You must use the 6 custom pastel hex codes provided in this PRD (`#9EABA2`, `#BDD1C5`, `#EECC8C`, `#E8B298`, `#D3A29D`, `#A36361`) applied against a dark theme.
*   **Execution:** Build the frontend incrementally. Start with the layout shell, move to UI primitives, integrate chart components (using mock data), and finalize with the interactive Threat Explanation modal. 
*   **Constraint:** Do not implement a backend, database, or actual ML logic. Rely entirely on mock data objects structured to fulfill the 6 expected outcomes (Detect, Classify, Score, Explain, Recommend, Visualize). Prioritize high visual fidelity, accurate component architecture, and responsive design.
