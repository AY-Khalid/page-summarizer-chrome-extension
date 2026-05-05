const PROXY_URL = "https://proxy-api-delta-one.vercel.app/api/summarizer";

// Clean up: We no longer need to open the options page on install
chrome.runtime.onInstalled.addListener(() => {
  console.log("Gemini Summarizer Installed and Proxy Ready.");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "FETCH_SUMMARY") {
    (async () => {
      try {
        // We call our Proxy instead of Google
        const summary = await fetchFromProxy(request.text, request.selectionType);
        sendResponse({ summary });
      } catch (error) {
        sendResponse({ error: error.message });
      }
    })();
    return true; 
  }
});

async function fetchFromProxy(text, type) {
  const promptMapping = {
    "brief": `Briefly summarize this text. Provide only the summary: \n\n ${text}`,
    "detailed": `Provide a detailed summary of this text: \n\n ${text}`,
    "bullet": `Summarize the following in 3-7 bullet points. Use '•' for bullets. Do not use asterisks (*). No intro text: \n\n ${text}`,
  };

  const prompt = promptMapping[type] || promptMapping["brief"];

  const response = await fetch(PROXY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: prompt }) // Sending the prompt to your Vercel server
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Proxy Error");
  }

  const data = await response.json();
  
  // Assuming your Vercel proxy returns the text directly or the Gemini JSON structure
  let result = data.candidates ? data.candidates[0].content.parts[0].text : data.text;
  
  return result.replace(/\*\*/g, "").replace(/^\*\s/gm, "• ");
}