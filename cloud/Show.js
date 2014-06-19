var Show = Parse.Object.extend("Show", {
  // Instance methods
	initialize: function (attrs, options) {}
	}, {
  // Class methods
  create: function(show, status) {
    var entry = new Show();

		entry.set( {
			"Title": show.title,
			"Year": show.year * 1,
			"Country": show.country,
			"Overview": show.overview,
			"Runtime": show.runtime * 1,
			"Network": show.network,
			"Genres" : show.genres,
			"tvdb_id": show.tvdb_id * 1,
			"Poster": show.images.poster,
			"Fanart": show.images.fanart,
			"Banner": show.images.banner
		});
    return entry;
  }
});

var Episode = Parse.Object.extend("Episode", {
  // Instance methods
	initialize: function (attrs, options) {}
	}, {
  // Class methods
  create: function(showObj, episode) {
    var entry = new Episode();

		entry.set( {
			"Season": episode.season * 1,
			"Number": episode.number * 1,
			"Title": episode.title,
			"Overview": episode.overview,
			"Screen": episode.images.screen,
			"Air_Date_UTC": new Date (episode.first_aired_utc * 1000),
			"Parent": showObj,
		});
    return entry;
  }
});

function processJsonData(jsonData, status) {
	var allObjects = [];
	for (var i = 0; i < jsonData.length; i++){
		var allEpisodeData = jsonData[i]["episodes"];
		for (var j = 0; j < allEpisodeData.length; j++) {
			var curShow = Show.create(allEpisodeData[j].show, status);
			var curEpisode = Episode.create(curShow, allEpisodeData[j].episode);

			// storing Episode objects automatically store its parent (i.e. Show)
			allObjects.push(curEpisode);
		}
	}
	Show.saveAll(allObjects, {
		success: function(list) {
			status.success("OKAY");
		},
		error: function(error) {
			status.error("FAILURE");
		}
	});
}

Parse.Cloud.job("updateTomorrowData", function (request, status) {

	Parse.Cloud.httpRequest({
		method: "GET",
		url: "http://api.trakt.tv/calendar/shows.json/1113cff76935521fb75e4bd9336e9a4c/tomorrow/1",
		success: function (httpResponse) {

			console.log("Request from API successful" + httpResponse.status);
			processJsonData(JSON.parse(httpResponse.text), status);
		},
		error: function (httpResponse) {
			console.error("Request failed with response code " + httpResponse.status);
		}
	});
});
