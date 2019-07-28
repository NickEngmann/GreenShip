
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
      if(dates =="Today") {
        var minimum_date = 0;
        var maximum_date = 0;
        var date_range = 0;   
      }
      else if(dates =="Tomorrow") {
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
              if(devmode){
                console.log("2 month case:")
              }
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
        var innerText = innerDOM[index].childNodes[1].innerText
      }
      catch(error){
        var innerText = undefined;
        var onlyDelivery = undefined;
      }

      if(innerText) {
        if(devmode) {
          console.log(innerText)
        }
        var noDatesRe = /[$](.*)/gm;
        var noDatesArray = innerText.match(noDatesRe);
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
            if(noTrackingCheck) {
              delivery_type = noTrackingCheck[0].slice(0, -2);
              if (devmode) {
                console.log(onlyDelivery);
              }
            }
          }
          else {
            var noRushShipping = /[\r\n](.*)[\r\n]?/gm;
            var deliveryNoRush = innerText.match(noRushShipping);
            if(devmode) {
              console.log("No Rush Delivery Catch")
              console.log(deliveryNoRush);
            }
            if(deliveryNoRush) {
              console.log(deliveryNoRush[0]);
              delivery_type = deliveryNoRush[0].slice(1,deliveryNoRush[0].length);
            }
          }
        }
        else{
          var noDatesRe = /\n.*/gm;
          var deliveryPrimeArray = innerText.match(noDatesRe);
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
      if(obj.delivery_type && obj.maximum_date){
        deliveryOptionsArray.push(obj);
      }
    }
    if(devmode){
      console.log(deliveryOptionsArray);
    }
    chrome.runtime.sendMessage({ deliveryOptionsArray});

    var emissions = deliveryOptionsArray

    // Embedded Modal
    wrapperDiv = document.createElement("div");
    wrapperDiv.setAttribute("id","iframe-wrapper");
    wrapperDiv.setAttribute("style","position: absolute; left: 0px; top: 0px; z-index: 2000; height: 1083px; width: 100%;");
    wrapperDiv.setAttribute("onclick","document.getElementById(\"iframe-wrapper\").style.display = \"none\"")

    modalDialogParentDiv = document.createElement("div");
    modalDialogParentDiv.setAttribute("id","popover-greenship");
    modalDialogParentDiv.setAttribute("style","position: absolute; width: 470px; border: 1px solid #20B566!important; background-color: rgb(255, 255, 255); z-index: 2010; text-align: center; top: 28px; right: 28px;");
    //removed button
    // modalDialogParentDiv.innerHTML += "<button style=\'position: absolute; width: 25px; height: 25px; top: 8px; font-size: 13px; right: 8px;\' onclick=\'document.getElementById(\"popover-greenship\").style.display = \"none\"\'>✖️</button>"

    // add all the approiate features for adding the content for the popup window
    //container
    modalParentContainer = document.createElement("div");
    modalParentContainer.setAttribute("style","width: 100%; padding-right: 15px; padding-left: 15px; margin-right: auto; margin-left: auto; margin: 0; font-family: -apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,\"Helvetica Neue\",Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"; font-weight: 400; line-height: 1.5; color: #212529; text-align: left;");
      //first row
      parentContainerChildTitleRow = document.createElement("div");
      parentContainerChildTitleRow.setAttribute("style","    display: flex; -ms-flex-wrap: wrap; flex-wrap: wrap; margin-right: -15px; margin-left: -15px; padding-left: .25rem!important; padding-bottom: .25rem!important; padding-right: .25rem!important; padding-top: .25rem!important; background-color:#20B566!important; color: #fff!important;")
        //font
        parentContainerChildTitleRowChildFont = document.createElement("div")
        parentContainerChildTitleRowChildFont.setAttribute("style","font-size:15px; padding-left: 20px;")
          //image
          titleImageElement = document.createElement("img"); 
          titleImageElement.src = chrome.extension.getURL("https://raw.githubusercontent.com/NickEngmann/GreenShip/master/icons/greenship-brand.png");
          titleImageElement.setAttribute("fill", "white")
          titleImageElement.setAttribute("width", "100px")
          titleImageElement.setAttribute("style","padding-top: 5px;")
        
        parentContainerChildTitleRowChildFont.appendChild(titleImageElement)
        // parentContainerChildTitleRowChildFont.innerHTML += "GreenShip"

        parentContainerChildTitleRow.appendChild(parentContainerChildTitleRowChildFont)
      
      modalParentContainer.appendChild(parentContainerChildTitleRow)
      
      // next row
      parentContainerChildTitleRow2 = document.createElement("div");
      parentContainerChildTitleRow2.setAttribute("style","display: flex; -ms-flex-wrap: wrap; flex-wrap: wrap; margin-right: -15px; margin-left: -15px; padding-left: 1.5rem!important; padding-right: 1.5rem!important; padding-top: 1.5rem!important; ")
      if(emissions.length != 1){
        //h6
        titleH6 = document.createElement("h6");
        titleH6.setAttribute("style","font-weight: 400; text-transform: none; font-size:20px; margin-bottom: .5rem; font-family: inherit; font-weight: 500; line-height: 1.2; color: inherit;")
        titleH6.innerHTML += "About to Buy Something?"
        //h7
        titleH7 = document.createElement("h7");
        titleH7.setAttribute("style","font-size:14px; font-weight: 400; line-height: 1.5; color: #212529; text-align: left; padding-bottom: 1rem!important; padding-top: .5rem!important;")
        titleH7.innerHTML += "Let\'s check out the environmental cost of your shipping options"
        parentContainerChildTitleRow2.appendChild(titleH6)
        parentContainerChildTitleRow2.appendChild(titleH7)
      }
      else if (emissions.length == 1) {
          //h6
          titleH6 = document.createElement("h6");
          titleH6.setAttribute("style","font-weight: 400; text-transform: none; font-size:20px; margin-bottom: .5rem; font-family: inherit; font-weight: 500; line-height: 1.2; color: inherit;")
          titleH6.innerHTML += "Looks like you only have one shipping option..."
          parentContainerChildTitleRow2.appendChild(titleH6)
      }
      else{
        console.log("No emissions table Found")
      }
      modalParentContainer.appendChild(parentContainerChildTitleRow2)

      savingsTableDiv = document.createElement("div");
      savingsTableDiv.setAttribute("style","display: flex; flex-wrap: wrap; margin-right: -15px; margin-left: -15px; padding-left: 1.5rem!important; padding-right: 1.5rem!important; padding-top: .5rem!important; background-color:#F3F3F3!important")


      if(emissions != null) {
        // Calculate Tree Variation Ratio
        if (devmode) {
          console.log(emissions);
        }
    
        var slowest_shipping_date = emissions[emissions.length-1].maximum_date
        var fastest_shipping_date = emissions[0].minimum_date
        var variation_ratio =  (slowest_shipping_date - fastest_shipping_date)/2;
    
        if(devmode) {
          console.log("Slowest Ship Date: " + slowest_shipping_date)
          console.log("Fastest Ship Date: " + fastest_shipping_date)
        }
    
        for (var index = (emissions.length-1); index >= 0; index--  ) {
    
          if(emissions[index].delivery_type) {
            // How to go from multiple images
            
            var content = document.createElement('div');
            content.setAttribute('style', 'display: flex; padding-bottom: 6px; flex-wrap: wrap; margin-right: -15px; margin-left: -15px; width: 450px!important;');
    
            // first column
            var firstColumn = document.createElement('div');
            firstColumn.setAttribute('style', 'position: relative; width: 100%; min-height: 1px; flex: 0 0 41.666667%; max-width: 41.666667%; padding-right: 0!important; padding-left: 15px;');
            // first column text
            var innerTextFirstColumn  = document.createElement('p');
            innerTextFirstColumn.setAttribute('style', 'font-size: 14px; font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"; font-weight: 400; line-height: 1.5; color: #212529; text-align: left;');
    
            if(emissions[index].business_day_case == false) {
              if(emissions[index].date_range != 0 ) {    
                innerTextFirstColumn.innerHTML += emissions[index].delivery_type +" (" + emissions[index].minimum_date +"-"+ emissions[index].maximum_date+" days)";
              }
              else{
                innerTextFirstColumn.innerHTML += emissions[index].delivery_type +" (" + emissions[index].minimum_date + " days)";
              }
            }
            else{
              if(emissions[index].date_range != 0 ) {    
                innerTextFirstColumn.innerHTML += emissions[index].delivery_type +" (" + emissions[index].minimum_date +"-"+ emissions[index].maximum_date+" business days once shipped)";
              }
              else{
                innerTextFirstColumn.innerHTML += emissions[index].delivery_type +" (" + emissions[index].minimum_date + " business days once shipped)";
              }   
            }
            // another column for the amount of lbs per C02
            var secondColumn = document.createElement('div');
            secondColumn.setAttribute('style', 'position: relative; width: 100%; min-height: 1px; text-align: right; padding-left: 0!important; padding-right: 0!important; flex: 0 0 58.333333%; max-width: 58.333333%;');
            var overflowFlag = false;
            if(index == (emissions.length-1)){
              var num_dead_trees = 1;
            }
            else{
              num_dead_trees = (slowest_shipping_date - emissions[index].minimum_date)/2
              
              if(num_dead_trees > 9) {
                num_dead_trees = 9;
                overflowFlag = true;
              }
            }
            if(num_dead_trees == 1) {
              secondColumn.innerHTML += '<p style="padding-top: 5px;color: #20B566!important; font-size: 14px;">Greenship\'s Choice!</p>'
            }
            else {
              for(var i = 0; i < num_dead_trees; i++ ){
                secondColumn.innerHTML += '<img src="https://raw.githubusercontent.com/NickEngmann/GreenShip/master/icons/dead_tree.png" width="25px" style="padding-left: 1px;padding-right: 1px;" >';
              }
              if(overflowFlag){
                secondColumn.innerHTML += '<img src="https://raw.githubusercontent.com/NickEngmann/GreenShip/master/icons/red-plus.png" width="25px" style="padding-left: 1px;padding-right: 1px;" >';
              }
            }
            firstColumn.appendChild(innerTextFirstColumn);
            content.appendChild(firstColumn);
            content.appendChild(secondColumn);
            savingsTableDiv.appendChild(content);
          }
        };
        modalParentContainer.appendChild(savingsTableDiv);
      }
      if(emissions.length > 1){
        // Emissions Suggestions
        twoColumnContainer = document.createElement('div')
        twoColumnContainer.setAttribute("style","padding-bottom: 1rem!important; padding-top: 1rem!important; height: 100%; width: 100%; display: flex;")

          // left
          leftSideContainer = document.createElement('div')
          leftSideContainer.setAttribute("style","height: 100%; width:50px; flex-grow: 0; display:inline-block;")
          leftSideContainer.innerHTML += '<img src="https://raw.githubusercontent.com/NickEngmann/GreenShip/master/icons/leaf_icon.png" width="35px" style="max-width: none;">';
          
          // right
          rightSideContainer = document.createElement('div')
          rightSideContainer.setAttribute("style","height: 100%; min-width:250px; flex-grow: 1000; display:inline-block;")
            
            // inner blurb
            var innerSuggestion = document.createElement('h7');
            innerSuggestion.setAttribute('style', 'font-size:14px;font-weight: 400; line-height: 1.5; color: #212529; text-align: left; padding-bottom: 1rem!important; padding-top: .5rem!important;' );
            innerSuggestion.innerHTML += 'Choosing "'+ emissions[0].delivery_type +'" will cause ' + variation_ratio + 'x the C02 emissions. That\'s like cutting down '+ variation_ratio + 'x as many trees to get your package sooner.';
            rightSideContainer.appendChild(innerSuggestion);
        
        twoColumnContainer.appendChild(leftSideContainer);
        twoColumnContainer.appendChild(rightSideContainer);
        modalParentContainer.appendChild(twoColumnContainer);
      }
      else if (emissions.length == 1){
        // Emissions Suggestions
        twoColumnContainer = document.createElement('div')
        twoColumnContainer.setAttribute("style","padding-bottom: 1rem!important; padding-top: 1rem!important; height: 100%; width: 100%; display: flex;")

          // left
          leftSideContainer = document.createElement('div')
          leftSideContainer.setAttribute("style","height: 100%; width:50px; flex-grow: 0; display:inline-block;")
          leftSideContainer.innerHTML += '<img src="https://raw.githubusercontent.com/NickEngmann/GreenShip/master/icons/leaf_icon.png" width="35px" style="max-width: none;">';
          
          // right
          rightSideContainer = document.createElement('div')
          rightSideContainer.setAttribute("style","height: 100%; min-width:250px; flex-grow: 1000; display:inline-block;")
            
            // inner blerb
            var innerSuggestion = document.createElement('h7');
            innerSuggestion.setAttribute('style', 'font-size:14px;font-weight: 400; line-height: 1.5; color: #212529; text-align: left; padding-bottom: 1rem!important; padding-top: .5rem!important;' );
            innerSuggestion.innerHTML += 'We can\'t compare something against itself but thanks for checking your impact either way!';
            rightSideContainer.appendChild(innerSuggestion);
        
        twoColumnContainer.appendChild(leftSideContainer);
        twoColumnContainer.appendChild(rightSideContainer);
        modalParentContainer.appendChild(twoColumnContainer);
      }
      disclaimerBlurb = document.createElement('div');
      disclaimerBlurb.setAttribute("style", "padding-bottom: .5rem!important; padding-right: .5rem!important; padding-left: .5rem!important;")
      var disclaimer_text = "Just a heads up, we keep track of which shipping option you choose to know if we\’re making a difference. Don\’t worry, we don\’t track anything else, it\’s all anonymous.";
      var disclaimerInner = document.createElement('p');
      disclaimerInner.setAttribute('style', 'font-size:9px;line height: 11px; color: #737373;');
      disclaimerInner.innerHTML += disclaimer_text;
      disclaimerBlurb.appendChild(disclaimerInner);
      modalParentContainer.appendChild(disclaimerBlurb);

    modalDialogParentDiv.appendChild(modalParentContainer);
    wrapperDiv.appendChild(modalDialogParentDiv);
    document.body.appendChild(wrapperDiv);
    
});
