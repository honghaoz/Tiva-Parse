var apiURL = "http://uw-info1.appspot.com";
exports.getURL = function() {
	return apiURL;
}

exports.queryMonth = function(month, request, response) {
	var queryMonth = "2014Jul"
	if (arguments.length === 3) {
		queryMonth = month;
	};
	// queryMonth = (typeof month === "undefined") ? "2014Jun" : month;
	var queryURL = apiURL + "/infosessions/" + queryMonth + ".json"
	Parse.Cloud.httpRequest({
		url: queryURL,
		params: {
			key: '1'
		},
		success: function(httpResponse) {
			console.log('Request successful' + httpResponse.status);
    		response.success(httpResponse.text);
		},
		error: function(httpResponse) {
			console.error("Request failed: " + httpResponse.status);
		}
	});
}