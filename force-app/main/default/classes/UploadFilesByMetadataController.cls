public with sharing class UploadFilesByMetadataController {
  @AuraEnabled(cacheable=true)
  public static DocumentType__mdt getViewDefinition(
    String LOB,
    String Profile,
    Boolean isPortalEnabled
  ) {
    String name =
      (isPortalEnabled ? 'Partner' : 'Internal') +
      LOB.replace(' ', '') +
      'View';
    try {
      DocumentType__mdt[] records = [
        SELECT Id, DeveloperName, LOB__c, Profile__c, Type__c, View_Upload__c
        FROM DocumentType__mdt
        WHERE
          DeveloperName = :name
          AND Profile__c = :Profile
          AND LOB__c = :LOB
          AND View_Upload__c = 'View'
      ];

      return records.size() > 0 ? records[0] : null;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled(cacheable=true)
  public static DocumentType__mdt getUploadDefinition(
    String LOB,
    String Profile,
    Boolean isPortalEnabled
  ) {
    String name =
      (isPortalEnabled ? 'Partner' : 'Internal') +
      LOB.replace(' ', '') +
      'Upload';
    try {
      DocumentType__mdt[] records = [
        SELECT Id, DeveloperName, LOB__c, Profile__c, Type__c, View_Upload__c
        FROM DocumentType__mdt
        WHERE
          DeveloperName = :name
          AND Profile__c = :Profile
          AND LOB__c = :LOB
          AND View_Upload__c = 'Upload'
      ];

      return records.size() > 0 ? records[0] : null;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}
