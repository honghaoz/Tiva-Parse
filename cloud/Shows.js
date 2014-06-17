var Shows = Parse.Object.extend("Shows", {
  // Instance methods
  initialize: function (attrs, options) {
  }
}, {
  // Class methods
  create: function(showId, percentage, votes, loved, hated) {
    var show = new Shows();
    show.set("ShowId", showId);
    show.set("Percentage", percentage);
    show.set("Votes", votes);
    show.set("Loved", loved);
    show.set("Hated", hated);
    return show;
  }
});

Parse.Cloud.define("testShows", function(request, response) {
  var aShow = Shows.create(2214, 95, 8, 8, 0);
  aShow.save(null, {
    success: function(aShow) {
      // Execute any logic that should take place after the object is saved.
      //alert('New Ratings created with percentage: ' + aShow.percentage);
      response.success("created!");
    },
    error: function(aShow, error) {
      // Execute any logic that should take place if the save fails.
      // error is a Parse.Error with an error code and description.
      //alert('Failed to create new object, with error code: ' + error.description);
      response.error("falied!");
    }
  });
});
