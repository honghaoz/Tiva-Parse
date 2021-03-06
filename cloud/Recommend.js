var User = Parse.User;
var Recom = Parse.Object.extend("Recommendation");
var Show = Parse.Object.extend("Show");

function recommendShowImpl(recommenderID, recommendeeID, showID) {
	var promises = [];

	Parse.Cloud.useMasterKey();

	var rder = new User();
	rder.set("objectId", recommenderID);
	promises.push(rder.fetch());

	var rdee;

	var query = new Parse.Query(User);
	query.equalTo("fbID", recommendeeID);
	promises.push(query.first().then(function(user){
		rdee = user;
	}));

	var showObj = new Show();
	showObj.set("objectId", showID);
	promises.push(showObj.fetch());

	return Parse.Promise.when(promises).then(function(obj) {
		if (rder == null || rdee == null || showObj == null){
			throw "Parameters cannot be retrieved";
		}

		var recom = new Recom();
		recom.set("recommender", rder);
		recom.set("recommendee", rdee);
		recom.set("showID", showObj);

		return recom.save();
	}).then(function(results){
		var relation = rder.relation("Recommending");
		relation.add(results);
		return rder.save();
	}).then(function(results){
		var fbID = rdee.get("fbID");
		var recommenderName = rder.get("fbFirstName") + " " + rder.get("fbLastName");
		var msg = recommenderName + " " + "recommends you " + showObj.get("Title");
		var type = "Recommendation";
		return Parse.Push.send({
			channels : ["fbID" + fbID],
			data : {alert : msg, type : type, recommenderName: recommenderName, recommenderID: recommenderID, recommendeeID: recommendeeID},
		});
	});
}

Parse.Cloud.define("recommendShow", function (request, status) {
	var recommenderID = request.params.recommenderID;
	var recommendeeID = request.params.recommendeeID;
	var showID = request.params.showID;

	if (!recommenderID || !recommendeeID || !showID){
		status.error("recommenderID or recommendeeID or showID cannot be null");
		return;
	}

	if (recommenderID === recommendeeID) {
		status.error("recommenderID and recommendeeID cannot be the same");
		return;
	}

	recommendShowImpl(recommenderID, recommendeeID, showID).then(function(okay){
			status.success("OKAY");
		}, function(error){
			var ret = ("FAILURE\nErrors:\n");
			for (var key in error){
				ret += key + " " + error[key] + "\n";
			}
			status.error(ret);
		});
});
