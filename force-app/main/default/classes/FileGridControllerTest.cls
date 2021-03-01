@isTest
private class FileGridControllerTest {
  @testSetup
  static void setup() {
    // Create Account
    Account testAcct = new Account(Name = 'Test Account');
    insert testAcct;

    Account testAcct2 = new Account(Name = 'Another Test Account');
    insert testAcct2;

    ContentVersion testVersion = new ContentVersion(
      Title = 'Test File',
      PathOnClient = 'Test File.jpg',
      VersionData = Blob.valueOf('Test File'),
      IsMajorVersion = true
    );
    insert testVersion;

    ContentDocumentLink testCDL = new ContentDocumentLink();
    testCDL.ContentDocumentId = [
      SELECT ContentDocumentId
      FROM ContentVersion
      WHERE Id = :testVersion.Id
    ]
    .ContentDocumentId;
    testCDL.LinkedEntityId = testAcct.Id;
    testCDL.ShareType = 'V';
    insert testCDL;

    ContentVersion testVersion2 = new ContentVersion(
      Title = 'Test File v2',
      PathOnClient = 'Test File v2.jpg',
      VersionData = Blob.valueOf('Test File v2'),
      IsMajorVersion = true,
      ContentDocumentId = testCDL.ContentDocumentId
    );
    insert testVersion2;

    // ContentDocumentLink testCDL2 = new ContentDocumentLink();
    // testCDL2.ContentDocumentId = testVersion2.ContentDocumentId;
    // testCDL2.LinkedEntityId = testAcct.Id;
    // testCDL2.ShareType = 'V';
    // insert testCDL2;

    ContentVersion testVersion3 = new ContentVersion(
      Title = 'Another Test File',
      PathOnClient = 'Another Test File.jpg',
      VersionData = Blob.valueOf('Another Test File'),
      IsMajorVersion = true
    );
    insert testVersion3;

    ContentDocumentLink testCDL3 = new ContentDocumentLink();
    testCDL3.ContentDocumentId = [
      SELECT ContentDocumentId
      FROM ContentVersion
      WHERE Id = :testVersion3.Id
    ]
    .ContentDocumentId;
    testCDL3.LinkedEntityId = testAcct.Id;
    testCDL3.ShareType = 'V';
    insert testCDL3;
  }

  @isTest
  static void testFileOrder() {
    Account testAccount = [SELECT Id FROM Account WHERE Name = 'Test Account'];
    List<ContentVersion> files = FileGridController.getFiles(testAccount.Id);

    System.assertEquals(files.size(), 2);
    System.assertEquals(files[0].ContentDocument.Title, 'Another Test File');
  }

  @isTest
  static void testNoFiles() {
    Account testAccount = [
      SELECT Id
      FROM Account
      WHERE Name = 'Another Test Account'
    ];
    List<ContentVersion> files = FileGridController.getFiles(testAccount.Id);

    System.assertEquals(files.size(), 0);
  }
}
