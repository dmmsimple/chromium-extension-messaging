//simple messaging
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  mylogger(request.payload).then(sendResponse({
    message: '[simple messaging] hi background',
  }));
  return true;

})

async function mylogger(data){
  console.log(data);
}


chrome.runtime.sendMessage({
  message: "[simple messaging] hi background 2",
});


//long lived conncections
const port = chrome.runtime.connect({
  name: "myportname",
});

port.postMessage({
  message: "[using conncect] hi background",
});

port.onMessage.addListener(function (message) {
  console.log(message);
});






//everything is done
ping();

async function ping(){
  await chrome.runtime.sendMessage({
    message: 'ping',
  }, response => {
    setTimeout(ping, 2000);
  })
}

