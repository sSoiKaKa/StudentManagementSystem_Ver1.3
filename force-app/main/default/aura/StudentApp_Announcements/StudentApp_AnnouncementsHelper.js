/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
({
  getNotifications: function (cmp, event, helper) {
    console.log("getNotifications: ");
    var action = cmp.get("c.getNotifications");
    action.setCallback(this, function (response) {
      var state = response.getState();
      console.log("state: ", state);
      console.log("response: ", response);
      if (state === "SUCCESS") {
        var returnValue = response.getReturnValue();
        var notifications = JSON.parse(returnValue);
        console.log("notifications: ", notifications);
        if (notifications) {
          for (var i = 0; i < notifications.classNotifications.length; i++) {
            notifications.classNotifications[i].CreatedDate =
              notifications.classNotifications[i].CreatedDate.substring(0, 10);
          }
          for (var j = 0; j < notifications.facultyNotifications.length; j++) {
            notifications.facultyNotifications[j].CreatedDate =
              notifications.facultyNotifications[j].CreatedDate.substring(
                0,
                10
              );
          }
          for (var k = 0; k < notifications.personalNotifications.length; k++) {
            notifications.personalNotifications[k].CreatedDate =
              notifications.personalNotifications[k].CreatedDate.substring(
                0,
                10
              );
          }
          console.log("notifications: ", notifications);
          cmp.set("v.notifications", notifications);
        }
      } else {
        console.log("Failed.");
        var errors = response.getError();
        console.log("Error: ", errors);
      }
    });
    $A.enqueueAction(action);
  }
});
