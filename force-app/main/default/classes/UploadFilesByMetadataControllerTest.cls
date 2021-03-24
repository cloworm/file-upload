@isTest
private class UploadFilesByMetadataControllerTest {
  @isTest
  static void testInternalView() {
    DocumentType__mdt record = UploadFilesByMetadataController.getViewDefinition(
      'LOB 1',
      'System Administrator',
      false
    );
    System.assertEquals(
      record.Type__c,
      'Category A;Category B;Category C;Category D;Category E;Category F; Category G; Category H; Category I; Category J; Category K;'
    );
  }

  @isTest
  static void testPartnerView() {
    DocumentType__mdt record = UploadFilesByMetadataController.getViewDefinition(
      'LOB 1',
      'Customer Community User',
      true
    );
    System.assertEquals(
      record.Type__c,
      'Category A;Category B;Category C;Category D;Category E'
    );
  }

  @isTest
  static void testInternalUpload() {
    DocumentType__mdt record = UploadFilesByMetadataController.getUploadDefinition(
      'LOB 1',
      'System Administrator',
      false
    );
    System.assertEquals(
      record.Type__c,
      'Category B;Category C;Category D;Category E;Category F; Category G; Category H; Category I; Category J; Category K;'
    );
  }

  @isTest
  static void testPartnerUpload() {
    DocumentType__mdt record = UploadFilesByMetadataController.getUploadDefinition(
      'LOB 1',
      'Customer Community User',
      true
    );
    System.assertEquals(record.Type__c, 'Category A;Category B;');
  }
}
