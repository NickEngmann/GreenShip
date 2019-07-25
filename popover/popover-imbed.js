
// console.log("we in this?")       
// try {
//     console.log("comon fam")

//     var testTarget = parentDOM.getElementsByClassName("test")[0]; // the first element, as we wanted
//     console.log(testTarget); //<p class="test">hello world 2</p>
// }
// catch(error) {
//     // console.error(error);
//     // expected output: ReferenceError: nonExistentFunction is not defined
//     // Note - error messages will vary depending on browser
// }


        
$().ready(() => {      
    console.log("content script ready");
    var parentDOM = document.getElementById("spc-orders");
    console.log(parentDOM)
    // "a-row shipping-speed ship-option pointer no-scheduled-delivery a-touch-radio"
    var test = parentDOM.getElementsByClassName("shipping-speed ship-option pointer")
    console.log(test); 
    for( var i = 0; i < test.length; i++) { 
      console.log(i)
    }
});
