@isTest
private class FileUploadControllerTest {
  @TestSetup
  static void setup() {
    Account testAcct = new Account(Name = 'Test Account');
    insert testAcct;

    ContentVersion cv = new ContentVersion(
      Title = 'Test.jpg',
      Type__c = 'Category A',
      VersionData = Blob.valueOf('test'),
      PathOnClient = 'Test.jpg'
    );
    insert cv;

    ContentVersion cvCreated = [
      SELECT ContentDocumentid
      FROM ContentVersion
      WHERE Id = :cv.Id
    ];

    ContentDocumentLink cdl = new ContentDocumentLink(
      ContentDocumentId = cvCreated.ContentDocumentId,
      LinkedEntityId = testAcct.Id,
      ShareType = 'V'
    );
    insert cdl;
  }

  @isTest
  static void testGetVersionInfo() {
    List<String> versionIds = new List<String>();
    for (ContentVersion cv : [SELECT Id FROM ContentVersion]) {
      versionIds.add(cv.Id);
    }
    List<ContentVersion> versions = FileUploadController.getVersionInfo(
      versionIds
    );
    System.assertEquals(versions.size(), 1);
    System.assertEquals(versions[0].Id, versionIds[0]);
  }

  @isTest
  static void testUpdateVersionTypes() {
    List<ContentVersion> versions = [SELECT Id, Type__c FROM ContentVersion];
    versions[0].Type__c = 'Category B';
    List<ContentVersion> versionsUpdated = FileUploadController.updateVersions(
      versions
    );
    System.assertEquals(versionsUpdated[0].Type__c, 'Category B');
  }
}
