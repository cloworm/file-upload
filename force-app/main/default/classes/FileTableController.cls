/**
 * @description       : Used by UploadFilesByType LWC to retrieve ContentVersion records
 * @author            : Chloe Echikson
 * @group             : Gerent LLC
 * @last modified on  : 03-01-2021
 * @last modified by  : Chloe Echikson
 * Modifications Log
 * Ver   Date         Author           Modification
 * 1.0   03-01-2021   Chloe Echikson   Initial Version
 **/
public with sharing class FileTableController {
  /**
   * @description  Returns List<ContentVersion> of all latest versions of files attached to recordId, filtered by type
   * @author       Chloe Echikson | 03-01-2021
   * @param        ID of record files are attached to
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
