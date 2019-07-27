
var deliveryOptionsArray = [];
var dateConverter = {
  Jul: 6,
  Aug: 7,
  Sept: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11
}
var dateConverterFull = {
  July: 6,
  Aug: 7,
  Sept: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11
}

$().ready(() => {      
    var devmode = true;
    var parentDOM = document.getElementById("spc-orders");
    var innerDOM = parentDOM.getElementsByClassName("a-radio-label");
    today = new Date();

    for( var index = 0; index < innerDOM.length; index++ ) {
      var business_day_case = false;
      if (devmode){
        console.log(index)
      }
      try {
        var dates = innerDOM[index].childNodes[0].nextElementSibling.childNodes[1].innerText;
      }
      catch(error) {
        var dates = undefined;
        var minimum_date = undefined;
        var maximum_date = undefined;
      }
      if (devmode){
        console.log("Dates:")
        console.log(dates);
      }
      if(dates =="Tomorrow"){
        var minimum_date = 1;
        var maximum_date = 1;
        var date_range = 0;   
      }
      else if(dates) {
        var dayRE = /\d([0-9]=?|)/gm;
        var dayArray = dates.match(dayRE);
        if (devmode) {
          console.log("dayArray: ")
          console.log(dayArray);
        }
        if(dayArray) {
          var monthRE = /[A-Z][a-z]+[.]/gm;
          var monthArray = dates.match(monthRE);
          if (devmode){
            console.log("Month Array:")
            console.log(monthArray);
          }
          if(monthArray != null) {
            if(monthArray.length == 2){
              var minimumMonth = dateConverter[monthArray[0].slice(0, -1)]
              var maximumMonth = dateConverter[monthArray[1].slice(0, -1)]
              if (devmode) {
                console.log("Minimum Month= "+ minimumMonth)
                console.log("Maximum Month= "+maximumMonth)
              }

              var minimumdateObject = new Date(
                  2019,
                  minimumMonth, // Careful, month starts at 0!
                  dayArray[0],
                  01,
                  02,
                  03
              );

              var minimum_date = parseInt((minimumdateObject - today)/(24*3600*1000))
              
              if (devmode) {
                console.log(minimumdateObject);
                console.log("minimum date: "+ minimum_date);
                console.log("Maximum Month: " + maximumMonth)
                console.log("maximum Day: " + dayArray[1])
              }
              var maximumdateObject = new Date(
                2019,
                maximumMonth,
                dayArray[1],
                01,
                02,
                03
              );

              var maximum_date = parseInt((maximumdateObject-today)/(24*3600*1000))
              var date_range = maximum_date - minimum_date;
            }
            else if(monthArray.length == 1) {
              var minimumMonth = dateConverter[monthArray[0].slice(0, -1)]
              if (devmode) {
                console.log("Solo Month= "+ minimumMonth)
              }
              var minimumdateObject = new Date(
                  2019,
                  minimumMonth, 
                  dayArray[0],
                  01,
                  02,
                  03
              );

              var minimum_date = parseInt((minimumdateObject - today)/(24*3600*1000))
              var maximum_date = minimum_date;
              var date_range =  0;
            }
          }

          else {
            var monthRE = /[A-Z][a-z]+[\s]/gm;
            var month = dates.match(monthRE);
            if(month != null) {
              var minimumMonth = dateConverterFull[month[0].slice(0,-1)];

              var minimumdateObject = new Date(
                  2019,
                  minimumMonth,
                  dayArray[0],
                  01,
                  02,
                  03
              );

              var minimum_date = parseInt((minimumdateObject-today)/(24*3600*1000))
              var maximum_date = minimum_date;
              var date_range = 0;    
              if (devmode){
                console.log("Months:" + month);
                console.log(minimumdateObject);
              }
            }
            else{
              console.log("business day case");
              console.log("dates left:" + dates);
              var minimum_date = dayArray[0];
              var maximum_date = dayArray[1];
              var date_range = maximum_date - minimum_date;
              business_day_case = true;
            }   
          }
        }
        
      }

      try {
        var everything = innerDOM[index].childNodes[1].innerText
      }
      catch(error){
        var everything = undefined;
        var onlyDelivery = undefined;
      }

      if(everything) {
        var noDatesRe = /[$](.*)/gm;
        var noDatesArray = everything.match(noDatesRe);
        if(noDatesArray){
          var noDates = noDatesArray[0].toString();
          var onlyMoneyRe = /^[$]+[0-9]+(\.[0-9]{1,2})?/gm;
          var monetaryAmountArray = noDates.match(onlyMoneyRe);
          var monetaryAmount = monetaryAmountArray[0];
        }
        else{
          var monetaryAmount = undefined;
        }
        if (devmode) {
          console.log(monetaryAmount);
        }
        if(noDatesArray) {
          var onlyDelivery = /\-(.*)?/gm;
          var onlyDeliveryArray = noDates.match(onlyDelivery);

          if(onlyDeliveryArray) {
            var onlyDelivery = onlyDeliveryArray[0].substr(2);
            if (devmode) {
              console.log(onlyDelivery);
            }
            // check for Tracking info
            var trackingCheck = /^(.*)\-/gm;
            var noTrackingCheck = onlyDelivery.match(trackingCheck);
            if(noTrackingCheck){
              delivery_type = noTrackingCheck[0].slice(0, -2);
              if (devmode) {
                console.log(onlyDelivery);
              }
            }
          };
        }
        else{
          var noDatesRe = /\n.*/gm;
          var deliveryPrimeArray = everything.match(noDatesRe);
          // 
          if(deliveryPrimeArray){
            var delivery_type = deliveryPrimeArray[0].slice(1);
            if(devmode){
              console.log("Delivery Type: " + deliveryPrimeArray[0].slice(1));
            }
          }
          else{
            var delivery_type = undefined;
          }
        }

      };
      if (devmode){
        console.log(delivery_type);
      }

      var obj = {
        index: index,
        minimum_date: minimum_date,
        maximum_date: maximum_date,
        date_range: date_range,
        money: monetaryAmount,
        delivery_type: delivery_type,
        business_day_case: business_day_case
      };
      if (devmode) {
        console.log(obj);
      }
      if(obj.delivery_type){
        deliveryOptionsArray.push(obj);
      }
    }
    if(devmode){
      console.log(deliveryOptionsArray);
    }
    chrome.runtime.sendMessage({ deliveryOptionsArray});

    // Embed Modal
    wrapperDiv = document.createElement("div");
    wrapperDiv.setAttribute("id","iframe-wrapper");
    wrapperDiv.setAttribute("style","position: absolute; left: 0px; top: 0px; z-index: 2000; height: 1083px; width: 100%;");
    wrapperDiv.setAttribute("onclick","document.getElementById(\"iframe-wrapper\").style.display = \"none\"")

    modalDialogParentDiv = document.createElement("div");
    modalDialogParentDiv.setAttribute("id","popover-greenship");
    modalDialogParentDiv.setAttribute("style","position: absolute; width: 470px; height: 300px; border: 1px solid rgb(51, 102, 153); padding: 10px; background-color: rgb(255, 255, 255); z-index: 2010; overflow: auto; text-align: center; top: 28px; right: 28px;");
    modalDialogParentDiv.innerHTML += "<button style=\'position: absolute; width: 25px; height: 25px; top: 8px; font-size: 13px; right: 8px;\' onclick=\'document.getElementById(\"popover-greenship\").style.display = \"none\"\'>✖️</button>"
    
    modalDialogSiblingDiv = document.createElement("div");

    modalDialogTextDiv = document.createElement("div"); 
    modalDialogTextDiv.setAttribute("style" , "text-align:center");
    
    // put elements that are currently in popupjs/popuphtml here
    modalDialogTextSpan = document.createElement("span"); 
    modalDialogText = document.createElement("strong"); 
    modalDialogText.innerHTML = "Processing...  Please Wait.";

    breakElement = document.createElement("br"); 
    imageElement = document.createElement("img"); 
    imageElement.src = chrome.extension.getURL("https://raw.githubusercontent.com/NickEngmann/GreenShip/master/imgs/amazon.png");

    modalDialogTextSpan.appendChild(modalDialogText);
    modalDialogTextDiv.appendChild(modalDialogTextSpan);
    modalDialogTextDiv.appendChild(breakElement);
    modalDialogTextDiv.appendChild(breakElement);
    modalDialogTextDiv.appendChild(imageElement);

    modalDialogSiblingDiv.appendChild(modalDialogTextDiv);
    modalDialogParentDiv.appendChild(modalDialogSiblingDiv);
    wrapperDiv.appendChild(modalDialogParentDiv);
    document.body.appendChild(wrapperDiv);
    
});
