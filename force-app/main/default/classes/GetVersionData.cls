public with sharing class GetVersionData {
  @AuraEnabled(cacheable=true)
  public static ContentVersion getData(Id cvId) {
    ContentVersion cv = [
      SELECT VersionData
      FROM ContentVersion
      WHERE Id = :cvId
    ];
    System.debug(cv);
    return cv;
  }
}
