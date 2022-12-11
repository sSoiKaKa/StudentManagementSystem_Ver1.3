/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
({
  generateDataForEachRequest: function (cmp, event, helper) {
    var requestHeader = cmp.get("v.requestHeader");
    switch (requestHeader) {
      case "Student Card Re-issuance":
        cmp.set("v.cardTitle", "Your Student Card Information");
        break;
      case "Semester Transcript Issuance":
        cmp.set("v.cardTitle", "Semester Transcript");
        break;
      default:
        break;
    }
  }
});