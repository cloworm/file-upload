public inherited sharing class FileGridController {
  @AuraEnabled(cacheable=true)
  public static List<ContentVersion> getFiles(Id id) {
    List<ContentDocumentLink> cdl = [
      SELECT ContentDocument.LatestPublishedVersionId
      FROM ContentDocumentLink
      WHERE LinkedEntityId = :id
    ];
    List<Id> latestPublishedVersionIds = new List<Id>();
    for (ContentDocumentLink doc : cdl) {
      latestPublishedVersionIds.add(
        doc.ContentDocument.LatestPublishedVersionId
      );
    }

    return [
      SELECT
        Type__c,
        ContentDocument.Id,
        ContentDocument.FileType,
        ContentDocument.Title,
        ContentDocument.ContentModifiedDate,
        ContentDocument.ContentSize,
        ContentDocument.Owner.Name,
        ContentDocument.Owner.SmallPhotoUrl,
        ContentDocument.OwnerId
      FROM ContentVersion
      WHERE Id IN :latestPublishedVersionIds
      ORDER BY ContentDocument.Title ASC
    ];
  }
}
