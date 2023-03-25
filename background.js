chrome.tabs.onUpdated.addListener(async (tabId, state, tab) => {
  if (chrome.runtime.lastError) {
    sendResponse({ message: "fail" });
    return;
  }
  if (state.status === "complete" && /^http/.test(tab.url)) {
    try {
      
      await chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ["./foreground.js"],
      });

      const response = await chrome.tabs.sendMessage(tabId, {
        message: 'hi foreground',
        payload: tab.url,
      });
      console.log(response);
      
    } catch (err) {
      console.warn(err);
    }
  }
  return true;
});


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'ping'){
    sendResponse({
      message: new Date(),
    });
  }
})


//long-lived connections
chrome.runtime.onConnect.addListener(function (port) {
  // console.log(port);
  port.onMessage.addListener(function (message) {
    console.log(message);
    if (message.message === "[using connect] hi background") {
      console.log(message.message)
      port.postMessage({
        message: "[using connect] hi foreground",
      });
    }
  });
});

//alternative endless service worker using runtime.connect
// let someport;
// async function letsstayconnected(){
//   someport = chrome.runtime.connect({
//     name: 'myEndlessPort',
//   });
//   someport.onDisconnect.addListener(letsstayconnected);

// }
// letsstayconnected();