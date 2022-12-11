/**
 * @description       :
 * @author            : Tuan Tran
 * @group             :
 * @last modified on  : 12-10-2022
 * @last modified by  : Tuan Tran
 **/
public without sharing class StudentApp_StudentController {
  @AuraEnabled
  public static String getStudentInfoForCurrentUser() {
    System.debug('getStudentInfoForCurrentUser...');
    try {
      String userId = UserInfo.getUserId();
      System.debug('userId: ' + userId);
      Student__c student = [
        SELECT
          Id,
          Name,
          Acitvity_Class__c,
          Admission_Day__c,
          Class_Name__c,
          Date_Of_Birth__c,
          Education_Program__c,
          Faculty__c,
          Faculty_Name__c,
          Free_Request_Remainder__c,
          GPA__c,
          Major_Name__c,
          Major__c,
          Student_Name__c,
          User__c,
          (
            SELECT Id, Name, Admission_Year__c, Id_Input__c, Is_Valid__c
            FROM Student_Cards__r
          ),
          (
            SELECT
              Id,
              Name,
              Academic_Term__c,
              Due_date__c,
              Faculty__c,
              Fee__c,
              Is_Free_Issuance_Available__c,
              Is_Submitted__c,
              Issuance_type__c,
              Major__c,
              Note__c,
              Number_of_Free_Issuance__c,
              Quantity__c,
              Reason__c,
              Request_Header__c,
              Request_Type__c,
              Second_Program__c,
              Status__c,
              Student_Name__c,
              Subject__c,
              Submitting_Date__c,
              Unit_Cost__c
            FROM Requests__r
          ),
          (
            SELECT
              Id,
              Name,
              Final_Exam_Score__c,
              Homework_Score__c,
              Mid_Term_Exam_Score__c,
              Overall_Score__c,
              Semester__c,
              Subject__c,
              Subject_Class__c
            FROM Subject_Registrations__r
          )
        FROM Student__c
        WHERE User__c = :userId
      ];
      return JSON.serialize(student);
    } catch (Exception e) {
      System.debug('Cannot get student infomation: ' + e.getMessage());
      return null;
    }
  }
  @AuraEnabled
  public static string getNotifications() {
    System.debug('getNotifications...');
    try {
      String userId = UserInfo.getUserId();
      System.debug('userId: ' + userId);
      Student__c student = [
        SELECT Id, Name, Faculty__c, Acitvity_Class__c, Current_Semester__c
        FROM Student__c
        WHERE User__c = :userId
      ];

      List<Subject_Registration__c> subjectRegistraionQueries = [
        SELECT Id, Name, Subject__c, Subject_Class__c, Semester__c
        FROM Subject_Registration__c
        WHERE
          Student__c = :student.Id
          AND Semester__c = :String.valueOf(student.Current_Semester__c)
      ];

      List<String> lsSubjectClass = new List<String>();
      for (Subject_Registration__c sr : subjectRegistraionQueries) {
        lsSubjectClass.add(sr.Subject_Class__c);
      }
      Notification notifications = new Notification();
      List<Notification__c> lsNotificationQueried = [
        SELECT
          Id,
          Name,
          Body__c,
          Faculty__c,
          Major__c,
          Student__c,
          Subject__c,
          Subject_Class__c,
          Teacher__c,
          From__c,
          Title__c,
          CreatedDate
        FROM Notification__c
        WHERE
          Faculty__c = :student.Faculty__c
          OR Subject_Class__c IN :lsSubjectClass
          OR Student__c = :student.Id
        ORDER BY CreatedDate DESC
      ];
      List<Notification__c> schoolNotifications = new List<Notification__c>();
      List<Notification__c> facultyNotifications = new List<Notification__c>();
      List<Notification__c> classNotifications = new List<Notification__c>();
      List<Notification__c> personalNotifications = new List<Notification__c>();
      for (Notification__c noti : lsNotificationQueried) {
        if (noti.Faculty__c == student.Faculty__c) {
          facultyNotifications.add(noti);
        } else if (lsSubjectClass.contains(noti.Subject_Class__c)) {
          classNotifications.add(noti);
        } else if (noti.Student__c == student.Id) {
          personalNotifications.add(noti);
        }
      }
      notifications.facultyNotifications = facultyNotifications;
      notifications.classNotifications = classNotifications;
      notifications.personalNotifications = personalNotifications;
      System.debug('List Notifications: ' + notifications);
      return JSON.serialize(notifications);
    } catch (Exception e) {
      System.debug('Error getting notification: ' + e.getMessage());
      return null;
    }
  }
  @AuraEnabled
  public static string getStudentInfo() {
    try {
      String userId = UserInfo.getUserId();
      System.debug('userId: ' + userId);
      Student__c student = [
        SELECT
          Id,
          Name,
          Acitvity_Class__c,
          Admission_Day__c,
          Class_Name__c,
          Date_Of_Birth__c,
          Education_Program__c,
          Faculty__c,
          Faculty_Name__c,
          Free_Request_Remainder__c,
          GPA__c,
          Major_Name__c,
          Major__c,
          Student_Name__c,
          User__c
        FROM Student__c
        WHERE User__c = :userId
      ];
      System.debug('Student: ' + student);
      return JSON.serialize(student);
    } catch (Exception e) {
      System.debug('Cannot get student infomation: ' + e.getMessage());
      return null;
    }
  }
  public class StudentInfo {
    public Student__c student;
  }
  public class Notification {
    public List<Notification__c> schoolNotifications;
    public List<Notification__c> facultyNotifications;
    public List<Notification__c> classNotifications;
    public List<Notification__c> personalNotifications;
  }
  public class StudentDataResponse {
    public StudentInfo student;
    public Notification lsNotifications;
  }
}