/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
({
  init: function (cmp, event, helper) {
    console.log("init...");
    helper.setVisibleFieldList(cmp, helper);
    helper.getStudentInformation(cmp);
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
  onRecordLoad: function (cmp, event, helper) {
    console.log("onRecordLoad...");
    var fields = event.getParam("recordUi").record.fields;
    var studentInfo = cmp.get("v.studentInfo");
    var isQuantitySelected = cmp.get("v.isQuantitySelected");
    cmp.set("v.numberOfFreeIssuance", studentInfo.Free_Request_Remainder__c);
    if (isQuantitySelected) {
      cmp.set("v.unitCost", fields.Unit_Cost__c.value);
      helper.initFeeValue(cmp);
    }
  },
  onCreateSuccess: function (cmp, event, helper) {
    var msg = "Submit Request successfully.";
    helper.showSuccessMessage(msg);
    $A.get("e.force:refreshView").fire();
  },
  onCreateError: function (cmp, event, helper) {
    var error = event.getParams();
    // Get the error message
    var errorMessage = event.getParam("message");
    helper.showErrorMessage(errorMessage);
    $A.get("e.force:refreshView").fire();
  },
  handleExit: function () {},
  onSave: function () {},
  onRecordUpdated: function (cmp, event, helper) {
    console.log("onRecordUpdated...");
    var requestData = cmp.get("v.requestFields");
    var requestHeader = requestData.Request_Header__c;
    var requestType = requestData.Request_Type__c;
    var isSubmitted = requestData.Is_Submitted__c;
    cmp.set("v.academicTerm", requestData.Academic_Term__c);
    cmp.set("v.isSubmitted", isSubmitted);
    var lsVisibleFieldsInfo = cmp.get("v.lsVisibleFields");
    var lsVisibleFieldsWHeader = lsVisibleFieldsInfo.find(function (element) {
      return element.requestHeader === requestHeader;
    });
    console.log("lsVisibleFieldsWHeader", lsVisibleFieldsWHeader);
    var lsSelectedAttribute = lsVisibleFieldsWHeader.visibleFields;
    cmp.set("v.lsSelectedAttribute", lsSelectedAttribute);
    lsSelectedAttribute.forEach(function (item) {
      cmp.set("v." + item, true);
    });
    cmp.set("v.requestHeader", requestHeader);
    cmp.set("v.requestType", requestType);
    helper.processDataForEachRequestHeader(cmp);
    var requestDetailInfoCmp = cmp.find("requestDetailInfo");
    requestDetailInfoCmp.updateRequestRecord(
      requestHeader,
      requestType,
      requestData
    );
    console.log(
      "lsVisibleFieldsWHeader: ",
      cmp.get("v.lsVisibleFieldsWHeader")
    );
  },
  onSubmit: function (cmp, event, helper) {
    console.log("onSubmit...");
    event.preventDefault();
    var isValid = helper.validate(cmp);
    console.log("isValid: ", isValid);
    if (isValid) {
      console.log("Request is Valid");
      var date = new Date();
      console.log("date: ", date);
      var dateFormatted = $A.localizationService.formatDate(date, "yyyy-MM-dd");
      console.log("dateFormatted: ", dateFormatted);
      cmp.set("v.submittingDate", date);
      cmp.find("submittedField").set("v.value", true);
      cmp.find("statusField").set("v.value", "Submitted");
      cmp.find("submittingDate").set("v.value", dateFormatted);
      cmp.find("recordEditForm").submit();
    } else {
      var msg = cmp.get("v.submitErrorMessage");
      console.log("error: ", msg);
      var toastEvent = $A.get("e.force:showToast");
      toastEvent.setParams({
        type: "error",
        message: msg
      });
      toastEvent.fire();
    }
  },
  onDelete: function (cmp) {
    console.log("onDelete...");
    cmp.find("requestRecordCreator").deleteRecord(
      $A.getCallback(function (deleteResult) {
        // NOTE: If you want a specific behavior(an action or UI behavior) when this action is successful
        // then handle that in a callback (generic logic when record is changed should be handled in recordUpdated event handler)
        if (
          deleteResult.state === "SUCCESS" ||
          deleteResult.state === "DRAFT"
        ) {
          // record is deleted
          console.log("Record is deleted.");
          var msg = "Request was deleted successfully.";
          var toastEvent = $A.get("e.force:showToast");
          toastEvent.setParams({
            type: "success",
            message: msg
          });
          toastEvent.fire();
          $A.get("e.force:refreshView").fire();
          cmp.find("navService").navigate(cmp.get("v.pageReference"), true);
        } else if (deleteResult.state === "INCOMPLETE") {
          console.log("User is offline, device doesn't support drafts.");
        } else if (deleteResult.state === "ERROR") {
          console.log(
            "Problem deleting record, error: " +
              JSON.stringify(deleteResult.error)
          );
        } else {
          console.log(
            "Unknown problem, state: " +
              deleteResult.state +
              ", error: " +
              JSON.stringify(deleteResult.error)
          );
        }
      })
    );
  },
  onReasonChanged: function (cmp, event) {
    var reason = event.getParam("value");
    console.log("reason: ", reason);
    cmp.set("v.reason", reason);
    if (reason === "Change information") {
      cmp.set("v.isNoteSelected", true);
    }
  },
  onSelectTermChange: function (cmp, event) {
    console.log("onSelectTermChange...");
    var termValue = cmp.find("selectTerm").get("v.value");
    console.log("termValue: ", termValue);
    var requestHeader = cmp.get("v.requestHeader");
    if (termValue === "default") {
      cmp.set("v.academicTerm", null);
    } else {
      cmp.set("v.academicTerm", cmp.find("selectTerm").get("v.value"));
      if (requestHeader === "Semester Transcript Issuance") {
        var requestDetailInfo = cmp.find("requestDetailInfo");
        requestDetailInfo.retrieveSemesterTranscriptData(Number(termValue));
      }
    }
  },
  onIssuanceTypeChanged: function (cmp) {
    var issuanceType = cmp.get("v.issuanceType");
    if (!issuanceType || issuanceType === "Free") {
      cmp.set("v.fee", 0);
    } else {
      var unitCost = cmp.get("v.unitCost");
      var quantity = cmp.get("v.quantity");
      if (unitCost && quantity) {
        var fee = quantity * unitCost;
        console.log("fee: ", fee);
        cmp.set("v.fee", fee);
      }
    }
  },
  onQuantityChanged: function (cmp) {
    var issuanceType = cmp.get("v.issuanceType");
    if (issuanceType === "Paid") {
      var unitCost = cmp.get("v.unitCost");
      var quantity = cmp.get("v.quantity");
      if (unitCost && quantity) {
        var fee = quantity * unitCost;
        console.log("fee: ", fee);
        cmp.set("v.fee", fee);
      }
    }
  }
});