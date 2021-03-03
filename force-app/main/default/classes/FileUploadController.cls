public with sharing class FileUploadController {
  @AuraEnabled
  public static List<ContentVersion> getVersionInfo(
    List<String> contentVersionIds
  ) {
    List<ContentVersion> versions = [
      SELECT Id, Title, ContentSize, FileType, ContentDocumentId
      FROM ContentVersion
      WHERE Id IN :contentVersionIds
    ];

    return versions;
  }

  @AuraEnabled
  public static List<ContentVersion> updateVersionTypes(
    List<ContentVersion> contentVersions
  ) {
    update contentVersions;
    return contentVersions;
  }
}
