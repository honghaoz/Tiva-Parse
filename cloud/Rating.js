var Rating = Parse.Object.extend("Rating");

function getShowRatingImpl(tvdb_id, ret){
	var promise = new Parse.Promise();

	Parse.Cloud.httpRequest({
		method: "GET",
		url: "http://api.trakt.tv/show/stats.json/1113cff76935521fb75e4bd9336e9a4c/" + tvdb_id
	}).then(function(httpResponse){
		var json = JSON.parse(httpResponse.text);
		//console.log(json.ratins.distribution);
		var dist = json.ratings.distribution;
		var sum = 0.0;
		var total = 0.0;
		for (var key in dist) {
			var val = dist[key];
			sum += key * val;
			total += val;
		}
		if (total == 0) {
			ret.push(0);
		} else {
			ret.push(sum/total/2);
		}
		promise.resolve();
	});

	return promise;
}

Parse.Cloud.define("getShowRating", function (request, status) {
	var tvdb_id = request.params.tvdb_id;
	var ret = [];

	if (!tvdb_id){
		status.error("tvdb_id cannot be null");
		return;
	}
	
	getShowRatingImpl(tvdb_id, ret).then(function(okay){
			status.success(ret[0]);
		}, function(error){
			status.error("");
	});
});
