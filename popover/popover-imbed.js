// This array will contain all of the numbers you want to highlight
// in no particular order
var numberArray = [670,710,820,1000];

numberArray.forEach(function(v){
  // Without knowing exactly what the page looks like I will just show you 
  // how to highlight just the numbers in question, but you could easily
  // similarly highlight surrounding text as well

  var num = "(" + v + ")";

  // Select the '<td>' that contains the number we are looking for
  var td = $('td.col-question:contains('+num+')');

  // Make sure that this number exists
  if(td.length > 0){

    // Now that we have it we need to single out the number and replace it
    var span = td.html().replace(num,'<span class="highlight-num">'+num+'</span>');
    var n = td.html(span);
  }
    // Now instead of '(1000)' we have
    // '<span class="highlight-num">(1000)</span>'
    // We will color it in the css file
});
