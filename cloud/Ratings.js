var Ratings = Parse.Object.extend("Ratings", {
  // Instance methods
  initialize: function (attrs, options) {
    console.log("initialize called");
    this.percentage = 0;
    this.votes = 0;
    this.loved = 0;
    this.hated = 0;
  }
}, {
  // Class methods
  init: function(percentage, votes, loved, hated) {
    var rating = new Ratings();
    rating.percentage = percentage;
    rating.votes = votes;
    rating.loved = loved;
    rating.hated = hated;
    rating.set("Percentage", rating.percentage);
    rating.set("Votes", rating.votes);
    rating.set("Loved", rating.loved);
    rating.set("Hated", rating.hated);
    return rating;
  }
});

Parse.Cloud.define("testRating", function(request, response) {
  var aRating = new Ratings.init(95, 8, 8, 0);
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
