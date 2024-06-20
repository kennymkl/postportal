chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "postPortal",
    title: "PostPortal: Find Forum Suggestions",
    contexts: ["selection"]
  });
  console.log('Context menu created'); // Debug log
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "postPortal") {
    const selectedText = info.selectionText;
    console.log('Selected text:', selectedText); // Debug log

    chrome.storage.local.set({ selectedText }, () => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      });
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'createNotification') {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: './icon.png',
      title: 'PostPortal',
      message: 'Suggestions are ready. Click the extension icon to view them.'
    });
  }
});
