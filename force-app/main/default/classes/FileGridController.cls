public inherited sharing class FileGridController {
  @AuraEnabled(cacheable=true)
  public static List<ContentDocument> getFiles(Id id) {
    List<ContentDocumentLink> cdl = [
      SELECT ContentDocumentId
      FROM ContentDocumentLink
      WHERE LinkedEntityId = :id
    ];
    List<Id> contentDocumentIds = new List<Id>();
    for (ContentDocumentLink doc : cdl) {
      contentDocumentIds.add(doc.ContentDocumentId);
    }

    return [
      SELECT
        Id,
        FileType,
        Title,
        ContentModifiedDate,
        ContentSize,
        Owner.Name,
        OwnerId
      FROM ContentDocument
      WHERE Id IN :contentDocumentIds
      ORDER BY ContentModifiedDate DESC
    ];
  }
}
