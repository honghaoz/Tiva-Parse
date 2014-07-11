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

function addFriend(userID, friendID) {
	var promise = new Parse.Promise();
	var promises = [];

	Parse.Cloud.useMasterKey();

	var ruser = new User();
	ruser.set("objectId", userID);
	promises.push(ruser.fetch());

	var rfriend = new User();
	rfriend.set("objectId", friendID);
	promises.push(rfriend.fetch());

	Parse.Promise.when(promises).then(function(obj) {
		var friendPromises = [];

		var relation = ruser.relation("Friends");
		relation.add(rfriend);
		friendPromises.push(ruser.save());

		relation = rfriend.relation("Friends");
		relation.add(ruser);
		friendPromises.push(rfriend.save());

		return Parse.Promise.when(friendPromises);
	}).then(function(obj){
		promise.resolve();
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

Parse.Cloud.define("addFriend", function (request, status) {
	var userID = request.params.userID;
	var friendID = request.params.friendID;
	addFriend(userID, friendID).then(function(okay){
			status.success("OKAY");
		}, function(error){
			status.error("FAILURE");
		});
});
