var Ratings = Parse.Object.extend("Ratings", {
  // Instance methods
  initialize: function (attrs, options) {
  }
}, {
  // Class methods
  create: function(showId, percentage, votes, loved, hated) {
    var rating = new Ratings();
    rating.set("ShowId", showId);
    rating.set("Percentage", percentage);
    rating.set("Votes", votes);
    rating.set("Loved", loved);
    rating.set("Hated", hated);
    return rating;
  }
});

Parse.Cloud.define("testRating", function(request, response) {
  var aRating = Ratings.create("CyMCK6HVhG", 95, 8, 8, 0);
  aRating.save(null, {
    success: function(aRating) {
      // Execute any logic that should take place after the object is saved.
      //alert('New Ratings created with percentage: ' + aRating.percentage);
      response.success("created!");
    },
    error: function(aRating, error) {
      // Execute any logic that should take place if the save fails.
      // error is a Parse.Error with an error code and description.
      //alert('Failed to create new object, with error code: ' + error.description);
      response.error("falied!");
    }
  });
});
