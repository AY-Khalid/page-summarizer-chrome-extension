# Gemini Web Summarizer

A high-performance Chrome Extension built on Manifest V3 that utilizes the Gemini 2.5 Flash Lite model to provide intelligent webpage summaries. This project emphasizes security, local state persistence, and efficient API management.

---

## Core Features

*   Summarization Logic: Offers three specific modes (Brief, Detailed, and Bulleted) to process webpage content.
*   Automated Metadata Extraction: Captures page titles and calculates estimated reading times using an asynchronous content script.
*   Local Caching System: Implements a caching layer via chrome.storage.local to map summaries to specific URLs, minimizing redundant API requests and optimizing quota usage.
*   Persistent Theming: Features a custom Light and Dark mode toggle with state persistence across browser sessions.
*   Manifest V3 Compliance: Architected using background service workers for secure API communication, ensuring no remotely hosted code is executed.

---

## Installation and Setup

1.  Download or clone the project repository to your local directory.
2.  Navigate to chrome://extensions/ in the Google Chrome browser.
3.  Activate Developer Mode via the toggle in the upper-right corner.
4.  Select "Load unpacked" and choose the project root folder.
5.  Configure the API Key:
    *   Generate a key at the Google AI Studio console.
    *   Right-click the extension icon and select Options.
    *   Input your API key and save to enable the summarization features.

---

## Usage Instructions

1.  Open any text-heavy webpage or article.
2.  Launch the extension from the Chrome toolbar.
3.  Select the desired summary depth from the configuration menu.
4.  Click the Summarize action button.
5.  The summary will be generated and cached instantly. Use the copy function for clipboard export or the theme toggle for visual adjustment.

---

## Technical Requirements Implementation

| Requirement | Technical Approach |
| :--- | :--- |
| Manifest V3 Standards | Utilizes service workers (background.js) and declarative permissions to meet modern security and performance benchmarks. |
| Gemini API Integration | Implements the Gemini 2.5 Flash Lite endpoint for low-latency processing and optimized token management. |
| Data Caching | Uses chrome.storage.local to store JSON objects indexed by a combined URL and summary-type key. |
| DOM Extraction | Employs a content script (content.js) to parse the document body and filter relevant text nodes while calculating word counts. |
| Interface Design | Developed with a responsive CSS layout, custom loading states, and robust error handling for API failures. |
| Security and CSP | Adheres to strict Content Security Policy by replacing external scripts with local inline SVGs and modular JavaScript files. |
| Options Management | Provides a secure options.html interface for sensitive data (API Key) handling using chrome.storage.sync. |

---

## Architecture and Technology

*   Frontend: HTML5, CSS3 (Custom Properties), and Vanilla JavaScript (ES6).
*   Backend: Chrome Extensions API (Scripting, Storage, Tabs, Runtime).
*   AI Integration: Google Generative AI (Gemini 2.5 Flash Lite).
*   Assets: Optimized inline SVG graphics for CSP compliance and performance.

---

## Security and Privacy Policy

*   API Key Protection: Keys are stored exclusively within the browser's internal storage and are never transmitted to external servers other than Google’s API endpoint.
*   Data Handling: The extension only processes text from the active tab upon user request. No background monitoring or data collection is performed.
*   Code Integrity: All logic is bundled locally. By avoiding external CDNs or remote scripts, the extension remains protected against cross-site scripting (XSS) and third-party injections.

---

**HNG Internship Stage 4A task.**