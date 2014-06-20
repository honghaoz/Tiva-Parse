var Show = Parse.Object.extend("Show", {
  // Instance methods
	initialize: function (attrs, options) {}
	}, {
  // Class methods
  create: function(show) {

    var entry = new Show();

		entry.set( {
			"Title": show.title,
			"Year": show.year * 1,
			"Country": show.country,
			"Overview": show.overview,
			"Runtime": show.runtime * 1,
			"Network": show.network,
			"Genres" : show.genres,
			"tvdb_id": show.tvdb_id,
			"imdb_id": show.imdb_id,
			"tvrage_id": show.tvrage_id,
			"Poster": show.images.poster,
			"Fanart": show.images.fanart,
			"Banner": show.images.banner,
			"URL" : show.url,
			"First_Aired_UTC" : new Date (show.first_aired_utc * 1000),
			"Certification" : show.certification
		});
    return entry;
  }
});

var Episode = Parse.Object.extend("Episode", {
  // Instance methods
	initialize: function (attrs, options) {}
	}, {
  // Class methods
  create: function(showObj, show, episode) {
    var entry = new Episode();

		entry.set( {
			"Season": episode.season * 1,
			"Number": episode.number * 1,
			"Title": episode.title,
			"Overview": episode.overview,
			"Screen": episode.images.screen,
			"Air_Date_UTC": new Date (episode.first_aired_utc * 1000),
			"Parent": showObj,
			"tvdb_id" : show.tvdb_id,
			"URL" : episode.url
		});
    return entry;
  }
});

function processJsonData(jsonData) {
	var allObjects = [];
	var unique_map = [];

	var promise = new Parse.Promise();

	for (var i = 0; i < jsonData.length; i++){
		var allEpisodeData = jsonData[i]["episodes"];
		for (var j = 0; j < allEpisodeData.length; j++) {
			var oneShow = allEpisodeData[j].show;
			var oneEpisode = allEpisodeData[j].episode;
			var curShow;
			var tempShow = unique_map[oneShow.tvdb_id];
			if (tempShow != undefined) {
				curShow = tempShow;
			} else {
				curShow = Show.create(oneShow);
				unique_map[oneShow.tvdb_id] = curShow;
			}

			var curEpisode = Episode.create(curShow, oneShow, oneEpisode);

			// storing Episode objects automatically store its parent (i.e. Show)
			allObjects.push(curEpisode);
		}
	}

	Show.saveAll(allObjects, {
		success: function(list){
			var promises = [];
			for (var i = 0; i < list.length; i++) {
				var episode = list[i];
				var show = episode.get("Parent");
				var relation = show.relation("Children");
				relation.add(episode);
				promises.push(show.save());
			}
			Parse.Promise.when(promises).then(function(obj) {
				promise.resolve();
			});
		}
	});
	return promise;
}

function runUpdate(request, status){
	Parse.Cloud.httpRequest({
		method: "GET",
		url: "http://api.trakt.tv/calendar/shows.json/1113cff76935521fb75e4bd9336e9a4c/tomorrow/1",
		success: function (httpResponse) {

			console.log("Request from API successful" + httpResponse.status);
			processJsonData(JSON.parse(httpResponse.text)).then(function(okay){
				status.success("OKAY");
			}, function(error){
				status.error("FAILURE");
			});
		},
		error: function (httpResponse) {
			console.error("Request failed with response code " + httpResponse.status);
		}
	});
}

Parse.Cloud.job("updateTomorrowData", function (request, status) {
	runUpdate(request,status);
});

Parse.Cloud.define("updateTomorrowData", function (request, status) {
	runUpdate(request,status);
});

