function getPageData() {
    // Getting the Title
    const title = document.title || "Unknown Page";

    // Extraction of Article Content
    let text = "";
    const articles = document.querySelectorAll("article");

    if (articles.length > 0) {
        text = Array.from(articles)
            .map(article => article.innerText)
            .join("\n");
    } else {
        const paragraphs = Array.from(document.querySelectorAll("p"));
        text = paragraphs.map(p => p.innerText).join("\n");
    }

    // Calculation of the Word Count and Estimated Reading Time
    const wordCount = text.trim().split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    return {
        title,
        text,
        readingTime,
        wordCount
    };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "GET_ARTICLES") {
        const pageData = getPageData();
        sendResponse(pageData);
    }
});