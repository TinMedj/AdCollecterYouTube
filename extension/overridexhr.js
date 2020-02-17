
var Adcheked = false;
var reasonsCheked = false;
var adSkept = false;
var channelCheked =false;
var floatAdReasonCheked = false;
var floatAdRemoved = false;
var adFloatCheking = false;


(function(xhr) {
    
const sendToBackground = function(typ, data, cb){
        
    window.postMessage({
                        "type": "YTADDATA",
                        "msgType": typ,
                        "data": data
                      }, "*");
    }




//this function gives the reasons why the user received the ad 

function getAdReasons (doc,dataToSend){

     var adReasons = doc.querySelectorAll(".ytp-ad-info-dialog-ad-reasons li");
     for (var i = 0 ; i < adReasons.length; i++) {
              dataToSend.ad_reasons.push(adReasons[i].innerHTML);
              }
}

//get information about the advertiser
function getAdvertiser(doc,dataToSend){

    var item = doc.querySelectorAll('[id^="visit-advertiser"]')[0];
    var advertiserLink = item.getAttribute("aria-label");
   if (advertiserLink.length > 0) {dataToSend.ad.adevrtiser_link = advertiserLink;}

    getAdvertiserInfo(doc,dataToSend);  
 
}

//this function gives more details about the advertiser, his channel if there is any,the link to the site and the description 

function getAdvertiserInfo(doc,dataToSend){

    var firstCheckPoint = doc.getElementsByClassName("ytp-title-text");
    //get the advertiser youtube channel if there is any 
    if (firstCheckPoint.length >= 1){
        var description = doc.querySelectorAll('.ytp-title-text a')[0].innerHTML;
               dataToSend.ad.ad_channel_description = description;
        var adChannel = doc.querySelectorAll('.ytp-title-subtext a')[0];
        var adChannelLink = adChannel.getAttribute("href"); dataToSend.ad.ad_channel_link ="https://www.youtube.com"+adChannelLink;
        var adChannelName = adChannel.innerHTML; dataToSend.ad.ad_channel_name = adChannelName;
        var adImg = doc.querySelectorAll('.ytp-title-channel a')[0];
        var adImgLink = adImg.getAttribute("style"); 
        if(adImgLink!=null) dataToSend.ad.ad_channel_img = adImgLink; 
    }

    var secondCheckPoint = doc.getElementsByClassName("ytp-ad-player-overlay-flyout-cta");
     //get the advertiser page, img and description from the floating card 
    if (secondCheckPoint.length >= 1 ){
         
         var imgSrc = doc.getElementsByClassName("ytp-ad-image ytp-flyout-cta-icon");
       if (imgSrc.length > 0) dataToSend.ad.ad_page_img = imgSrc[0].getAttribute("src");
         var adDescription = doc.getElementsByClassName("ytp-ad-text ytp-flyout-cta-headline");
        if (adDescription.length>0) dataToSend.ad.ad_page_desctiption = adDescription[0].innerHTML;
         var adLink =  doc.getElementsByClassName("ytp-ad-text ytp-flyout-cta-description");
         if (adLink.length>0) dataToSend.ad.ad_page_link = adLink[0].innerHTML;
  
    } 

}

//this functions gives details about the main visited videos the img of the channel, the name and the link 

function getVideoHostDetails(doc,dataToSend){

  var videoName = doc.querySelectorAll('h1[class="title style-scope ytd-video-primary-info-renderer"] yt-formatted-string')[0].innerHTML;
  var viewsAll = doc.querySelectorAll('div[class="style-scope ytd-video-primary-info-renderer"] yt-view-count-renderer span[class="view-count style-scope yt-view-count-renderer"]')[0].innerHTML;
  var viewsNotAll = doc.querySelectorAll('div[class="style-scope ytd-video-primary-info-renderer"] yt-view-count-renderer span[class="short-view-count style-scope yt-view-count-renderer"]')[0].innerHTML;
  var dateOfLunch = doc.querySelectorAll('div[id="date"] yt-formatted-string[class="style-scope ytd-video-primary-info-renderer"]')[0].innerHTML;
    
    dataToSend.host_video.name = videoName;
    dataToSend.host_video.link = window.location.href;
    dataToSend.host_video.total_views = viewsAll.replace("&nbsp;"," ");
    dataToSend.host_video.partial_views = viewsNotAll.replace("&nbsp;"," ").replace("&nbsp;"," ");
    dataToSend.host_video.date = dateOfLunch;
   
  var channelImg = doc.querySelectorAll('div[class="style-scope ytd-video-secondary-info-renderer"] a img[class="style-scope yt-img-shadow"]')[0].getAttribute("src");
  var channel = doc.querySelectorAll( 'div[id="upload-info"] div[class="style-scope ytd-channel-name"] div[class="style-scope ytd-channel-name"] a[class="yt-simple-endpoint style-scope yt-formatted-string"]')[0];
  var channel_link = "https://www.youtube.com"+channel.getAttribute("href");  
  var channel_name = channel.innerHTML;
  var description = doc.querySelectorAll('div[class="style-scope ytd-expander"] div[id="description"] yt-formatted-string')[0].innerHTML;
  var followers = doc.querySelectorAll('div[class="style-scope ytd-video-owner-renderer"] yt-formatted-string[id="owner-sub-count"]')[0].innerHTML;
    
    reg=new RegExp("<.[^>]*>", "gi" );
    description=description.replace(reg, "" );

    dataToSend.host_video.channel_name = channel_name;
    dataToSend.host_video.channel_link = channel_link;
    if(channelImg!=null) dataToSend.host_video.channel_img = channelImg;
    dataToSend.host_video.channel_description = description;
    dataToSend.host_video.nbr_followers = followers.replace("&nbsp;"," ").replace("&nbsp;"," ");

}


//thid function gives information about the user [name and email]

function getUser(doc,dataToSend){

      
      var userName = doc.getElementById("account-name").getAttribute("title");
      var userEmail = doc.getElementById("email").getAttribute("title");
      var idUser = window["ytInitialData"]["responseContext"]["serviceTrackingParams"][1]["params"][1]["value"];
      console.log("idUser "+idUser);
        dataToSend.user.name = userName;
        dataToSend.user.email = userEmail;
        dataToSend.user.id = idUser;

      
    }

//this function give information about the floating card ads when it"s not a video ad ! 

    function getFloatingAd(doc,dataToSend) {

       var dialogMsgFloatAdTitle = doc.querySelectorAll('div[class="ytp-ad-text-overlay"] div[class="ytp-ad-overlay-title"]')[0].innerHTML ;
       var dialogMsgFloatAdDsc = doc.querySelectorAll('div[class="ytp-ad-text-overlay"] div[class="ytp-ad-overlay-desc"]')[0].textContent ;
       var dialogMsgFloatAdlink = doc.querySelectorAll('div[class="ytp-ad-text-overlay"] div[class="ytp-ad-overlay-link-inline-block ytp-ad-overlay-link"]')[0].textContent ; 
         dataToSend.ad_floating.title.push(dialogMsgFloatAdTitle);
         dataToSend.ad_floating.description.push(dialogMsgFloatAdDsc);
         dataToSend.ad_floating.link.push(dialogMsgFloatAdlink);
        
       var dialogMsgFloatAdTitle2 = doc.querySelectorAll('div[class="ytp-ad-text-overlay ytp-ad-enhanced-overlay"] div[class="ytp-ad-overlay-title"]')[0].innerHTML;
       var dialogMsgFloatAdDsc2 = doc.querySelectorAll('div[class="ytp-ad-text-overlay ytp-ad-enhanced-overlay"] div[class="ytp-ad-overlay-desc"]')[0].textContent;
       var dialogMsgFloatAdLink2 = doc.querySelectorAll('div[class="ytp-ad-text-overlay ytp-ad-enhanced-overlay"] div[class="ytp-ad-overlay-link-inline-block ytp-ad-overlay-link"]')[0].textContent ; 
       var floatAdImg = doc.querySelectorAll(".ytp-ad-overlay-image img")[0].getAttribute("src");
         dataToSend.ad_floating.title.push(dialogMsgFloatAdTitle2);
         dataToSend.ad_floating.description.push(dialogMsgFloatAdDsc2);
         dataToSend.ad_floating.link.push(dialogMsgFloatAdLink2);
         if(floatAdImg!=null) dataToSend.ad_floating.img = floatAdImg;  



       var floatAdReasons = doc.querySelectorAll(".ytp-ad-info-dialog-ad-reasons li"); 
            for (var i = 0 ; i < floatAdReasons.length; i++) {
              dataToSend.ad_reasons.push(floatAdReasons[i].innerHTML);
              }
    }


    function getAdUrl(url){
      var video_id = "";
      var rightOne = false;
    
       if(url.indexOf("video_id") > -1 || url.indexOf("hqdefault") > -1){
                
                lunched_video_id = window.location.href.split("=")[1].split("&")[0];  
              if (url.indexOf("video_id")> -1){

                var urlSplit = url.split("=");
                video_id = (urlSplit[2]).split("&")[0];
                
            }
         else{
              var urlSlit = url.split("/");
              video_id = urlSplit[4];
         }  
             if (video_id != lunched_video_id && video_id.length == 11) {
                rightOne = true;
                
              }
       }
             if (rightOne) return video_id;
             else return "";
    
  }



  function isTheSame (oldData,newData){


    return ((oldData.ad_floating.title[0] == newData.title[0])&&(oldData.ad_floating.title[1] == newData.title[1])&&
            (oldData.ad_floating.description[0]== newData.description[0])&& (oldData.ad_floating.description[1] == newData.description[1])&&
            (oldData.ad_floating.link[0] == newData.link[0])&& (oldData.ad_floating.link[1] == newData.link[1])&&
            (oldData.ad_floating.img == newData.img)
            );

  }


  function sendDataToBackground (dataToSend){
    d = new Date();
    dateActuel = d.toLocaleDateString()+' - '+d.toLocaleTimeString()+'.';
   dataToSend.time = dateActuel; 
   
   sendToBackground("here is the data",dataToSend);
  }


  var advertiserCheked = function(){
     Adcheked = true;
  };

  var ChekingReasons = function(){

    reasonsCheked = true;

  };

  var skeepingAd = function(){
     adSkept = true;
  };

  var channelCheking = function(){
    channelCheked = true;
  };


  
  function adListeners(){
    console.log("Am In");
    chik = false;
     var buttonAdvertiser = document.querySelectorAll('button[class="ytp-ad-button ytp-ad-visit-advertiser-button ytp-ad-button-link"]')[0];
         buttonAdvertiser.addEventListener("click", advertiserCheked) ;
     var buttonInfo = document.querySelectorAll('button[class="ytp-ad-button ytp-ad-button-link ytp-ad-clickable"]')[0];
         buttonInfo.addEventListener("click", ChekingReasons);
     var buttonSkeep = document.querySelectorAll('button[class="ytp-ad-skip-button ytp-button"]')[0];
        if( buttonSkeep != null)  buttonSkeep.addEventListener("click", skeepingAd);
         console.log("cheked "+reasonsCheked);
     var linkToChennel = document. querySelectorAll('div[class="ytp-title-subtext"] a[class="ytp-title-channel-name"]')[0];
         linkToChennel.addEventListener("click", channelCheking);
     var buttonAdvertiser2 = document.querySelectorAll('div[class="ytp-ad-player-overlay-flyout-cta"]')[0];
         buttonAdvertiser2.addEventListener("click", advertiserCheked);

  }


  var chekreasonsForFloatAd = function(){

    floatAdReasonCheked = true;
  };

  var closeFloatAd = function(){
      floatAdRemoved = true;
      console.log("removed ad "+floatAdRemoved);

  };



  var adFloatCheking = function(){
      adFloatCheked = true;
  };

  function getLandingURL(request){
    
    if (request._url.indexOf("get_midroll_info")> -1){
      reponse = request.responseText;
      console.log("this is the reponse: "+JSON.parse(reponse));    
  }
  }


  function adFloatingListener(){
    console.log(" listeners done");
       var infoAd = document.querySelectorAll('button[class="ytp-ad-button ytp-ad-button-link ytp-ad-clickable"]')[0];
           infoAd.addEventListener("click", chekreasonsForFloatAd);
       var closeButton = document.querySelectorAll('button[class="ytp-ad-overlay-close-button"]')[0];
           closeButton.addEventListener("click", closeFloatAd);  
  }






var XHR = XMLHttpRequest.prototype;
    var open = XHR.open;
    var send = XHR.send;
    var setRequestHeader = XHR.setRequestHeader;

XHR.open = function(method, url) {
        this._method = method;
        this._url = url;
        this._requestHeaders = {};
        this._startTime = (new Date()).toISOString();

        return open.apply(this, arguments);
};

XHR.setRequestHeader = function(header, value) {
        this._requestHeaders[header] = value;
        return setRequestHeader.apply(this, arguments);
};


var sendNonSkeptAd = false;
var ad = false;
var floatAd = false;
var adLink = "";
var sendAd = false;
var id_ad = "";
var nbrClick = 0;
var data = null;
var floatData = null;
var shouldSend = false;
var landingURL = "";
 var oldData =  
{
       title :["",""],
       description : ["",""],
       link :["",""],
       img : ""       
};
var oldLink = "";
var oldLinkHostVideo = "";
var newAd = "";




XHR.send = function(postData) {

          

       
        this.addEventListener('load', function() {
          
          
          let dataToSend =
                          {
        connected : false,
        time : "",
        user : {
              id : "",
              name : "none",
              email : 'none'
        },
        host_video :{
              name : "",
              link : "",
              date : "",
              channel_name : "",
              channel_link : "",
              channel_img : "",
              nbr_followers : "",
              total_views : "",
              partial_views : "",
              channel_description : ""
              
        },
        ad_or_not : false,
        ad : {
              ad_link : "",
              advertiser_name : "",
              ad_channel_description : "",
              ad_channel_name : "",
              ad_channel_link : "",
              ad_channel_img  : "",
              ad_page_img : "",
              ad_page_desctiption : "",
              ad_page_link : "",
              skeept_or_not : false,
              checked_or_not : false,
              reason_cheked : false,
              channel_cheked : false
        },
        ad_floating:{

              title :[],
              description : [],
              link :[],
              img : "",
              ad_reason_cheked : false,
              ad_removed : false,
             
        },
        ad_reasons :[]
    };

              if (this._url.indexOf("get_midroll_info")> -1){
                reponse = JSON.parse(this.responseText);
                land = reponse["playerAds"][0]["adPlacementRenderer"]["renderer"]["invideoOverlayAdRenderer"]["contentSupportedRenderer"]["imageOverlayAdContentRenderer"]["navigationEndpoint"]["urlEndpoint"]["url"]; 
                if (land != null) landingURL = land;  
            }
           
            var myUrl = this._url ;
            console.log("url"+myUrl);
            console.log("variable globale :"+window["ytInitialData"]["responseContext"]["serviceTrackingParams"][1]["params"][1]["value"]);
            if (id_ad == "") {
            id_ad = getAdUrl(myUrl);
            if(id_ad!=""){
              if(oldLink!="") newAd = id_ad;
              else oldLink = id_ad;
            }
            else{
              if(oldLink=="" && newAd != "") {oldLink = newAd; newAd = "";}
            }

            console.log("oldLink "+oldLink +" new ad "+newAd);
            }
            if(oldLink!=""){  adLink ="https://www.youtube.com/watch?v="+oldLink;
                             }

            if(nbrClick==0){
                var userBtn = document.getElementById("avatar-btn");
                if(userBtn!=null)
                {  userBtn.click();
                   nbrClick++;
                   userBtn.click();
                    dataToSend.connected = true;
                    console.log("connected "+dataToSend.connected);
                   getUser(document,dataToSend);
                   
                }
             }
             //to say that it's a lunched video
            if (window.location.href.indexOf("watch")> -1) {
               
                
               
                
                //test if it's an ad or not !
                if(document.getElementsByClassName("ytp-ad-player-overlay-instream-info").length > 0){
                  console.log("this is an ad");
                  ad = true;
                  adListeners();
                  
                  dataToSend.ad_or_not = true;
                  if (nbrClick == 1 ) {
                    dataToSend.connected = true;
                   getUser(document,dataToSend);} 
                   
                  /*if(id_ad.length==11 )  adLink ="https://www.youtube.com/watch?v="+id_ad;    
                  if(id_ad =="" && oldLink.length==11){
                   adLink ="https://www.youtube.com/watch?v="+oldLink;
                   oldLink = "";
                 }*/
                  getAdvertiser(document,dataToSend);
                  getAdReasons(document,dataToSend); 
                  getVideoHostDetails(document,dataToSend);           
                 /* if (oldLink.length == 11){ 
                    adLink = "https://www.youtube.com/watch?v="+oldLink;
                  }*/
                  data = dataToSend;   
               }
                else{

                  if(ad == true){
                        data.ad.ad_link = adLink;  oldLink ="";
                       data.ad.skeept_or_not = adSkept; adSkept = false;
                       data.ad.checked_or_not = Adcheked; Adcheked = false;
                       data.ad.reason_cheked = reasonsCheked; reasonsCheked = false;
                       data.ad.channel_cheked = channelCheked; channelCheked = false;
                       oldLink = "";
                       sendDataToBackground(data); 
                       sendAd = true;
                       ad = false;
                       
                  }

                      console.log("this is not an ad");
                       //this is to test if there is any floating ad
                      if(document.getElementsByClassName("ytp-ad-text-overlay").length > 0){
                      adFloatingListener(); 
                         if (nbrClick == 1 ) {
                      dataToSend.connected = true;
                      floatAd = true;
                      getUser(document,dataToSend);}


                      console.log("this is a floating ad");
                     // getLandingURL(this);
                      
                      getFloatingAd(document,dataToSend);
                      if(landingURL != "") dataToSend.ad_floating.link.push(landingURL);
                      
                      if (!isTheSame(dataToSend,oldData) ){
                        if(shouldSend){
                           console.log("save ad float before"); 
                           floatData.ad_floating.ad_reason_cheked = floatAdReasonCheked; floatAdReasonCheked = false;
                           floatData.ad_floating.ad_removed = floatAdRemoved; floatAdRemoved = false;
                           sendDataToBackground(floatData);
                           shouldSend = false;
                           sendAd = true;
                           landingURL = "";
                        }
                        oldData = dataToSend.ad_floating;
                        getVideoHostDetails(document,dataToSend);
                        oldLinkHostVideo = dataToSend.host_video.link;
                        floatData = dataToSend;
                        shouldSend = true;

                      }
                      else{

                        if (oldLinkHostVideo != window.location.href) {
                          
                          getVideoHostDetails(document,dataToSend);
                          floatData = dataToSend;
                          oldLinkHostVideo = dataToSend.host_video.link;
                          shouldSend = true;
                        }
                       
                      }
                      }
                      else{

                          if(floatAd ==true && shouldSend == true){
                          console.log("save ad float after");  
                            floatData.ad_floating.ad_reason_cheked = floatAdReasonCheked; floatAdReasonCheked = false;  
                            floatData.ad_floating.ad_removed = floatAdRemoved; floatAdRemoved = false;
                            sendDataToBackground(floatData);
                            floatAd = false;
                            sendAd = true;
                            shouldSend = false;
                            landingURL = "";
                          }


                      }
                    }
                   

                    if (sendAd == true){
                      var notification = new Notification("Hi there!", {body: "the ad was collected"});
                      setTimeout(function() {notification.close()}, 5000);
                      oldLink = "";

                          
                    }
               }
               
               id_ad="";
               sendAd = false;
       });

    return send.apply(this, arguments);
  
    };

})(XMLHttpRequest);





    