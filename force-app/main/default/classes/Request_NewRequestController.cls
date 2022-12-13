/**
 * @description       :
 * @author            : Tuan Tran
 * @group             :
 * @last modified on  : 12-13-2022
 * @last modified by  : Tuan Tran
 **/
public without sharing class Request_NewRequestController {
  @AuraEnabled
  public static Student__c getStudentInformation() {
    try {
      String userId = UserInfo.getUserId();
      System.debug('userId: ' + userId);
      Student__c student = [
        SELECT
          Id,
          Name,
          Student_Name__c,
          Date_Of_Birth__c,
          Acitvity_Class__r.Class_Name__c,
          Faculty__r.Faculty_Name__c,
          Free_Request_Remainder__c,
          Major__c,
          Admission_Day__c,
          (
            SELECT Id, Name, Admission_Year__c, Id_Input__c, Is_Valid__c
            FROM Student_Cards__r
          )
        FROM Student__c
        WHERE User__c = :userId
      ];
      return student;
    } catch (Exception e) {
      System.debug('Fail to get Student Information: ' + e.getMessage());
      return null;
    }
  }
  @AuraEnabled
  public static Student__c getStudentInformationWId(String requestId) {
    try {
      Request__c req = [SELECT Id, Student__c FROM Request__c WHERE Id = :requestId];
      Student__c student = [
        SELECT
          Id,
          Name,
          Student_Name__c,
          Date_Of_Birth__c,
          Acitvity_Class__r.Class_Name__c,
          Faculty__r.Faculty_Name__c,
          Free_Request_Remainder__c,
          Major__c,
          Admission_Day__c,
          (
            SELECT Id, Name, Admission_Year__c, Id_Input__c, Is_Valid__c
            FROM Student_Cards__r
          )
        FROM Student__c
        WHERE Id = :req.Student__c
      ];
      return student;
    } catch (Exception e) {
      System.debug('Fail to get Student Information: ' + e.getMessage());
      return null;
    }
  }
  @AuraEnabled
  public static String getSemesterTranscript(String studentId, Decimal term) {
    try {
      List<SubjectRegistration> lsSubjectRegistrationResponse = new List<SubjectRegistration>();
      List<Subject_Registration__c> lsSubjectRegistration = [
        SELECT
          Id,
          Subject__r.Subject_Name__c,
          Subject_Class__r.Subject_Class_Name__c,
          Homework_Score__c,
          Mid_Term_Exam_Score__c,
          Final_Exam_Score__c,
          Overall_Score__c
        FROM Subject_Registration__c
        WHERE Student__c = :studentId AND Semester__c = :String.valueOf(term)
      ];
      System.debug('lsSubjectRegistration: ' + lsSubjectRegistration);
      for (Subject_Registration__c sr : lsSubjectRegistration) {
        SubjectRegistration srRes = new SubjectRegistration();
        srRes.id = sr.Id;
        srRes.studentId = studentId;
        srRes.term = term;
        srRes.subjectName = sr.Subject__r.Subject_Name__c;
        srRes.className = sr.Subject_Class__r.Subject_Class_Name__c;
        srRes.homeworkScore = sr.Homework_Score__c;
        srRes.midTermScore = sr.Mid_Term_Exam_Score__c;
        srRes.finalExamScore = sr.Final_Exam_Score__c;
        srRes.overallScore = sr.Overall_Score__c;
        lsSubjectRegistrationResponse.add(srRes);
      }
      System.debug(
        'lsSubjectRegistrationResponse: ' + lsSubjectRegistrationResponse
      );

      return JSON.serialize(lsSubjectRegistrationResponse);
    } catch (Exception e) {
      System.debug('Fail to get semester transcript: ' + e.getMessage());
      return null;
    }
  }
  @AuraEnabled
  public static string getYearTranscript(
    String studentId,
    String admissionYear
  ) {
    try {
      List<String> lsTerms = getLsTermsForCurrentTime(admissionYear);
      return null;
    } catch (Exception e) {
      System.debug('Fail to get Year Transcript. Error: ' + e.getMessage());
      return null;
    }
  }
  public static List<String> getLsTermsForCurrentTime(String admissionYear) {
    Integer currentYear = System.today().year();
    Integer currentMonth = System.today().month();
    Integer yearNumber;
    List<String> lsTerm = new List<String>();
    if (currentMonth <= 7 && currentMonth > 5) {
      yearNumber = currentYear - Integer.valueOf(admissionYear);
      lsTerm.add(String.valueOf(yearNumber * 2 - 1));
      lsTerm.add(String.valueOf(yearNumber * 2));
      lsTerm.add(String.valueOf(yearNumber * 2 + 0.5));
    } else if (currentMonth < 5) {
      yearNumber = currentYear - Integer.valueOf(admissionYear);
      lsTerm.add(String.valueOf(yearNumber * 2 - 1));
      lsTerm.add(String.valueOf(yearNumber * 2));
    }
    return lsTerm;
  }
  public class SubjectRegistration {
    public String id;
    public String studentId;
    public Double term;
    public String subjectName;
    public String className;
    public Double homeworkScore;
    public Double midTermScore;
    public Double finalExamScore;
    public Double overallScore;
  }
}