var User = Parse.User;
var Recom = Parse.Object.extend("Recommendation");
var Show = Parse.Object.extend("Show");

function recommendShowImpl(recommenderID, recommendeeID, showID) {
	var promise = new Parse.Promise();
	var promises = [];

	Parse.Cloud.useMasterKey();

	var rder = new User();
	rder.set("objectId", recommenderID);
	promises.push(rder.fetch());

	var rdee = new User();
	rdee.set("objectId", recommendeeID);
	promises.push(rdee.fetch());

	var showObj = new Show();
	showObj.set("objectId", showID);
	promises.push(showObj.fetch());

	Parse.Promise.when(promises).then(function(obj) {

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
		promise.resolve();
	});

	return promise;
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
			status.error("FAILURE");
		});
});
