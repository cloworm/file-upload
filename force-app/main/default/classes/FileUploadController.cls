/**
 * @description       : Controller for fileUpload LWC
 * @author            : Chloe Echikson
 * @group             : Gerent LLC
 * @last modified on  : 03-01-2021
 * @last modified by  : Chloe Echikson
 * Modifications Log
 * Ver   Date         Author           Modification
 * 1.0   03-01-2021   Chloe Echikson   Initial Version
 **/
public with sharing class FileUploadController {
  /**
   * @description    Returns ContentVersion records for a given list of contentVersionIds
   * @author         Chloe Echikson | 03-01-2021
   * @param          contentVersionIds
   * @return         List<ContentVersion>
   **/
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

  /**
   * @description  Updates list of ContentVersion records
   * @author       Chloe Echikson | 03-01-2021
   * @param        contentVersions
   * @return       List<ContentVersion>
   **/
  @AuraEnabled
  public static List<ContentVersion> updateVersions(
    List<ContentVersion> contentVersions
  ) {
    update contentVersions;
    return contentVersions;
  }
}
