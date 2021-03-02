public with sharing class FileUploadController {
  /*
   * @method uploadFile()
   * @desc Creates a content version from a given file's base64 and name
   *
   * @param {String} base64 - base64 string that represents the file
   * @param {String} filename - full file name with extension, i.e. 'products.csv'
   * @param {String} recordId - Id of the record you want to attach this file to
   * @param {String} type - value for Type__c custom picklist field
   *
   * @return {ContentVersion} - returns the created ContentVersion.Id and ContentDocumentId if the
   *   upload was successful, otherwise returns null
   */
  @AuraEnabled
  public static ContentVersion uploadFile(
    String chunk,
    String filename,
    String recordId,
    String type,
    String versionId
  ) {
    if (String.isBlank(versionId)) {
      ContentVersion cv = createContentVersion(chunk, filename, type);
      ContentDocumentLink cdl = createContentLink(cv.Id, recordId);
      versionId = cv.Id;
    } else {
      addChunk(versionId, chunk);
    }

    if (versionId == null) {
      return null;
    }

    return [
      SELECT Id, FileType, ContentDocumentId
      FROM ContentVersion
      WHERE Id = :versionId
    ];
  }
  /*
   * @method createContentVersion() [private]
   * @desc Creates a content version from a given file's base64 and name
   *
   * @param {String} base64 - base64 string that represents the file
   * @param {String} filename - full file name with extension, i.e. 'products.csv'
   * @param {String} type - value for Type__c custom picklist field
   *
   * @return {ContentVersion} - returns the newly created ContentVersion, or null
   *   if there was an error inserting the record
   */
  private static ContentVersion createContentVersion(
    String chunk,
    String filename,
    String type
  ) {
    ContentVersion cv = new ContentVersion();
    cv.VersionData = EncodingUtil.base64Decode(chunk);
    cv.Title = filename;
    cv.Type__c = type;

    cv.PathOnClient = filename;
    cv.IsMajorVersion = false;

    try {
      insert cv;
      return cv;
    } catch (DMLException e) {
      System.debug(e);
      return null;
    }
  }

  /*
   * @method createContentLink() [private]
   * @desc Creates a content link for a given ContentVersion and record
   *
   * @param {String} contentVersionId - Id of the ContentVersion of the file
   * @param {String} recordId - Id of the record you want to attach this file to
   *
   * @return {ContentDocumentLink} - returns the newly created ContentDocumentLink,
   *   or null if there was an error inserting the record
   */
  private static ContentDocumentLink createContentLink(
    String contentVersionId,
    String recordId
  ) {
    if (contentVersionId == null || recordId == null) {
      return null;
    }
    ContentDocumentLink cdl = new ContentDocumentLink();
    cdl.ContentDocumentId = [
      SELECT ContentDocumentId
      FROM ContentVersion
      WHERE Id = :contentVersionId
    ]
    .ContentDocumentId;
    cdl.LinkedEntityId = recordId;
    // ShareType is either 'V', 'C', or 'I'
    // V = Viewer, C = Collaborator, I = Inferred
    cdl.ShareType = 'V';
    try {
      insert cdl;
      return cdl;
    } catch (DMLException e) {
      System.debug(e);
      return null;
    }
  }

  private static void addChunk(Id contentVersionId, String chunk) {
    ContentVersion existingVersion = [
      SELECT Id, VersionData
      FROM ContentVersion
      WHERE Id = :contentVersionId
    ];
    String existingBody = EncodingUtil.base64Encode(
      existingVersion.VersionData
    );
    existingVersion.VersionData = EncodingUtil.base64Decode(
      existingBody + chunk
    );
    update existingVersion;
  }

  @AuraEnabled
  public static ContentVersion finalizeVersion(
    String recordId,
    String contentVersionId
  ) {
    ContentVersion cv = [
      SELECT Id, VersionData, Title, Type__c, ContentDocumentId
      FROM ContentVersion
      WHERE Id = :contentVersionId
    ];

    ContentVersion finalVersion = createContentVersion(
      EncodingUtil.base64Encode(cv.VersionData),
      cv.Title,
      cv.Type__c
    );

    System.debug(recordId);
    ContentDocumentLink finalCDL = createContentLink(finalVersion.Id, recordId);

    try {
      delete [SELECT Id FROM ContentDocument WHERE Id = :cv.ContentDocumentId];
    } catch (DMLException e) {
      System.debug(e);
      return null;
    }

    return [
      SELECT Id, FileType, ContentDocumentId
      FROM ContentVersion
      WHERE Id = :finalVersion.Id
    ];
  }

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
