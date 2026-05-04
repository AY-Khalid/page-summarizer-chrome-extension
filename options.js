document.addEventListener("DOMContentLoaded", () => {
    // Load existing API key
    chrome.storage.sync.get(["geminiApiKey"], (result) => {
        if (result.geminiApiKey) {
            apiKeyInput.value = result.geminiApiKey;
        }
    });
});

    const apiKeyInput = document.getElementById("api-key");
    const saveBtn = document.getElementById("save-button");
    const successMessage = document.getElementById("success-message");

    saveBtn.addEventListener("click", () => {
        const apiKey = apiKeyInput.value.trim();
        if (apiKey) {
            chrome.storage.sync.set({ geminiApiKey: apiKey }, () => {
                successMessage.textContent = "API key saved successfully!";
                setTimeout(() => window.close(), 1000);
            });
        } else {
            successMessage.textContent = "Please enter a valid API key.";
            setTimeout(() => window.close(), 1000);
        }
        
    });

