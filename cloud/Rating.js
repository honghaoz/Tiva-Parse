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

Parse.Cloud.define("testRating", function(request, response) {
  var aRating = Rating.create("CyMCK6HVhG", 95, 8, 8, 0);
  aRating.save(null, {
    success: function(aRating) {
      response.success("created!");
    },
    error: function(aRating, error) {
      response.error("falied!");
    }
  });
});
