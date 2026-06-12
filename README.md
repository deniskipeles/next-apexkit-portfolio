# Green Terminal Portfolio 🖥️💚

Welcome to the **Green Terminal Portfolio**, a high-performance neobrutalist developer portal, system workspace simulator, and real-time backend platform integrator custom-built for **Denis Kipeles (Full-Stack Systems Engineer & Architecht)**.

This portfolio is seamlessly integrated with the `@apexkit/sdk` to pull dynamic page layouts, repositories, technical skill profiles, and live-updated system tickers from a hosted **ApexKit Backend**.

---

## 🚀 Architectural Configuration & API Setup

The application is fully wired to integrate with the remote ApexKit instance:
- **Target Backend URL**: `https://kipeles-vs--5000.hf.space`
- **Tenant Context ID**: `portfolio`

All data-fetching functions in the client components feature robust **fault-tolerant fallback engines**. If the endpoint is unconfigured or a connection times out, the system will smoothly fall back to locally compiled static datasets to preserve uninterrupted professional delivery.

---

## 🗃️ Database Collection Schemas for Admin UI

To enable full-stack dynamic state, create the following **five collections** in your ApexKit Admin Panel (`https://kipeles-vs--5000.hf.space` portal under the `portfolio` tenant namespace).

Specify the exact field names and types listed below:

### 1. `projects` Collection
Stores the list of key systems, Web3, and frontend repositories.
*   **Collection Name:** `projects`
*   **Field Specifications:**
    *   `title` (Type: `Text`, Required): The exact repository slug (e.g., `swalang`, `apexkit`, `swalang-beta`).
    *   `category` (Type: `Text` / `Select`, Required): Selection constraint representing the code category. Must be one of: `systems`, `frontend`, `web3`, or `tooling`.
    *   `description` (Type: `Text` / `LongText`, Required): High-fidelity description outlining interpreter, service, or compiler architecture.
    *   `tech` (Type: `Array of Strings` or `Text` / Comma-separated): Technology stack keywords (e.g., `Zig, C, Interpreter`).
    *   `githubUrl` / `github_url` (Type: `URL` or `Text`, Required): Absolute URL pointing to github repository.
    *   `demoUrl` / `demo_url` (Type: `URL` or `Text`, Optional): Live deploy URL (e.g., `https://swalang.vercel.app`, `https://apexkit-hub.vercel.app`).

### 2. `skills` Collection
Organizes modular language proficiencies, infrastructure segments, and frontend skill cards.
*   **Collection Name:** `skills`
*   **Field Specifications:**
    *   `category` (Type: `Text` / `Select`, Required): Must be one of: `languages`, `backend`, `frontend`, or `infrastructure`.
    *   `title` (Type: `Text`, Required): Heading title shown above the skills card (e.g., `LANGUAGES`, `BACKEND ENGINES`).
    *   `skills` (Type: `Array of Strings` or `Text` / Comma-separated): Individual competence keywords (e.g., `Go, C, Redis, JWT, WebSockets`).
    *   `colorClass` / `color_class` (Type: `Text`, Optional): Style variable class (e.g., `bg-[#32ff84]` for languages, `bg-teal-300` for backend).

### 3. `about` Collection
Injects configurable biography details into the About Page viewport.
*   **Collection Name:** `about`
*   **Field Specifications:**
    *   `headline` (Type: `Text` / `LongText`, Required): Large prominent display headline detailing your expertise summary.
    *   `description` (Type: `Text` / `LongText`, Required): In-depth professional bio and architectural philosophy summary.
    *   `highlights` (Type: `JSON` or `Array of Objects` or `Text`): Array of custom highlighted blocks. Each block must have:
        *   `text` (Type: `Text`): Text label representing skill achievement.
        *   `color` (Type: `Text`): Theme color accent (e.g., `#32ff84`, `teal-300`, `yellow-300`, `sky-300`).

### 4. `home_hero` Collection
Powers variable copy elements on the main landing page.
*   **Collection Name:** `home_hero`
*   **Field Specifications:**
    *   `title` (Type: `Text` / `LongText`, Required): Prominent uppercase display headline.
    *   `subheading` (Type: `Text` / `LongText`, Required): Detailed paragraph description outlining core SDK wrappers and compilers.

### 5. `home_ticker` Collection
Populates the real-time active system node simulator banner on the main page.
*   **Collection Name:** `home_ticker`
*   **Field Specifications:**
    *   `key` (Type: `Text`, Required): Uppercase node tag slug (e.g., `SWALANG-ZIG`, `APEXKIT-RUST`).
    *   `module` (Type: `Text`, Required): Orchestration category label (e.g., `V2 Compiler`, `BaaS Realtime`).
    *   `load` (Type: `Number` / Float, Required): Simulated processor workload state percent.
    *   `latency` (Type: `Text`, Required): Sub-millisecond cycle timing metrics (e.g., `1ms`, `3ms`).
    *   `status` (Type: `Text`, Required): Status quality level. One of: `optimal`, `warning`, `critical`.

---

## 🛠️ Tech Stack & Scripts

The applet is powered by **Next.js 15+ App Router**, **React 19**, and **Tailwind CSS**.

### CLI Tasks
*   **Development Server**: `npm run dev`
*   **Compiler Build**: `npm run build`
*   **Linter Checks**: `npm run lint`
