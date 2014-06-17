// Include modeules
var myModule = require('cloud/api_experiment.js');
var testModule = require('cloud/test.js');
var ratingsModule = require('cloud/Ratings.js');
var ShowsModule = require('cloud/Shows.js');

// Check whether an object is a number
function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("testHTTP", function (request, response) {
	myModule.queryMonth("2014Jun", request, response);
});
