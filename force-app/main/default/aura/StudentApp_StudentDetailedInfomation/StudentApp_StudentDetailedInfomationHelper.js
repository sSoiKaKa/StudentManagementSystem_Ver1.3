/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
({
  getStudentInfo: function (cmp, event, helper) {
    console.log("getStudentInfo: ");
    var action = cmp.get("c.getStudentInfo");
    action.setCallback(this, function (response) {
      var state = response.getState();
      console.log("state: ", state);
      console.log("response: ", response);
      if (state === "SUCCESS") {
        var returnValue = response.getReturnValue();
        var studentInfo = JSON.parse(returnValue);
        console.log("studentInfo: ", studentInfo);
        if (returnValue) {
          cmp.set("v.studentInfo", studentInfo);
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