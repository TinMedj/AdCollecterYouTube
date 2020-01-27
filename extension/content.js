
const hosts = ["www.youtube.com"];
const urls = ["/get_midroll_info?", "/watch?v="];

let opts = {}

chrome.extension.sendMessage({
  "msgType": "getOptions",
}, (resp) => {
    if(resp && resp.msgType == "setOptions"){
      console.log("asdf", resp);
      opts["show_data_on_page"] = resp.show_data_on_page;
      overrideXhr(opts)
    }
  }
);

const overrideXhr = (opts) => {
  var variables_s = document.createElement('script');
  variables_s.textContent = `window._show_data_on_page = ${opts.show_data_on_page}; window._paths_to_save =["${urls.join("\", \"")}"];`;
  (document.head || document.documentElement).appendChild(variables_s);
  console.log(variables_s.textContent)
  var s = document.createElement('script');
  s.src = chrome.extension.getURL('extension/overridexhr.js');
  s.onload = function() {
      this.remove();
  };
  (document.head || document.documentElement).appendChild(s);
  console.log("overridexhr.js injected")
}

var port = chrome.runtime.connect({name: "ytadgotten"});

window.addEventListener("message", function(event) {
  // We only accept messages from ourselves
  if (event.source != window)
    return;

  if (event.data.type && (event.data.type == "YTADDATA")) {
    console.log("Content script received: " + event.data);
    port.postMessage(event.data);
  }
}, false);