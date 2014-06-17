Parse.Cloud.define("testJson", function(request, response) {
 
	var buffer = "";
	try {
		JSON.parse('{"magic" : 1, "beef" : 5, "bool" : "false"}', function (key, val) {
			if (!key && key.length === 0) return;
			buffer += "(" + key + "," + val + ')';
		}); 
	} catch (e) {
		console.error("Parsing error:", e);
	}
  response.success(buffer);
 
});

Parse.Cloud.define("testAPI", function(request, response) {
});

Parse.Cloud.define("updateTomorrowData", function (request, response) {

	Parse.Cloud.httpRequest({
		method: "GET",
		url: "http://api.trakt.tv/calendar/shows.json/1113cff76935521fb75e4bd9336e9a4c/tomorrow/1",
		success: function (httpResponse) {
			console.log('Request successful' + httpResponse.status);
			response.success(httpResponse.text);
		},
		error: function (httpResponse) {
			console.error('Request failed with response code ' + httpResponse.status);
		}
	});
	//response.success("Hello world!");
});
