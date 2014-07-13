var User = Parse.User;
var Comment = Parse.Object.extend("Comment");
var Show = Parse.Object.extend("Show");

function commentShowImpl(senderID, contents, showID) {
	var promise = new Parse.Promise();
	var promises = [];

	Parse.Cloud.useMasterKey();

	var sender = new User();
	sender.set("objectId", senderID);
	promises.push(sender.fetch());

	var showObj = new Show();
	showObj.set("objectId", showID);
	promises.push(showObj.fetch());

	Parse.Promise.when(promises).then(function(obj) {

		var comment = new Comment();
		comment.set("sender", sender);
		comment.set("contents", contents);
		comment.set("tvdb_id", showObj.get("tvdb_id"));

		return comment.save();
	}).then(function(results){
		promise.resolve();
	});

	return promise;
}

Parse.Cloud.define("commentShow", function (request, status) {
	var senderID = request.params.senderID;
	var contents = request.params.contents;
	var showID = request.params.showID;

	if (!senderID || !contents || !showID){
		status.error("senderID or contents or showID cannot be null");
		return;
	}

	if (contents.length <= 0 || contents.length > 200) {
		status.error("Contents must be at least 0 to 200 characters long");
		return;
	}

	commentShowImpl(senderID, contents, showID).then(function(okay){
			status.success("OKAY");
		}, function(error){
			status.error("FAILURE");
		});
});

function getShowImpl(tvdb_id, ret) {
	var query = new Parse.Query(Comment);
	var promise = new Parse.Promise();
	var promises = [];

	query.equalTo("tvdb_id", tvdb_id);
	query.find().then(function(results){
		ret.push(results);
		promise.resolve();
	});
	
	return promise;
}

Parse.Cloud.define("getShowComments", function (request, status) {
	var tvdb_id = request.params.tvdb_id;
	var ret = [];

	if (!tvdb_id){
		status.error("tvdb_id cannot be null");
		return;
	}

	getShowImpl(tvdb_id, ret).then(function(okay){
			status.success(ret[0]);
		}, function(error){
			status.error("");
		});
});


