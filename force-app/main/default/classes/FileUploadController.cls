public with sharing class FileUploadController {
  @AuraEnabled
  public static List<ContentVersion> getVersionInfo(
    List<String> contentVersionIds
  ) {
    try {
      List<ContentVersion> versions = [
        SELECT Id, Title, ContentSize, FileType, ContentDocumentId
        FROM ContentVersion
        WHERE Id IN :contentVersionIds
      ];

      return versions;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled
  public static List<ContentVersion> updateVersionTypes(
    List<ContentVersion> contentVersions
  ) {
    try {
      System.debug(contentVersions);
      update contentVersions;
      return contentVersions;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}
