document.addEventListener("DOMContentLoaded", () => {
    const summarizeBtn = document.querySelector("#summarize-btn");
    const clearBtn = document.querySelector("#clear-btn");
    const copyBtn = document.querySelector("#copy-btn");
    const contentDiv = document.querySelector("#summary-output");
    const selectionType = document.querySelector("#selection-type");
    const titleEl = document.querySelector("#page-title");
    const timeEl = document.querySelector("#reading-time");

summarizeBtn.addEventListener("click", () => {
    contentDiv.innerHTML = `<div class="loading"></div>`;
    timeEl.textContent = "";

    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        const currentUrl = tab.url;
        const currentType = selectionType.value;
        const cacheKey = `${currentUrl}_${currentType}`; // Unique key per page + summary type

        // Checking to see if we already have this summary in local storage
        chrome.storage.local.get([cacheKey], (result) => {
            if (result[cacheKey]) {
                // UI Update: Let the user know this is a cached version
                contentDiv.textContent = result[cacheKey].summary;
                titleEl.textContent = result[cacheKey].title;
                timeEl.textContent = `Estimated Reading Time: ${result[cacheKey].readingTime} min (Cached)`;
                return;
            }

            // If we don't have the summary cache, proceed to talk to content.js
            chrome.tabs.sendMessage(tab.id, { type: "GET_ARTICLES" }, (pageData) => {
                if (chrome.runtime.lastError || !pageData) {
                    contentDiv.textContent = "Error: Could not read page content.";
                    return;
                }

                titleEl.textContent = pageData.title;
                timeEl.textContent = `Estimated Reading Time: ${pageData.readingTime} min`;

                // Let's request summary from background.js
                chrome.runtime.sendMessage({
                    type: "FETCH_SUMMARY",
                    text: pageData.text,
                    selectionType: currentType
                }, (response) => {
                    if (response.error) {
                        contentDiv.textContent = "API Error: " + response.error;
                    } else {
                        contentDiv.textContent = response.summary;

                        //we can finally SAVE to cache for next time
                        chrome.storage.local.set({
                            [cacheKey]: {
                                summary: response.summary,
                                title: pageData.title,
                                readingTime: pageData.readingTime
                            }
                        });
                    }
                });
            });
        });
    });
});

// Clear and Copy button functionality
    clearBtn.addEventListener("click", () => {
        contentDiv.textContent = "Select a summary type and click 'Summarize'";
        titleEl.textContent = "Article Summarizer";
        timeEl.textContent = "";
    });

    copyBtn.addEventListener("click", () => {
        const text = contentDiv.textContent;
        navigator.clipboard.writeText(text).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = "Copied!";
            setTimeout(() => copyBtn.textContent = originalText, 1500);
        });
    });
});