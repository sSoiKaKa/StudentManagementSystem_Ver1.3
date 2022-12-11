/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
({
  init: function (cmp, event, helper) {
    console.log("init: ");
    helper.getStudentRequests(cmp, event, helper);
  },
  onSelectChange: function (cmp, event, helper) {
    console.log("onSelectChange: ");
    var selected = cmp.find("records").get("v.value");
    var paginationList = [];
    var oppList = cmp.get("v.requests");
    for (var i = 0; i < selected; i++) {
      paginationList.push(oppList[i]);
    }
    cmp.set("v.paginationList", paginationList);
  },

  searchKeyChange: function (cmp, event) {
    console.log("searchKeyChange: ");
    var searchKey = cmp.find("input1").get("v.value");
    console.log(searchKey);
    var action = cmp.get("c.getByName");
    var keysize = cmp.get("v.totalSize");
    action.setParams({
      searchKey: searchKey
    });
    action.setCallback(this, function (response) {
      var state = response.getState();
      if (cmp.isValid() && state === "SUCCESS") {
        cmp.set("v.requests", response.getReturnValue());
        cmp.set("v.totalSize", cmp.get("v.opportunityList").length);
        var paginationList = [];
        for (var i = 0; i < keysize; i++) {
          paginationList.push(response.getReturnValue()[i]);
        }
        cmp.set("v.paginationList", paginationList);
      }
    });
    $A.enqueueAction(action);
  },

  first: function (cmp, event, helper) {
    console.log("first: ");
    var oppList = cmp.get("v.requests");
    var pageSize = cmp.get("v.pageSize");
    var paginationList = [];
    for (var i = 0; i < pageSize; i++) {
      paginationList.push(oppList[i]);
    }
    cmp.set("v.paginationList", paginationList);
  },

  last: function (cmp, event, helper) {
    console.log("last: ");
    var oppList = cmp.get("v.requests");
    var pageSize = cmp.get("v.pageSize");
    var totalSize = cmp.get("v.totalSize");
    var paginationList = [];
    for (var i = totalSize - pageSize + 1; i < totalSize; i++) {
      paginationList.push(oppList[i]);
    }
    cmp.set("v.paginationList", paginationList);
  },

  next: function (cmp, event, helper) {
    console.log("next: ");
    var oppList = cmp.get("v.requests");
    var end = cmp.get("v.end");
    var start = cmp.get("v.start");
    var pageSize = cmp.get("v.pageSize");
    var paginationList = [];
    var counter = 0;
    for (var i = end + 1; i < end + pageSize + 1; i++) {
      if (oppList.length > end) {
        paginationList.push(oppList[i]);
        counter++;
      }
    }
    start = start + counter;
    end = end + counter;
    cmp.set("v.start", start);
    cmp.set("v.end", end);
    cmp.set("v.paginationList", paginationList);
  },

  previous: function (cmp, event, helper) {
    console.log("previous: ");
    var oppList = cmp.get("v.requests");
    var end = cmp.get("v.end");
    var start = cmp.get("v.start");
    var pageSize = cmp.get("v.pageSize");
    var paginationList = [];
    var counter = 0;
    for (var i = start - pageSize; i < start; i++) {
      if (i > -1) {
        paginationList.push(oppList[i]);
        counter++;
      } else {
        start++;
      }
    }
    start = start - counter;
    end = end - counter;
    cmp.set("v.start", start);
    cmp.set("v.end", end);
    cmp.set("v.paginationList", paginationList);
  },
  openNewModal: function (cmp, event, helper) {
    cmp.set("v.isModalOpen", true);
  }
});