/* eslint-disable no-console */
({
  setVisibleFieldList: function (cmp, helper) {
    var lsVisibleFields = [];
    lsVisibleFields.push({
      requestType: "Request",
      requestHeader: "Student Card Re-issuance",
      visibleFields: ["Reason__c"]
    });
    lsVisibleFields.push({
      requestType: "Request",
      requestHeader: "Application for Graduation Recognition",
      visibleFields: ["Academic_Term__c"]
    });
    lsVisibleFields.push({
      requestType: "Request",
      requestHeader: "Application for Deferred Graduation",
      visibleFields: []
    });
    lsVisibleFields.push({
      requestType: "Request",
      requestHeader: "Application for Study Promotion Scholarship",
      visibleFields: ["Academic_Term__c", "Note__c"]
    });
    lsVisibleFields.push({
      requestType: "Request",
      requestHeader: "Second Program Registration",
      visibleFields: ["Academic_Term__c", "Faculty__c", "Major__c"]
    });
    lsVisibleFields.push({
      requestType: "Request",
      requestHeader: "Handling the Procedure for University Dropout",
      visibleFields: ["Reason__c"]
    });
    lsVisibleFields.push({
      requestType: "Request & Issue Written Confirmation",
      requestHeader: "Semester Transcript Issuance",
      visibleFields: [
        "Is_Free_Issuance_Available__c",
        "Number_of_Free_Issuance__c",
        "Issuance_type__c",
        "Academic_Term__c",
        "Quantity__c",
        "Fee__c",
        "Note__c"
      ]
    });
    lsVisibleFields.push({
      requestType: "Request & Issue Written Confirmation",
      requestHeader: "Academic Year Transcript Issuance",
      visibleFields: [
        "Is_Free_Issuance_Available__c",
        "Academic_Term__c",
        "Quantity__c",
        "Fee__c",
        "Note__c"
      ]
    });
    lsVisibleFields.push({
      requestType: "Request & Issue Written Confirmation",
      requestHeader: "Academic Record Transcript Issuance",
      visibleFields: [
        "Is_Free_Issuance_Available__c",
        "Quantity__c",
        "Fee__c",
        "Note__c"
      ]
    });
    lsVisibleFields.push({
      requestType: "Request & Issue Written Confirmation",
      requestHeader: "Training Point Transcript Issuance",
      visibleFields: [
        "Is_Free_Issuance_Available__c",
        "Quantity__c",
        "Fee__c",
        "Note__c"
      ]
    });
    lsVisibleFields.push({
      requestType: "Request & Issue Written Confirmation",
      requestHeader: "Written Confirmation for Military Service Postponement",
      visibleFields: [
        "Is_Free_Issuance_Available__c",
        "Number_of_Free_Issuance__c",
        "Issuance_type__c",
        "Quantity__c",
        "Fee__c",
        "Note__c"
      ]
    });
    lsVisibleFields.push({
      requestType: "Request & Issue Written Confirmation",
      requestHeader: "Student Confirmation",
      visibleFields: [
        "Is_Free_Issuance_Available__c",
        "Number_of_Free_Issuance__c",
        "Issuance_type__c",
        "Quantity__c",
        "Fee__c",
        "Note__c"
      ]
    });
    lsVisibleFields.push({
      requestType: "Request & Issue Written Confirmation",
      requestHeader: "Student Loan Confirmation",
      visibleFields: [
        "Is_Free_Issuance_Available__c",
        "Number_of_Free_Issuance__c",
        "Issuance_type__c",
        "Quantity__c",
        "Fee__c",
        "Note__c"
      ]
    });
    lsVisibleFields.push({
      requestType: "Support Email, LMS Accounts",
      requestHeader: "Password Reset for Office 365 Account",
      visibleFields: []
    });
    lsVisibleFields.push({
      requestType: "Support Email, LMS Accounts",
      requestHeader: "Password Reset for LMS account",
      visibleFields: []
    });
    lsVisibleFields.push({
      requestType: "Postpone the Exam, Register for Additional Exam",
      requestHeader: "Exam Postponement",
      visibleFields: ["Academic_Term__c", "Subject__c"]
    });
    lsVisibleFields.push({
      requestType: "Score Review",
      requestHeader: "Score Review Request",
      visibleFields: ["Subject__c", "Note__c"]
    });
    lsVisibleFields.push({
      requestType: "Take Studying Break",
      requestHeader: "Studying Break Request",
      visibleFields: []
    });
    lsVisibleFields.push({
      requestType: "Return to Study",
      requestHeader: "Study Return Request",
      visibleFields: []
    });
    lsVisibleFields.push({
      requestType: "Defer Paying Tuition Fee",
      requestHeader: "Tuition Fee Payment Deferral",
      visibleFields: [
        "Academic_Term__c",
        "Note__c",
        "Submitting_Date__c",
        "Due_date__c"
      ]
    });
    cmp.set("v.lsVisibleFields", lsVisibleFields);
  },
  getStudentInformation: function (cmp) {
    console.log("getStudentInformation...");
    var action = cmp.get("c.getStudentInformation");
    action.setCallback(this, function (response) {
      var state = response.getState();
      // eslint-disable-next-line no-console
      console.log("state: ", state);
      console.log("response: ", response);
      if (state === "SUCCESS") {
        var returnValue = response.getReturnValue();
        console.log("returnValue: ", returnValue);
        if (returnValue) {
          cmp.set("v.studentInfo", returnValue);
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