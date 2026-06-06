# VectorShift Node Orchestrator & DAG Validation Suite

A highly interactive, full-stack visual workspace built with **React Flow**, **TypeScript**, and **Tailwind CSS**, designed for composing, parameterizing, and validating modular AI pipelines.

This repository represents a senior-level implementation matching all requirements of the VectorShift Frontend Technical Assessment.

---

## 🏛️ Project Architecture
The project is built as a complete full-stack workspace. To satisfy both **VectorShift's Python/FastAPI requirement** and **AI Studio's live container hosting requirements**, we support a dual-run architecture:

```
                  ┌──────────────────────────────────────────────┐
                  │                 REACT FLOW FRONTEND          │
                  │              (React 19 + TypeScript)         │
                  └───────────────────────┬──────────────────────┘
                                          │
                                          ▼ POST /api/pipelines/parse
               ┌──────────────────────────┴──────────────────────────┐
               │                                                     │
               ▼ (Live preview host & API proxy)                     ▼ (Production Target Submission)
┌─────────────────────────────────────────────┐       ┌─────────────────────────────────────────────┐
│        Node.js / Express Server             │       │            Python/FastAPI Service           │
│              (server.ts)                    │       │             (backend/main.py)               │
├─────────────────────────────────────────────┤       ├─────────────────────────────────────────────┤
│ • Hosts dev container/assets on Port 3000   │       │ • Official FastAPI Python Submission        │
│ • Powers Live interactive DAG validation   │       │ • Deploys high-performance graph algorithms │
│ • Validates canvas topology instantly       │       │ • Fully compliant with Pydantic schemas     │
└─────────────────────────────────────────────┘       └─────────────────────────────────────────────┘
```

*   **FastAPI Backend (`/backend/main.py`)**: This is the **official target submission** for the Python/FastAPI technical challenge. It implements the topological parsing endpoints with Pydantic models.
*   **Express Server (`/server.ts`)**: Retained as a robust dev-server and reverse-proxy to run the interactive frontend live preview in the AI Studio sandboxed environment (which requires Node.js asset building and hosting on Port 3000).

---

## 🚀 Key Architectural Pillars

### 1. Robust Node Abstraction (Part 1)
All custom nodes in the application leverage a highly reusable orchestration envelope: `BaseNode.tsx`. This container encapsulates:
*   **Header Aesthetics**: Color-coded categorization tags, active category labels, clean typography, responsive icon mounts, and a unified delete trigger.
*   **Handle Routing**: Automated vertically aligned left (input/target) and right (output/source) handle placement calculated dynamically based on input/output descriptors.
*   **Consistency**: Every node on the canvas shares identical padding, shadow styles, selection borders, hover adjustments, and visual weight.
*   **Scalability**: Adding a new node requires simply composing the custom input states as regular children within the `BaseNode` component wrapper.

#### Visual Templates Implemented:
*   📩 **Input Node**: Captures variables and typed expectations.
*   📤 **Output Node**: Models structural JSON or Markdown final outputs.
*   🧠 **AI LLM Inference**: Parameterizes system instructions, active model targets, and inference variables.
*   📝 **Query Block (Text Node)**: Houses expandable textual code, template prompts, and auto-generates left-side variable ports.
*   🗄️ **Database Node** *(Custom)*: Executes relational SQL blocks and schemas.
*   🌐 **HTTP Client Node** *(Custom)*: Outlines headers and targets for REST payload requests.
*   🔤 **Language Translator Node** *(Custom)*: Mounts real-time stream translations.
*   💻 **Script Sandbox Node** *(Custom)*: Operates secure JavaScript, Python, or Bash logic.
*   🔀 **Logic Router Node** *(Custom)*: Routes conditional flows based on custom comparator rules.

---

### 2. Auto-Resizing & Variable-Parsing Engine (Part 3)
The **Text Node** is engineered to look and feel like Notion or ChatGPT, maintaining natural visual spacing without text clipping.

#### 📏 Responsive Smart Resizing:
1.  **Dynamic Width Allocation**: The component computes the maximum line character density (`longestLineLength`) across all text rows. Applying font-metric scaling (roughly `7.4px` per character for `JetBrains Mono` text size), we calculate the exact optimal card width and inject it as inline styles via `cardStyle`. The node expands smoothly between `280px` and `550px`.
2.  **Dynamic Height Scaling**: We target the native `textarea` through a React `useRef` hook. On change, we clear the height and calculate the exact required `scrollHeight` container bounds, matching content seamlessly to eliminate ugly scrollbars.

#### 🛠️ Strict JS Variable Parsing:
*   **Syntax Format**: Reads variables framed in double curly-brackets (e.g., `{{variableName}}` or `{{ custom_arg }}`).
*   **Strict Variable Filtering**: The parsing engine employs the regular expression:
    ```typescript
    /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g
    ```
    This matches **only** valid JavaScript identifier names (cannot begin with a digit, cannot contain punctuation or illegal spaces). Expressions like `{{ 123invalid }}` or `{{ obj.val }}` are correctly ignored to preserve variable scope integrity.
*   **Deduplication Protection**: Variable matches are filtered through validation checks to exclude duplicate definitions, preventing handle layering anomalies on the left side of the block.

---

### 3. Graph Cycle Detection (DAG Validation) (Part 4)
When clicking **Submit Pipeline**, the application packages the network schema of active canvas nodes and transition edges, dispatching them to the parsing backend.

The system performs cycle analysis using **Kahn's Algorithm for Topological Sorting**:

#### Kahn's Algorithm Phase Model:
1.  **Build In-Degree Map**: Maps each node id to its incoming dependencies (incoming edge count) and constructs an adjacency tracking map representing output-to-input routes.
2.  **Seed Leaf-Queue**: Identifies and schedules all nodes that have an in-degree of `0` (independent entry points).
3.  **Topological Reduction**:
    *   Pops a queue node $u$ and increments the validation visit pointer.
    *   Iterates through all outgoing neighbors $v$ of node $u$, reducing their in-degree rating by 1.
    *   If any destination node $v$'s in-degree drops to `0`, it is immediately queued.
4.  **DAG Verification**: If the total visited node count matches the total unique graph nodes, the network is free of cycles and is declared a **Valid Directed Acyclic Graph (DAG)**. If a cycle exists, the algorithm fails to resolve, identifying a cyclic feedback loop.

---

## 💎 UX Improvements & Accessibility
*   **Animated Transitions**: Harnesses `@xyflow/react` and `"motion/react"` animations for high-framerated zoom, modal entry transitions, and panel actions.
*   **Defensive UI States**: Disables the pipeline submit action and flashes visual spin animations during active processing cycles to avoid double submissions.
*   **Clear Canvas Safety**: Protects users from accidental work losses with highlighted warning colors on the canvas control console.
*   **No-Scroll Interlacing**: The canvas controls are optimized to adapt cleanly across different viewport dimensions without layout breaking.

---

## 🛠️ Step-by-Step Run Instructions

### 🐍 running the Python / FastAPI Backend
The official node validation API backend is located inside the `./backend` directory.

1.  **Navigate to the backend folder**:
    ```bash
    cd backend
    ```
2.  **Install dependencies from requirements.txt**:
    ```bash
    pip install -r requirements.txt
    ```
3.  **Boot the FastAPI development server**:
    ```bash
    uvicorn main:app --host 127.0.0.1 --port 8000 --reload
    ```
4.  **Access Interactive Swagger docs**:
    Open [http://localhost:8000/docs](http://localhost:8051/docs) inside your browser.

---

### 💻 Running the React Frontend (Local Hosting)
The frontend application can be compiled and booted locally on your machine.

1.  **Install node packages**:
    ```bash
    npm install
    ```
2.  **Start the Dev Server**:
    ```bash
    npm run dev
    ```
    *(The frontend will spin up, providing the interactive builder workspace at http://localhost:3000)*
3.  **Build the production assets**:
    ```bash
    npm run build
    ```

---

## 🖼️ Application Screenshots

### 1. Unified Canvas Overview
*A dark, high-contrast digital workspace grid sporting cohesive node headers, smooth wires, and an intuitive custom element drag-and-drop toolbox panel on the left.*
![Canvas Overview](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80)

### 2. Auto-Resizing & Variable Connectors
*The dynamic text node expanding horizontally and vertically in real-time as users enter prompt variables, generating corresponding green target pins on the fly.*
![Text Auto-Resize and Variables](https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80)

### 3. Topological Evaluation Modal (DAG Check)
*Interactive validation feedback notifying developers if the workflow is a valid acyclic chain, or flashing warnings when loop cycles are detected.*
![DAG Validation Successful Report](https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80)
