@isTest
private class FileTableByMetadataControllerTest {
  @testSetup
  static void setup() {
    Account testAcct = new Account(Name = 'Test Account');
    insert testAcct;

    Account testAcct2 = new Account(Name = 'Another Test Account');
    insert testAcct2;

    ContentVersion testVersion = new ContentVersion(
      Title = 'Test File',
      PathOnClient = 'Test File.jpg',
      VersionData = Blob.valueOf('Test File'),
      IsMajorVersion = true,
      Type__c = 'Category A'
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
      Type__c = 'Category B'
    );
    insert testVersion2;

    ContentDocumentLink testCDL2 = new ContentDocumentLink();
    testCDL2.ContentDocumentId = [
      SELECT ContentDocumentId
      FROM ContentVersion
      WHERE Id = :testVersion2.Id
    ]
    .ContentDocumentId;
    testCDL2.LinkedEntityId = testAcct.Id;
    testCDL2.ShareType = 'V';
    insert testCDL2;
  }

  @isTest
  static void testGetFiles() {
    Account testAccount = [SELECT Id FROM Account WHERE Name = 'Test Account'];
    List<String> types = new List<String>();
    types.add('Category A');
    types.add('Category B');

    List<ContentVersion> files = FileTableByMetadataController.getFiles(
      testAccount.Id,
      types
    );

    System.assertEquals(files.size(), 2);
  }

  @isTest
  static void testTypes() {
    Account testAccount = [SELECT Id FROM Account WHERE Name = 'Test Account'];
    List<String> types = new List<String>();
    types.add('Category A');

    List<ContentVersion> files = FileTableByMetadataController.getFiles(
      testAccount.Id,
      types
    );

    System.assertEquals(files.size(), 1);
    System.assertEquals(files[0].Type__c, 'Category A');
  }

  @isTest
  static void testNoFiles() {
    Account testAccount = [
      SELECT Id
      FROM Account
      WHERE Name = 'Another Test Account'
    ];
    List<String> types = new List<String>();
    types.add('Category C');

    List<ContentVersion> files = FileTableByMetadataController.getFiles(
      testAccount.Id,
      types
    );

    System.assertEquals(files.size(), 0);
  }

  @isTest
  static void testNoRecord() {
    String recordId = null;
    List<String> types = new List<String>();
    types.add('Category C');

    List<ContentVersion> files = FileTableByMetadataController.getFiles(
      recordId,
      types
    );

    System.assertEquals(files, null);
  }
}
