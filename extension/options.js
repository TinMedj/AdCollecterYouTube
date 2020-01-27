// Saves options to chrome.storage
function save_options() {
  // var urls_textarea = document.getElementById('urls-textarea').value.trim().split("\n");
  // var hosts_textarea = document.getElementById('hosts-textarea').value.trim().split("\n");
  // var couchdb_input = document.getElementById('couchdb-input').value;
  var show_data_on_page = document.getElementById('show-data-or-not').checked;

  chrome.storage.sync.set({
    // "urls_textarea": urls_textarea,
    // "hosts_textarea": hosts_textarea,
    // "couchdb_input": couchdb_input,
    "show_data_on_page": show_data_on_page
  }, function() {
    chrome.extension.getBackgroundPage().window.location.reload();
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    urls_textarea: [],
    hosts_textarea: [],
    couchdb_input: null,
    show_data_on_page: true
  }, function(items) {
    console.log(items);

    // document.getElementById('urls-textarea').value = typeof items.urls_textarea == "string" ? [] : items.urls_textarea.join("\n");
    // document.getElementById('hosts-textarea').value = typeof items.hosts_textarea == "string" ? [] : items.hosts_textarea.join("\n");
    // document.getElementById('couchdb-input').value = items.couchdb_input;
    document.getElementById('show-data-or-not').checked = items.show_data_on_page;
  });
}

// Main init
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save-button').addEventListener('click', save_options);