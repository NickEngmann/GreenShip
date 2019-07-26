
var deliveryOptionsArray = [];
var dateConverter = {
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11
}
var dateConverterFull = {
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11
}
$().ready(() => {      
    var parentDOM = document.getElementById("spc-orders");
    var innerDOM = parentDOM.getElementsByClassName("a-label a-radio-label");
    today = new Date();
    console.log(today);

    for( var index = 0; index < innerDOM.length; index++ ) {
      console.log(index)

      try {
        var dates = innerDOM[index].childNodes[0].nextElementSibling.childNodes[1].innerText;
      }
      catch(error) {
        var dates = undefined;
        var minimum_date = undefined;
        var maximum_date = undefined;
      }

      console.log(dates);
      if(dates =="Tomorrow"){
        var minimum_date = 1;
        var maximum_date = 1;
        var date_range = 0;   
      }
      else if(dates) {
        // var dayRE = /\d(.=?)/gm;
        var dayRE = /\d([0-9]=?|)/gm;
        var dayArray = dates.match(dayRE);
        console.log("dayArray: ")
        console.log(dayArray);
        
        if(dayArray) {
          // console.log("What is this variable" + dates);
          var monthRE = /[A-Z][a-z]+[.]/gm;
          var monthArray = dates.match(monthRE);
          // console.log(monthArray);
          if(monthArray) {
            var minimumMonth = dateConverter[monthArray[0].slice(0, -1)]
            // console.log("Minimum Month= "+ minimumMonth)
            var maximumMonth = dateConverter[monthArray[1].slice(0, -1)]
            // console.log("Maximum Month= "+maximumMonth)

            var minimumdateObject = new Date(
                2019,
                minimumMonth, // Careful, month starts at 0! TODO: Calculate Months from regex
                dayArray[0],
                01,
                02,
                03
            );
            // console.log(minimumdateObject);
            var minimum_date = parseInt((minimumdateObject-today)/(24*3600*1000))
            // console.log("minimum date: "+ minimum_date);
            // console.log("Maximum Month: " + maximumMonth)
            // console.log("maximum Day: " + dayArray[1])
            var maximumdateObject = new Date(
              2019,
              maximumMonth, // Careful, month starts at 0! TODO: Calculate Months from regex
              dayArray[1],
              01,
              02,
              03
          );
          // console.log(maximumdateObject);
          var maximum_date = parseInt((maximumdateObject-today)/(24*3600*1000))
          var date_range = maximum_date - minimum_date;
          // console.log("Maximum Date" + maximum_date)
          }
          else{
            var monthRE = /[A-Z][a-z]+[\s]/gm;
            var month = dates.match(monthRE);
            // console.log("Months:" + month);
            // console.log(month)
            // console.log(dateConverterFull)
            var minimumMonth = dateConverterFull[month[0].slice(0,-1)];
            // console.log("Minimum Month= "+minimumMonth[0]);
            // console.log("MaximumMonth= "+maximumMonth)

            var minimumdateObject = new Date(
                2019,
                minimumMonth, // Careful, month starts at 0! TODO: Calculate Months from regex
                dayArray[0],
                01,
                02,
                03
            );
            // console.log(minimumdateObject);
            var minimum_date = parseInt((minimumdateObject-today)/(24*3600*1000))
            var maximum_date = minimum_date;
            var date_range = 0;       
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

        // console.log(monetaryAmount);
        console.log("What is in everything:" + everything)
        if(noDatesArray) {
          var onlyDelivery = /\-(.*)?/gm;
          var onlyDeliveryArray = noDates.match(onlyDelivery);
          console.log("Dates?:" + noDates);
          if(onlyDeliveryArray) {
            var onlyDelivery = onlyDeliveryArray[0].substr(2);
            console.log(onlyDelivery);

            // check for Tracking info
            var trackingCheck = /^(.*)\-/gm;
            var noTrackingCheck = onlyDelivery.match(trackingCheck);
            if(noTrackingCheck){
              delivery_type = noTrackingCheck[0].slice(0, -2);
              console.log(onlyDelivery);
            }
          };
        }
        else{
          var noDatesRe = /\n.*/gm;
          var deliveryPrimeArray = everything.match(noDatesRe);
          // 
          if(deliveryPrimeArray){
            var delivery_type = deliveryPrimeArray[0].slice(1);
            console.log("Delivery Type: " + deliveryPrimeArray[0].slice(1));
          }
          else{
            var delivery_type = undefined;
          }
        }

      };
      console.log(delivery_type);

      var obj = {
        index: index,
        minimum_date: minimum_date,
        maximum_date: maximum_date,
        date_range: date_range,
        money: monetaryAmount,
        delivery_type: delivery_type
      };
      console.log(obj);
      if(obj.delivery_type){
        deliveryOptionsArray.push(obj);
      }
    }

    console.log(deliveryOptionsArray);
    chrome.runtime.sendMessage({ deliveryOptionsArray});
});
