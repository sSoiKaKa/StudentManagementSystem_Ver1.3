/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
({
  init: function (cmp, event, helper) {
    console.log("init...");
    helper.getStudentInformation(cmp);
    helper.setVisibleFieldList(cmp, helper);
    // Prepare a new record from template
    cmp.find("requestRecordCreator").getNewRecord(
      "Request__c", // sObject type (objectApiName)
      null, // recordTypeId
      false, // skip cache?
      $A.getCallback(function () {
        var rec = cmp.get("v.newRequestRecord");
        var error = cmp.get("v.newRequestError");
        if (error || rec === null) {
          console.log("Error initializing record template: " + error);
          return;
        }
        console.log("Record template initialized: " + rec.apiName);
      })
    );
    // set up navigation for closing
    var pageReference = {
      type: "standard__objectPage",
      attributes: {
        objectApiName: "Request__c",
        actionName: "home"
      }
    };
    cmp.set("v.pageReference", pageReference);
  },
  onRecordLoad: function () {
    // cmp.set("v.newRequestFields.Student__c", "a005g000036Gw5GAAS");
  },
  onCreateSuccess: function (cmp, event) {
    // record is saved successfully
    var resultsToast = $A.get("e.force:showToast");
    resultsToast.setParams({
      title: "Saved",
      message: "The record was created."
    });
    resultsToast.fire();
    var params = event.getParams();
    var requestId = params.response.id;
    console.log(params.response.id);
    cmp.find("navService").navigate(
      {
        type: "standard__recordPage",
        attributes: {
          recordId: requestId,
          actionName: "view" //clone, edit, view
        }
      },
      true
    );
  },
  onCreateError: function () {},
  handleExit: function (cmp) {
    var isStudentAppInvoked = cmp.get("v.isStudentAppInvoked");
    if (!isStudentAppInvoked) {
      cmp.find("navService").navigate(cmp.get("v.pageReference"), true);
    } else {
      cmp.set("v.isModalOpen", false);
      var dismissActionPanel = $A.get("e.force:closeQuickAction");
      dismissActionPanel.fire();
    }
  },
  onContinue: function (cmp) {
    cmp.set("v.newRequestFields.Id", cmp.get("v.recordId"));
    var studentInfo = cmp.get("v.studentInfo");
    cmp.set("v.newRequestFields.Student__c", studentInfo.Id);
    cmp.find("recordEditForm").submit();
  },
  onRequestHeaderChanged: function (cmp, event, helper) {
    var requestHeader = cmp.get("v.requestHeader");
    var lsVisibleFields = cmp.get("v.lsVisibleFields");
    var lsVisibleFieldsWHeader = lsVisibleFields.find(function (element) {
      return element.requestHeader === requestHeader;
    });
    console.log("lsVisibleFieldsWHeader: ", lsVisibleFieldsWHeader);
    cmp.set("v.lsVisibleFieldsWHeader", lsVisibleFieldsWHeader.visibleFields);
  }
});