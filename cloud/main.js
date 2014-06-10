// Check whether an object is a number
function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
 
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("forwardAPI", function(request, response) {
 
    sid = request.params.sid;
    if (!isNumber(sid)){
        errmsg = "Sid is not a valid number, got: ".concat(sid);
        console.error(errmsg);
        response.error(errmsg);
        return;
    }
 
    Parse.Cloud.httpRequest({
  method: "POST",
  url: "http://services.tvrage.com/feeds/episode_list.php",
  params: {
     sid:sid
  },
    success: function(httpResponse) {
    console.log('Request successful' + httpResponse.status);
    response.success(httpResponse.text);
  },
  error: function(httpResponse) {
    console.error('Request failed with response code ' + httpResponse.status);
  }
    });
  //response.success("Hello world!");
});


var myModule = require('cloud/api_experiment.js');
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("testHTTP", function(request, response) {
  myModule.queryMonth("2014Jun", request, response);
});
