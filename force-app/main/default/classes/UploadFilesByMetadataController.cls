public with sharing class UploadFilesByMetadataController {
  @AuraEnabled(cacheable=true)
  public static DocumentType__mdt getViewDefinition(
    String Name,
    String Profile,
    String LOB
  ) {
    try {
      return [
        SELECT Id, DeveloperName, LOB__c, Profile__c, Type__c, View_Upload__c
        FROM DocumentType__mdt
        WHERE
          DeveloperName = :Name
          AND Profile__c = :profile
          AND LOB__c = :LOB
          AND View_Upload__c = 'View'
      ];
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled(cacheable=true)
  public static DocumentType__mdt getUploadDefinition(
    String Name,
    String Profile,
    String LOB
  ) {
    try {
      return [
        SELECT Id, DeveloperName, LOB__c, Profile__c, Type__c, View_Upload__c
        FROM DocumentType__mdt
        WHERE
          DeveloperName = :Name
          AND Profile__c = :profile
          AND LOB__c = :LOB
          AND View_Upload__c = 'Upload'
      ];
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}
