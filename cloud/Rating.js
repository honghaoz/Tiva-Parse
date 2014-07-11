var Rating = Parse.Object.extend("Rating", {
  // Instance methods
  initialize: function (attrs, options) {
  }
}, {
  // Class methods
  create: function(showId, percentage, votes, loved, hated) {
    var rating = new Rating();
    rating.set("ShowId", showId);
    rating.set("Percentage", percentage);
    rating.set("Votes", votes);
    rating.set("Loved", loved);
    rating.set("Hated", hated);
    return rating;
  }
});

function getRatings(tvdb_id, ret){

	Parse.Cloud.httpRequest({
		method: "GET",
		url: "http://api.trakt.tv/show/stats.json/1113cff76935521fb75e4bd9336e9a4c/" + tvdb_id
	}).then(function(httpResponse){
		var json = JSON.parse(httpResponse.text);
	});
}

Parse.Cloud.job("updateAPIData", function (request, status) {
	runUpdate(request,status);
});

Parse.Cloud.define("updateAPIData", function (request, status) {
	runUpdate(request,status);
});
