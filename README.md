# Note: The installation process of the install has changed, users are no longer directed to a page to input their API keys

# Gemini Web Summarizer

A high-performance Chrome Extension built on Manifest V3 that utilizes the Gemini 2.5 Flash Lite model to provide intelligent webpage summaries. This project is engineered for zero-configuration usage, leveraging a secure proxy architecture to manage API communication and protect sensitive credentials.

---

## Core Features

*   Summarization Logic: Offers three specific modes (Brief, Detailed, and Bulleted) to process webpage content.
*   Automated Metadata Extraction: Captures page titles and calculates estimated reading times using an asynchronous content script.
*   Local Caching System: Implements a caching layer via chrome.storage.local to map summaries to specific URLs, minimizing redundant API requests and optimizing performance.
*   Persistent Theming: Features a custom Light and Dark mode toggle with state persistence across browser sessions.
*   Manifest V3 Compliance: Architected using background service workers for secure communication, ensuring no remotely hosted code is executed.

---

## Installation and Setup

1.  Download or clone the project repository to your local directory.
2.  Navigate to `chrome://extensions/` in the Google Chrome browser.
3.  Activate **Developer Mode** via the toggle in the upper-right corner.
4.  Select **"Load unpacked"** and choose the project root folder.
5.  **Ready to Use:** No API key configuration is required. The extension is pre-configured to work "out of the box" via a secure backend proxy.

---

## Usage Instructions

1.  Open any text-heavy webpage or article.
2.  Launch the extension from the Chrome toolbar.
3.  Select the desired summary depth from the configuration menu.
4.  Click the **Summarize** action button.
5.  The summary will be generated and cached instantly. Use the copy function for clipboard export or the theme toggle for visual adjustment.

---

## Technical Requirements Implementation

| Requirement | Technical Approach |
| :--- | :--- |
| Manifest V3 Standards | Utilizes service workers (background.js) and declarative permissions to meet modern security and performance benchmarks. |
| Zero-Config Usage | Implemented a secure Node.js proxy hosted on Vercel, allowing the grader to use the extension without providing a personal API key. |
| Secure API Management | API keys are stored as encrypted Environment Variables on the server-side, ensuring credentials are never exposed in the client-side code or public repositories. |
| Data Caching | Uses chrome.storage.local to store JSON objects indexed by a combined URL and summary-type key for instant retrieval. |
| DOM Extraction | Employs a content script (content.js) to parse the document body and filter relevant text nodes while calculating word counts. |
| Security and CSP | Adheres to strict Content Security Policy by utilizing inline SVGs and local modular JavaScript, preventing XSS and third-party injections. |

---

## Architecture and Technology

*   **Extension Frontend:** HTML5, CSS3 (Custom Properties), and Vanilla JavaScript (ES6).
*   **Extension Backend:** Chrome Extensions API (Scripting, Storage, Tabs, Runtime).
*   **Server-Side Proxy:** Node.js (deployed on Vercel) acting as a secure gateway to the Gemini API.
*   **AI Integration:** Google Generative AI (Gemini 2.5 Flash Lite).

---

## Security and Privacy Policy

*   **Credential Protection:** To comply with security best practices, the Gemini API key is managed server-side. It is never hardcoded in the extension files or stored in the browser's local storage.
*   **Data Minimization:** The extension only processes text from the active tab upon an explicit user request. No background monitoring or unauthorized data collection is performed.
*   **Architecture Integrity:** By routing requests through a dedicated proxy, the extension maintains a clean security profile, avoiding the need for users to manage sensitive API tokens.

---

**HNG Internship Stage 4A task.**
