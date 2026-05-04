chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(["geminiApiKey"], (result) => {
    if (!result.geminiApiKey) {
      chrome.runtime.openOptionsPage();
    }
  });
});


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "FETCH_SUMMARY") {
    // We use an async IIFE because onMessage listeners must return true for async responses
    (async () => {
      try {
        const { geminiApiKey } = await chrome.storage.sync.get("geminiApiKey");
        if (!geminiApiKey) {
          sendResponse({ error: "API Key missing. Please check options." });
          return;
        }

        const summary = await getGeminiSummary(request.text, request.selectionType, geminiApiKey);
        sendResponse({ summary });
      } catch (error) {
        sendResponse({ error: error.message });
      }
    })();
    return true; 
  }
});

async function getGeminiSummary(text, type, apiKey) {
  const promptMapping = {
    "brief": `Briefly summarize this text. Provide only the summary: \n\n ${text}`,
    "detailed": `Provide a detailed summary of this text: \n\n ${text}`,
    "bullet": `Summarize the following in 3-7 bullet points. Use '•' for bullets. Do not use asterisks (*). No intro text: \n\n ${text}`,
  };

  const prompt = promptMapping[type] || promptMapping["brief"];
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message);
  }

  let result = data.candidates[0].content.parts[0].text;
  
  return result.replace(/\*\*/g, "").replace(/^\*\s/gm, "• ");
}