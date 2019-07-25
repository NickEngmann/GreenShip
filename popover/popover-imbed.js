

$().ready(() => {      
    var parentDOM = document.getElementById("spc-orders");
    var innerDOM = parentDOM.getElementsByClassName("a-label a-radio-label");
    var deliveryOptionsArray = [];
    for( var index = 0; index < innerDOM.length; index++ ) {
      // console.log(index)

      try {
        var dates = innerDOM[index].childNodes[0].nextElementSibling.childNodes[1].innerText;
      }
      catch(error) {
        var dates = undefined;
      }
      // console.log(dates);

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
        
        if(noDatesArray) {
          var onlyDelivery = /\-(.*)?/gm;
          var onlyDeliveryArray = noDates.match(onlyDelivery);
          if(onlyDeliveryArray) {
            var onlyDelivery = onlyDeliveryArray[0].substr(2);
            // console.log(onlyDelivery);
          };
        }
        else{
          var onlyDelivery = undefined;
        }
      };

      var obj = {
        index: index,
        date_range: dates,
        money: monetaryAmount,
        delivery_type: onlyDelivery
      };
      console.log(obj);
      deliveryOptionsArray.push(obj);
      console.log(deliveryOptionsArray);
    }

    console.log(deliveryOptionsArray);
});
