/**
 * @description       : Used by UploadFilesByMetadata to retrieve View/Upload permission definitions set in DocumentType__mdt custom metadata
 * @author            : Chloe Echikson
 * @group             : Gerent LLC
 * @last modified on  : 03-16-2021
 * @last modified by  : Chloe Echikson
 * Modifications Log
 * Ver   Date         Author           Modification
 * 1.0   03-16-2021   Chloe Echikson   Initial Version
 **/
public with sharing class UploadFilesByMetadataController {
  /**
   * @description               Returns types of files current user can view
   * @author                    Chloe Echikson | 03-16-2021
   * @param LOB                 Line of business, corresponds to DocumentType__mdt.LOB__c picklist
   * @param Profile             CurrentUser.Profile.Name
   * @param isPortalEnabled     CurrentUser.Profile.IsPortalEnabled
   * @return DocumentType__mdt
   **/
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

  /**
   * @description               Returns types of files current user can upload
   * @author                    Chloe Echikson | 03-16-2021
   * @param LOB                 Line of business, corresponds to DocumentType__mdt.LOB__c picklist
   * @param Profile             CurrentUser.Profile.Name
   * @param isPortalEnabled     CurrentUser.Profile.IsPortalEnabled
   * @return DocumentType__mdt
   **/
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
