console.log("Email Writer Extension - Content Script Loaded");

function createAIButton() {
    const button = document.createElement("button");
    button.className = "T-I J-J5-Ji aoO v7 T-I-atl L3 ai-reply-button";
    button.style.marginRight = "8px";
    button.innerText = "AI Reply";
    button.type = "button";
    button.setAttribute("data-tooltip", "Generate AI Reply");
    return button;
}

function getEmailContent() {
    const selectors = [
        ".h7",
        ".a3s.ail",
        ".gmail_quote",
        '[role="presentation"]'
    ];

    for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
            return element.innerText.trim();
        }
    }

    return "";
}

function findComposeToolbar() {
    const selectors = [
        ".btC",
        ".aDh",
        '[role="toolbar"]',
        ".gU.Up"
    ];

    for (const selector of selectors) {
        const toolbar = document.querySelector(selector);
        if (toolbar) {
            return toolbar;
        }
    }

    return null;
}

function findComposeBox() {
    return document.querySelector('[role="textbox"][g_editable="true"]');
}

async function generateAIReply(button) {
    try {
        button.innerText = "Generating...";
        button.disabled = true;

        const emailContent = getEmailContent();

        const response = await fetch("http://localhost:8081/api/email/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                emailContent: emailContent,
                tone: "professional"
            })
        });

        if (!response.ok) {
            throw new Error("Failed to generate reply");
        }

        const generatedReply = await response.text();
        const composeBox = findComposeBox();

        if (composeBox) {
            composeBox.focus();
            document.execCommand("insertText", false, generatedReply);
        } else {
            alert("Compose box not found.");
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Failed to generate AI reply.");
    } finally {
        button.innerText = "AI Reply";
        button.disabled = false;
    }
}

function injectButton() {
    const toolbar = findComposeToolbar();

    if (!toolbar) {
        return;
    }

    if (toolbar.querySelector(".ai-reply-button")) {
        return;
    }

    const button = createAIButton();

    button.addEventListener("click", () => {
        generateAIReply(button);
    });

    toolbar.insertBefore(button, toolbar.firstChild);
}

const observer = new MutationObserver(() => {
    setTimeout(injectButton, 500);
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});