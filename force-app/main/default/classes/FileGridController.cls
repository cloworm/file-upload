/**
 * @description       : Controller class for fileGridContainer LWC
 * @author            : Chloe Echikson
 * @group             : Gerent LLC
 * @last modified on  : 03-01-2021
 * @last modified by  : Chloe Echikson
 * Modifications Log
 * Ver   Date         Author           Modification
 * 1.0   03-01-2021   Chloe Echikson   Initial Version
 **/
public with sharing class FileGridController {
  /**
   * @description  Returns latest ContentVersion for all files associated to recordId
   * @author       Chloe Echikson | 03-01-2021
   * @param        recordId
   * @return       List<ContentVersion>
   **/
  @AuraEnabled(cacheable=true)
  public static List<ContentVersion> getFiles(Id recordId) {
    if (recordId == null) {
      return null;
    }

    List<ContentDocumentLink> cdl = [
      SELECT ContentDocument.LatestPublishedVersionId
      FROM ContentDocumentLink
      WHERE LinkedEntityId = :recordId
    ];
    List<Id> latestPublishedVersionIds = new List<Id>();
    for (ContentDocumentLink doc : cdl) {
      latestPublishedVersionIds.add(
        doc.ContentDocument.LatestPublishedVersionId
      );
    }

    return [
      SELECT
        Id,
        Type__c,
        OwnerId,
        Owner.Name,
        Owner.SmallPhotoUrl,
        ContentDocument.Id,
        ContentDocument.FileType,
        ContentDocument.Title,
        ContentDocument.ContentModifiedDate,
        ContentDocument.ContentSize
      FROM ContentVersion
      WHERE Id IN :latestPublishedVersionIds
      ORDER BY ContentDocument.Title ASC
    ];
  }
}
