"use strict";

var couchdb_url = "https://12d1bba7-a4d9-40d6-937a-ddeec660fedf-bluemix.cloudantnosqldb.appdomain.cloud/youtube";
var HOST_SERVER = 'https://adanalystplus.imag.fr/';
var SOMETHING_WRONG = "there were something wrong with your request please review it ";
var SUCCESS = 'success';
var STATUS = "status"

var URLS_SERVER = {
  'store_Data_To_DataBase' : HOST_SERVER+'store_Data_To_DataBase'};

chrome.storage.sync.get({
  // urls_textarea: 'noname',
  // hosts_textarea: false,
  // couchdb_input: false,
  show_data_on_page: false
}, function(items) {
  // var urls = items.urls_textarea;
  // var hosts = items.hosts_textarea;
  // couchdb_url = items.couchdb_input;
  var show_data_on_page = items.show_data_on_page;
  console.log(items);


  chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
    if (request.msgType == "getOptions"){
      sendResponse({
        // "urls": urls, 
        // "hosts": hosts,
        "msgType": "setOptions",
        "show_data_on_page": show_data_on_page
      });
    }
  });
});


const save_to_localstorage = (data = {}) => {
  let allData = localStorage.dataTest?JSON.parse(localStorage.dataTest):[];
  allData.push(data);
  localStorage.dataTest = JSON.stringify(allData);

}


const post_to_couchdb = (data = {}) => {
    // TODO: should also send the full URL to couchdb to be saved

    var headers = new Headers();
    if(couchdb_url.indexOf('bluemix') > -1){
      headers.append('Authorization', 'Basic ' + btoa("erfuldlyinglimptakedstio" + ':' + "80f41fd9f654a97278cb5d2b10fb38f90436b55a"));
    }
    headers.append("Content-Type", "application/json; charset=utf-8")

    return fetch(couchdb_url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "include", // include, same-origin, *omit
        headers: headers,
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
    .then(response => response.json()) // parses response to JSON
    .catch(error => console.error(`Fetch Error =\n`, error));
};



// chrome.runtime.onMessageExternal.addListener( function(request, sender, sendResponse) {
//     if (typeof request.msgType == "number"){
//         // post_to_couchdb(request.data);
//         return true; // chrome is silly. (without this, the sendResponse is considered to be synchronous, so has no data)
//     }else{
//       console.log("unknown request msgType", request);
//     }
// });


function saveToServer(data){
  console.log("am going to send the request");
  $.ajax({
    type: 'POST',
    url: URLS_SERVER.store_Data_To_DataBase,
    dataType: "json",
    traditional:true,
    data: JSON.stringify(data),
    success: function (a) {
            if (a[STATUS]==SUCCESS ) {          
              console.log('Success registering data');       
           }},
        }).fail(function(a){
          console.log('Failure to register data');

                }
        );
}

chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name == "ytadgotten");
  port.onMessage.addListener(function(msg) {
      console.log("here we go");
      saveToServer(msg.data);
      console.log("bg script got data", msg.data);
      save_to_localstorage(msg.data);
      
      return true; 
  });
});