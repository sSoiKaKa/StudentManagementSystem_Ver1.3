/**
 * @description       :
 * @author            : Tuan Tran
 * @group             :
 * @last modified on  : 12-08-2022
 * @last modified by  : Tuan Tran
 **/
trigger Notification on Notification__c(before insert, before update) {
  if (Trigger.isInsert || Trigger.isUpdate) {
    for (Notification__c noti : Trigger.new) {
      String bodyPlainText;
      bodyPlainText = noti.Body__c;
      noti.Body_PlainText__c = bodyPlainText.replaceAll('<[^>]+>', '');
      System.debug('noti.Body_PlainText__c: ' + noti.Body_PlainText__c);
    }
  }
}