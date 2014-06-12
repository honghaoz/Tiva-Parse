// Include modeules
var myModule = require('cloud/api_experiment.js');
var testModule = require('cloud/test.js');
var ratingsModule = require('cloud/Ratings.js');

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


// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("testHTTP", function(request, response) {
  myModule.queryMonth("2014Jun", request, response);
});

Parse.Cloud.define("testRating", function(request, response) {
  var aRating = new Ratings(95, 8, 8, 0);
  aRating.save(null, {
    success: function(aRating) {
      // Execute any logic that should take place after the object is saved.
      alert('New Ratings created with percentage: ' + aRating.percentage);
    },
    error: function(aRating, error) {
      // Execute any logic that should take place if the save fails.
      // error is a Parse.Error with an error code and description.
      alert('Failed to create new object, with error code: ' + error.description);
    }
  });
});
