/* eslint-disable no-console */
({
  init: function (cmp, event, helper) {
    console.log("init: ");
    helper.getStudentInfo(cmp, event, helper);
  }
});