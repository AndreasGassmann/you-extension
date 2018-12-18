// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

var socket = io.connect('http://localhost:3000/');

socket.on('signResponse', data => {
  alert('got data!');

  var div = document.createElement('div');
  div.style.position = 'fixed';
  div.style.top = 0;
  div.style.right = 0;
  div.textContent = 'Injected!';
  document.body.appendChild(div);
});

chrome.browserAction.onClicked.addListener(function(tab) {
  alert('asdf');
  socket.send('hi');
});

//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  chrome.pageAction.show(sender.tab.id);
  sendResponse();
});
