
$().ready(() => {      

    var parentDOM = document.getElementById("spc-orders");
    // this level of DOM doesn't get the Pickup a Amazon Delivery Stop
    // var innerDOM = parentDOM.getElementsByClassName("shipping-speed ship-option pointer")
    var innerDOM = parentDOM.getElementsByClassName("a-label a-radio-label")

    for( var index = 0; index < innerDOM.length; index++ ) {
      console.log(index)

      var dates = innerDOM[index].childNodes[0].nextElementSibling.childNodes[1].innerText
      console.log(dates);

      // TODO: Regex to get the monetary amount
      var everything = innerDOM[index].childNodes[1].innerText.toString()
      var noDatesRe = /[$](.*)/gm
      var noDatesArray = everything.match(noDatesRe);
      var noDates = noDatesArray[0].toString()
      var onlyMoneyRe = /^[$]+[0-9]+(\.[0-9]{1,2})?/gm;
      var monetaryAmountArray = noDates.match(onlyMoneyRe);
      var monetaryAmount = monetaryAmountArray[0]
      console.log(monetaryAmount);

      var onlyDelivery = /\-(.*)?/gm;
      var onlyDeliveryArray = noDates.match(onlyDelivery);
      if(onlyDeliveryArray) {
        var onlyDelivery = onlyDeliveryArray[0].substr(2)
        console.log(onlyDelivery);
        // objects.delivery = onlyDelivery
      }
      console.log("")

    }
});
