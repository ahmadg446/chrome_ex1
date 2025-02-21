document.getElementById('extractButton').addEventListener('click', async () => {
    // Get the active tab
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    // Execute a script in the context of the active page to extract its text
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => document.body.innerText
    }, (results) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        return;
      }
      let pageText = results[0].result;
  
      // Create a Blob from the text and generate a URL
      let blob = new Blob([pageText], { type: 'text/plain' });
      let url = URL.createObjectURL(blob);
  
      // Trigger the download of the file
      let title = tab.title.replace(/[\\\/:*?"<>|]/g, '');
      chrome.downloads.download({
        url: url,
        filename: title + '.txt',
        saveAs: true
      });
    });
  });
  