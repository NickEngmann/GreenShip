
  'use strict';


function emissionsTable(emissions) {
  var devmode = false;

  // Emissions table
  var emissionsTable = document.getElementById('savings-table');

  if(emissionsTable != null && emissions != null) {
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
        content.setAttribute('class', 'row fixed-row');

        // first column
        var firstColumn = document.createElement('div');
        firstColumn.setAttribute('class', 'col-5 pr-0');
        // first column text
        var innerTextFirstColumn  = document.createElement('p');
        innerTextFirstColumn.setAttribute('class', 'text-standard');

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
        secondColumn.setAttribute('class', 'col-7 to-da-right');
        var overflowFlag = false;
        if(index == (emissions.length-1)){
          var num_dead_trees = 1;
        }
        else{
          num_dead_trees = (slowest_shipping_date - emissions[index].minimum_date)/2
          
          if(num_dead_trees > 9){
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
        emissionsTable.appendChild(content);
      }
    };

    // Final blurb text
    if(emissions.length > 1){
      var emissionsSuggestion = document.getElementById('final-blurb');
      var innerSuggestion = document.createElement('h7');
      innerSuggestion.setAttribute('class', 'text-standard');
      innerSuggestion.innerHTML += 'Choosing "'+ emissions[0].delivery_type +'" will cause ' + variation_ratio + 'x the C02 emissions. That\'s like cutting down '+ variation_ratio + 'x as many trees to get your package sooner.';
      emissionsSuggestion.appendChild(innerSuggestion);
    }
    if(emissions.length == 1){
      var emissionsSuggestion = document.getElementById('final-blurb');
      var innerSuggestion = document.createElement('h7');
      innerSuggestion.setAttribute('class', 'text-standard');
      innerSuggestion.innerHTML += 'We can\'t compare something against itself but thanks for checking your impact either way!';
      emissionsSuggestion.appendChild(innerSuggestion);
    }
    var disclaimerBlurb = document.getElementById('disclaimer-blurb');
    disclaimerBlurb.setAttribute("style", "padding-right: .5rem!important; padding-left: .5rem!important;")
    var disclaimer_text = "Just a heads up, we keep track of which shipping option you choose to know if we\’re making a difference. Don\’t worry, we don\’t track anything else, it\’s all anonymous.";
    var disclaimerInner = document.createElement('p');
    disclaimerInner.setAttribute('style', 'font-size:9px;line height: 11px; color: #737373;');
    disclaimerInner.innerHTML += disclaimer_text;
    disclaimerBlurb.appendChild(disclaimerInner);
  }

}

window.addEventListener("load", function load() {
    //on page load go ahead and get the saved storage elements
    chrome.storage.local.get('emissionsTable', function (items) {
	    var results = items['emissionsTable'];
      emissionsTable(results.deliveryOptionsArray);
  	});

});

