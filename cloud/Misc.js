var User = Parse.User;
var Show = Parse.Object.extend("Show");

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
					}, function(obj, error){console.log("ERROR cannot " + obj + " " +  error); promise.reject(error);});
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

function removeFavImpl(userID, showID) {

	var promises = [];

	Parse.Cloud.useMasterKey();
	var userObj = new User();
	userObj.set("objectId", userID);

	var showObj = new Show();
	showObj.set("objectId", showID);

	promises.push(showObj.fetch());
	promises.push(userObj.fetch());

	return Parse.Promise.when(promises).then(function (results){
		return showObj.save();
	}).then(function(results){
		var favShows = userObj.relation("FavouriteShows");
		favShows.remove(showObj);
		return userObj.save();
	});
}

Parse.Cloud.define("removeFavourite", function (request, status) {
	var userID = request.params.userID;
	var showID = request.params.showID;
	removeFavImpl(userID, showID).then(function(okay){
			status.success("OKAY");
		}, function(error){
			var ret = ("FAILURE\nErrors:\n");
			for (var key in error){
				ret += key + " " + error[key] + "\n";
			}
			status.error(ret);
		});
});
