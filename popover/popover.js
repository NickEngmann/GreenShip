
  'use strict';


function emissionsTable(emissions) {

  //Need to order the emissions table by days
  //

  // Emissions table
  var emissionsTable = document.getElementById('savings-table');
  if(emissionsTable != null) {
    // Calculate Tree Variation Ratio
    console.log(emissions);
    var slowest_shipping_date = emissions[emissions.length-1].maximum_date
    console.log(slowest_shipping_date)
    var fastest_shipping_date = emissions[0].minimum_date
    console.log(fastest_shipping_date)
    var variation_ratio =  (slowest_shipping_date - fastest_shipping_date)/2;
    console.log(variation_ratio);
    for (var index = (emissions.length-1); index >= 0; index--  ) {
      // console.log("Hello World");
      if(emissions[index].delivery_type) {
        // How to go from multiple images

        var content = document.createElement('div');
        content.setAttribute('class', 'row fixed-row');

        // first column
        var firstColumn = document.createElement('div');
        firstColumn.setAttribute('class', 'col-3 pr-0');
        // first column text
        var innerTextFirstColumn  = document.createElement('p');
        innerTextFirstColumn.setAttribute('class', 'text-standard');
        if(emissions[index].date_range != 0) {    
          innerTextFirstColumn.innerHTML += emissions[index].delivery_type +" (" + emissions[index].minimum_date +"-"+ emissions[index].maximum_date+" days)";
        }
        else{
          innerTextFirstColumn.innerHTML += emissions[index].delivery_type +" (" + emissions[index].minimum_date + " days)";
        }
        // another column for the amount of lbs per C02
        var secondColumn = document.createElement('div');
        secondColumn.setAttribute('class', 'col-9 to-da-right');
        if(index == (emissions.length-1)){
          var num_dead_trees = 1;
        }
        else{
          num_dead_trees = (slowest_shipping_date - emissions[index].minimum_date)/2
        }
        for(var i = 0; i < num_dead_trees; i++ ){
          secondColumn.innerHTML += '<img src="../icons/dead_tree.png" width="30px" >';
        }
        
    
        firstColumn.appendChild(innerTextFirstColumn);
        content.appendChild(firstColumn);

        // console.log(secondColumn)
        content.appendChild(secondColumn);

        emissionsTable.appendChild(content);
      }
    };

    // Final blurb text
    var emissionsSuggestion = document.getElementById('final-blurb');
    var innerSuggestion = document.createElement('h7');
    innerSuggestion.setAttribute('class', 'text-standard');

    innerSuggestion.innerHTML += 'Choose '+ emissions[(emissions.length-1)].delivery_type +' will cause ' + variation_ratio + 'x the C02 emissions. That\'s like cutting down '+ variation_ratio + 'x as many trees to get your package sooner.';
    emissionsSuggestion.appendChild(innerSuggestion);
    
  }

}

window.addEventListener("load", function load() {
    //on page load go ahead and get the saved storage elements
    chrome.storage.local.get('emissionsTable', function (items) {
	    var results = items['emissionsTable'];
      emissionsTable(results.deliveryOptionsArray);
  	});

});

