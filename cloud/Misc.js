var User = Parse.User;
var Recom = Parse.Object.extend("Recommendation");
var Show = Parse.Object.extend("Show");

Parse.Cloud.define("resetPW", function (request, status) {
	Parse.User.requestPasswordReset("a77chan@uwaterloo.ca", status);
});

function addFavImpl(userID, showID) {
	var promise = new Parse.Promise();
	var query = new Parse.Query(User);
	query.get(userID, {
		success: function(user) {
			console.log(user.getUsername());
			var iquery = new Parse.Query(Show);
			iquery.get(showID, {
				success: function(show) {
					console.log(show.get("Title"));
					console.log(user.getUsername());
					var relation = user.relation("FavouriteShows");
					relation.add(show);
					Parse.Cloud.useMasterKey();
					user.save().then(function(obj){
						promise.resolve();
					}, function(obj, error){console.log("ERROR cannot " + obj + " " +  error); promise.resolve();});
				},
				error : function(error) { promise.resolve(); }
			});
		},
		error : function(error) { promise.resolve(); }
	});
	return promise;
}

Parse.Cloud.define("addFavourite", function (request, status) {
	var userID = request.params.userID;
	var showID = request.params.showID;
	addFavImpl(userID, showID).then(function(okay){
			status.success("OKAY");
		}, function(error){
			status.error("FAILURE");
		});
});
