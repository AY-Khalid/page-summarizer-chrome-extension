document.addEventListener("DOMContentLoaded", () => {
    const summarizeBtn = document.querySelector("#summarize-btn");
    const clearBtn = document.querySelector("#clear-btn");
    const copyBtn = document.querySelector("#copy-btn");
    const contentDiv = document.querySelector("#summary-output");
    const selectionType = document.querySelector("#selection-type");
    const titleEl = document.querySelector("#page-title");
    const timeEl = document.querySelector("#reading-time");


    const themeToggle = document.querySelector("#theme-toggle");


// Load saved theme
chrome.storage.sync.get(["theme"], (result) => {
    if (result.theme === "dark") {
        document.body.classList.add("dark-mode");
    }
});

themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-mode");
    
    themeToggle.innerHTML = isDark 
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 512 512"><path d="M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391.4 112l98.9 20.3c5.3 1.1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L439.8 244l60.8 86.9c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391.4 376l-20.3 98.9c-1.1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L259.4 424.4l-86.9 60.8c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L127.4 376l-98.9-20.3c-5.3-1.1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L79.4 244l-60.8-86.9c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L127.4 112l20.3-98.9c1.1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L259.4 62.8l86.9-60.8c4.5-3.1 10.2-3.7 15.2-1.6zM259.4 128C188.7 128 131.4 185.3 131.4 256s57.3 128 128 128s128-57.3 128-128s-57.3-128-128-128z"/></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 512 512"><path d="M223.5 32C100 32 0 132 0 255.5S100 479 223.5 479c60.6 0 115.5-24.2 155.8-63.4 5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6-96.9 0-175.5-78.8-175.5-176 0-65.8 36-123.1 89.3-153.3 6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"/></svg>`;

    chrome.storage.sync.set({ theme: isDark ? "dark" : "light" });
});


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