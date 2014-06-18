var Show = Parse.Object.extend("Show", {
  // Instance methods
  initialize: function (attrs, options) {
  }
}, {
  // Class methods
  create: function(show, episode) {
    var entry = new Show();
    return entry;
  }
});

function processSingleEpisode(show, episode) {
	var buffer = "";
	for (var prop in show) buffer += prop + "="+show[prop] + "        ";
	return buffer;
}

function processJsonData(jsonData) {
	var buffer = "";
	for (var i = 0; i < jsonData.length; i++){
		var allEpisodeData = jsonData[i]["episodes"];
		for (var j = 0; j < allEpisodeData.length; j++) {
			buffer += processSingleEpisode(allEpisodeData[j].show, allEpisodeData[j].data);
		}
	}
	return buffer;
}

Parse.Cloud.define("updateTomorrowData", function (request, response) {

	Parse.Cloud.httpRequest({
		method: "GET",
		url: "http://api.trakt.tv/calendar/shows.json/1113cff76935521fb75e4bd9336e9a4c/tomorrow/1",
		success: function (httpResponse) {
			console.log('Request successful' + httpResponse.status);
			response.success(processJsonData(JSON.parse(httpResponse.text)));
		},
		error: function (httpResponse) {
			console.error('Request failed with response code ' + httpResponse.status);
		}
	});
});
