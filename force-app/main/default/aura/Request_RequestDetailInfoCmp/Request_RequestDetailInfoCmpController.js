/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
({
  init: function (cmp, helper) {},
  onRecordUpdated: function (cmp, helper) {
    var requestFields = cmp.get("v.requestFields");
    console.log("requestFields: ", requestFields);
    switch (requestFields.Request_Header__c) {
      case "Student Card Re-issuance":
        cmp.set("v.cardTitle", "Your Student Card Information");
        break;
      default:
        break;
    }
  },
  getStudentInfo: function (cmp, event) {
    console.log("getStudentInfo...");
    var params = event.getParam("arguments");
    if (params) {
      cmp.set("v.studentInfo", params.studentInfoFromParent);
    }
  },
  updateRequestRecord: function (cmp, event, helper) {
    console.log("updateRequestRecord...");
    var params = event.getParam("arguments");
    console.log("params: ", params);
    if (params) {
      cmp.set("v.requestHeader", params.requestHeader);
      cmp.set("v.requestType", params.requestType);
      cmp.set("v.requestFields", params.requestFields);
      helper.generateDataForEachRequest(cmp, event, helper);
    }
  },
  retrieveSemesterTranscriptData: function (cmp, event, helper) {
    console.log("retrieveSemesterTranscriptData...");
    var params = event.getParam("arguments");
    console.log("params: ", params);
    if (params) {
      var term = params.term;
      var studentInfo = cmp.get("v.studentInfo");
      var studentId = studentInfo.Id;
      var action = cmp.get("c.getSemesterTranscript");
      action.setParams({
        studentId: studentId,
        term: term
      });
      action.setCallback(this, function (response) {
        var state = response.getState();
        console.log("response: ", response);
        console.log("state: ", state);
        if (state === "SUCCESS") {
          var returnValue = JSON.parse(response.getReturnValue());
          console.log("returnValue: ", returnValue);
          cmp.set("v.semesterTranscriptData", returnValue);
        } else {
          console.log("Failed.");
          var errors = response.getError();
          console.log("Error: ", errors);
        }
      });
    }
    $A.enqueueAction(action);
  }
});