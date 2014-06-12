Parse.Cloud.define("testJson", function(request, response) {
 
	var buffer = "";
	try {
		JSON.parse('{"magic" : 1, "beef" : 5, "bool" : "false"}', function (key, val) {
			if (!key && key.length === 0) return;
			buffer += "(" + key + "," + val + ')';
		}); 
	} catch (e) {
		console.error("Parsing error:", e);
	}
  response.success(buffer);
 
});
